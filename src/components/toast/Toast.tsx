import {
  createContext,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  For,
  onCleanup,
  Show,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import { createId, cx } from "../../utils/index";
import { Button } from "../button/Button";

export type ToastIntent = "info" | "success" | "warning" | "error";
export type ToastPosition =
  | "top-end"
  | "top-start"
  | "bottom-end"
  | "bottom-start"
  | "top"
  | "bottom";
export type ToastPoliteness = "polite" | "assertive";

export type ToastData = {
  id: string;
  title?: JSX.Element;
  body?: JSX.Element;
  intent?: ToastIntent;
  timeout?: number;
  politeness?: ToastPoliteness;
  /** Higher priority toasts are rendered first. Defaults to `0`. */
  priority?: number;
};

export type ToastOptions = Omit<ToastData, "id"> & { id?: string };

type ToastTimer = {
  handle: number;
  remaining: number;
  startedAt: number;
};

type ToastStore = {
  toasts: Accessor<ToastData[]>;
  replace: (fn: (list: ToastData[]) => ToastData[]) => void;
  position: Accessor<ToastPosition>;
  setPosition: (position: ToastPosition) => void;
  timers: Map<string, ToastTimer>;
  paused: Accessor<boolean>;
  setPaused: (paused: boolean) => void;
};

function createToastStore(): ToastStore {
  const [toasts, setToasts] = createSignal<ToastData[]>([]);
  const [position, setPosition] = createSignal<ToastPosition>("top-end");
  const [paused, setPaused] = createSignal(false);
  return {
    toasts,
    replace: setToasts,
    position,
    setPosition,
    timers: new Map(),
    paused,
    setPaused,
  };
}

/** Global store used by the legacy module-level helpers. */
const globalStore = createRoot(createToastStore);
const ToastContext = createContext<ToastStore>();

function useToastStore(): ToastStore {
  return useContext(ToastContext) ?? globalStore;
}

function hasWindow() {
  return typeof window !== "undefined";
}

function clearToastTimer(store: ToastStore, id: string) {
  const timer = store.timers.get(id);
  if (timer && timer.handle && hasWindow()) window.clearTimeout(timer.handle);
  store.timers.delete(id);
}

function dismissFrom(store: ToastStore, id: string) {
  clearToastTimer(store, id);
  store.replace((list) => list.filter((item) => item.id !== id));
}

function schedule(store: ToastStore, id: string, duration: number) {
  if (!hasWindow()) return;
  if (store.paused()) {
    // Remember the duration; the timer is started when the region is resumed.
    store.timers.set(id, { handle: 0, remaining: duration, startedAt: 0 });
    return;
  }
  const handle = window.setTimeout(() => {
    store.timers.delete(id);
    dismissFrom(store, id);
  }, duration);
  store.timers.set(id, { handle, remaining: duration, startedAt: Date.now() });
}

function pauseTimers(store: ToastStore) {
  if (!hasWindow()) return;
  const now = Date.now();
  for (const timer of store.timers.values()) {
    if (!timer.handle) continue;
    window.clearTimeout(timer.handle);
    timer.remaining = Math.max(0, timer.remaining - (now - timer.startedAt));
    timer.handle = 0;
    timer.startedAt = 0;
  }
}

function resumeTimers(store: ToastStore) {
  if (!hasWindow()) return;
  for (const [id, timer] of store.timers) {
    if (timer.handle) continue;
    timer.startedAt = Date.now();
    timer.handle = window.setTimeout(() => {
      store.timers.delete(id);
      dismissFrom(store, id);
    }, timer.remaining);
  }
}

function dispatchFrom(store: ToastStore, toast: ToastOptions) {
  const id = toast.id ?? createId("toast");
  clearToastTimer(store, id);
  store.replace((list) => [...list.filter((item) => item.id !== id), { ...toast, id }]);
  const timeout = toast.timeout ?? 4000;
  if (timeout > 0) schedule(store, id, timeout);
  return id;
}

function clearFrom(store: ToastStore) {
  for (const id of [...store.timers.keys()]) clearToastTimer(store, id);
  store.replace(() => []);
}

function toastRole(intent?: ToastIntent, politeness?: ToastPoliteness) {
  return politeness === "assertive" || intent === "warning" || intent === "error"
    ? "alert"
    : "status";
}

/** @deprecated Global helpers are kept for backwards compatibility. Prefer `ToastProvider` + `useToastController`. */
export function dispatchToast(toast: ToastOptions) {
  return dispatchFrom(globalStore, toast);
}
/** @deprecated Prefer the controller returned from `useToastController`. */
export function dismissToast(id: string) {
  dismissFrom(globalStore, id);
}
/** @deprecated Prefer the controller returned from `useToastController`. */
export function clearToasts() {
  clearFrom(globalStore);
}

export function useToastController() {
  const store = useToastStore();
  return {
    dispatchToast: (toast: ToastOptions) => dispatchFrom(store, toast),
    dismissToast: (id: string) => dismissFrom(store, id),
    clearToasts: () => clearFrom(store),
  };
}

export type ToastProviderProps = {
  children?: JSX.Element;
  position?: ToastPosition;
};

/** Scopes toast state so multiple independent toaster regions can coexist. */
export function ToastProvider(props: ToastProviderProps) {
  const store = createToastStore();
  createEffect(() => {
    if (props.position) store.setPosition(props.position);
  });
  onCleanup(() => clearFrom(store));
  return <ToastContext.Provider value={store}>{props.children}</ToastContext.Provider>;
}

export type ToasterProps = {
  position?: ToastPosition;
  class?: string;
};

export function Toaster(props: ToasterProps) {
  const store = useToastStore();
  createEffect(() => {
    if (props.position) store.setPosition(props.position);
  });

  const pos = createMemo(() => props.position ?? store.position());
  const sortedToasts = createMemo(() =>
    [...store.toasts()].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)),
  );

  const pause = () => {
    store.setPaused(true);
    pauseTimers(store);
  };
  const resume = () => {
    store.setPaused(false);
    resumeTimers(store);
  };

  return (
    <Portal>
      <div
        class={cx("sf-Toaster", `sf-Toaster--${pos()}`, props.class)}
        aria-live="polite"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusIn={pause}
        onFocusOut={(event) => {
          if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
            resume();
          }
        }}
      >
        <For each={sortedToasts()}>
          {(toast) => (
            <Toast
              intent={toast.intent}
              politeness={toast.politeness}
              onDismiss={() => dismissFrom(store, toast.id)}
            >
              <div style={{ flex: "1 1 auto", "min-width": "0" }}>
                {toast.title ? <p class="sf-Toast__title">{toast.title}</p> : null}
                {toast.body ? <p class="sf-Toast__body">{toast.body}</p> : null}
              </div>
            </Toast>
          )}
        </For>
      </div>
    </Portal>
  );
}

