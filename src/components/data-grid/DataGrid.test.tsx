import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridSelectionCell,
} from "./DataGrid";
import { renderWithFluent } from "../../test-utils/index";

const columns = [
  { columnId: "name", title: "Name" },
  { columnId: "role", title: "Role" },
] as any[];

const items = [
  { name: "Ada", role: "Engineer" },
  { name: "Alan", role: "Mathematician" },
] as any[];

const sortColumns = [
  {
    columnId: "name",
    label: "Name",
    compare: (a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name),
  },
] as any[];

describe("DataGrid", () => {
  it("renders a table with headers and rows", () => {
    const { getByRole } = renderWithFluent(() => (
      <DataGrid items={items} columns={columns} />
    ));
    const grid = getByRole("grid");
    expect(grid).toBeTruthy();
    expect(grid.querySelectorAll('[role="columnheader"]').length).toBe(2);
    expect(grid.querySelectorAll('[role="row"]').length).toBe(3);
  });

  it("counts the header row in aria-rowcount and exposes aria-rowindex", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <DataGrid items={items} columns={columns} />
    ));
    const grid = getByRole("grid");
    expect(grid.getAttribute("aria-rowcount")).toBe("3");
    const header = container.querySelector<HTMLElement>('[role="row"][aria-rowindex]')!;
    expect(header.getAttribute("aria-rowindex")).toBe("1");
    const rows = container.querySelectorAll<HTMLElement>(".sf-DataGrid__row");
    expect(rows[0]!.getAttribute("aria-rowindex")).toBe("2");
    expect(rows[1]!.getAttribute("aria-rowindex")).toBe("3");
  });

  it("reactively updates selection class, aria-selected and checkbox", () => {
    const { container } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={columns}
        selectionMode="multiselect"
        getRowId={(item) => item.name}
      />
    ));
    const row = container.querySelectorAll<HTMLElement>(".sf-DataGrid__row")[0]!;
    const checkbox = row.querySelector("input") as HTMLInputElement;
    expect(row.getAttribute("aria-selected")).toBe("false");

    fireEvent.click(checkbox);

    expect(row.classList.contains("sf-DataGrid__row--selected")).toBe(true);
    expect(row.getAttribute("aria-selected")).toBe("true");
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(row.classList.contains("sf-DataGrid__row--selected")).toBe(false);
    expect(row.getAttribute("aria-selected")).toBe("false");
  });

  it("moves the active row with the keyboard and reflects it via aria-activedescendant", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={columns}
        selectionMode="multiselect"
        getRowId={(item) => item.name}
      />
    ));
    const grid = getByRole("grid");
    const rows = container.querySelectorAll<HTMLElement>(".sf-DataGrid__row");
    expect(grid.getAttribute("aria-activedescendant")).toBe(rows[0]!.id);

    fireEvent.keyDown(grid, { key: "ArrowDown" });
    expect(grid.getAttribute("aria-activedescendant")).toBe(rows[1]!.id);
    expect(rows[1]!.classList.contains("sf-DataGrid__row--active")).toBe(true);
    expect(rows[0]!.classList.contains("sf-DataGrid__row--active")).toBe(false);

    fireEvent.keyDown(grid, { key: "End" });
    expect(grid.getAttribute("aria-activedescendant")).toBe(rows[1]!.id);
    fireEvent.keyDown(grid, { key: "Home" });
    expect(grid.getAttribute("aria-activedescendant")).toBe(rows[0]!.id);

    fireEvent.keyDown(grid, { key: "ArrowDown" });
    fireEvent.keyDown(grid, { key: "Enter" });
    expect(rows[1]!.getAttribute("aria-selected")).toBe("true");
  });

  it("cycles sorting asc -> desc -> none and reports changes", () => {
    const onSortChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={sortColumns}
        sortable
        onSortChange={onSortChange}
        getRowId={(item) => item.name}
      />
    ));
    const header = container.querySelector<HTMLElement>('[role="columnheader"][aria-sort]')!;
    const button = header.querySelector("button")!;
    expect(header.getAttribute("aria-sort")).toBe("none");

    fireEvent.click(button);
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "name", direction: "asc" });

    fireEvent.click(button);
    expect(header.getAttribute("aria-sort")).toBe("descending");
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "name", direction: "desc" });

    fireEvent.click(button);
    expect(header.getAttribute("aria-sort")).toBe("none");
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "name", direction: null });
  });

  it("respects controlled sortColumn / sortDirection", () => {
    const onSortChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={sortColumns}
        sortable
        sortColumn="name"
        sortDirection="desc"
        onSortChange={onSortChange}
      />
    ));
    const header = container.querySelector<HTMLElement>('[role="columnheader"][aria-sort]')!;
    expect(header.getAttribute("aria-sort")).toBe("descending");
    fireEvent.click(header.querySelector("button")!);
    // Controlled value is unchanged until the owner updates it.
    expect(header.getAttribute("aria-sort")).toBe("descending");
    expect(onSortChange).toHaveBeenCalled();
  });

  it("resizes columns with pointer drag and arrow keys", () => {
    const { container } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={[{ columnId: "name", label: "Name", width: 120 }]}
        resizableColumns
      />
    ));
    const handle = container.querySelector<HTMLElement>(".sf-DataGrid__resizeHandle")!;
    expect(handle.getAttribute("role")).toBe("separator");
    const cell = container.querySelector<HTMLElement>(".sf-DataGrid__headerCell")!;

    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: 150 });
    fireEvent.pointerUp(window);
    expect(cell.style.width).toBe("170px");

    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(cell.style.width).toBe("160px");
  });

  it("renders an empty grid with only the header row and no active descendant", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <DataGrid items={[]} columns={columns} selectionMode="multiselect" />
    ));
    const grid = getByRole("grid");
    expect(grid.getAttribute("aria-rowcount")).toBe("1");
    expect(grid.hasAttribute("aria-activedescendant")).toBe(false);
    expect(container.querySelectorAll('[role="row"]').length).toBe(1);
    expect(container.querySelectorAll(".sf-DataGrid__row").length).toBe(0);
  });

  it("exposes aria-label, data-size and a custom class", () => {
    const { getByRole } = renderWithFluent(() => (
      <DataGrid items={items} columns={columns} size="small" aria-label="People" class="my-grid" />
    ));
    const grid = getByRole("grid");
    expect(grid).toHaveAttribute("aria-label", "People");
    expect(grid.getAttribute("data-size")).toBe("small");
    expect(grid.classList.contains("my-grid")).toBe(true);
  });

  it("uses radio inputs and single-selection semantics in single mode", () => {
    const onSelectionChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={columns}
        selectionMode="single"
        getRowId={(item) => item.name}
        onSelectionChange={onSelectionChange}
      />
    ));
    const grid = getByRole("grid");
    expect(grid.hasAttribute("aria-multiselectable")).toBe(false);
    const rows = container.querySelectorAll<HTMLElement>(".sf-DataGrid__row");
    const radios = container.querySelectorAll<HTMLInputElement>(".sf-DataGrid__selectionCell input");
    expect(radios.length).toBe(2);
    expect(radios[0]!.type).toBe("radio");

    fireEvent.click(radios[0]!);
    expect(onSelectionChange).toHaveBeenCalledWith(["Ada"]);
    fireEvent.click(radios[1]!);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["Alan"]);
    expect(rows[0]!.getAttribute("aria-selected")).toBe("false");
    expect(rows[1]!.getAttribute("aria-selected")).toBe("true");
  });

  it("respects a controlled selectedItems value until the owner updates it", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={columns}
        selectionMode="multiselect"
        selectedItems={["Ada"]}
        getRowId={(item) => item.name}
        onSelectionChange={onSelectionChange}
      />
    ));
    const rows = container.querySelectorAll<HTMLElement>(".sf-DataGrid__row");
    expect(rows[0]!.getAttribute("aria-selected")).toBe("true");
    fireEvent.click(rows[1]!.querySelector("input")!);
    expect(onSelectionChange).toHaveBeenCalledWith(["Ada", "Alan"]);
    expect(rows[0]!.getAttribute("aria-selected")).toBe("true");
    expect(rows[1]!.getAttribute("aria-selected")).toBe("false");
  });

  it("selects the active row with Space and moves up with ArrowUp", () => {
    const onSelectionChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <DataGrid
        items={items}
        columns={columns}
        selectionMode="multiselect"
        getRowId={(item) => item.name}
        onSelectionChange={onSelectionChange}
      />
    ));
    const grid = getByRole("grid");
    const rows = container.querySelectorAll<HTMLElement>(".sf-DataGrid__row");
    fireEvent.keyDown(grid, { key: "ArrowDown" });
    expect(grid.getAttribute("aria-activedescendant")).toBe(rows[1]!.id);
    fireEvent.keyDown(grid, { key: "ArrowUp" });
    expect(grid.getAttribute("aria-activedescendant")).toBe(rows[0]!.id);
    fireEvent.keyDown(grid, { key: " " });
    expect(onSelectionChange).toHaveBeenCalledWith(["Ada"]);
  });

  it("uses renderCell and renderHeaderCell when provided", () => {
    const customColumns = [
      {
        columnId: "name",
        label: "Name",
        renderHeaderCell: () => <span>Custom Header</span>,
        renderCell: (item: { name: string }) => <strong>{item.name}!</strong>,
      },
    ] as any[];
    const { container } = renderWithFluent(() => (
      <DataGrid items={items} columns={customColumns} />
    ));
    expect(container.querySelector(".sf-DataGrid__headerButton")!.textContent).toContain(
      "Custom Header",
    );
    expect(container.querySelector<HTMLElement>(".sf-DataGrid__row .sf-DataGrid__cell")!.textContent).toContain(
      "Ada!",
    );
  });

  it("renders rows through the virtualizer when virtualized", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <DataGrid items={items} columns={columns} virtualized rowHeight={20} height={40} />
    ));
    const grid = getByRole("grid");
    expect(grid.classList.contains("sf-DataGrid--virtual")).toBe(true);
    expect(container.querySelector(".sf-Virtualizer.sf-DataGrid__virtualBody")).toBeTruthy();
    expect(container.querySelectorAll(".sf-DataGrid__row").length).toBeGreaterThan(0);
  });
});

describe("DataGrid compound parts", () => {
  it("exposes DataGridHeader/Body/Row/Cell/HeaderCell/SelectionCell", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <table>
        <DataGridHeader><DataGridHeaderCell>Name</DataGridHeaderCell></DataGridHeader>
        <DataGridBody>
          <DataGridRow selected>
            <DataGridCell>Ada</DataGridCell>
            <DataGridSelectionCell checked onChange={onChange} />
          </DataGridRow>
        </DataGridBody>
      </table>
    ));
    expect(container.querySelector(".sf-DataGridHeader")).toBeTruthy();
    expect(container.querySelector(".sf-DataGridBody")).toBeTruthy();
    expect(container.querySelector(".sf-DataGridRow--selected")).toBeTruthy();
    expect(container.querySelector(".sf-DataGridCell")?.textContent).toContain("Ada");
    expect(container.querySelector(".sf-DataGridSelectionCell input")).toBeTruthy();
  });
});
