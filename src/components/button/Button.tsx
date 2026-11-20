import { onCleanup, splitProps, type JSX } from "solid-js";
import { callHandler, cx, type IntrinsicElementProps } from "../../utils/index";

export type ButtonAppearance =
  | "primary"
  | "secondary"
  | "outline"
  | "subtle"
  | "transparent";
export type ButtonShape = "rounded" | "circular" | "square";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = Omit<IntrinsicElementProps<"button">, "children"> & {
  appearance?: ButtonAppearance;
  shape?: ButtonShape;
  size?: ButtonSize;
  icon?: JSX.Element;
  iconPosition?: "before" | "after";
  disabledFocusable?: boolean;
  children?: JSX.Element;
};

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    "appearance",
    "shape",
    "size",
    "icon",
    "iconPosition",
    "disabled",
    "disabledFocusable",
    "class",
    "children",
    "onClick",
  ]);

  const appearance = () => local.appearance ?? "secondary";
  const shape = () => local.shape ?? "rounded";
  const size = () => local.size ?? "medium";
  const iconPosition = () => local.iconPosition ?? "before";
  const isDisabled = () => Boolean(local.disabled || local.disabledFocusable);
  // Native `disabled` gives correct form/AT semantics and removes the button
  // from the tab order. `disabledFocusable` opts into the aria-only variant.
  const nativelyDisabled = () => Boolean(local.disabled) && !local.disabledFocusable;

  // Solid's delegated onClick is skipped for natively disabled buttons, so a
  // synthetic click could otherwise bubble to ancestors. A native listener on
  // the element itself still runs and keeps the disabled button inert.
  const stopDisabledClick = (event: MouseEvent) => {
    if (!isDisabled()) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <button
      type="button"
      ref={(el) => {
        el.addEventListener("click", stopDisabledClick);
        onCleanup(() => el.removeEventListener("click", stopDisabledClick));
      }}
      {...rest}
      disabled={nativelyDisabled()}
      class={cx(
        "sf-Button",
        "sf-focus-ring",
        `sf-Button--${appearance()}`,
        `sf-Button--${shape()}`,
        `sf-Button--${size()}`,
        local.class,
      )}
      aria-disabled={isDisabled() ? true : undefined}
      onClick={(event) => {
        if (isDisabled()) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        callHandler(local.onClick, event);
      }}
    >
      {local.icon && iconPosition() === "before" ? (
        <span class="sf-Button__icon">{local.icon}</span>
      ) : null}
      {local.children}
      {local.icon && iconPosition() === "after" ? (
        <span class="sf-Button__icon">{local.icon}</span>
      ) : null}
    </button>
  );
}
