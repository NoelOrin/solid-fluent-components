import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
} from "solid-js";
import { createId, cx, focusElement, moveActiveIndex } from "../../utils/index";
import { Virtualizer } from "../utilities/virtualizer/Virtualizer";
import {
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableSelectionCell,
  type TableSelectionCellProps,
} from "../table/Table";

export type DataGridColumnDef<T> = {
  columnId: string;
  label: JSX.Element;
  width?: string | number;
  compare?: (a: T, b: T) => number;
  renderCell?: (item: T) => JSX.Element;
  renderHeaderCell?: () => JSX.Element;
};

export type DataGridSortDirection = "asc" | "desc";
export type DataGridSortChange = {
  columnId: string;
  direction: DataGridSortDirection | null;
};

type ActiveSort = { columnId: string; direction: DataGridSortDirection };

export type DataGridProps<T extends object> = {
  items: T[];
  columns: Array<DataGridColumnDef<T>>;
  getRowId?: (item: T, index: number) => string | number;
  sortable?: boolean;
  /** Controlled sorted column. When set, sorting is fully controlled. */
  sortColumn?: string;
  /** Controlled sort direction. */
  sortDirection?: DataGridSortDirection;
  defaultSortColumn?: string;
  defaultSortDirection?: DataGridSortDirection;
  /** Fired after an asc → desc → none cycle. */
  onSortChange?: (change: DataGridSortChange) => void;
  selectionMode?: "none" | "single" | "multiselect";
  selectedItems?: Array<string | number>;
  defaultSelectedItems?: Array<string | number>;
  onSelectionChange?: (selected: Array<string | number>) => void;
  class?: string;
  size?: "small" | "medium" | "extra-small";
  resizableColumns?: boolean;
  virtualized?: boolean;
  rowHeight?: number;
  height?: number;
  "aria-label"?: string;
};

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const [internalSort, setInternalSort] = createSignal<ActiveSort | null>(
    props.defaultSortColumn
      ? {
          columnId: props.defaultSortColumn,
          direction: props.defaultSortDirection ?? "asc",
        }
      : null,
  );
  const [selected, setSelected] = createSignal<Array<string | number>>(
    props.defaultSelectedItems ?? [],
  );
  const [activeRow, setActiveRow] = createSignal(0);
  const [columnWidths, setColumnWidths] = createSignal<Record<string, number>>({});
  let bodyEl: HTMLElement | undefined;
  let gridEl!: HTMLDivElement;

  const gridId = createId("sf-datagrid");
  const rowId = (index: number) => `${gridId}-row-${index}`;

  const sort = createMemo<ActiveSort | null>(() => {
    if (props.sortColumn !== undefined) {
      return props.sortDirection
        ? { columnId: props.sortColumn, direction: props.sortDirection }
        : null;
    }
    return internalSort();
  });
  const selectedItems = createMemo(() => props.selectedItems ?? selected());
  const getId = (item: T, index: number) => props.getRowId?.(item, index) ?? index;

  const sortedItems = createMemo(() => {
    const current = sort();
    if (!current || !props.sortable) return props.items;
    const column = props.columns.find((col) => col.columnId === current.columnId);
    if (!column?.compare) return props.items;
    const copy = [...props.items];
    copy.sort((a, b) => {
      const result = column.compare!(a, b);
      return current.direction === "asc" ? result : -result;
    });
    return copy;
  });

  createEffect(() => {
    const index = activeRow();
    const count = sortedItems().length;
    if (count === 0) return;
    if (index > count - 1) {
      setActiveRow(count - 1);
      return;
    }
    if (props.virtualized && bodyEl) {
      const rowHeight = props.rowHeight ?? 40;
      const top = index * rowHeight;
      const bottom = top + rowHeight;
      const viewTop = bodyEl.scrollTop;
      const viewBottom = viewTop + bodyEl.clientHeight;
      if (top < viewTop) bodyEl.scrollTop = top;
      else if (bottom > viewBottom) bodyEl.scrollTop = bottom - bodyEl.clientHeight;
      return;
    }
    const row = bodyEl?.querySelector<HTMLElement>(`[data-row-index="${index}"]`);
    row?.scrollIntoView({ block: "nearest" });
  });

  const setSortState = (next: ActiveSort | null, clearedColumnId?: string) => {
    if (props.sortColumn === undefined) setInternalSort(next);
    props.onSortChange?.({
      columnId: next?.columnId ?? clearedColumnId ?? "",
      direction: next?.direction ?? null,
    });
  };

  // asc → desc → none → asc
  const toggleSort = (columnId: string) => {
    if (!props.sortable) return;
    const current = sort();
    if (!current || current.columnId !== columnId) {
      setSortState({ columnId, direction: "asc" });
      return;
    }
    if (current.direction === "asc") {
      setSortState({ columnId, direction: "desc" });
      return;
    }
    setSortState(null, columnId);
  };

  const toggleSelect = (id: string | number) => {
    if (props.selectionMode === "none" || !props.selectionMode) return;
    let next: Array<string | number>;
    if (props.selectionMode === "single") {
      next = selectedItems().includes(id) ? [] : [id];
    } else {
      next = selectedItems().includes(id)
        ? selectedItems().filter((item) => item !== id)
        : [...selectedItems(), id];
    }
    if (props.selectedItems === undefined) setSelected(next);
    props.onSelectionChange?.(next);
  };

  const onGridKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | undefined;
    if (target?.closest("input, button, [role='separator']")) return;
    const count = sortedItems().length;
    if (!count) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveRow((current) =>
        moveActiveIndex(current, event.key === "ArrowDown" ? 1 : -1, count, {
          loop: false,
        }),
      );
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveRow(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveRow(count - 1);
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      const item = sortedItems()[activeRow()];
      if (!item) return;
      event.preventDefault();
      toggleSelect(getId(item, activeRow()));
    }
  };

  const selectionEnabled = () =>
    Boolean(props.selectionMode && props.selectionMode !== "none");

  const cellStyle = (column: DataGridColumnDef<T>): JSX.CSSProperties => {
    const width = columnWidths()[column.columnId] ?? column.width;
    const hasFixedWidth =
      columnWidths()[column.columnId] !== undefined || column.width !== undefined;
    return {
      width: typeof width === "number" ? `${width}px` : width,
      flex: hasFixedWidth ? "0 0 auto" : "1 1 0",
    };
  };

  const beginResize = (
    event: PointerEvent,
    column: DataGridColumnDef<T>,
    cell: HTMLElement,
  ) => {
    if (!props.resizableColumns) return;
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const measured = cell.getBoundingClientRect().width;
    const startWidth =
      columnWidths()[column.columnId] ??
      (measured ||
        (typeof column.width === "number" ? column.width : 100));
    const onMove = (moveEvent: PointerEvent) => {
      const next = Math.max(
        40,
        Math.round(startWidth + moveEvent.clientX - startX),
      );
      setColumnWidths((widths) => ({ ...widths, [column.columnId]: next }));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const resizeWithKeyboard = (
    event: KeyboardEvent,
    column: DataGridColumnDef<T>,
    cell: HTMLElement,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    const measured = cell.getBoundingClientRect().width;
    const current = columnWidths()[column.columnId] ?? (measured || 100);
    const delta = event.key === "ArrowRight" ? 10 : -10;
    setColumnWidths((widths) => ({
      ...widths,
      [column.columnId]: Math.max(40, Math.round(current + delta)),
    }));
  };

  const renderCellContent = (column: DataGridColumnDef<T>, item: T) => {
    if (column.renderCell) return column.renderCell(item);
    if (Object.prototype.hasOwnProperty.call(item, column.columnId)) {
      const value = (item as Record<string, unknown>)[column.columnId];
      return value == null ? "" : String(value);
    }
    return "";
  };

  const header = (
    <div class="sf-DataGrid__headerRow" role="row" aria-rowindex={1}>
      <Show when={selectionEnabled()}>
        <div class="sf-DataGrid__selectionCell" role="columnheader" />
      </Show>
      <For each={props.columns}>
        {(column) => {
          let headerCell!: HTMLDivElement;
          const active = () => sort()?.columnId === column.columnId;
          return (
            <div
              ref={headerCell}
              class="sf-DataGrid__cell sf-DataGrid__headerCell"
              role="columnheader"
              aria-sort={
                active()
                  ? sort()?.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              style={cellStyle(column)}
            >
              <button
                type="button"
                class="sf-DataGrid__headerButton sf-focus-ring"
                disabled={!props.sortable || !column.compare}
                onClick={() => toggleSort(column.columnId)}
              >
                {column.renderHeaderCell?.() ?? column.label}
                <Show when={active()}>
                  <span aria-hidden="true">
                    {sort()?.direction === "asc" ? " ↑" : " ↓"}
                  </span>
                </Show>
              </button>
              <Show when={props.resizableColumns}>
                <div
                  class="sf-DataGrid__resizeHandle"
                  role="separator"
                  aria-orientation="vertical"
                  aria-label={`Resize ${column.columnId} column`}
                  tabindex={0}
                  onPointerDown={(event) =>
                    beginResize(event, column, headerCell)
                  }
                  onKeyDown={(event) => resizeWithKeyboard(event, column, headerCell)}
                  onClick={(event) => event.stopPropagation()}
                />
              </Show>
            </div>
          );
        }}
      </For>
    </div>
  );

  const renderRow = (item: T, index: number) => {
    const id = getId(item, index);
    // Reactive accessors — a `<For>` row is created once, so plain constants
    // would never reflect later selection / focus changes.
    const isSelected = createMemo(() =>
      selectedItems().some((value) => String(value) === String(id)),
    );
    const isActive = createMemo(() => activeRow() === index);
    return (
      <div
        class="sf-DataGrid__row"
        classList={{
          "sf-DataGrid__row--selected": isSelected(),
          "sf-DataGrid__row--active": isActive(),
        }}
        role="row"
        id={rowId(index)}
        data-row-index={index}
        aria-rowindex={index + 2}
        aria-selected={selectionEnabled() ? isSelected() : undefined}
        onClick={(event) => {
          setActiveRow(index);
          const target = event.target as HTMLElement | undefined;
          if (!target?.closest("input, button, [role='separator']")) {
            focusElement(gridEl);
          }
        }}
      >
        <Show when={selectionEnabled()}>
          <div class="sf-DataGrid__selectionCell" role="gridcell">
            <input
              type={props.selectionMode === "single" ? "radio" : "checkbox"}
              checked={isSelected()}
              aria-label="Select row"
              onChange={() => toggleSelect(id)}
            />
          </div>
        </Show>
        <For each={props.columns}>
          {(column) => (
            <div
              class="sf-DataGrid__cell"
              role="gridcell"
              style={cellStyle(column)}
            >
              {renderCellContent(column, item)}
            </div>
          )}
        </For>
      </div>
    );
  };

  return (
    <div
      ref={gridEl}
      class={cx(
        "sf-DataGrid",
        props.virtualized && "sf-DataGrid--virtual",
        props.class,
      )}
      role="grid"
      aria-label={props["aria-label"] ?? "Data grid"}
      aria-rowcount={sortedItems().length + 1}
      aria-activedescendant={
        sortedItems().length ? rowId(activeRow()) : undefined
      }
      aria-multiselectable={
        props.selectionMode === "multiselect" ? true : undefined
      }
      data-size={props.size ?? "medium"}
      tabindex={0}
      onKeyDown={onGridKeyDown}
    >
      {header}
      <Show
        when={props.virtualized}
        fallback={
          <div
            class="sf-DataGrid__body"
            role="rowgroup"
            ref={(el) => {
              bodyEl = el;
            }}
          >
            <For each={sortedItems()}>
              {(item, index) => renderRow(item, index())}
            </For>
          </div>
        }
      >
        <Virtualizer
          class="sf-DataGrid__virtualBody"
          items={sortedItems()}
          itemSize={props.rowHeight ?? 40}
          height={props.height ?? 320}
          scrollRef={(el) => {
            bodyEl = el;
          }}
        >
          {(item, index) => renderRow(item, index)}
        </Virtualizer>
      </Show>
    </div>
  );
}

/** @deprecated Prefer DataGrid virtualized prop */
export function VirtualDataGrid<T extends object>(
  props: Omit<DataGridProps<T>, "virtualized">,
) {
  return <DataGrid {...props} virtualized />;
}
export function DataGridHeader(props: { class?: string; children?: JSX.Element }) {
  return <TableHeader class={cx("sf-DataGridHeader", props.class)}>{props.children}</TableHeader>;
}

export function DataGridHeaderCell(props: { class?: string; children?: JSX.Element }) {
  return (
    <TableHeaderCell class={cx("sf-DataGridHeaderCell", props.class)}>{props.children}</TableHeaderCell>
  );
}

export function DataGridBody(props: { class?: string; children?: JSX.Element }) {
  return <TableBody class={cx("sf-DataGridBody", props.class)}>{props.children}</TableBody>;
}

export function DataGridRow(props: { class?: string; children?: JSX.Element; selected?: boolean }) {
  return (
    <TableRow class={cx("sf-DataGridRow", props.selected && "sf-DataGridRow--selected", props.class)}>
      {props.children}
    </TableRow>
  );
}

export function DataGridCell(props: { class?: string; children?: JSX.Element }) {
  return <TableCell class={cx("sf-DataGridCell", props.class)}>{props.children}</TableCell>;
}

export function DataGridSelectionCell(props: TableSelectionCellProps) {
  return (
    <TableSelectionCell class={cx("sf-DataGridSelectionCell", props.class)} checked={props.checked} type={props.type} onChange={props.onChange} />
  );
}
