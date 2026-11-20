import { createMemo, createSignal, splitProps } from "solid-js";
import { callHandler, cx, type IntrinsicElementProps } from "../../utils/index";
import { Button } from "../button/Button";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type SpinButtonProps = Omit<
  IntrinsicElementProps<"input">,
  "type" | "size" | "onChange"
> & {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: "small" | "medium";
  appearance?: "outline" | "underline" | "filled-darker" | "filled-lighter";
  displayValue?: string;
  onChange?: (value: number | null, displayValue: string) => void;
};

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

export function SpinButton(props: SpinButtonProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, [
    "class",
    "value",
    "defaultValue",
    "min",
    "max",
    "step",
    "precision",
    "size",
    "appearance",
    "displayValue",
    "disabled",
    "onChange",
    "onInput",
    "onKeyDown",
    "id",
  ]);

  const [uncontrolled, setUncontrolled] = createSignal(local.defaultValue ?? 0);
  const [empty, setEmpty] = createSignal(false);
  const value = createMemo(() => local.value ?? uncontrolled());
  const step = () => local.step ?? 1;
  const display = () =>
    local.displayValue ?? (empty() ? "" : String(value()));

  const commit = (next: number) => {
    setEmpty(false);
    const rounded =
      local.precision !== undefined
        ? Number(next.toFixed(local.precision))
        : next;
    const clamped = clamp(rounded, local.min, local.max);
    if (local.value === undefined) setUncontrolled(clamped);
    local.onChange?.(clamped, String(clamped));
  };

  const commitEmpty = () => {
    setEmpty(true);
    local.onChange?.(null, "");
  };

  const onKeyDown = (
    event: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element },
  ) => {
    if (local.disabled) return;
    const largeStep = step() * 10;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        commit(value() + step());
        break;
      case "ArrowDown":
        event.preventDefault();
        commit(value() - step());
        break;
      case "PageUp":
        event.preventDefault();
        commit(value() + largeStep);
        break;
      case "PageDown":
        event.preventDefault();
        commit(value() - largeStep);
        break;
      case "Home":
        if (local.min !== undefined) {
          event.preventDefault();
          commit(local.min);
        }
        break;
      case "End":
        if (local.max !== undefined) {
          event.preventDefault();
          commit(local.max);
        }
        break;
    }
    callHandler(local.onKeyDown, event);
  };

  return (
    <span
      class={cx(
        "sf-SpinButton",
        `sf-SpinButton--${local.size ?? "medium"}`,
        local.disabled && "sf-SpinButton--disabled",
        fieldA11y().invalid && "sf-SpinButton--invalid",
        local.class,
      )}
      data-appearance={local.appearance ?? "outline"}
    >
      <input
        {...rest}
        id={local.id ?? fieldId}
        class="sf-SpinButton__input"
        type="text"
        inputmode="decimal"
        role="spinbutton"
        aria-valuenow={empty() ? undefined : value()}
        aria-valuemin={local.min}
        aria-valuemax={local.max}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        disabled={local.disabled}
        value={display()}
        onInput={(event) => {
          const raw = event.currentTarget.value;
          if (raw.trim() === "") {
            commitEmpty();
          } else {
            const parsed = Number(raw);
            if (Number.isFinite(parsed)) commit(parsed);
            else local.onChange?.(null, raw);
          }
          callHandler(local.onInput, event);
        }}
        onKeyDown={onKeyDown}
      />
      <span class="sf-SpinButton__controls">
        <Button
          appearance="transparent"
          size="small"
          class="sf-SpinButton__button"
          disabled={local.disabled}
          aria-label="Increment"
          onClick={() => commit(value() + step())}
        >
          ▲
        </Button>
        <Button
          appearance="transparent"
          size="small"
          class="sf-SpinButton__button"
          disabled={local.disabled}
          aria-label="Decrement"
          onClick={() => commit(value() - step())}
        >
          ▼
        </Button>
      </span>
    </span>
  );
}

export type SpinButtonBounds = {
  min?: number;
  max?: number;
  step?: number;
};
