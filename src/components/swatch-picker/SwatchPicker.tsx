import { For, createMemo, createSignal, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type SwatchPickerColor = {
  value: string;
  color: string;
  label?: string;
  disabled?: boolean;
};

export type SwatchPickerProps = {
  items?: SwatchPickerColor[];
  value?: string;
  defaultValue?: string;
  selectedItems?: string[];
  defaultSelectedItems?: string[];
  selectionMode?: "single" | "multiple";
  shape?: "square" | "circular";
  size?: "extra-small" | "small" | "medium" | "large";
  spacing?: "small" | "medium";
  class?: string;
  /** onChange 为旧 API 别名，与新 onSelectionChange 同时触发 */
  onSelectionChange?: (selected: string[]) => void;
  onChange?: (selected: string[]) => void;
  children?: JSX.Element;
};

export function SwatchPicker(props: SwatchPickerProps) {
  const [selected, setSelected] = createSignal<string[]>(
    props.defaultSelectedItems ??
      (props.defaultValue ? [props.defaultValue] : []),
  );
  const items = createMemo(() => props.items ?? []);
  const selectedItems = createMemo(() => {
    if (props.selectedItems) return props.selectedItems;
    if (props.value !== undefined) return [props.value];
    return selected();
  });
  const mode = () => props.selectionMode ?? "single";
  const [focusIndex, setFocusIndex] = createSignal(0);
  const cells = new Map<number, HTMLButtonElement>();

  const toggle = (value: string, disabled?: boolean) => {
    if (disabled) return;
    let next: string[];
    if (mode() === "multiple") {
      next = selectedItems().includes(value)
        ? selectedItems().filter((item) => item !== value)
        : [...selectedItems(), value];
    } else {
      next = [value];
    }
    if (!props.selectedItems && props.value === undefined) setSelected(next);
    props.onSelectionChange?.(next);
    props.onChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const list = items();
    if (!list.length) return;
    let next = focusIndex();
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next += 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next -= 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = list.length - 1;
    else return;
    event.preventDefault();
    // 跳过禁用项（循环查找，最多扫描一圈）
    for (let step = 0; step < list.length; step += 1) {
      const index = ((next % list.length) + list.length) % list.length;
      if (!list[index]!.disabled) {
        setFocusIndex(index);
        cells.get(index)?.focus();
        return;
      }
      next += event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    }
  };

  return (
    <div
      class={cx(
        "sf-SwatchPicker",
        `sf-SwatchPicker--${props.size ?? "medium"}`,
        `sf-SwatchPicker--${props.shape ?? "square"}`,
        `sf-SwatchPicker--spacing-${props.spacing ?? "medium"}`,
        props.class,
      )}
      role="listbox"
      aria-multiselectable={mode() === "multiple" ? true : undefined}
      onKeyDown={onKeyDown}
    >
      <For each={items()}>
        {(item, index) => {
          const isSelected = () => selectedItems().includes(item.value);
          return (
            <button
              ref={(el) => {
                if (el) cells.set(index(), el);
                else cells.delete(index());
              }}
              type="button"
              role="option"
              data-index={index()}
              class={cx(
                "sf-ColorSwatch",
                isSelected() && "sf-ColorSwatch--selected",
                item.disabled && "sf-ColorSwatch--disabled",
              )}
              style={{ background: item.color }}
              aria-label={item.label ?? item.value}
              aria-selected={isSelected()}
              disabled={item.disabled}
              tabindex={focusIndex() === index() ? 0 : -1}
              onClick={() => toggle(item.value, item.disabled)}
            />
          );
        }}
      </For>
      {props.children}
    </div>
  );
}

export function ColorSwatch(props: {
  color: string;
  value?: string;
  selected?: boolean;
  disabled?: boolean;
  class?: string;
  "aria-label"?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      class={cx(
        "sf-ColorSwatch",
        props.selected && "sf-ColorSwatch--selected",
        props.disabled && "sf-ColorSwatch--disabled",
        props.class,
      )}
      style={{ background: props.color }}
      disabled={props.disabled}
      aria-label={props["aria-label"] ?? props.value ?? props.color}
      aria-selected={props.selected}
      onClick={props.onClick}
    />
  );
}

export function SwatchPickerRow(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-SwatchPicker__row", props.class)} role="presentation">{props.children}</div>;
}

export function ImageSwatch(props: {
  src: string;
  value: string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  class?: string;
  onClick?: (value: string) => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-label={props.label ?? props.value}
      aria-selected={props.selected ? true : undefined}
      aria-disabled={props.disabled ? true : undefined}
      class={cx(
        "sf-ColorSwatch",
        "sf-ColorSwatch--image",
        props.selected && "sf-ColorSwatch--selected",
        props.disabled && "sf-ColorSwatch--disabled",
        props.class,
      )}
      disabled={props.disabled}
      onClick={() => props.onClick?.(props.value)}
    >
      <img src={props.src} alt={props.label ?? props.value} />
    </button>
  );
}

export function EmptySwatch(props: { label?: string; class?: string }) {
  return (
    <span
      class={cx("sf-ColorSwatch", "sf-ColorSwatch--empty", props.class)}
      role="img"
      aria-label={props.label ?? "Empty swatch"}
    />
  );
}
