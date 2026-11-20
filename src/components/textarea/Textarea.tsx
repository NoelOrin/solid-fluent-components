import { splitProps } from "solid-js";
import { cx, type IntrinsicElementProps } from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type TextareaProps = IntrinsicElementProps<"textarea"> & {
  size?: "small" | "medium" | "large";
  resize?: "none" | "both" | "horizontal" | "vertical";
  invalid?: boolean;
};

export function Textarea(props: TextareaProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, [
    "class",
    "size",
    "resize",
    "style",
    "id",
    "invalid",
  ]);
  const ariaInvalid = () =>
    local.invalid || fieldA11y().invalid ? true : undefined;

  return (
    <textarea
      id={local.id ?? fieldId}
      class={cx(
        "sf-Textarea",
        "sf-focus-ring",
        ariaInvalid() && "sf-Textarea--invalid",
        local.class,
      )}
      data-size={local.size ?? "medium"}
      aria-invalid={ariaInvalid()}
      aria-describedby={fieldA11y().describedBy}
      {...rest}
      style={{
        resize: local.resize ?? "vertical",
        ...(typeof local.style === "object" ? local.style : {}),
      }}
    />
  );
}
