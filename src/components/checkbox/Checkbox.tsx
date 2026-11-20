import { Show, createEffect, splitProps, type JSX } from "solid-js";
import {
  callHandler,
  createControllableSignal,
  cx,
  type IntrinsicElementProps,
} from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type CheckboxProps = Omit<
  IntrinsicElementProps<"input">,
  "type" | "size"
> & {
  label?: JSX.Element;
  indicator?: JSX.Element;
  size?: "medium" | "large";
  defaultChecked?: boolean;
  /** Renders the mixed / indeterminate state. */
  mixed?: boolean;
  /** Called with the next checked state whenever the value changes. */
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox(props: CheckboxProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, [
    "class",
    "label",
    "indicator",
    "disabled",
    "checked",
    "defaultChecked",
    "size",
    "children",
    "id",
    "mixed",
    "onCheckedChange",
    "onChange",
  ]);

  const [isChecked, setChecked] = createControllableSignal<boolean>(
    () => local.checked,
    local.defaultChecked ?? false,
    (next) => local.onCheckedChange?.(next),
  );

  let inputEl!: HTMLInputElement;
  createEffect(() => {
    inputEl.indeterminate = Boolean(local.mixed);
  });

  return (
    <label
      class={cx(
        "sf-Checkbox",
        local.disabled && "sf-Checkbox--disabled",
        fieldA11y().invalid && "sf-Checkbox--invalid",
        local.class,
      )}
      data-size={local.size ?? "medium"}
    >
      <input
        ref={inputEl}
        id={local.id ?? fieldId}
        type="checkbox"
        class="sf-Checkbox__input"
        disabled={local.disabled}
        checked={isChecked()}
        aria-checked={local.mixed ? "mixed" : undefined}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        onChange={(event) => {
          setChecked(event.currentTarget.checked);
          callHandler(local.onChange, event);
        }}
        {...rest}
      />
      <span
        class="sf-Checkbox__indicator"
        data-checked={
          local.mixed ? "mixed" : isChecked() ? "true" : undefined
        }
        aria-hidden="true"
      >
        <Show
          when={local.indicator}
          fallback={
            <svg class="sf-Checkbox__check" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 10.5 8.5 14 15 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        >
          {local.indicator}
        </Show>
      </span>
      <Show when={local.label ?? local.children}>
        <span>{local.label ?? local.children}</span>
      </Show>
    </label>
  );
}
