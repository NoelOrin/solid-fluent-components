import {
  For,
  createSignal,
  onCleanup,
  splitProps,
  type JSX,
} from "solid-js";
import { cx, focusElement } from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";
import { Radio } from "./Radio";
import {
  RadioGroupContext,
  type RadioGroupContextValue,
  type RadioMoveDirection,
} from "./context";

export type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  name?: string;
  layout?: "vertical" | "horizontal";
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: JSX.Element; disabled?: boolean }>;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function RadioGroup(props: RadioGroupProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local] = splitProps(props, [
    "value",
    "defaultValue",
    "name",
    "layout",
    "disabled",
    "class",
    "children",
    "onChange",
    "options",
    "id",
    "aria-label",
    "aria-labelledby",
  ]);

  const [uncontrolled, setUncontrolled] = createSignal(local.defaultValue ?? "");
  const value = () => local.value ?? uncontrolled();
  const name = () => local.name ?? fieldId ?? "radio-group";
  const disabled = () => Boolean(local.disabled);

  const radios = new Map<string, HTMLInputElement>();

  const setValue = (next: string) => {
    if (disabled()) return;
    if (local.value === undefined) setUncontrolled(next);
    local.onChange?.(next);
  };

  const enabledEntries = () =>
    Array.from(radios.entries()).filter(([, el]) => !el.disabled);

  const move = (fromValue: string, direction: RadioMoveDirection) => {
    const entries = enabledEntries();
    if (entries.length === 0) return;
    const currentIndex = entries.findIndex(([v]) => v === fromValue);
    let nextIndex: number;
    if (direction === "first") nextIndex = 0;
    else if (direction === "last") nextIndex = entries.length - 1;
    else if (currentIndex < 0) nextIndex = 0;
    else {
      const delta = direction === "next" ? 1 : -1;
      nextIndex = (currentIndex + delta + entries.length) % entries.length;
    }
    const [nextValue, nextEl] = entries[nextIndex]!;
    setValue(nextValue);
    focusElement(nextEl);
  };

  const isTabbable = (radioValue: string) => {
    const entries = enabledEntries();
    if (entries.length === 0) return false;
    if (value() && entries.some(([v]) => v === value())) {
      return radioValue === value();
    }
    return entries[0]![0] === radioValue;
  };

  const context: RadioGroupContextValue = {
    value,
    name,
    disabled,
    setValue,
    register: (radioValue, el) => radios.set(radioValue, el),
    unregister: (radioValue) => radios.delete(radioValue),
    move,
    isTabbable,
  };

  onCleanup(() => radios.clear());

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        id={local.id ?? fieldId}
        role="radiogroup"
        class={cx(
          "sf-RadioGroup",
          local.layout === "horizontal" && "sf-RadioGroup--horizontal",
          fieldA11y().invalid && "sf-RadioGroup--invalid",
          local.class,
        )}
        aria-label={local["aria-label"]}
        aria-labelledby={local["aria-labelledby"]}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        data-orientation={local.layout ?? "vertical"}
      >
        <For each={local.options ?? []}>
          {(option) => (
            <Radio
              value={option.value}
              label={option.label}
              disabled={disabled() || option.disabled}
            />
          )}
        </For>
        {local.children}
      </div>
    </RadioGroupContext.Provider>
  );
}
