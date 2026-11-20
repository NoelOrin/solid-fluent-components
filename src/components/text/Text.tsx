import { splitProps, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cx, type IntrinsicElementProps } from "../../utils/index";

export type TextSize =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000;

export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextAlign = "start" | "center" | "end" | "justify";

export type TextProps = IntrinsicElementProps<"span"> & {
  href?: string;
  as?:
    | "span"
    | "p"
    | "div"
    | "label"
    | "a"
    | "abbr"
    | "b"
    | "code"
    | "dd"
    | "dt"
    | "em"
    | "i"
    | "li"
    | "mark"
    | "pre"
    | "s"
    | "small"
    | "strong"
    | "sub"
    | "sup"
    | "u"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  truncate?: boolean;
  block?: boolean;
  wrap?: boolean;
  font?: "base" | "numeric" | "monospace";
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function Text(props: TextProps) {
  const [local, rest] = splitProps(props, [
    "as",
    "size",
    "weight",
    "align",
    "italic",
    "underline",
    "strikethrough",
    "truncate",
    "block",
    "wrap",
    "font",
    "class",
    "style",
    "children",
  ]);

  const Tag = (local.as ?? "span") as "span";
  const size = () => local.size ?? 300;
  const weight = () => local.weight ?? "regular";

  return (
    <Dynamic
      component={Tag}
      {...rest}
      class={cx(
        "sf-Text",
        `sf-Text--${size()}`,
        `sf-Text--${weight()}`,
        local.italic && "sf-Text--italic",
        local.underline && "sf-Text--underline",
        local.strikethrough && "sf-Text--strikethrough",
        local.truncate && "sf-Text--truncate",
        local.class,
      )}
      style={{
        display: local.block ? "block" : undefined,
        "text-align": local.align,
        "font-family":
          local.font === "monospace"
            ? "var(--sf-fontFamilyMonospace)"
            : local.font === "numeric"
              ? "var(--sf-fontFamilyNumeric)"
              : undefined,
        "white-space": local.wrap === false ? "nowrap" : undefined,
        ...(local.style ?? {}),
      }}
    >
      {local.children}
    </Dynamic>
  );
}

export function Title1(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h1" size={800} weight="semibold" {...props} />;
}
export function Title2(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h2" size={700} weight="semibold" {...props} />;
}
export function Title3(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h3" size={600} weight="semibold" {...props} />;
}
export function Subtitle1(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h4" size={500} weight="semibold" {...props} />;
}
export function Subtitle2(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h5" size={400} weight="semibold" {...props} />;
}
export function Body1(props: Omit<TextProps, "size">) {
  return <Text size={300} {...props} />;
}
export function Body1Strong(props: Omit<TextProps, "size" | "weight">) {
  return <Text size={300} weight="semibold" {...props} />;
}
export function Body2(props: Omit<TextProps, "size">) {
  return <Text size={200} {...props} />;
}
export function Caption1(props: Omit<TextProps, "size">) {
  return <Text size={200} {...props} />;
}
export function Caption2(props: Omit<TextProps, "size">) {
  return <Text size={100} {...props} />;
}
export function Display(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h1" size={1000} weight="semibold" {...props} />;
}
export function LargeTitle(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h1" size={900} weight="semibold" {...props} />;
}
export function Subtitle2Stronger(props: Omit<TextProps, "size" | "weight">) {
  return <Text as="h5" size={400} weight="semibold" {...props} />;
}
