import { t } from "../../i18n";
import { Show, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";
import { Button } from "../button/Button";
import type { TagAppearance } from "./Tag";

export type InteractionTagProps = {
  appearance?: TagAppearance;
  size?: "extra-small" | "small" | "medium";
  shape?: "rounded" | "circular";
  selected?: boolean;
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
  onClick?: () => void;
  onDismiss?: () => void;
  media?: JSX.Element;
  secondaryText?: JSX.Element;
  "aria-label"?: string;
};

export function InteractionTag(props: InteractionTagProps) {
  const [local] = splitProps(props, [
    "appearance",
    "size",
    "shape",
    "selected",
    "disabled",
    "class",
    "children",
    "onClick",
    "onDismiss",
    "media",
    "secondaryText",
    "aria-label",
  ]);

  return (
    <span
      class={cx(
        "sf-InteractionTag",
        local.appearance && `sf-InteractionTag--${local.appearance}`,
        local.selected && "sf-InteractionTag--selected",
        local.disabled && "sf-InteractionTag--disabled",
        local.class,
      )}
      data-size={local.size ?? "medium"}
      data-shape={local.shape ?? "circular"}
      data-appearance={local.appearance}
    >
      <button
        type="button"
        class="sf-InteractionTag__primary"
        disabled={local.disabled}
        aria-label={local["aria-label"]}
        onClick={local.onClick}
      >
        {local.media}
        <span class="sf-InteractionTag__text">
          <span>{local.children}</span>
          <Show when={local.secondaryText}>
            <span class="sf-InteractionTag__secondary">{local.secondaryText}</span>
          </Show>
        </span>
      </button>
      <Show when={local.onDismiss}>
        <Button
          appearance="transparent"
          size="small"
          class="sf-InteractionTag__dismiss"
          disabled={local.disabled}
          aria-label={t("common.remove")}
          onClick={local.onDismiss}
        >
          ×
        </Button>
      </Show>
    </span>
  );
}

export type InteractionTagPrimaryProps = {
  class?: string;
  children?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  media?: JSX.Element;
  "aria-label"?: string;
};
export function InteractionTagPrimary(props: InteractionTagPrimaryProps) {
  return (
    <button
      type="button"
      class={cx("sf-InteractionTag__primary", props.class)}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
      onClick={props.onClick}
    >
      {props.media}
      <span class="sf-InteractionTag__text">{props.children}</span>
    </button>
  );
}

export type InteractionTagSecondaryProps = {
  class?: string;
  children?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};
export function InteractionTagSecondary(props: InteractionTagSecondaryProps) {
  return (
    <button
      type="button"
      class={cx("sf-InteractionTag__dismiss", props.class)}
      disabled={props.disabled}
      aria-label={props["aria-label"] ?? t("common.remove")}
      onClick={props.onClick}
    >
      {props.children ?? "×"}
    </button>
  );
}
