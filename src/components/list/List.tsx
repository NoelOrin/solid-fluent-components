import {
  For,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext,
  type JSX,
} from "solid-js";
import { cx, focusElement, moveActiveIndex } from "../../utils/index";

export type ListItemData = {
  value: string | number;
  content: JSX.Element;
  disabled?: boolean;
};

export type ListProps = {
  navigationMode?: "items" | "composite";
  selectionMode?: "single" | "multiselect" | "none";
  selectedItems?: Array<string | number>;
  defaultSelectedItems?: Array<string | number>;
  onSelectionChange?: (selected: Array<string | number>) => void;
  class?: string;
  children?: JSX.Element;
  items?: ListItemData[];
  "aria-label"?: string;
};

export type ListItemContextValue = {
  selectionMode: () => "single" | "multiselect" | "none";
  navigationMode: () => "items" | "composite";
  isSelected: (value: string | number) => boolean;
  isActive: (value: string | number) => boolean;
  setActive: (value?: string | number, disabled?: boolean) => void;
  toggle: (value?: string | number, disabled?: boolean) => void;
  register: (value: string | number, disabled: boolean, el: HTMLElement) => void;
  unregister: (value: string | number, el: HTMLElement) => void;
};

/** Injected by `<List>` so declarative `<ListItem>` children gain state. */
export const ListContext = createContext<ListItemContextValue>();

type RegisteredItem = {
  value: string | number;
  disabled: boolean;
  el: HTMLElement;
};

