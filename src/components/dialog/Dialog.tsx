import { t } from "../../i18n";
import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  Show,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import { createFocusTrap, createId, cx } from "../../utils/index";
import { Button } from "../button/Button";
import { useControllableOpen } from "../utilities/overlay/Overlay";

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modalType?: "modal" | "non-modal" | "alert";
  /** Keep the dialog subtree mounted (hidden) while closed. Defaults to `true`. */
  unmountOnClose?: boolean;
  children?: JSX.Element;
};

type DialogContextValue = {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  modalType: () => NonNullable<DialogProps["modalType"]>;
  titleId: string;
  hasTitle: () => boolean;
  registerTitle: () => void;
  unmountOnClose: () => boolean;
};

const DialogContext = createContext<DialogContextValue>();

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}

export function Dialog(props: DialogProps) {
  const [open, setOpen] = useControllableOpen(
    () => props.open,
    props.defaultOpen ?? false,
    props.onOpenChange,
  );
  const [titleCount, setTitleCount] = createSignal(0);
  const titleId = createId("dialog-title");
  const modalType = () => props.modalType ?? "modal";
  const isModal = () => modalType() !== "non-modal";
  const isAlert = () => modalType() === "alert";

  const dismissOutside = () => {
    if (isAlert()) return;
    setOpen(false);
  };

  const context: DialogContextValue = {
    open,
    setOpen,
    modalType,
    titleId,
    hasTitle: () => titleCount() > 0,
    registerTitle: () => {
      setTitleCount((count) => count + 1);
      onCleanup(() => setTitleCount((count) => Math.max(0, count - 1)));
    },
    unmountOnClose: () => props.unmountOnClose ?? true,
  };

  return (
    <DialogContext.Provider value={context}>
      <Show when={open() && isModal()}>
        <Portal>
          <div class="sf-Overlay" onMouseDown={dismissOutside} />
        </Portal>
      </Show>
      {props.children}
    </DialogContext.Provider>
  );
}

export type DialogSurfaceProps = {
  class?: string;
  size?: "small" | "medium" | "large";
  children?: JSX.Element;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};
export function DialogSurface(props: DialogSurfaceProps) {
  const dialog = useDialogContext();
  const isAlert = () => dialog.modalType() === "alert";
  const isModal = () => dialog.modalType() !== "non-modal";
  let dialogEl!: HTMLDivElement;

  // Focus trap only applies to modal dialogs.
  createEffect(() => {
    if (!dialog.open() || !isModal()) return;
    const trap = createFocusTrap(() => dialogEl);
    const deactivate = trap.activate();
    onCleanup(deactivate);
  });

  // Escape is handled independently so non-modal dialogs are dismissible too.
  // Alert dialogs are intentionally excluded.
  createEffect(() => {
    if (!dialog.open() || isAlert()) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));
  });

  const labelledBy = () =>
    props["aria-labelledby"] ?? (dialog.hasTitle() ? dialog.titleId : undefined);

  return (
    <Show when={dialog.open() || !dialog.unmountOnClose()}>
      <Portal>
        <div
          ref={dialogEl}
          class="sf-Dialog"
          role={isAlert() ? "alertdialog" : "dialog"}
          aria-modal={isModal() ? true : undefined}
          aria-label={props["aria-label"]}
          aria-labelledby={labelledBy()}
          aria-describedby={props["aria-describedby"]}
          tabindex={-1}
          hidden={!dialog.open()}
          style={{ display: dialog.open() ? undefined : "none" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isAlert()) {
              dialog.setOpen(false);
            }
          }}
        >
          <div
            class={cx(
              "sf-Dialog__surface",
              props.size === "small" && "sf-Dialog__surface--small",
              props.size === "large" && "sf-Dialog__surface--large",
              props.class,
            )}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}

export type DialogBodyProps = { class?: string; children?: JSX.Element };
export function DialogBody(props: DialogBodyProps) {
  return <div class={cx("sf-Dialog__body", props.class)}>{props.children}</div>;
}

export type DialogTitleProps = { class?: string; children?: JSX.Element };
export function DialogTitle(props: DialogTitleProps) {
  const dialog = useDialogContext();
  dialog.registerTitle();
  return (
    <h2 id={dialog.titleId} class={cx("sf-Dialog__title", props.class)}>
      {props.children}
    </h2>
  );
}

export type DialogActionsProps = {
  class?: string;
  children?: JSX.Element;
  position?: "start" | "end";
};
export function DialogActions(props: DialogActionsProps) {
  return (
    <div
      class={cx("sf-Dialog__actions", props.class)}
      style={{ "justify-content": props.position === "start" ? "flex-start" : "flex-end" }}
    >
      {props.children}
    </div>
  );
}

export type DialogContentProps = {
  class?: string;
  title?: JSX.Element;
  children?: JSX.Element;
  actions?: JSX.Element;
  onClose?: () => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
};
export function DialogContent(props: DialogContentProps) {
  const dialog = useDialogContext();
  const [local] = splitProps(props, [
    "class",
    "title",
    "children",
    "actions",
    "onClose",
    "aria-label",
    "aria-describedby",
  ]);
  return (
    <DialogSurface
      class={local.class}
      aria-label={local["aria-label"]}
      aria-describedby={local["aria-describedby"]}
    >
      <Show when={local.title !== undefined || local.onClose}>
        <div class="sf-Dialog__header">
          <Show when={local.title !== undefined}>
            <DialogTitle>{local.title}</DialogTitle>
          </Show>
          <Show when={local.onClose}>
            <Button
              appearance="transparent"
              size="small"
              onClick={() => {
                local.onClose?.();
                dialog.setOpen(false);
              }}
              aria-label={t("common.close")}
            >
              ×
            </Button>
          </Show>
        </div>
      </Show>
      <DialogBody>{local.children}</DialogBody>
      <Show when={local.actions}>
        <DialogActions>{local.actions}</DialogActions>
      </Show>
    </DialogSurface>
  );
}

export type DialogTriggerProps = {
  /** Skip adding `aria-haspopup` / `aria-expanded` to the trigger element. */
  disableButtonEnhancement?: boolean;
  children: JSX.Element;
};
export function DialogTrigger(props: DialogTriggerProps) {
  const dialog = useDialogContext();
  let triggerEl!: HTMLSpanElement;

  // Fluent-style button enhancement: annotate the actual trigger element so
  // assistive technology can discover the popup and its expanded state.
  createEffect(() => {
    if (props.disableButtonEnhancement) return;
    const child = triggerEl?.firstElementChild as HTMLElement | null;
    if (!child) return;
    child.setAttribute("aria-haspopup", "dialog");
    child.setAttribute("aria-expanded", dialog.open() ? "true" : "false");
  });

  return (
    <span
      ref={triggerEl}
      style={{ display: "inline-flex" }}
      onClick={() => dialog.setOpen(true)}
    >
      {props.children}
    </span>
  );
}
