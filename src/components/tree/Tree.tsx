import { t } from "../../i18n";
import {
  For,
  Show,
  createContext,
  createMemo,
  createSignal,
  onMount,
  useContext,
  type JSX,
} from "solid-js";
import { createId, cx, focusElement } from "../../utils/index";

export type TreeItemValue = string | number;

export type TreeItemData = {
  value: TreeItemValue;
  content: JSX.Element;
  children?: TreeItemData[];
  disabled?: boolean;
};

export type TreeProps = {
  items?: TreeItemData[];
  openItems?: TreeItemValue[];
  defaultOpenItems?: TreeItemValue[];
  selectedItems?: TreeItemValue[];
  defaultSelectedItems?: TreeItemValue[];
  selectionMode?: "single" | "multiselect" | "none";
  appearance?: "subtle" | "subtle-alpha" | "transparent";
  size?: "small" | "medium";
  class?: string;
  onOpenChange?: (openItems: TreeItemValue[]) => void;
  onSelect?: (selectedItems: TreeItemValue[]) => void;
  children?: JSX.Element;
  "aria-label"?: string;
};

export type TreeItemContextValue = {
  value: TreeItemValue;
  /** 1-based ARIA level. */
  level: number;
  id: string;
  active: () => boolean;
  selected: () => boolean;
  expanded: () => boolean;
  disabled: () => boolean;
  hasChildren: () => boolean;
  toggleExpand: () => void;
  toggleSelect: () => void;
  setActive: () => void;
  register: (el: HTMLElement) => void;
};

/** Per-item state injected by `<Tree>` into each rendered `TreeItem`. */
export const TreeItemContext = createContext<TreeItemContextValue>();

export function TreeItemProvider(props: {
  value: TreeItemContextValue;
  children?: JSX.Element;
}) {
  return (
    <TreeItemContext.Provider value={props.value}>
      {props.children}
    </TreeItemContext.Provider>
  );
}

type TreeRow = {
  el: HTMLElement;
  value: string | undefined;
  level: number;
  disabled: boolean;
};