export type ToastProps = {
  class?: string;
  intent?: ToastIntent;
  politeness?: ToastPoliteness;
  children?: JSX.Element;
  onDismiss?: () => void;
};
export function Toast(props: ToastProps) {
  return (
    <div
      role={toastRole(props.intent, props.politeness)}
      aria-live={props.politeness === "assertive" ? "assertive" : undefined}
      class={cx("sf-Toast", `sf-Toast--${props.intent ?? "info"}`, props.class)}
    >
      {props.children}
      <Show when={props.onDismiss}>
        <Button
          appearance="transparent"
          size="small"
          aria-label="Dismiss"
          onClick={() => props.onDismiss?.()}
        >
          ×
        </Button>
      </Show>
    </div>
  );
}

export function ToastTitle(props: { children?: JSX.Element; class?: string }) {
  return <p class={cx("sf-Toast__title", props.class)}>{props.children}</p>;
}
export function ToastBody(props: { children?: JSX.Element; class?: string }) {
  return <p class={cx("sf-Toast__body", props.class)}>{props.children}</p>;
}
export function ToastFooter(props: { children?: JSX.Element; class?: string }) {
  return <div class={props.class}>{props.children}</div>;
}

export type ToastTriggerProps = {
  class?: string;
  toast?: ToastOptions;
  children?: JSX.Element;
};
export function ToastTrigger(props: ToastTriggerProps) {
  const store = useToastStore();
  return (
    <Button
      class={props.class}
      onClick={() => {
        if (props.toast) dispatchFrom(store, props.toast);
      }}
    >
      {props.children}
    </Button>
  );
}