export function List(props: ListProps) {
  const [uncontrolled, setUncontrolled] = createSignal<Array<string | number>>(
    props.defaultSelectedItems ?? [],
  );
  const [activeValue, setActiveValue] = createSignal<string | number | undefined>(
    props.defaultSelectedItems?.[0] ??
      props.items?.find((item) => !item.disabled)?.value,
  );
  const [registered, setRegistered] = createSignal<RegisteredItem[]>([]);

  let listEl!: HTMLUListElement;

  const selectedItems = createMemo(() => props.selectedItems ?? uncontrolled());
  const dataItems = createMemo(() => props.items ?? []);
  const selectionMode = () => props.selectionMode ?? "none";
  const navigationMode = () => props.navigationMode ?? "items";

  const sameValue = (a: string | number, b: string | number) =>
    String(a) === String(b);
  const isSelected = (value: string | number) =>
    selectedItems().some((item) => sameValue(item, value));
  const isActive = (value: string | number) =>
    activeValue() !== undefined && sameValue(activeValue()!, value);

  const resolveValue = (raw: string | undefined): string | number | undefined => {
    if (raw === undefined) return undefined;
    const fromData = dataItems().find((item) => String(item.value) === raw)?.value;
    if (fromData !== undefined) return fromData;
    const fromRegistered = registered().find((item) => String(item.value) === raw)?.value;
    return fromRegistered ?? raw;
  };

  const setSelected = (next: Array<string | number>) => {
    if (props.selectedItems === undefined) setUncontrolled(next);
    props.onSelectionChange?.(next);
  };

  const toggleValue = (value?: string | number, disabled?: boolean) => {
    if (value === undefined || disabled || selectionMode() === "none") return;
    const current = selectedItems();
    const alreadySelected = current.some((item) => sameValue(item, value));
    if (selectionMode() === "single") {
      setSelected(alreadySelected ? [] : [value]);
      return;
    }
    setSelected(
      alreadySelected
        ? current.filter((item) => !sameValue(item, value))
        : [...current, value],
    );
  };

  const getRows = (): Array<{
    el: HTMLElement;
    value: string | undefined;
    disabled: boolean;
  }> =>
    Array.from(listEl?.querySelectorAll<HTMLElement>("li.sf-ListItem") ?? []).map(
      (el) => ({
        el,
        value: el.dataset.value,
        disabled: el.getAttribute("aria-disabled") === "true",
      }),
    );

  const setActive = (value?: string | number, disabled?: boolean) => {
    if (value === undefined || disabled) return;
    setActiveValue(value);
    if (navigationMode() === "composite") {
      const row = getRows().find((item) => String(item.value) === String(value));
      focusElement(row?.el);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const rows = getRows();
    if (!rows.length) return;
    const foundIndex = rows.findIndex(
      (row) => String(row.value) === String(activeValue()),
    );
    const current = foundIndex >= 0 ? foundIndex : 0;
    const disabledAt = (index: number) => Boolean(rows[index]?.disabled);
    const focusIndex = (index: number) => {
      const row = rows[Math.min(Math.max(index, 0), rows.length - 1)];
      if (row) setActive(resolveValue(row.value), row.disabled);
    };

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusIndex(
          moveActiveIndex(current, 1, rows.length, {
            disabled: disabledAt,
            loop: false,
          }),
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        focusIndex(
          moveActiveIndex(current, -1, rows.length, {
            disabled: disabledAt,
            loop: false,
          }),
        );
        break;
      case "Home":
        event.preventDefault();
        focusIndex(
          moveActiveIndex(-1, 1, rows.length, {
            disabled: disabledAt,
            loop: false,
          }),
        );
        break;
      case "End":
        event.preventDefault();
        focusIndex(
          moveActiveIndex(rows.length, -1, rows.length, {
            disabled: disabledAt,
            loop: false,
          }),
        );
        break;
      case " ":
      case "Enter": {
        event.preventDefault();
        const row = rows[current];
        if (row) toggleValue(resolveValue(row.value), row.disabled);
        break;
      }
      default:
        break;
    }
  };

  const context: ListItemContextValue = {
    selectionMode,
    navigationMode,
    isSelected,
    isActive,
    setActive,
    toggle: toggleValue,
    register: (value, disabled, el) =>
      setRegistered((current) => [
        ...current.filter((item) => item.el !== el),
        { value, disabled, el },
      ]),
    unregister: (_value, el) =>
      setRegistered((current) => current.filter((item) => item.el !== el)),
  };

  createEffect(() => {
    const list = dataItems();
    if (!list.length || activeValue() !== undefined) return;
    const firstEnabled = list.find((item) => !item.disabled);
    if (firstEnabled) setActiveValue(firstEnabled.value);
  });

  onMount(() => {
    if (activeValue() !== undefined) return;
    const first = getRows().find((row) => !row.disabled);
    if (first?.value !== undefined) setActiveValue(resolveValue(first.value));
  });

  const activeId = createMemo(() => {
    const value = activeValue();
    return value === undefined ? undefined : `sf-list-option-${String(value)}`;
  });

  return (
    <ListContext.Provider value={context}>
      <ul
        ref={listEl}
        class={cx("sf-List", "sf-focus-ring", props.class)}
        role={selectionMode() === "none" ? "list" : "listbox"}
        tabindex={0}
        aria-label={props["aria-label"]}
        aria-activedescendant={
          navigationMode() === "items" ? activeId() : undefined
        }
        aria-multiselectable={
          selectionMode() === "multiselect" ? true : undefined
        }
        data-navigation={navigationMode()}
        data-selection={selectionMode()}
        onKeyDown={onKeyDown}
      >
        <Show when={props.items} fallback={props.children}>
          <For each={dataItems()}>
            {(item) => (
              <ListItem
                id={`sf-list-option-${String(item.value)}`}
                value={item.value}
                disabled={item.disabled}
                checkmark={
                  selectionMode() === "multiselect" ? (
                    <span aria-hidden="true">{isSelected(item.value) ? "☑" : "☐"}</span>
                  ) : undefined
                }
              >
                {item.content}
              </ListItem>
            )}
          </For>
        </Show>
      </ul>
    </ListContext.Provider>
  );
}

export type ListItemProps = {
  id?: string;
  value?: string | number;
  disabled?: boolean;
  selected?: boolean;
  active?: boolean;
  class?: string;
  children?: JSX.Element;
  onClick?: () => void;
  onMouseEnter?: () => void;
  checkmark?: JSX.Element;
};

export function ListItem(props: ListItemProps) {
  const ctx = useContext(ListContext);
  let el!: HTMLLIElement;

  const value = () => props.value;
  const disabled = () => Boolean(props.disabled);
  const selected = () =>
    props.selected ??
    (ctx && value() !== undefined ? ctx.isSelected(value()!) : false);
  const active = () =>
    props.active ??
    (ctx && value() !== undefined ? ctx.isActive(value()!) : false);
  const id = () =>
    props.id ??
    (ctx && value() !== undefined
      ? `sf-list-option-${String(value())}`
      : undefined);
  const role = () =>
    ctx ? (ctx.selectionMode() === "none" ? undefined : "option") : "option";
  const composite = () => Boolean(ctx && ctx.navigationMode() === "composite");

  onMount(() => {
    if (ctx && value() !== undefined) ctx.register(value()!, disabled(), el);
  });
  onCleanup(() => {
    if (ctx && value() !== undefined) ctx.unregister(value()!, el);
  });

  return (
    <li
      ref={el}
      id={id()}
      class={cx(
        "sf-ListItem",
        selected() && "sf-ListItem--selected",
        active() && "sf-ListItem--active",
        disabled() && "sf-ListItem--disabled",
        composite() && "sf-focus-ring",
        props.class,
      )}
      role={role()}
      aria-selected={
        ctx && ctx.selectionMode() === "none" ? undefined : selected()
      }
      aria-disabled={disabled() ? true : undefined}
      data-value={value() !== undefined ? String(value()) : undefined}
      tabindex={composite() ? (active() ? 0 : -1) : undefined}
      onMouseEnter={() => {
        props.onMouseEnter?.();
        if (ctx && value() !== undefined) ctx.setActive(value(), disabled());
      }}
      onClick={() => {
        if (disabled()) return;
        if (ctx && value() !== undefined) {
          ctx.setActive(value());
          ctx.toggle(value());
        }
        props.onClick?.();
      }}
    >
      {props.checkmark}
      <span class="sf-ListItem__content">{props.children}</span>
    </li>
  );
}
