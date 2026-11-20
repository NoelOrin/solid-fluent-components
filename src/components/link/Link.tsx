import { splitProps, type JSX } from "solid-js";
import { callHandler, cx, type IntrinsicElementProps } from "../../utils/index";

export type LinkProps = IntrinsicElementProps<"a"> & {
  as?: "a" | "button";
  disabled?: boolean;
  inline?: boolean;
  appearance?: "default" | "subtle";
  children?: JSX.Element;
};

export function Link(props: LinkProps) {
  const [local, rest] = splitProps(props, [
    "as",
    "class",
    "disabled",
    "inline",
    "appearance",
    "children",
    "href",
    "onClick",
  ]);

  const className = () =>
    cx(
      "sf-Link",
      local.appearance && local.appearance !== "default" && `sf-Link--${local.appearance}`,
      local.inline && "sf-Link--inline",
      local.disabled && "sf-Link--disabled",
      local.class,
    );

  if ((local.as ?? "a") === "button" || !local.href) {
    return (
      <button
        {...(rest as unknown as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
        type="button"
        class={className()}
        disabled={local.disabled}
        onClick={(event) => {
          if (local.disabled) {
            event.preventDefault();
            return;
          }
          callHandler(local.onClick as never, event as never);
        }}
      >
        {local.children}
      </button>
    );
  }

  return (
    <a
      {...rest}
      href={local.disabled ? undefined : local.href}
      class={className()}
      aria-disabled={local.disabled ? true : undefined}
      onClick={(event) => {
        if (local.disabled) {
          event.preventDefault();
          return;
        }
        callHandler(local.onClick, event);
      }}
    >
      {local.children}
    </a>
  );
}
