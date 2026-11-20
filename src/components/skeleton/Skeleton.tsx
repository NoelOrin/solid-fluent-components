import { splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type SkeletonAppearance = "opaque" | "translucent";
export type SkeletonAnimation = "wave" | "pulse" | "none";
export type SkeletonShape = "rectangle" | "circle" | "square";

export type SkeletonProps = {
  appearance?: SkeletonAppearance;
  animation?: SkeletonAnimation;
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  class?: string;
  style?: JSX.CSSProperties;
};

export function Skeleton(props: SkeletonProps) {
  const [local] = splitProps(props, [
    "appearance",
    "animation",
    "shape",
    "width",
    "height",
    "class",
    "style",
  ]);

  const appearance = () => local.appearance ?? "opaque";
  const animation = () => local.animation ?? "wave";
  const shape = () => local.shape ?? "rectangle";

  return (
    <span
      class={cx(
        "sf-Skeleton",
        `sf-Skeleton--${appearance()}`,
        `sf-Skeleton--${animation()}`,
        `sf-Skeleton--${shape()}`,
        // Legacy hook kept for backwards compatibility.
        shape() === "circle" && "sf-Skeleton--circle",
        local.class,
      )}
      data-appearance={appearance()}
      data-animation={animation()}
      data-shape={shape()}
      style={{
        width:
          typeof local.width === "number" ? `${local.width}px` : local.width ?? "100%",
        height:
          typeof local.height === "number"
            ? `${local.height}px`
            : local.height ?? (shape() === "circle" ? "32px" : "16px"),
        ...(local.style ?? {}),
        // Guarantee no shimmer/pulse without requiring a CSS change.
        ...(animation() === "none" ? { animation: "none" } : {}),
      }}
      aria-hidden="true"
    />
  );
}

export type SkeletonItemProps = SkeletonProps;
export function SkeletonItem(props: SkeletonItemProps) {
  return <Skeleton {...props} />;
}
