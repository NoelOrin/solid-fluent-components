import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { List, ListItem } from "./List";
import { renderWithFluent } from "../../test-utils/index";

describe("List", () => {
  it("renders a list with items", () => {
    const { container } = renderWithFluent(() => (
      <List>
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
      </List>
    ));
    expect(container.querySelector(".sf-List")).toBeTruthy();
    expect(container.querySelectorAll(".sf-ListItem").length).toBe(2);
  });

  it("reflects disabled and selected states", () => {
    const { container } = renderWithFluent(() => (
      <List>
        <ListItem value="a" disabled>Disabled</ListItem>
        <ListItem value="b" selected>Selected</ListItem>
      </List>
    ));
    const items = container.querySelectorAll(".sf-ListItem");
    expect(items[0]!.classList.contains("sf-ListItem--disabled")).toBe(true);
    expect(items[1]!.classList.contains("sf-ListItem--selected")).toBe(true);
  });

  it("injects selection state into declarative children", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <List selectionMode="single" onSelectionChange={onSelectionChange}>
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
      </List>
    ));
    const ul = container.querySelector("ul")!;
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");
    expect(ul.getAttribute("role")).toBe("listbox");
    expect(items[0]!.getAttribute("role")).toBe("option");

    fireEvent.click(items[0]!);
    expect(items[0]!.classList.contains("sf-ListItem--selected")).toBe(true);
    expect(onSelectionChange).toHaveBeenCalledWith(["a"]);
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-a");

    fireEvent.click(items[1]!);
    expect(items[0]!.classList.contains("sf-ListItem--selected")).toBe(false);
    expect(items[1]!.classList.contains("sf-ListItem--selected")).toBe(true);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("supports keyboard selection in declarative children mode", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <List selectionMode="single" onSelectionChange={onSelectionChange}>
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
        <ListItem value="c" disabled>C</ListItem>
      </List>
    ));
    const ul = container.querySelector("ul")!;
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");

    fireEvent.keyDown(ul, { key: "ArrowDown" });
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-b");
    fireEvent.keyDown(ul, { key: "Enter" });
    expect(items[1]!.classList.contains("sf-ListItem--selected")).toBe(true);
    expect(onSelectionChange).toHaveBeenCalledWith(["b"]);

    // Disabled items are skipped by arrow navigation.
    fireEvent.keyDown(ul, { key: "ArrowDown" });
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-b");
  });

  it("does not use role=option when selectionMode is none", () => {
    const { container } = renderWithFluent(() => (
      <List>
        <ListItem value="a">A</ListItem>
      </List>
    ));
    expect(container.querySelector("ul")!.getAttribute("role")).toBe("list");
    const item = container.querySelector<HTMLElement>(".sf-ListItem")!;
    expect(item.getAttribute("role")).toBeNull();
    expect(item.hasAttribute("aria-selected")).toBe(false);
  });

  it("composite navigation moves DOM focus onto items", () => {
    const { container } = renderWithFluent(() => (
      <List selectionMode="single" navigationMode="composite">
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
      </List>
    ));
    const ul = container.querySelector("ul")!;
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");
    expect(ul.getAttribute("data-navigation")).toBe("composite");
    expect(ul.hasAttribute("aria-activedescendant")).toBe(false);
    expect(items[0]!.getAttribute("tabindex")).toBe("0");
    expect(items[1]!.getAttribute("tabindex")).toBe("-1");

    fireEvent.keyDown(ul, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]!);
    expect(items[1]!.getAttribute("tabindex")).toBe("0");
  });

  it("keeps data-driven items working with injection", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <List
        selectionMode="multiselect"
        items={[
          { value: 1, content: "One" },
          { value: 2, content: "Two", disabled: true },
        ]}
        onSelectionChange={onSelectionChange}
      />
    ));
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");
    fireEvent.click(items[0]!);
    expect(onSelectionChange).toHaveBeenCalledWith([1]);
    expect(items[0]!.classList.contains("sf-ListItem--selected")).toBe(true);
    fireEvent.click(items[1]!);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("Home, End and ArrowUp move the active option and Space toggles selection", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <List selectionMode="single" onSelectionChange={onSelectionChange}>
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
        <ListItem value="c">C</ListItem>
      </List>
    ));
    const ul = container.querySelector("ul")!;

    fireEvent.keyDown(ul, { key: "ArrowDown" });
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-b");
    fireEvent.keyDown(ul, { key: "ArrowUp" });
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-a");
    fireEvent.keyDown(ul, { key: "End" });
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-c");
    fireEvent.keyDown(ul, { key: "Home" });
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-a");

    fireEvent.keyDown(ul, { key: " " });
    expect(onSelectionChange).toHaveBeenCalledWith(["a"]);
  });

  it("exposes aria-multiselectable and per-option aria-selected in multiselect", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <List selectionMode="multiselect" defaultSelectedItems={["b"]} onSelectionChange={onSelectionChange}>
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
      </List>
    ));
    const ul = container.querySelector("ul")!;
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");
    expect(ul).toHaveAttribute("aria-multiselectable", "true");
    expect(items[0]!.getAttribute("aria-selected")).toBe("false");
    expect(items[1]!.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(items[0]!);
    expect(items[0]!.getAttribute("aria-selected")).toBe("true");
    expect(onSelectionChange).toHaveBeenCalledWith(["b", "a"]);
  });

  it("a disabled item click does not change selection", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <List selectionMode="single" onSelectionChange={onSelectionChange}>
        <ListItem value="a">A</ListItem>
        <ListItem value="b" disabled>B</ListItem>
      </List>
    ));
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");
    fireEvent.click(items[1]!);
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(items[1]!.getAttribute("aria-selected")).toBe("false");
    expect(items[1]!.getAttribute("aria-disabled")).toBe("true");
  });

  it("respects a controlled selectedItems value until the owner updates it", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <List selectionMode="single" selectedItems={["a"]} onSelectionChange={onSelectionChange}>
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
      </List>
    ));
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");
    fireEvent.click(items[1]!);
    expect(onSelectionChange).toHaveBeenCalledWith(["b"]);
    expect(items[0]!.classList.contains("sf-ListItem--selected")).toBe(true);
    expect(items[1]!.classList.contains("sf-ListItem--selected")).toBe(false);
  });

  it("an empty list exposes no active descendant and forwards aria-label/class", () => {
    const { container } = renderWithFluent(() => (
      <List selectionMode="single" aria-label="Empty list" class="my-list" />
    ));
    const ul = container.querySelector<HTMLElement>("ul.sf-List")!;
    expect(ul).toHaveAttribute("aria-label", "Empty list");
    expect(ul.classList.contains("my-list")).toBe(true);
    expect(ul.getAttribute("role")).toBe("listbox");
    expect(ul.hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("hovering an option makes it active", () => {
    const { container } = renderWithFluent(() => (
      <List selectionMode="single">
        <ListItem value="a">A</ListItem>
        <ListItem value="b">B</ListItem>
      </List>
    ));
    const ul = container.querySelector("ul")!;
    const items = container.querySelectorAll<HTMLElement>(".sf-ListItem");
    fireEvent.mouseEnter(items[1]!);
    expect(ul.getAttribute("aria-activedescendant")).toBe("sf-list-option-b");
    expect(items[1]!.classList.contains("sf-ListItem--active")).toBe(true);
  });
});
