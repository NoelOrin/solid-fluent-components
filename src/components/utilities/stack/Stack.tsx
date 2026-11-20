import { type JSX } from "solid-js";
import { cx } from "../../../utils/index";

export type StackProps = {
  horizontal?: boolean;
  reversed?: boolean;
  wrap?: boolean;
  verticalAlign?: "start" | "center" | "end" | "stretch" | "baseline";
  horizontalAlign?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
  tokens?: { childrenGap?: number | string; padding?: number | string };
  /** Stretch the stack to the full height of its parent. */
  verticalFill?: boolean;
  /** Stretch the stack to the full width of its parent. */
  horizontalFill?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function Stack(props: StackProps) {
  const gap = props.tokens?.childrenGap;
  return (
    <div
      class={cx(
        "sf-Stack",
        props.horizontal ? "sf-Stack--horizontal" : "sf-Stack--vertical",
        props.wrap && "sf-Stack--wrap",
        props.verticalFill && "sf-Stack--vertical-fill",
        props.horizontalFill && "sf-Stack--horizontal-fill",
        props.class,
      )}
      style={{
        width: props.horizontalFill ? "100%" : undefined,
        height: props.verticalFill ? "100%" : undefined,
        gap: typeof gap === "number" ? `${gap}px` : gap,
        padding:
          typeof props.tokens?.padding === "number"
            ? `${props.tokens.padding}px`
            : props.tokens?.padding,
        "align-items": props.verticalAlign,
        "justify-content": props.horizontalAlign,
        "flex-direction": props.reversed
          ? props.horizontal
            ? "row-reverse"
            : "column-reverse"
          : undefined,
        ...(props.style ?? {}),
      }}
    >
      {props.children}
    </div>
  );
}

export type StackItemProps = {
  grow?: boolean | number;
  disableShrink?: boolean;
  align?: "auto" | "stretch" | "center" | "start" | "end" | "baseline";
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function StackItem(props: StackItemProps) {
  return (
    <div
      class={props.class}
      style={{
        flex: props.grow === true ? "1 1 auto" : props.grow ? `${props.grow} 1 auto` : undefined,
        "flex-shrink": props.disableShrink ? 0 : undefined,
        "align-self": props.align,
        ...(props.style ?? {}),
      }}
    >
      {props.children}
    </div>
  );
}
