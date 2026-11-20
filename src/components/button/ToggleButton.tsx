import { createSignal, splitProps, type JSX } from "solid-js";
import { callHandler, cx, type IntrinsicElementProps } from "../../utils/index";

export type ToggleButtonProps = Omit<IntrinsicElementProps<"button">, "children"> & {
  appearance?: "primary" | "secondary" | "outline" | "subtle" | "transparent";
  size?: "small" | "medium" | "large";
  shape?: "rounded" | "circular" | "square";
  checked?: boolean;
  defaultChecked?: boolean;
  icon?: JSX.Element;
  children?: JSX.Element;
  disabledFocusable?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function ToggleButton(props: ToggleButtonProps) {
  const [local, rest] = splitProps(props, [
    "appearance",
    "size",
    "shape",
    "checked",
    "defaultChecked",
    "icon",
    "class",
    "children",
    "disabled",
    "disabledFocusable",
    "onClick",
    "onCheckedChange",
  ]);

  const [uncontrolled, setUncontrolled] = createSignal(
    local.defaultChecked ?? false,
  );
  const checked = () => local.checked ?? uncontrolled();
  const appearance = () => local.appearance ?? "secondary";
  const isDisabled = () => Boolean(local.disabled || local.disabledFocusable);

  return (
    <button
      type="button"
      {...rest}
      class={cx(
        "sf-Button",
        "sf-ToggleButton",
        "sf-focus-ring",
        `sf-Button--${appearance()}`,
        `sf-Button--${local.shape ?? "rounded"}`,
        `sf-Button--${local.size ?? "medium"}`,
        checked() && "sf-ToggleButton--checked",
        local.class,
      )}
      aria-pressed={checked()}
      disabled={local.disabled && !local.disabledFocusable ? true : undefined}
      aria-disabled={local.disabledFocusable ? true : undefined}
      onClick={(event) => {
        if (isDisabled()) return;
        const next = !checked();
        if (local.checked === undefined) setUncontrolled(next);
        local.onCheckedChange?.(next);
        callHandler(local.onClick, event);
      }}
    >
      {local.icon ? <span class="sf-Button__icon">{local.icon}</span> : null}
      {local.children}
    </button>
  );
}
