import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  Tree,
  TreeItem,
  TreeItemProvider,
  type TreeItemContextValue,
} from "./Tree";
import { renderWithFluent } from "../../test-utils/index";

const items = [
  { value: "a", content: "Alpha", children: [{ value: "a1", content: "Alpha-1" }] },
  { value: "b", content: "Beta" },
] as any[];

describe("Tree", () => {
  it("renders a tree with items", () => {
    const { container } = renderWithFluent(() => <Tree items={items} />);
    expect(container.querySelector(".sf-Tree")).toBeTruthy();
    expect(container.querySelectorAll('[role="treeitem"]').length).toBeGreaterThan(0);
    expect(container.textContent).toContain("Alpha");
  });

  it("renders a standalone tree item", () => {
    const { container } = renderWithFluent(() => <TreeItem value="x">X</TreeItem>);
    expect(container.querySelector(".sf-TreeItem")).toBeTruthy();
  });

  it("exposes aria-level and a labelled, non-tabbable expand button", () => {
    const { container } = renderWithFluent(() => (
      <Tree items={items} defaultOpenItems={["a"]} />
    ));
    const rows = container.querySelectorAll<HTMLElement>('[role="treeitem"]');
    expect(rows[0]!.getAttribute("aria-level")).toBe("1");
    expect(rows[1]!.getAttribute("aria-level")).toBe("2");
    const expand = rows[0]!.querySelector<HTMLElement>("[data-treeitem-expand]")!;
    expect(expand.getAttribute("aria-label")).toBe("Collapse");
    expect(expand.getAttribute("tabindex")).toBe("-1");
    expect(
      rows[0]!.querySelector<HTMLElement>("[data-treeitem-select]")!.getAttribute("tabindex"),
    ).toBe("-1");
  });

  it("navigates with ArrowUp/Down, Home and End using roving tabindex", () => {
    const { container } = renderWithFluent(() => (
      <Tree items={items} defaultOpenItems={["a"]} />
    ));
    const rows = () =>
      container.querySelectorAll<HTMLElement>('[role="treeitem"]');
    expect(rows()[0]!.getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(rows()[0]!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(rows()[1]!);
    expect(rows()[1]!.getAttribute("tabindex")).toBe("0");
    expect(rows()[0]!.getAttribute("tabindex")).toBe("-1");

    fireEvent.keyDown(rows()[1]!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(rows()[0]!);

    fireEvent.keyDown(rows()[0]!, { key: "End" });
    expect(document.activeElement).toBe(rows()[2]!);
    fireEvent.keyDown(rows()[2]!, { key: "Home" });
    expect(document.activeElement).toBe(rows()[0]!);
  });

  it("expands with ArrowRight and collapses with ArrowLeft", () => {
    const { container } = renderWithFluent(() => <Tree items={items} />);
    const count = () => container.querySelectorAll('[role="treeitem"]').length;
    expect(count()).toBe(2);

    fireEvent.keyDown(
      container.querySelectorAll<HTMLElement>('[role="treeitem"]')[0]!,
      { key: "ArrowRight" },
    );
    expect(count()).toBe(3);

    fireEvent.keyDown(
      container.querySelectorAll<HTMLElement>('[role="treeitem"]')[0]!,
      { key: "ArrowLeft" },
    );
    expect(count()).toBe(2);
  });

  it("selects with Enter/Space and expands all siblings with *", () => {
    const onSelect = vi.fn();
    const siblings = [
      { value: "p", content: "P", children: [{ value: "p1", content: "P1" }] },
      { value: "q", content: "Q", children: [{ value: "q1", content: "Q1" }] },
    ] as any[];
    const selectView = renderWithFluent(() => (
      <Tree items={items} selectionMode="multiselect" onSelect={onSelect} />
    ));
    const first = selectView.container.querySelectorAll<HTMLElement>(
      '[role="treeitem"]',
    )[0]!;
    fireEvent.keyDown(first, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(["a"]);
    expect(first.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(first, { key: " " });
    expect(first.getAttribute("aria-selected")).toBe("false");

    const starView = renderWithFluent(() => <Tree items={siblings} />);
    expect(starView.container.querySelectorAll('[role="treeitem"]').length).toBe(2);
    fireEvent.keyDown(
      starView.container.querySelectorAll<HTMLElement>('[role="treeitem"]')[0]!,
      { key: "*" },
    );
    expect(starView.container.querySelectorAll('[role="treeitem"]').length).toBe(4);
  });

  it("clicking an item's content selects it and reports the selection", () => {
    const onSelect = vi.fn();
    const { container } = renderWithFluent(() => <Tree items={items} onSelect={onSelect} />);
    const rows = container.querySelectorAll<HTMLElement>('[role="treeitem"]');
    const selectButton = rows[0]!.querySelector<HTMLElement>("[data-treeitem-select]")!;

    fireEvent.click(selectButton);
    expect(rows[0]).toHaveAttribute("aria-selected", "true");
    expect(onSelect).toHaveBeenCalledWith(["a"]);
  });

  it("clicking the expand button reveals children and reports the open items", () => {
    const onOpenChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Tree items={items} onOpenChange={onOpenChange} />
    ));
    const rows = container.querySelectorAll<HTMLElement>('[role="treeitem"]');
    const expand = rows[0]!.querySelector<HTMLElement>("[data-treeitem-expand]")!;
    expect(expand).toHaveAttribute("aria-label", "Expand");

    fireEvent.click(expand);
    expect(container.querySelectorAll('[role="treeitem"]').length).toBe(3);
    expect(expand).toHaveAttribute("aria-label", "Collapse");
    expect(onOpenChange).toHaveBeenCalledWith(["a"]);
  });

  it("keeps controlled open/selected items in the DOM while reporting clicks", () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <Tree
        items={items}
        openItems={[]}
        selectedItems={[]}
        onOpenChange={onOpenChange}
        onSelect={onSelect}
      />
    ));
    const rows = container.querySelectorAll<HTMLElement>('[role="treeitem"]');

    fireEvent.click(rows[0]!.querySelector<HTMLElement>("[data-treeitem-expand]")!);
    fireEvent.click(rows[1]!.querySelector<HTMLElement>("[data-treeitem-select]")!);
    expect(container.querySelectorAll('[role="treeitem"]').length).toBe(2);
    expect(rows[0]).toHaveAttribute("aria-expanded", "false");
    expect(rows[1]).toHaveAttribute("aria-selected", "false");
    expect(onOpenChange).toHaveBeenCalledWith(["a"]);
    expect(onSelect).toHaveBeenCalledWith(["b"]);
  });

  it("cannot expand or select a disabled item with the keyboard", () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    const disabled = [
      {
        value: "d",
        content: "D",
        disabled: true,
        children: [{ value: "d1", content: "D1" }],
      },
    ] as any[];
    const { container } = renderWithFluent(() => (
      <Tree items={disabled} onOpenChange={onOpenChange} onSelect={onSelect} />
    ));
    const row = container.querySelector<HTMLElement>('[role="treeitem"]')!;
    expect(row).toHaveAttribute("aria-disabled", "true");
    expect(row.querySelector<HTMLButtonElement>("[data-treeitem-expand]")!.disabled).toBe(true);
    expect(row.querySelector<HTMLButtonElement>("[data-treeitem-select]")!.disabled).toBe(true);

    fireEvent.keyDown(row, { key: "ArrowRight" });
    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: " " });
    expect(container.querySelectorAll('[role="treeitem"]').length).toBe(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("applies appearance and size variant classes", () => {
    const { container } = renderWithFluent(() => (
      <Tree items={items} appearance="transparent" size="small" />
    ));
    const tree = container.querySelector(".sf-Tree")!;
    expect(tree.classList.contains("sf-Tree--transparent")).toBe(true);
    expect(tree.classList.contains("sf-Tree--small")).toBe(true);
  });

  it("exposes aria-multiselectable only in multiselect mode", () => {
    const { container } = renderWithFluent(() => (
      <Tree items={items} selectionMode="multiselect" aria-label="Files" />
    ));
    const tree = container.querySelector('[role="tree"]')!;
    expect(tree).toHaveAttribute("aria-multiselectable", "true");
    expect(tree).toHaveAttribute("aria-label", "Files");
  });

  it("renders an empty tree with no rows", () => {
    const { container } = renderWithFluent(() => <Tree items={[]} />);
    expect(container.querySelector('[role="tree"]')).toBeTruthy();
    expect(container.querySelectorAll('[role="treeitem"]').length).toBe(0);
  });

  it("makes a clicked row the roving tab stop", () => {
    const { container } = renderWithFluent(() => (
      <Tree items={items} defaultOpenItems={["a"]} />
    ));
    const rows = () => container.querySelectorAll<HTMLElement>('[role="treeitem"]');
    expect(rows()[0]!.tabIndex).toBe(0);

    fireEvent.click(rows()[1]!.querySelector<HTMLElement>("[data-treeitem-select]")!);
    expect(rows()[1]!.tabIndex).toBe(0);
    expect(rows()[0]!.tabIndex).toBe(-1);
  });

  it("replaces the previous selection in single-select mode", () => {
    const onSelect = vi.fn();
    const { container } = renderWithFluent(() => <Tree items={items} onSelect={onSelect} />);
    const rows = container.querySelectorAll<HTMLElement>('[role="treeitem"]');

    fireEvent.click(rows[0]!.querySelector<HTMLElement>("[data-treeitem-select]")!);
    fireEvent.click(rows[1]!.querySelector<HTMLElement>("[data-treeitem-select]")!);
    expect(rows[0]).toHaveAttribute("aria-selected", "false");
    expect(rows[1]).toHaveAttribute("aria-selected", "true");
    expect(onSelect).toHaveBeenLastCalledWith(["b"]);
  });

});

describe("TreeItem context primitive", () => {
  it("renders interactive semantics from TreeItemProvider", () => {
    const context: TreeItemContextValue = {
      value: "x",
      level: 2,
      id: "test-tree-item",
      active: () => true,
      selected: () => true,
      expanded: () => false,
      disabled: () => false,
      hasChildren: () => true,
      toggleExpand: vi.fn(),
      toggleSelect: vi.fn(),
      setActive: vi.fn(),
      register: vi.fn(),
    };
    const { container } = renderWithFluent(() => (
      <TreeItemProvider value={context}>
        <TreeItem value="x">X</TreeItem>
      </TreeItemProvider>
    ));
    const item = container.querySelector<HTMLElement>('[role="treeitem"]')!;
    expect(item.id).toBe("test-tree-item");
    expect(item.getAttribute("aria-level")).toBe("2");
    expect(item.getAttribute("aria-selected")).toBe("true");
    expect(item.getAttribute("aria-expanded")).toBe("false");
    expect(item.getAttribute("tabindex")).toBe("0");
    fireEvent.click(item);
    expect(context.setActive).toHaveBeenCalled();
  });
});