export function Tree(props: TreeProps) {
  const [openItems, setOpenItems] = createSignal<TreeItemValue[]>(
    props.defaultOpenItems ?? [],
  );
  const [selectedItems, setSelectedItems] = createSignal<TreeItemValue[]>(
    props.defaultSelectedItems ?? [],
  );
  const [activeValue, setActiveValue] = createSignal<TreeItemValue | undefined>(
    props.items?.find((item) => !item.disabled)?.value,
  );

  let treeEl!: HTMLDivElement;
  const elementRegistry = new Map<string, HTMLElement>();
  const treeId = createId("sf-tree");
  let itemSeed = 0;

  const open = createMemo(() => props.openItems ?? openItems());
  const selected = createMemo(() => props.selectedItems ?? selectedItems());
  const selectionMode = () => props.selectionMode ?? "single";

  const toggleOpen = (value: TreeItemValue) => {
    const current = open();
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    if (props.openItems === undefined) setOpenItems(next);
    props.onOpenChange?.(next);
  };

  const toggleSelect = (value: TreeItemValue, disabled?: boolean) => {
    if (disabled || selectionMode() === "none") return;
    let next: TreeItemValue[];
    if (selectionMode() === "multiselect") {
      next = selected().includes(value)
        ? selected().filter((item) => item !== value)
        : [...selected(), value];
    } else {
      next = [value];
    }
    if (props.selectedItems === undefined) setSelectedItems(next);
    props.onSelect?.(next);
  };

  // Read the visible rows from the DOM so navigation works identically for the
  // data-driven and declarative (children) render paths.
  const getRows = (): TreeRow[] =>
    Array.from(
      treeEl?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [],
    ).map((el) => ({
      el,
      value: el.dataset.value,
      level: Number(el.dataset.level ?? "1"),
      disabled: el.getAttribute("aria-disabled") === "true",
    }));

  const focusValue = (value: TreeItemValue) => {
    setActiveValue(value);
    focusElement(elementRegistry.get(String(value)));
  };

  const onTreeKeyDown = (event: KeyboardEvent) => {
    const rows = getRows();
    if (!rows.length) return;
    const foundIndex = rows.findIndex(
      (row) => String(row.value) === String(activeValue()),
    );
    const current = foundIndex >= 0 ? foundIndex : 0;
    const focusRow = (index: number) => {
      const target = rows[Math.min(Math.max(index, 0), rows.length - 1)]!;
      if (target.value !== undefined) focusValue(target.value as TreeItemValue);
    };
    const expandButton = (row: TreeRow) =>
      row.el.querySelector<HTMLElement>("[data-treeitem-expand]");

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusRow(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusRow(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusRow(0);
        break;
      case "End":
        event.preventDefault();
        focusRow(rows.length - 1);
        break;
      case "ArrowRight": {
        event.preventDefault();
        const row = rows[current]!;
        const expanded = row.el.getAttribute("aria-expanded") === "true";
        const button = expandButton(row);
        if (button && !button.hasAttribute("disabled") && !expanded) {
          button.click();
        } else {
          focusRow(current + 1);
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const row = rows[current]!;
        const expanded = row.el.getAttribute("aria-expanded") === "true";
        if (expanded && expandButton(row)) {
          expandButton(row)!.click();
          break;
        }
        for (let index = current - 1; index >= 0; index -= 1) {
          const candidate = rows[index]!;
          if (candidate.level < row.level) {
            focusRow(index);
            break;
          }
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const row = rows[current]!;
        const selectButton = row.el.querySelector<HTMLElement>(
          "[data-treeitem-select]",
        );
        if (selectButton && !selectButton.hasAttribute("disabled")) {
          selectButton.click();
        } else if (!selectButton && !row.disabled) {
          // Declarative `<TreeItem>` children have no injected select button;
          // fall back to clicking the row (which fires the item's onSelect).
          row.el.click();
        }
        break;
      }
      case "*": {
        event.preventDefault();
        const row = rows[current]!;
        rows.forEach((candidate) => {
          if (
            candidate.level === row.level &&
            candidate.el.parentElement === row.el.parentElement
          ) {
            const button = expandButton(candidate);
            if (
              button &&
              !button.hasAttribute("disabled") &&
              candidate.el.getAttribute("aria-expanded") !== "true"
            ) {
              button.click();
            }
          }
        });
        break;
      }
      default:
        break;
    }
  };

  onMount(() => {
    if (activeValue() !== undefined) return;
    const first = getRows().find((row) => !row.disabled);
    if (first?.value !== undefined) setActiveValue(first.value as TreeItemValue);
  });

  const renderItems = (items: TreeItemData[], level = 1): JSX.Element => (
    <For each={items}>
      {(item) => {
        const hasChildren = () => Boolean(item.children?.length);
        const isOpen = () => open().includes(item.value);
        const isSelected = () => selected().includes(item.value);
        const itemId = `${treeId}-item-${itemSeed++}`;

        const context: TreeItemContextValue = {
          value: item.value,
          level,
          id: itemId,
          active: () => activeValue() === item.value,
          selected: isSelected,
          expanded: isOpen,
          disabled: () => Boolean(item.disabled),
          hasChildren,
          toggleExpand: () => toggleOpen(item.value),
          toggleSelect: () => toggleSelect(item.value, item.disabled),
          setActive: () => setActiveValue(item.value),
          register: (el) => elementRegistry.set(String(item.value), el),
        };

        return (
          <TreeItemProvider value={context}>
            <TreeItem value={item.value}>
              <div
                class={cx(
                  "sf-TreeItem__layout",
                  isSelected() && "sf-TreeItem__layout--selected",
                  item.disabled && "sf-TreeItem__layout--disabled",
                )}
                style={{ "padding-inline-start": `${(level - 1) * 16 + 8}px` }}
              >
                <button
                  type="button"
                  class="sf-TreeItem__expand"
                  data-treeitem-expand
                  tabindex={-1}
                  aria-label={isOpen() ? t("common.collapse") : t("common.expand")}
                  aria-hidden={!hasChildren() ? true : undefined}
                  disabled={!hasChildren() || item.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveValue(item.value);
                    if (hasChildren()) toggleOpen(item.value);
                  }}
                >
                  {hasChildren() ? (isOpen() ? "▾" : "▸") : ""}
                </button>
                <button
                  type="button"
                  class="sf-TreeItem__content"
                  data-treeitem-select
                  tabindex={-1}
                  disabled={item.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveValue(item.value);
                    toggleSelect(item.value, item.disabled);
                  }}
                >
                  {item.content}
                </button>
              </div>
              <Show when={hasChildren() && isOpen()}>
                <div role="group">{renderItems(item.children ?? [], level + 1)}</div>
              </Show>
            </TreeItem>
          </TreeItemProvider>
        );
      }}
    </For>
  );

  return (
    <div
      ref={treeEl}
      class={cx(
        "sf-Tree",
        `sf-Tree--${props.appearance ?? "subtle"}`,
        `sf-Tree--${props.size ?? "medium"}`,
        props.class,
      )}
      role="tree"
      aria-label={props["aria-label"]}
      aria-multiselectable={selectionMode() === "multiselect" ? true : undefined}
      onKeyDown={onTreeKeyDown}
    >
      <Show when={props.items} fallback={props.children}>
        {renderItems(props.items ?? [])}
      </Show>
    </div>
  );
}

export type TreeItemProps = {
  value: TreeItemValue;
  class?: string;
  children?: JSX.Element;
  /** 1-based ARIA level. Read from `TreeItemContext` when rendered inside `<Tree>`. */
  level?: number;
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  onToggle?: () => void;
};

/**
 * Interactive tree row. Inside `<Tree>` it reads per-item state from
 * `TreeItemContext` (role, aria-level, selection, expansion and roving focus).
 * Outside a tree it degrades to a plain, standalone row.
 */
export function TreeItem(props: TreeItemProps) {
  const ctx = useContext(TreeItemContext);
  const level = () => props.level ?? ctx?.level ?? 1;
  const selected = () => props.selected ?? ctx?.selected() ?? false;
  const expanded = () => props.expanded ?? ctx?.expanded() ?? false;
  const disabled = () => props.disabled ?? ctx?.disabled() ?? false;
  const active = () => Boolean(ctx?.active());
  const hasChildren = () => Boolean(ctx?.hasChildren());

  return (
    <div
      ref={(el) => ctx?.register(el)}
      class={cx("sf-TreeItem", props.class)}
      role="treeitem"
      id={ctx?.id ?? `sf-treeitem-${String(props.value)}`}
      data-value={String(props.value)}
      data-level={level()}
      aria-level={level()}
      aria-selected={selected()}
      aria-expanded={hasChildren() ? expanded() : undefined}
      aria-disabled={disabled() ? true : undefined}
      tabindex={ctx ? (active() ? 0 : -1) : undefined}
      onClick={() => {
        ctx?.setActive();
        if (!ctx) props.onSelect?.();
      }}
    >
      {props.children}
    </div>
  );
}

export function TreeItemLayout(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TreeItem__layout", props.class)}>{props.children}</div>;
}

export function TreeItemPersonaLayout(props: {
  media?: JSX.Element;
  description?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}) {
  return (
    <div class={cx("sf-TreeItemPersonaLayout", props.class)}>
      <Show when={props.media}>
        <span class="sf-TreeItemPersonaLayout__media">{props.media}</span>
      </Show>
      <span class="sf-TreeItemPersonaLayout__main">
        <span class="sf-TreeItemPersonaLayout__content">{props.children}</span>
        <Show when={props.description}>
          <span class="sf-TreeItemPersonaLayout__description">{props.description}</span>
        </Show>
      </span>
    </div>
  );
}

export function TreeRootReset(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TreeRootReset", props.class)}>{props.children}</div>;
}
