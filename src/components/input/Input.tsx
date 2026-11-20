import { splitProps, type JSX } from "solid-js";
import { cx, type IntrinsicElementProps } from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type InputProps = Omit<IntrinsicElementProps<"input">, "size"> & {
  size?: "small" | "medium" | "large";
  contentBefore?: JSX.Element;
  contentAfter?: JSX.Element;
  invalid?: boolean;
};

export function Input(props: InputProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, [
    "class",
    "size",
    "contentBefore",
    "contentAfter",
    "disabled",
    "invalid",
    "id",
  ]);

  const size = () => local.size ?? "medium";
  const ariaInvalid = () =>
    local.invalid || fieldA11y().invalid ? true : undefined;

  return (
    <span
      class={cx(
        "sf-Input",
        `sf-Input--${size()}`,
        local.disabled && "sf-Input--disabled",
        ariaInvalid() && "sf-Input--invalid",
        local.class,
      )}
    >
      {local.contentBefore ? (
        <span class="sf-Input__content">{local.contentBefore}</span>
      ) : null}
      <input
        id={local.id ?? fieldId}
        class="sf-Input__field"
        disabled={local.disabled}
        aria-invalid={ariaInvalid()}
        aria-describedby={fieldA11y().describedBy}
        {...rest}
      />
      {local.contentAfter ? (
        <span class="sf-Input__content">{local.contentAfter}</span>
      ) : null}
    </span>
  );
}
