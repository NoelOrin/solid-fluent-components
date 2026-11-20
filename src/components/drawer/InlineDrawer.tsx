import { createSignal, type JSX } from "solid-js";
import { cx } from "../../utils/index";
import { Button } from "../button/Button";
import { Drawer } from "./Drawer";

export type InlineDrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  position?: "start" | "end";
  size?: number | string;
  class?: string;
  children?: JSX.Element;
  onOpenChange?: (open: boolean) => void;
  /** Accessible label for the expand/collapse toggle button. */
  "aria-label"?: string;
  /** Localizable label for the expand button. */
  expandLabel?: string;
  /** Localizable label for the collapse button. */
  collapseLabel?: string;
};

export function InlineDrawer(props: InlineDrawerProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultOpen ?? false);
  const open = () => props.open ?? uncontrolled();
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setUncontrolled(next);
    props.onOpenChange?.(next);
  };
  const toggleLabel = () => (open() ? props.collapseLabel ?? "收起" : props.expandLabel ?? "展开");

  return (
    <div class={cx("sf-InlineDrawerHost", props.class)}>
      <aside
        class={cx(
          "sf-InlineDrawer",
          props.position === "end" ? "sf-InlineDrawer--end" : "sf-InlineDrawer--start",
          !open() && "sf-InlineDrawer--collapsed",
        )}
        style={{
          width: open()
            ? typeof props.size === "number"
              ? `${props.size}px`
              : props.size ?? "280px"
            : "0px",
        }}
      >
        {props.children}
      </aside>
      <Button
        appearance="subtle"
        size="small"
        aria-label={props["aria-label"] ?? toggleLabel()}
        onClick={() => setOpen(!open())}
      >
        {toggleLabel()}
      </Button>
    </div>
  );
}

export type OverlayDrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: "start" | "end";
  size?: number | string;
  modalType?: "modal" | "non-modal";
  class?: string;
  children?: JSX.Element;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

/**
 * A drawer rendered in a portal above the page. Delegates all behaviour to
 * `Drawer` (portal, positioning, overlay, focus trap, Escape/outside
 * dismissal and `onOpenChange`) so the two stay in sync.
 */
export function OverlayDrawer(props: OverlayDrawerProps) {
  return (
    <Drawer
      open={props.open}
      defaultOpen={props.defaultOpen}
      onOpenChange={props.onOpenChange}
      position={props.position}
      size={props.size}
      modalType={props.modalType}
      class={props.class}
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      aria-describedby={props["aria-describedby"]}
    >
      {props.children}
    </Drawer>
  );
}

export type MessageBarIntentGroupProps = {
  class?: string;
  children?: JSX.Element;
};

export function MessageBarIntentGroup(props: MessageBarIntentGroupProps) {
  return <div class={cx("sf-MessageBarGroup", props.class)}>{props.children}</div>;
}

export type SkeletonAvatarProps = {
  size?: number;
  class?: string;
};

export function SkeletonAvatar(props: SkeletonAvatarProps) {
  const size = props.size ?? 32;
  return (
    <span
      class={cx("sf-Skeleton", "sf-Skeleton--circle", props.class)}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
