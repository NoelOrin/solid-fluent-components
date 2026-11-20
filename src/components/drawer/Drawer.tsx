import { t } from "../../i18n";
import { Show, createEffect, onCleanup, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { createFocusTrap, cx } from "../../utils/index";
import { Button } from "../button/Button";
import { useControllableOpen } from "../utilities/overlay/Overlay";

export type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: "start" | "end";
  size?: number | string;
  modalType?: "modal" | "non-modal";
  children?: JSX.Element;
  class?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

export function Drawer(props: DrawerProps) {
  const [open, setOpen] = useControllableOpen(
    () => props.open,
    props.defaultOpen ?? false,
    props.onOpenChange,
  );
  const position = () => props.position ?? "start";
  const isModal = () => props.modalType !== "non-modal";
  let drawerEl!: HTMLElement;

  // Focus trap is modal-only.
  createEffect(() => {
    if (!open() || !isModal()) return;
    const trap = createFocusTrap(() => drawerEl);
    const deactivate = trap.activate();
    onCleanup(deactivate);
  });

  // Escape works for modal and non-modal drawers alike.
  createEffect(() => {
    if (!open()) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));
  });

  return (
    <Show when={open()}>
      <Portal>
        <Show when={isModal()}>
          <div class="sf-Overlay" onMouseDown={() => setOpen(false)} />
        </Show>
        <aside
          ref={(el) => {
            drawerEl = el;
          }}
          class={cx(
            "sf-Drawer",
            position() === "end" ? "sf-Drawer--end" : "sf-Drawer--start",
            props.class,
          )}
          style={{ width: typeof props.size === "number" ? `${props.size}px` : props.size }}
          role="dialog"
          aria-modal={isModal() ? true : undefined}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          aria-describedby={props["aria-describedby"]}
          data-open={open() ? "true" : "false"}
          tabindex={-1}
        >
          {props.children}
        </aside>
      </Portal>
    </Show>
  );
}

export function DrawerHeader(props: {
  class?: string;
  children?: JSX.Element;
  onClose?: () => void;
}) {
  return (
    <div class={cx("sf-Drawer__header", props.class)}>
      <div>{props.children}</div>
      <Show when={props.onClose}>
        <Button appearance="transparent" size="small" onClick={props.onClose} aria-label={t("common.close")}>
          ×
        </Button>
      </Show>
    </div>
  );
}

export function DrawerBody(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-Drawer__body", props.class)}>{props.children}</div>;
}

export function DrawerFooter(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-Drawer__footer", props.class)}>{props.children}</div>;
}

export function DrawerHeaderNavigation(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-Drawer__headerNavigation", props.class)} role="navigation">{props.children}</div>;
}

// Re-exported so `DrawerHeaderTitle` is available from the drawer module.
export { DrawerHeaderTitle } from "../utilities/extras/Extras";
export type { DrawerHeaderTitleProps } from "../utilities/extras/Extras";
