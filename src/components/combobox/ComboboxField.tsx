import { t } from "../../i18n";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import {
  createId,
  cx,
  moveActiveIndex,
  scrollIntoViewIfNeeded,
} from "../../utils/index";
import { useControllableOpen } from "../utilities/overlay/Overlay";
import { Tag } from "../tag/Tag";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxFieldProps = {
  options?: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  selectedOptions?: string[];
  defaultSelectedOptions?: string[];
  multiselect?: boolean;
  placeholder?: string;
  disabled?: boolean;
  freeform?: boolean;
  clearable?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  class?: string;
  listboxId?: string;
  id?: string;
  onInput?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onOptionSelect?: (data: {
    value: string;
    selectedOptions: string[];
    optionValue?: string;
    optionText?: string;
  }) => void;
};

export function ComboboxField(props: ComboboxFieldProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [open, setOpen] = useControllableOpen(
    () => props.open,
    props.defaultOpen ?? false,
    props.onOpenChange,
  );
  const [text, setText] = createSignal(props.defaultValue ?? props.value ?? "");
  const [selected, setSelected] = createSignal<string[]>(
    props.selectedOptions ??
      props.defaultSelectedOptions ??
      (props.defaultValue ? [props.defaultValue] : []),
  );
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const listboxId = props.listboxId ?? createId("listbox");
  let rootEl!: HTMLSpanElement;
  let inputEl!: HTMLInputElement;
  let listEl!: HTMLUListElement;
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });

  const options = createMemo(() => props.options ?? []);
  const selectedOptions = createMemo(() => props.selectedOptions ?? selected());
  const filtered = createMemo(() => {
    const q = text().trim().toLowerCase();
    if (!q) return options();
    return options().filter((option) => option.label.toLowerCase().includes(q));
  });
  const activeOption = createMemo(() => filtered()[activeIndex()]);

  createEffect(() => {
    if (props.value !== undefined) setText(props.value);
  });
  createEffect(() => {
    if (props.selectedOptions) setSelected(props.selectedOptions);
  });

  createEffect(() => {
    if (!open()) {
      setActiveIndex(-1);
      return;
    }
    const list = filtered();
    const firstEnabled = list.findIndex((item) => !item.disabled);
    setActiveIndex(firstEnabled);
    const update = async () => {
      if (!rootEl || !listEl) return;
      const result = await computePosition(rootEl, listEl, {
        placement: "bottom-start",
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      });
      setCoords({ x: result.x, y: result.y });
    };
    void update();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (listEl.contains(target) || rootEl.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", update);
    onCleanup(() => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", update);
    });
  });

  createEffect(() => {
    if (!open() || !listEl) return;
    const item = listEl.querySelector<HTMLElement>(
      `[data-index="${activeIndex()}"]`,
    );
    scrollIntoViewIfNeeded(listEl, item ?? undefined);
  });

  const commitSelected = (nextSelected: string[], option?: ComboboxOption) => {
    if (props.selectedOptions === undefined) setSelected(nextSelected);
    props.onOptionSelect?.({
      value: option?.value ?? text(),
      selectedOptions: nextSelected,
      optionValue: option?.value,
      optionText: option?.label,
    });
  };

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (props.multiselect) {
      const nextSelected = selectedOptions().includes(option.value)
        ? selectedOptions().filter((v) => v !== option.value)
        : [...selectedOptions(), option.value];
      commitSelected(nextSelected, option);
      setText("");
      inputEl?.focus();
      return;
    }
    commitSelected([option.value], option);
    setText(option.label);
    setOpen(false);
  };

  const removeSelected = (value: string) => {
    const option = options().find((item) => item.value === value);
    commitSelected(selectedOptions().filter((item) => item !== value), option);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (props.disabled) return;
    const list = filtered();

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open()) {
        setOpen(true);
        return;
      }
      setActiveIndex((current) =>
        moveActiveIndex(current, 1, list.length, {
          disabled: (index) => Boolean(list[index]?.disabled),
        }),
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open()) {
        setOpen(true);
        return;
      }
      setActiveIndex((current) =>
        moveActiveIndex(current, -1, list.length, {
          disabled: (index) => Boolean(list[index]?.disabled),
        }),
      );
      return;
    }
    if (event.key === "Home" && open()) {
      event.preventDefault();
      setActiveIndex(
        moveActiveIndex(-1, 1, list.length, {
          disabled: (index) => Boolean(list[index]?.disabled),
        }),
      );
      return;
    }
    if (event.key === "End" && open()) {
      event.preventDefault();
      setActiveIndex(
        moveActiveIndex(list.length, -1, list.length, {
          disabled: (index) => Boolean(list[index]?.disabled),
        }),
      );
      return;
    }
    if (event.key === "Enter") {
      if (!open()) {
        setOpen(true);
        return;
      }
      const option = activeOption();
      if (option) {
        event.preventDefault();
        choose(option);
      } else if (props.freeform && text().trim()) {
        event.preventDefault();
        commitSelected(
          props.multiselect ? [...selectedOptions(), text().trim()] : [text().trim()],
        );
        if (!props.multiselect) setOpen(false);
      }
      return;
    }
    if (event.key === "Escape") {
      if (open()) {
        event.preventDefault();
        setOpen(false);
      }
      if (text()) {
        setText("");
        props.onInput?.("");
      }
      return;
    }
    if (
      event.key === "Backspace" &&
      props.multiselect &&
      !text() &&
      selectedOptions().length > 0
    ) {
      removeSelected(selectedOptions()[selectedOptions().length - 1]!);
    }
  };

  return (
    <div class={cx("sf-ComboboxField", props.class)}>
      <span
        ref={rootEl}
        class={cx(
          "sf-Combobox",
          "sf-focus-ring",
          props.multiselect && "sf-Combobox--multiselect",
          props.disabled && "sf-Combobox--disabled",
          fieldA11y().invalid && "sf-Combobox--invalid",
        )}
      >
        <Show when={props.multiselect}>
          <For each={selectedOptions()}>
            {(value) => {
              const label =
                options().find((item) => item.value === value)?.label ?? value;
              return (
                <Tag
                  dismissible={!props.disabled}
                  onDismiss={() => removeSelected(value)}
                >
                  {label}
                </Tag>
              );
            }}
          </For>
        </Show>
        <input
          ref={inputEl}
          id={props.id ?? fieldId}
          class="sf-Combobox__input"
          role="combobox"
          aria-invalid={fieldA11y().invalid}
          aria-describedby={fieldA11y().describedBy}
          aria-expanded={open()}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open() && activeOption()
              ? `${listboxId}-opt-${activeOption()!.value}`
              : undefined
          }
          aria-multiselectable={props.multiselect ? true : undefined}
          disabled={props.disabled}
          placeholder={
            props.multiselect && selectedOptions().length
              ? ""
              : props.placeholder
          }
          value={text()}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onInput={(event) => {
            const next = event.currentTarget.value;
            setText(next);
            setOpen(true);
            props.onInput?.(next);
            if (props.freeform && !props.multiselect) {
              props.onOptionSelect?.({
                value: next,
                selectedOptions: selectedOptions(),
              });
            }
          }}
        />
        <Show when={props.clearable && (text() || selectedOptions().length)}>
          <button
            type="button"
            class="sf-Combobox__clear"
            aria-label={t("common.clear")}
            disabled={props.disabled}
            onClick={() => {
              setText("");
              commitSelected([]);
              inputEl?.focus();
            }}
          >
            ×
          </button>
        </Show>
        <button
          type="button"
          class="sf-Combobox__expand"
          aria-label={open() ? t("common.close") : t("common.open")}
          disabled={props.disabled}
          onClick={() => {
            setOpen(!open());
            inputEl?.focus();
          }}
        >
          ▾
        </button>
      </span>
      <Show when={open()}>
        <Portal>
          <ul
            ref={listEl}
            id={listboxId}
            class="sf-Listbox"
            role="listbox"
            aria-multiselectable={props.multiselect ? true : undefined}
            style={{
              position: "absolute",
              left: `${coords().x}px`,
              top: `${coords().y}px`,
              "min-width": `${rootEl?.offsetWidth ?? 180}px`,
            }}
          >
            <For
              each={filtered()}
              fallback={<li class="sf-Option sf-Option--empty">No results</li>}
            >
              {(option, index) => {
                const active = () => activeIndex() === index();
                const isSelected = () => selectedOptions().includes(option.value);
                return (
                  <li
                    id={`${listboxId}-opt-${option.value}`}
                    data-index={index()}
                    role="option"
                    class={cx(
                      "sf-Option",
                      isSelected() && "sf-Option--selected",
                      active() && "sf-Option--active",
                      option.disabled && "sf-Option--disabled",
                    )}
                    aria-selected={isSelected()}
                    aria-disabled={option.disabled ? true : undefined}
                    onMouseEnter={() => {
                      if (!option.disabled) setActiveIndex(index());
                    }}
                    onClick={() => choose(option)}
                  >
                    <Show when={props.multiselect}>
                      <span class="sf-Option__check" aria-hidden="true">
                        {isSelected() ? "☑" : "☐"}
                      </span>
                    </Show>
                    <span>{option.label}</span>
                  </li>
                );
              }}
            </For>
          </ul>
        </Portal>
      </Show>
    </div>
  );
}

export type OptionGroupProps = {
  label?: JSX.Element;
  class?: string;
  children?: JSX.Element;
};

export function OptionGroup(props: OptionGroupProps) {
  return (
    <div
      class={cx("sf-OptionGroup", props.class)}
      role="group"
      aria-label={typeof props.label === "string" ? props.label : undefined}
    >
      <Show when={props.label}>
        <div class="sf-OptionGroup__label">{props.label}</div>
      </Show>
      {props.children}
    </div>
  );
}
