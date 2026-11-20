import { splitProps } from "solid-js";
import { cx, type IntrinsicElementProps } from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type SelectProps = IntrinsicElementProps<"select"> & {
  size?: "small" | "medium" | "large";
};

export function Select(props: SelectProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, ["class", "size", "children", "id"]);
  return (
    <select
      id={local.id ?? fieldId}
      class={cx("sf-Select", "sf-focus-ring", local.class)}
      data-size={local.size ?? "medium"}
      aria-invalid={fieldA11y().invalid}
      aria-describedby={fieldA11y().describedBy}
      {...rest}
    >
      {local.children}
    </select>
  );
}

export type OptionProps = IntrinsicElementProps<"option">;
export function Option(props: OptionProps) {
  return <option {...props} />;
}

/**
 * @deprecated Use `ComboboxField` from `../combobox` instead. This is a legacy
 * low-level part kept for backwards compatibility.
 */
export type ComboboxProps = {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  children?: import("solid-js").JSX.Element;
  onInput?: (value: string) => void;
};

/**
 * @deprecated Use `ComboboxField` from `../combobox` instead. This is a legacy
 * low-level part kept for backwards compatibility.
 */
export function Combobox(props: ComboboxProps) {
  return (
    <span class={cx("sf-Combobox", props.class)}>
      <input
        class="sf-Combobox__input"
        value={props.value}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onInput={(event) => props.onInput?.(event.currentTarget.value)}
      />
      <span aria-hidden="true">▾</span>
      {props.children}
    </span>
  );
}

/**
 * @deprecated Use `ComboboxField` from `../combobox` instead. This is a legacy
 * low-level part kept for backwards compatibility.
 */
export type ListboxProps = {
  class?: string;
  children?: import("solid-js").JSX.Element;
};

/**
 * @deprecated Use `ComboboxField` from `../combobox` instead. This is a legacy
 * low-level part kept for backwards compatibility.
 */
export function Listbox(props: ListboxProps) {
  return (
    <ul class={cx("sf-Listbox", props.class)} role="listbox">
      {props.children}
    </ul>
  );
}

/**
 * @deprecated Use the options API of `ComboboxField`/`Dropdown` instead.
 */
export type OptionItemProps = {
  value: string;
  selected?: boolean;
  active?: boolean;
  disabled?: boolean;
  class?: string;
  children?: import("solid-js").JSX.Element;
  onSelect?: (value: string) => void;
};

/**
 * @deprecated Use the options API of `ComboboxField`/`Dropdown` instead.
 */
export function OptionItem(props: OptionItemProps) {
  return (
    <li
      role="option"
      class={cx("sf-Option", props.class)}
      aria-selected={props.selected}
      data-active={props.active ? "true" : undefined}
      aria-disabled={props.disabled ? true : undefined}
      onClick={() => {
        if (!props.disabled) props.onSelect?.(props.value);
      }}
    >
      {props.children}
    </li>
  );
}
