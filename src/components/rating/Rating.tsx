import { For, createMemo, createSignal, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type RatingProps = {
  value?: number;
  defaultValue?: number;
  max?: number;
  step?: 0.5 | 1;
  size?: "small" | "medium" | "large";
  color?: "brand" | "marigold" | "neutral";
  name?: string;
  readOnly?: boolean;
  disabled?: boolean;
  class?: string;
  onChange?: (value: number) => void;
  "aria-label"?: string;
  id?: string;
};

export function Rating(props: RatingProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local] = splitProps(props, [
    "value",
    "defaultValue",
    "max",
    "step",
    "size",
    "color",
    "readOnly",
    "disabled",
    "class",
    "onChange",
    "aria-label",
    "id",
  ]);

  const [uncontrolled, setUncontrolled] = createSignal(local.defaultValue ?? 0);
  const [hover, setHover] = createSignal<number | null>(null);
  const max = () => local.max ?? 5;
  const step = () => local.step ?? 1;
  const value = createMemo(() => local.value ?? uncontrolled());
  const display = createMemo(() => hover() ?? value());
  const interactive = () => !local.disabled && !local.readOnly;

  const normalize = (next: number) => {
    const snapped = Number((Math.round(next / step()) * step()).toFixed(2));
    return Math.min(max(), Math.max(0, snapped));
  };

  const setValue = (next: number) => {
    if (!interactive()) return;
    const resolved = normalize(next);
    if (local.value === undefined) setUncontrolled(resolved);
    local.onChange?.(resolved);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!interactive()) return;
    let next: number | undefined;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = value() + step();
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = value() - step();
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = max();
        break;
      default:
        return;
    }
    event.preventDefault();
    setValue(next);
  };

  const onItemClick = (
    event: MouseEvent & { currentTarget: HTMLButtonElement },
    item: number,
  ) => {
    if (step() !== 0.5) {
      setValue(item);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const isLeftHalf =
      rect.width > 0 && event.clientX < rect.left + rect.width / 2;
    setValue(isLeftHalf ? item - 0.5 : item);
  };

  return (
    <div
      id={local.id ?? fieldId}
      class={cx(
        "sf-Rating",
        `sf-Rating--${local.size ?? "medium"}`,
        `sf-Rating--${local.color ?? "marigold"}`,
        local.disabled && "sf-Rating--disabled",
        fieldA11y().invalid && "sf-Rating--invalid",
        local.class,
      )}
      role="slider"
      tabindex={interactive() ? 0 : undefined}
      aria-label={local["aria-label"] ?? "Rating"}
      aria-valuemin={0}
      aria-valuemax={max()}
      aria-valuenow={value()}
      aria-valuetext={`${value()} of ${max()} stars`}
      aria-readonly={local.readOnly ? true : undefined}
      aria-disabled={local.disabled ? true : undefined}
      aria-invalid={fieldA11y().invalid}
      aria-describedby={fieldA11y().describedBy}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
    >
      <For each={Array.from({ length: max() }, (_, i) => i + 1)}>
        {(item) => {
          const filled = () => display() >= item;
          const half = () =>
            step() === 0.5 && display() + 0.5 >= item && display() < item;
          return (
            <button
              type="button"
              class={cx(
                "sf-Rating__item",
                filled() && "sf-Rating__item--filled",
                half() && "sf-Rating__item--half",
              )}
              tabindex={-1}
              disabled={!interactive()}
              onMouseEnter={() => setHover(item)}
              onFocus={() => setHover(item)}
              onClick={(event) => onItemClick(event, item)}
              aria-label={`${item} star`}
            >
              ★
            </button>
          );
        }}
      </For>
    </div>
  );
}

export type RatingDisplayProps = {
  value: number;
  max?: number;
  size?: "small" | "medium" | "large";
  color?: "brand" | "marigold" | "neutral";
  class?: string;
  children?: JSX.Element;
};

export function RatingDisplay(props: RatingDisplayProps) {
  return (
    <div class={cx("sf-RatingDisplay", props.class)}>
      <Rating
        value={props.value}
        max={props.max}
        size={props.size}
        color={props.color}
        readOnly
      />
      {props.children}
    </div>
  );
}

export type RatingItemProps = {
  value: number;
  selected?: boolean;
  half?: boolean;
  disabled?: boolean;
  class?: string;
  onSelect?: (value: number) => void;
};
export function RatingItem(props: RatingItemProps) {
  return (
    <button
      type="button"
      class={cx(
        "sf-Rating__item",
        props.selected && "sf-Rating__item--filled",
        props.half && "sf-Rating__item--half",
        props.class,
      )}
      disabled={props.disabled}
      aria-label={`${props.value} star`}
      onClick={() => props.onSelect?.(props.value)}
    >
      ★
    </button>
  );
}
