import { Show, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type BadgeAppearance = "filled" | "ghost" | "outline" | "tint";
export type BadgeColor =
  | "brand"
  | "danger"
  | "important"
  | "informative"
  | "severe"
  | "subtle"
  | "success"
  | "warning";
export type BadgeSize =
  | "tiny"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large";
export type BadgeShape = "circular" | "rounded" | "square";
export type BadgeIconPosition = "before" | "after";

export type BadgeProps = {
  appearance?: BadgeAppearance;
  color?: BadgeColor;
  size?: BadgeSize;
  shape?: BadgeShape;
  /** Convenience flag equivalent to `color="severe"`. */
  severe?: boolean;
  /** Convenience flag equivalent to `color="subtle"`. */
  subtle?: boolean;
  icon?: JSX.Element;
  /** @default "before" */
  iconPosition?: BadgeIconPosition;
  class?: string;
  children?: JSX.Element;
};

export function Badge(props: BadgeProps) {
  const [local] = splitProps(props, [
    "appearance",
    "color",
    "size",
    "shape",
    "severe",
    "subtle",
    "icon",
    "iconPosition",
    "class",
    "children",
  ]);

  const appearance = () => local.appearance ?? "filled";
  const color = (): BadgeColor =>
    local.severe
      ? "severe"
      : local.subtle
        ? "subtle"
        : (local.color ?? "brand");
  const size = () => local.size ?? "medium";
  const shape = () => local.shape ?? "circular";
  const iconPosition = () => local.iconPosition ?? "before";

  const icon = () => (
    <Show when={local.icon}>
      <span class="sf-Badge__icon">{local.icon}</span>
    </Show>
  );

  return (
    <span
      class={cx(
        "sf-Badge",
        `sf-Badge--${appearance()}`,
        `sf-Badge--${color()}`,
        `sf-Badge--${size()}`,
        `sf-Badge--${shape()}`,
        iconPosition() === "after" && "sf-Badge--icon-after",
        local.class,
      )}
      data-size={size()}
      data-shape={shape()}
      data-icon-position={iconPosition()}
      data-severe={local.severe ? "true" : undefined}
      data-subtle={local.subtle ? "true" : undefined}
    >
      {iconPosition() === "before" ? icon() : null}
      {local.children}
      {iconPosition() === "after" ? icon() : null}
    </span>
  );
}

export type CounterBadgeProps = BadgeProps & {
  count?: number;
  overflowCount?: number;
  dot?: boolean;
  showZero?: boolean;
};

export function CounterBadge(props: CounterBadgeProps) {
  const [local] = splitProps(props, [
    "count",
    "overflowCount",
    "dot",
    "showZero",
    "class",
    "appearance",
    "color",
    "size",
    "shape",
    "icon",
    "iconPosition",
    "severe",
    "subtle",
  ]);

  const count = () => local.count ?? 0;
  const overflowCount = () => local.overflowCount ?? 99;
  const visible = () => local.dot || count() > 0 || !!local.showZero;
  const text = () => {
    if (local.dot) return "";
    return count() > overflowCount() ? `${overflowCount()}+` : String(count());
  };

  return (
    <Show when={visible()}>
      <Badge
        appearance={local.appearance ?? "filled"}
        // Fluent v9 CounterBadge defaults to the brand color.
        color={local.color ?? "brand"}
        size={local.size}
        shape={local.shape}
        icon={local.icon}
        iconPosition={local.iconPosition}
        severe={local.severe}
        subtle={local.subtle}
        class={local.class}
      >
        {text()}
      </Badge>
    </Show>
  );
}
