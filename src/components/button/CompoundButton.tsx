import { splitProps, type JSX } from "solid-js";
import { callHandler, cx, type IntrinsicElementProps } from "../../utils/index";

export type CompoundButtonProps = Omit<IntrinsicElementProps<"button">, "children"> & {
  appearance?: "primary" | "secondary" | "outline" | "subtle" | "transparent";
  size?: "small" | "medium" | "large";
  shape?: "rounded" | "circular" | "square";
  icon?: JSX.Element;
  secondaryContent?: JSX.Element;
  disabledFocusable?: boolean;
  children?: JSX.Element;
};

export function CompoundButton(props: CompoundButtonProps) {
  const [local, rest] = splitProps(props, [
    "appearance",
    "size",
    "shape",
    "icon",
    "secondaryContent",
    "disabled",
    "disabledFocusable",
    "class",
    "children",
    "onClick",
  ]);

  const appearance = () => local.appearance ?? "secondary";
  const size = () => local.size ?? "medium";
  const shape = () => local.shape ?? "rounded";
  const isDisabled = () => Boolean(local.disabled || local.disabledFocusable);

  return (
    <button
      type="button"
      {...rest}
      class={cx(
        "sf-Button",
        "sf-CompoundButton",
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
      {local.icon ? <span class="sf-Button__icon">{local.icon}</span> : null}
      <span class="sf-CompoundButton__content">
        <span class="sf-CompoundButton__primary">{local.children}</span>
        {local.secondaryContent ? (
          <span class="sf-CompoundButton__secondary">{local.secondaryContent}</span>
        ) : null}
      </span>
    </button>
  );
}
