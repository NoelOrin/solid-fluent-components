import { t } from "../../i18n";
import { splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type HamburgerProps = {
  class?: string;
  "aria-label"?: string;
  open?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
};

export function Hamburger(props: HamburgerProps) {
  const [local] = splitProps(props, [
    "class",
    "aria-label",
    "open",
    "disabled",
    "onClick",
  ]);

  return (
    <button
      type="button"
      class={cx("sf-Hamburger", "sf-focus-ring", local.class)}
      aria-label={local["aria-label"] ?? t("common.menu")}
      aria-expanded={local.open ? true : undefined}
      aria-disabled={local.disabled ? true : undefined}
      disabled={local.disabled}
      onClick={(event) => {
        if (local.disabled) {
          event.preventDefault();
          return;
        }
        local.onClick?.(event);
      }}
    >
      <span class="sf-Hamburger__bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
