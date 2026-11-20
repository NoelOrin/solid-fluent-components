import { t } from "../../i18n";
import { Show, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type TagAppearance = "filled" | "outline" | "brand" | "ghost";

export type TagProps = {
  appearance?: TagAppearance;
  size?: "extra-small" | "small" | "medium";
  shape?: "rounded" | "circular";
  dismissible?: boolean;
  onDismiss?: (event?: MouseEvent) => void;
  icon?: JSX.Element;
  class?: string;
  children?: JSX.Element;
  disabled?: boolean;
};

export function Tag(props: TagProps) {
  return (
    <span
      class={cx(
        "sf-Tag",
        props.appearance && `sf-Tag--${props.appearance}`,
        props.class,
      )}
      data-size={props.size ?? "medium"}
      data-shape={props.shape ?? "circular"}
      data-appearance={props.appearance}
      data-disabled={props.disabled ? "true" : undefined}
    >
      {props.icon}
      <span>{props.children}</span>
      <Show when={props.dismissible}>
        <button
          type="button"
          class="sf-Tag__dismiss"
          aria-label={t("common.remove")}
          disabled={props.disabled}
          onClick={(event) => {
            event.stopPropagation();
            props.onDismiss?.(event);
          }}
        >
          ×
        </button>
      </Show>
    </span>
  );
}

export type TagGroupProps = {
  class?: string;
  children?: JSX.Element;
};
export function TagGroup(props: TagGroupProps) {
  return (
    <div class={cx("sf-TagGroup", props.class)} style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
      {props.children}
    </div>
  );
}
