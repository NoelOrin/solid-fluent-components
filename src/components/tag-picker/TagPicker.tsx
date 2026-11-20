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
import { Tag } from "../tag/Tag";
import { useControllableOpen } from "../utilities/overlay/Overlay";

export type TagPickerOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TagPickerProps = {
  options?: TagPickerOption[];
  selectedOptions?: string[];
  defaultSelectedOptions?: string[];
  placeholder?: string;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  class?: string;
  onOpenChange?: (open: boolean) => void;
  onOptionSelect?: (selectedOptions: string[]) => void;
};

export function TagPicker(props: TagPickerProps) {
  const [open, setOpen] = useControllableOpen(
    () => props.open,
    props.defaultOpen ?? false,
    props.onOpenChange,
  );
  const [query, setQuery] = createSignal("");
  const [selected, setSelected] = createSignal<string[]>(
    props.defaultSelectedOptions ?? [],
  );
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const listboxId = createId("tagpicker-listbox");
  let rootEl!: HTMLDivElement;
  let inputEl!: HTMLInputElement;
  let listEl!: HTMLUListElement;
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });

  const selectedOptions = createMemo(() => props.selectedOptions ?? selected());
  const options = createMemo(() => props.options ?? []);
  const filtered = createMemo(() => {
    const q = query().trim().toLowerCase();
    return options().filter((option) => {
      if (selectedOptions().includes(option.value)) return false;
      if (!q) return true;
      return option.label.toLowerCase().includes(q);
    });
  });
  const activeOption = createMemo(() => filtered()[activeIndex()]);

  const labelOf = (value: string) =>
    options().find((option) => option.value === value)?.label ?? value;

  const commit = (next: string[]) => {
    if (props.selectedOptions === undefined) setSelected(next);
    props.onOptionSelect?.(next);
  };

  const add = (value: string) => {
    if (selectedOptions().includes(value)) return;
    commit([...selectedOptions(), value]);
    setQuery("");
    inputEl?.focus();
  };

  const remove = (value: string, event?: MouseEvent) => {
    event?.stopPropagation();
    commit(selectedOptions().filter((item) => item !== value));
  };

  createEffect(() => {
    if (!open()) {
      setActiveIndex(-1);
      return;
    }
    const firstEnabled = filtered().findIndex((option) => !option.disabled);
    setActiveIndex(firstEnabled);
  });

  createEffect(() => {
    const count = filtered().length;
    setActiveIndex((index) => (count === 0 ? -1 : Math.min(index, count - 1)));
  });

  createEffect(() => {
    if (!open()) return;
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
      if (listEl?.contains(target) || rootEl.contains(target)) return;
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
    const item = listEl.querySelector<HTMLElement>(`[data-index="${activeIndex()}"]`);
    scrollIntoViewIfNeeded(listEl, item ?? undefined);
  });

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
        add(option.value);
      }
      return;
    }
    if (event.key === "Escape") {
      if (open()) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
    if (event.key === "Backspace" && !query() && selectedOptions().length > 0) {
      remove(selectedOptions()[selectedOptions().length - 1]!);
      return;
    }
    if (event.key === "Tab") setOpen(false);
  };

  const onFocusOut = () => {
    queueMicrotask(() => {
      const active = document.activeElement;
      if (!active || active === document.body) return;
      if (!rootEl.contains(active) && !listEl?.contains(active)) setOpen(false);
    });
  };

  return (
    <div class={cx("sf-TagPicker", props.class)} ref={rootEl} onFocusOut={onFocusOut}>
      <div
        class={cx("sf-TagPicker__control", props.disabled && "sf-TagPicker__control--disabled")}
        onClick={() => !props.disabled && setOpen(true)}
      >
        <For each={selectedOptions()}>
          {(value) => (
            <Tag dismissible={!props.disabled} onDismiss={(event) => remove(value, event)}>
              {labelOf(value)}
            </Tag>
          )}
        </For>
        <input
          ref={inputEl}
          class="sf-TagPicker__input"
          role="combobox"
          aria-expanded={open()}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-multiselectable={true}
          aria-activedescendant={
            open() && activeOption()
              ? `${listboxId}-opt-${activeOption()!.value}`
              : undefined
          }
          disabled={props.disabled}
          placeholder={selectedOptions().length ? "" : props.placeholder ?? "选择标签"}
          value={query()}
          onKeyDown={onKeyDown}
          onInput={(event) => {
            setQuery(event.currentTarget.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      <Show when={open()}>
        <Portal>
          <ul
            ref={listEl}
            id={listboxId}
            class="sf-Listbox"
            role="listbox"
            aria-multiselectable={true}
            style={{
              position: "absolute",
              left: `${coords().x}px`,
              top: `${coords().y}px`,
              "min-width": `${rootEl?.offsetWidth ?? 220}px`,
            }}
          >
            <For
              each={filtered()}
              fallback={<li class="sf-Option sf-Option--empty">没有更多选项</li>}
            >
              {(option, index) => (
                <li
                  id={`${listboxId}-opt-${option.value}`}
                  data-index={index()}
                  class={cx(
                    "sf-Option",
                    selectedOptions().includes(option.value) && "sf-Option--selected",
                    activeIndex() === index() && "sf-Option--active",
                    option.disabled && "sf-Option--disabled",
                  )}
                  role="option"
                  aria-selected={selectedOptions().includes(option.value)}
                  aria-disabled={option.disabled ? true : undefined}
                  onMouseEnter={() => {
                    if (!option.disabled) setActiveIndex(index());
                  }}
                  onClick={() => !option.disabled && add(option.value)}
                >
                  {option.label}
                </li>
              )}
            </For>
          </ul>
        </Portal>
      </Show>
    </div>
  );
}

export type TagPickerControlProps = {
  class?: string;
  children?: JSX.Element;
};
export function TagPickerControl(props: TagPickerControlProps) {
  return <div class={cx("sf-TagPicker__control", props.class)}>{props.children}</div>;
}

export function TagPickerButton(props: { class?: string; onClick?: () => void; children?: JSX.Element }) {
  return (
    <button type="button" class={cx("sf-TagPicker__button", props.class)} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export function TagPickerGroup(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TagPicker__group", props.class)}>{props.children}</div>;
}

export function TagPickerInput(props: {
  class?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onInput?: (value: string) => void;
  onFocus?: () => void;
}) {
  return (
    <input
      class={cx("sf-TagPicker__input", props.class)}
      disabled={props.disabled}
      placeholder={props.placeholder}
      value={props.value ?? ""}
      onInput={(event) => props.onInput?.(event.currentTarget.value)}
      onFocus={props.onFocus}
    />
  );
}

export function TagPickerList(props: { class?: string; children?: JSX.Element }) {
  return (
    <ul class={cx("sf-Listbox", props.class)} role="listbox">
      {props.children}
    </ul>
  );
}

export function TagPickerOption(props: {
  value: string;
  label: string;
  disabled?: boolean;
  class?: string;
  selected?: boolean;
  active?: boolean;
  "aria-label"?: string;
  onClick?: (value: string) => void;
}) {
  return (
    <li
      class={cx(
        "sf-Option",
        props.selected && "sf-Option--selected",
        props.active && "sf-Option--active",
        props.disabled && "sf-Option--disabled",
        props.class,
      )}
      role="option"
      aria-label={props["aria-label"] ?? props.label}
      aria-selected={props.selected ? true : undefined}
      aria-disabled={props.disabled ? true : undefined}
      onClick={() => !props.disabled && props.onClick?.(props.value)}
    >
      {props.label}
    </li>
  );
}

export function TagPickerOptionGroup(props: { class?: string; children?: JSX.Element; label?: string }) {
  return (
    <li role="group" aria-label={props.label} class={props.class}>
      {props.children}
    </li>
  );
}
