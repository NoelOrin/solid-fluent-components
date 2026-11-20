import { Show, splitProps, type JSX } from "solid-js";
import {
  callHandler,
  createControllableSignal,
  cx,
  type IntrinsicElementProps,
} from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type SwitchProps = Omit<IntrinsicElementProps<"input">, "type"> & {
  label?: JSX.Element;
  labelPosition?: "before" | "after";
  defaultChecked?: boolean;
  /** Called with the next checked state whenever the value changes. */
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch(props: SwitchProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, [
    "class",
    "label",
    "labelPosition",
    "disabled",
    "checked",
    "defaultChecked",
    "children",
    "id",
    "onCheckedChange",
    "onChange",
  ]);

  const [isChecked, setChecked] = createControllableSignal<boolean>(
    () => local.checked,
    local.defaultChecked ?? false,
    (next) => local.onCheckedChange?.(next),
  );

  const labelPosition = () => local.labelPosition ?? "after";
  const label = () => local.label ?? local.children;

  return (
    <label
      class={cx(
        "sf-Switch",
        local.disabled && "sf-Switch--disabled",
        fieldA11y().invalid && "sf-Switch--invalid",
        local.class,
      )}
    >
      <Show when={label() && labelPosition() === "before"}>
        <span>{label()}</span>
      </Show>
      <input
        id={local.id ?? fieldId}
        type="checkbox"
        role="switch"
        class="sf-Switch__input"
        disabled={local.disabled}
        checked={isChecked()}
        aria-checked={isChecked()}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        onChange={(event) => {
          setChecked(event.currentTarget.checked);
          callHandler(local.onChange, event);
        }}
        {...rest}
      />
      <span
        class="sf-Switch__track"
        data-checked={isChecked() ? "true" : undefined}
        aria-hidden="true"
      >
        <span class="sf-Switch__thumb" />
      </span>
      <Show when={label() && labelPosition() === "after"}>
        <span>{label()}</span>
      </Show>
    </label>
  );
}
