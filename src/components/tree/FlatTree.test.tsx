import { describe, expect, it, vi } from "vitest";
import { createSignal } from "solid-js";
import { fireEvent } from "@solidjs/testing-library";
import {
  FlatTree,
  FlatTreeItem,
  HeadlessFlatTree,
  HeadlessFlatTreeItem,
  FlattenTreeItem,
} from "./FlatTree";
import { renderWithFluent } from "../../test-utils/index";

describe("FlatTree", () => {
  it("renders tree and items with role", () => {
    const { container } = renderWithFluent(() => (
      <FlatTree>
        <FlatTreeItem value="1">One</FlatTreeItem>
        <FlatTreeItem value="2">Two</FlatTreeItem>
      </FlatTree>
    ));
    expect(container.querySelector(".sf-FlatTree")).toBeTruthy();
    expect(container.querySelectorAll("[role='treeitem']").length).toBe(2);
  });

  it("HeadlessFlatTree renders without role semantics", () => {
    const { container } = renderWithFluent(() => (
      <HeadlessFlatTree>
        <HeadlessFlatTreeItem value="x" selected>
          X
        </HeadlessFlatTreeItem>
      </HeadlessFlatTree>
    ));
    expect(container.querySelector(".sf-FlatTree--headless")).toBeTruthy();
    const item = container.querySelector<HTMLElement>(".sf-FlatTreeItem")!;
    expect(item.getAttribute("role")).toBeNull();
    expect(item.hasAttribute("aria-selected")).toBe(false);
    expect(item.getAttribute("data-value")).toBe("x");
  });

  it("FlatTreeItem keeps tree semantics and forwards clicks", () => {
    const onClick = vi.fn();
    const { container } = renderWithFluent(() => (
      <FlatTreeItem value="3" selected onClick={onClick}>
        Three
      </FlatTreeItem>
    ));
    const item = container.querySelector<HTMLElement>(".sf-FlatTreeItem")!;
    expect(item.getAttribute("role")).toBe("treeitem");
    expect(item.getAttribute("aria-selected")).toBe("true");
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it("FlattenTreeItem flattens nested children with depth", () => {
    const flat = FlattenTreeItem([
      { value: "a", children: [{ value: "b", children: [{ value: "c", children: [] }] }] },
    ]);
    expect(flat.map((f) => `${f.item.value}:${f.depth}`).join(",")).toBe("a:0,b:1,c:2");
  });

  it("FlatTreeItem reflects a signal-controlled selected state after clicks", () => {
    const [selected, setSelected] = createSignal(false);
    const { container } = renderWithFluent(() => (
      <FlatTreeItem value="1" selected={selected()} onClick={() => setSelected(!selected())}>
        One
      </FlatTreeItem>
    ));
    const item = container.querySelector<HTMLElement>(".sf-FlatTreeItem")!;
    expect(item).not.toHaveAttribute("aria-selected");

    fireEvent.click(item);
    expect(item).toHaveAttribute("aria-selected", "true");
    fireEvent.click(item);
    expect(item).not.toHaveAttribute("aria-selected");
  });

  it("HeadlessFlatTreeItem forwards clicks without tree semantics", () => {
    const onClick = vi.fn();
    const { container } = renderWithFluent(() => (
      <HeadlessFlatTree>
        <HeadlessFlatTreeItem value="x" selected onClick={onClick}>
          X
        </HeadlessFlatTreeItem>
      </HeadlessFlatTree>
    ));
    const item = container.querySelector<HTMLElement>(".sf-FlatTreeItem")!;
    expect(item).not.toHaveAttribute("role");
    expect(item).not.toHaveAttribute("aria-selected");
    expect(item).toHaveAttribute("data-value", "x");
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an empty tree with a custom class", () => {
    const { container } = renderWithFluent(() => <FlatTree class="my-tree" />);
    const tree = container.querySelector(".sf-FlatTree")!;
    expect(tree.classList.contains("my-tree")).toBe(true);
    expect(tree.querySelectorAll('[role="treeitem"]').length).toBe(0);
  });

  it("FlattenTreeItem handles empty input and records parentValue", () => {
    expect(FlattenTreeItem([])).toEqual([]);
    const flat = FlattenTreeItem([{ value: "p", children: [{ value: "c", children: [] }] }]);
    expect(flat[1]!.parentValue).toBe("p");
    expect(flat[0]!.parentValue).toBeUndefined();
  });
});
