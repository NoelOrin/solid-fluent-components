import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableCellLayout,
  TableResizeHandle,
  TableSelectionCell,
  type TableRowId,
  type TableSortChange,
  type TableSortDirection,
  TableCellActions,
} from "./Table";
import { renderWithFluent } from "../../test-utils/index";

describe("TableCellActions", () => {
  it("renders a presentation slot and respects visible=false", () => {
    const visible = renderWithFluent(() => (
      <Table><TableBody><TableRow><TableCell>
        <TableCellActions visible={false}><button>Edit</button></TableCellActions>
      </TableCell></TableRow></TableBody></Table>
    ));
    const el = visible.container.querySelector(".sf-TableCellActions");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("role")).toBe("presentation");
    expect(el?.classList.contains("sf-TableCellActions--hidden")).toBe(true);
    expect(el?.textContent).toContain("Edit");
  });

  it("is visible by default without the hidden class", () => {
    const { container } = renderWithFluent(() => (
      <Table><TableBody><TableRow><TableCell>
        <TableCellActions><button>Edit</button></TableCellActions>
      </TableCell></TableRow></TableBody></Table>
    ));
    const el = container.querySelector(".sf-TableCellActions") as HTMLElement;
    expect(el).toBeTruthy();
    expect(el).not.toHaveClass("sf-TableCellActions--hidden");
  });
});

