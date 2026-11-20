import { Show, createEffect, createSignal, onCleanup, type JSX } from "solid-js";
import { Portal } from "solid-js/web";

export type OverlayProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  class?: string;
  children?: JSX.Element;
  mount?: Node;
};

export function useControllableOpen(
  open: (() => boolean | undefined) | undefined,
  defaultOpen: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [uncontrolled, setUncontrolled] = createSignal(defaultOpen);
  const isControlled = () => open?.() !== undefined;
  const value = () => (isControlled() ? Boolean(open?.()) : uncontrolled());
  const setValue = (next: boolean) => {
    if (!isControlled()) setUncontrolled(next);
    onOpenChange?.(next);
  };
  return [value, setValue] as const;
}

export function Overlay(props: OverlayProps) {
  createEffect(() => {
    if (!props.open || props.closeOnEscape === false) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onOpenChange?.(false);
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));
  });

  return (
    <Show when={props.open}>
      <Portal mount={props.mount}>
        <div
          class={["sf-Overlay", props.class].filter(Boolean).join(" ")}
          onMouseDown={() => {
            if (props.closeOnOutsideClick !== false) props.onOpenChange?.(false);
          }}
        >
          {props.children}
        </div>
      </Portal>
    </Show>
  );
}
