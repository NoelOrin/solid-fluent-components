import { Show, createContext, useContext, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type TableSortDirection = "asc" | "desc";
export type TableSortChange = {
  columnId: string;
  direction: TableSortDirection | null;
};

export type TableSortContextValue = {
  sortable: () => boolean;
  sortColumn: () => string | undefined;
  sortDirection: () => TableSortDirection | undefined;
  onSortChange?: (columnId: string, direction: TableSortDirection | null) => void;
};

/** Provided by `<Table>` so `<TableHeaderCell sortable>` can participate in sorting. */
export const TableSortContext = createContext<TableSortContextValue>();

export type TableProps = {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  sortable?: boolean;
  size?: "small" | "extra-small" | "medium";
  /** Controlled sorted column id. */
  sortColumn?: string;
  /** Controlled sort direction. */
  sortDirection?: TableSortDirection;
  /** Fired when a sortable header cell requests a new sort state. */
  onSortChange?: (change: TableSortChange) => void;
};

export function Table(props: TableProps) {
  const context: TableSortContextValue = {
    sortable: () => Boolean(props.sortable),
    sortColumn: () => props.sortColumn,
    sortDirection: () => props.sortDirection,
    onSortChange: (columnId, direction) =>
      props.onSortChange?.({ columnId, direction }),
  };
  return (
    <TableSortContext.Provider value={context}>
      <table
        class={cx("sf-Table", props.class)}
        style={props.style}
        data-size={props.size ?? "medium"}
      >
        {props.children}
      </table>
    </TableSortContext.Provider>
  );
}

export function TableHeader(props: { class?: string; children?: JSX.Element }) {
  return <thead class={props.class}>{props.children}</thead>;
}
export function TableBody(props: { class?: string; children?: JSX.Element }) {
  return <tbody class={props.class}>{props.children}</tbody>;
}
export function TableRow(props: { class?: string; children?: JSX.Element }) {
  return <tr class={props.class}>{props.children}</tr>;
}

export type TableHeaderCellProps = {
  class?: string;
  children?: JSX.Element;
  sortable?: boolean;
  /** Id reported to `onSortChange`. Falls back to the cell's text content. */
  columnId?: string;
  /** Current direction; omit to read `<Table>`'s controlled state. */
  sortDirection?: TableSortDirection | "none";
  /** Called with the next three-state direction (asc → desc → null). */
  onSort?: (direction: TableSortDirection | null) => void;
};

export function TableHeaderCell(props: TableHeaderCellProps) {
  const ctx = useContext(TableSortContext);
  const sortable = () => props.sortable ?? ctx?.sortable() ?? false;
  const columnId = () =>
    props.columnId ?? (typeof props.children === "string" ? props.children : "");
  const direction = (): TableSortDirection | undefined => {
    if (props.sortDirection && props.sortDirection !== "none") return props.sortDirection;
    if (ctx?.sortColumn() && ctx.sortColumn() === columnId()) return ctx.sortDirection();
    return undefined;
  };
  const ariaSort = () =>
    direction() === "asc"
      ? "ascending"
      : direction() === "desc"
        ? "descending"
        : "none";

  const handleSort = () => {
    if (!sortable()) return;
    const next: TableSortDirection | null =
      direction() === "asc" ? "desc" : direction() === "desc" ? null : "asc";
    props.onSort?.(next);
    ctx?.onSortChange?.(columnId(), next);
  };

  return (
    <th
      class={cx("sf-TableHeaderCell", props.class)}
      aria-sort={sortable() ? ariaSort() : undefined}
    >
      <Show when={sortable()} fallback={props.children}>
        <button type="button" class="sf-Table__sortButton" onClick={handleSort}>
          <span>{props.children}</span>
          <span aria-hidden="true" class="sf-Table__sortIcon">
            {direction() === "asc" ? " ▲" : direction() === "desc" ? " ▼" : " ↕"}
          </span>
        </button>
      </Show>
    </th>
  );
}

export function TableCell(props: { class?: string; children?: JSX.Element }) {
  return <td class={props.class}>{props.children}</td>;
}
export type TableSelectionCellProps = {
  class?: string;
  checked?: boolean;
  type?: "checkbox" | "radio";
  onChange?: (checked: boolean) => void;
};

export function TableSelectionCell(props: TableSelectionCellProps) {
  return (
    <td class={props.class}>
      <input
        type={props.type ?? "checkbox"}
        checked={props.checked}
        onChange={(event) => props.onChange?.(event.currentTarget.checked)}
      />
    </td>
  );
}

export type TableCellActionsProps = {
  class?: string;
  children?: JSX.Element;
  /** Whether the actions are visible. When false the actions are hidden until row hover/focus. */
  visible?: boolean;
};

/**
 * Row actions that appear on hover/focus inside a table row, aligned to the trailing edge.
 * Mirrors the official `TableCellActions` compound part.
 */
export function TableCellActions(props: TableCellActionsProps) {
  return (
    <div
      role="presentation"
      class={cx("sf-TableCellActions", props.visible === false && "sf-TableCellActions--hidden", props.class)}
    >
      {props.children}
    </div>
  );
}

export type TableRowId = string | number;

export type TableCellLayoutProps = {
  media?: JSX.Element;
  content?: JSX.Element;
  description?: JSX.Element;
  class?: string;
  children?: JSX.Element;
};
export function TableCellLayout(props: TableCellLayoutProps) {
  return (
    <div class={cx("sf-TableCellLayout", props.class)}>
      <Show when={props.media}>
        <span class="sf-TableCellLayout__media">{props.media}</span>
      </Show>
      <span class="sf-TableCellLayout__main">
        <span class="sf-TableCellLayout__content">{props.content ?? props.children}</span>
        <Show when={props.description}>
          <span class="sf-TableCellLayout__description">{props.description}</span>
        </Show>
      </span>
    </div>
  );
}

export type TableResizeHandleProps = {
  class?: string;
  onResize?: (width: number) => void;
};

/**
 * Separator used between table columns. Dragging (or using Left/Right arrows)
 * reports the resulting width through `onResize`.
 */
export function TableResizeHandle(props: TableResizeHandleProps) {
  let el!: HTMLDivElement;
  const currentWidth = () => el?.parentElement?.getBoundingClientRect().width ?? 0;
  const emit = (width: number) =>
    props.onResize?.(Math.max(20, Math.round(width)));

  const onPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = currentWidth();
    const onMove = (moveEvent: PointerEvent) =>
      emit(startWidth + (moveEvent.clientX - startX));
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      emit(currentWidth() + (event.key === "ArrowRight" ? 10 : -10));
    }
  };

  return (
    <div
      ref={el}
      class={cx("sf-Table__resizeHandle", props.class)}
      role="separator"
      aria-orientation="vertical"
      tabindex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    />
  );
}
