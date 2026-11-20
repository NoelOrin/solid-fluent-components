import { splitProps, type JSX } from "solid-js";
import { cx, type IntrinsicElementProps } from "../../utils/index";

export type LabelProps = IntrinsicElementProps<"label"> & {
  disabled?: boolean;
  required?: boolean;
  weight?: "regular" | "semibold";
  size?: "small" | "medium" | "large";
  children?: JSX.Element;
};

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "disabled",
    "required",
    "children",
    "weight",
    "size",
  ]);

  return (
    <label
      {...rest}
      class={cx("sf-Label", local.disabled && "sf-Label--disabled", local.class)}
      data-weight={local.weight ?? "semibold"}
      data-size={local.size ?? "medium"}
    >
      {local.children}
      {local.required ? <span class="sf-Label__required">*</span> : null}
    </label>
  );
}