describe("Table sub-components", () => {
  it("renders semantic table and cell layout", () => {
    const { container } = renderWithFluent(() => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <TableCellLayout media={<span>@</span>} description="desc">
                Ada
              </TableCellLayout>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ));
    expect(container.querySelector("table")?.className).toContain("sf-Table");
    expect(container.querySelector(".sf-TableCellLayout")?.textContent).toContain("Ada");
  });

  it("TableSelectionCell toggles and TableResizeHandle renders", () => {
    const onChange = vi.fn();
    const { getByRole, container } = renderWithFluent(() => (
      <>
        <TableSelectionCell checked={false} onChange={onChange} />
        <TableResizeHandle />
      </>
    ));
    getByRole("checkbox").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(container.querySelector(".sf-Table__resizeHandle")).toBeTruthy();
  });

  it("TableRowId is exported as a type alias", () => {
    const id: TableRowId = "x";
    expect(id).toBe("x");
  });

  it("sortable header cells expose aria-sort and a sorting button", () => {
    const onSortChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Table sortable sortColumn="name" sortDirection="asc" onSortChange={onSortChange}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell columnId="name">Name</TableHeaderCell>
          </TableRow>
        </TableHeader>
      </Table>
    ));
    const th = container.querySelector<HTMLElement>("th")!;
    expect(th.getAttribute("aria-sort")).toBe("ascending");
    const button = th.querySelector("button")!;
    expect(button.textContent).toContain("▲");
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
    fireEvent.click(button);
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "name", direction: "desc" });
  });

  it("standalone sortable TableHeaderCell cycles through onSort", () => {
    const onSort = vi.fn();
    const { container } = renderWithFluent(() => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell sortable onSort={onSort}>Age</TableHeaderCell>
          </TableRow>
        </TableHeader>
      </Table>
    ));
    const th = container.querySelector<HTMLElement>("th")!;
    expect(th.getAttribute("aria-sort")).toBe("none");
    expect(th.textContent).toContain("↕");
    fireEvent.click(th.querySelector("button")!);
    expect(onSort).toHaveBeenCalledWith("asc");
  });

  it("TableResizeHandle reports width from pointer drag and arrow keys", () => {
    const onResize = vi.fn();
    const { container } = renderWithFluent(() => (
      <TableResizeHandle onResize={onResize} />
    ));
    const handle = container.querySelector<HTMLElement>(".sf-Table__resizeHandle")!;
    expect(handle.getAttribute("role")).toBe("separator");
    expect(handle.getAttribute("aria-orientation")).toBe("vertical");
    expect(handle.tabIndex).toBe(0);

    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: 140 });
    fireEvent.pointerUp(window);
    expect(onResize).toHaveBeenCalled();
    expect(typeof onResize.mock.calls[0]![0]).toBe("number");

    onResize.mockClear();
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onResize).toHaveBeenCalled();
  });

  it("exposes size and custom class/style hooks on the table", () => {
    const { container } = renderWithFluent(() => (
      <Table size="small" class="my-table" style={{ width: "300px" }}>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>
    ));
    const table = container.querySelector("table") as HTMLElement;
    expect(table).toHaveClass("sf-Table", "my-table");
    expect(table).toHaveAttribute("data-size", "small");
    expect(table.style.width).toBe("300px");
  });

  it("renders a non-sortable header cell without a button or aria-sort", () => {
    const { container } = renderWithFluent(() => (
      <Table>
        <TableHeader>
          <TableRow><TableHeaderCell>Plain</TableHeaderCell></TableRow>
        </TableHeader>
      </Table>
    ));
    const th = container.querySelector<HTMLElement>("th")!;
    expect(th).not.toHaveAttribute("aria-sort");
    expect(th.querySelector("button")).toBeNull();
    expect(th.textContent).toBe("Plain");
  });

  it("uses the cell text as columnId when none is provided", () => {
    const onSortChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Table sortable onSortChange={onSortChange}>
        <TableHeader>
          <TableRow><TableHeaderCell>Age</TableHeaderCell></TableRow>
        </TableHeader>
      </Table>
    ));
    fireEvent.click(container.querySelector("th button")!);
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "Age", direction: "asc" });
  });

  it("cycles a controlled sort through asc, desc and none", () => {
    const [sortColumn, setSortColumn] = createSignal<string | undefined>("name");
    const [sortDirection, setSortDirection] = createSignal<TableSortDirection | undefined>("asc");
    const changes: TableSortChange[] = [];
    const { container } = renderWithFluent(() => (
      <Table
        sortable
        sortColumn={sortColumn()}
        sortDirection={sortDirection()}
        onSortChange={(change) => {
          changes.push(change);
          setSortColumn(change.columnId);
          setSortDirection(change.direction ?? undefined);
        }}
      >
        <TableHeader>
          <TableRow><TableHeaderCell columnId="name">Name</TableHeaderCell></TableRow>
        </TableHeader>
      </Table>
    ));
    const th = container.querySelector<HTMLElement>("th")!;
    const button = th.querySelector("button")!;
    const icon = () => th.querySelector(".sf-Table__sortIcon")!.textContent;

    expect(th).toHaveAttribute("aria-sort", "ascending");
    expect(icon()).toContain("▲");

    fireEvent.click(button);
    expect(changes[0]).toEqual({ columnId: "name", direction: "desc" });
    expect(th).toHaveAttribute("aria-sort", "descending");
    expect(icon()).toContain("▼");

    fireEvent.click(button);
    expect(changes[1]).toEqual({ columnId: "name", direction: null });
    expect(th).toHaveAttribute("aria-sort", "none");
    expect(icon()).toContain("↕");

    fireEvent.click(button);
    expect(changes[2]).toEqual({ columnId: "name", direction: "asc" });
    expect(th).toHaveAttribute("aria-sort", "ascending");
    expect(icon()).toContain("▲");
  });

  it("renders a radio selection cell with its checked state", () => {
    const { container } = renderWithFluent(() => (
      <TableSelectionCell type="radio" checked />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("radio");
    expect(input.checked).toBe(true);
  });

  it("lets the content prop take precedence over children in cell layout", () => {
    const { container, getByTestId } = renderWithFluent(() => (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <TableCellLayout
                media={<span data-testid="media">M</span>}
                content={<span data-testid="content">C</span>}
                description="D"
              >
                <span data-testid="child">X</span>
              </TableCellLayout>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ));
    expect(getByTestId("content")).toBeTruthy();
    expect(getByTestId("media")).toBeTruthy();
    expect(container.querySelector(".sf-TableCellLayout__description")?.textContent).toBe("D");
    expect(container.querySelector('[data-testid="child"]')).toBeNull();
  });

  it("ignores non-horizontal keys on the resize handle and clamps the width", () => {
    const onResize = vi.fn();
    const { container } = renderWithFluent(() => (
      <TableResizeHandle onResize={onResize} />
    ));
    const handle = container.querySelector<HTMLElement>(".sf-Table__resizeHandle")!;

    fireEvent.keyDown(handle, { key: "ArrowUp" });
    fireEvent.keyDown(handle, { key: "Home" });
    expect(onResize).not.toHaveBeenCalled();

    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(onResize).toHaveBeenCalledWith(20);
  });
});
