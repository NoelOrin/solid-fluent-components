import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  Nav,
  NavCategoryItem,
  NavItem,
  NavSection,
  NavSubItem,
  NavSubItemGroup,
  SplitNavItem,
  NavDrawer,
  NavDrawerHeader,
  NavDrawerBody,
  NavDrawerFooter,
} from "./Nav";
import { renderWithFluent } from "../../test-utils/index";

describe("Nav sub-components", () => {
  it("renders items and drawer pieces", () => {
    const { container, getByText } = renderWithFluent(() => (
      <>
        <Nav items={[{ value: "home", content: "Home" }]} />
        <NavCategoryItem>Cat</NavCategoryItem>
        <NavSubItem>Sub</NavSubItem>
        <NavSubItemGroup>Group</NavSubItemGroup>
        <SplitNavItem>A</SplitNavItem>
        <NavDrawer>
          <NavDrawerHeader>H</NavDrawerHeader>
          <NavDrawerBody>B</NavDrawerBody>
          <NavDrawerFooter>F</NavDrawerFooter>
        </NavDrawer>
      </>
    ));
    expect(getByText("Home")).toBeInTheDocument();
    expect(container.querySelector(".sf-NavCategoryItem")).toBeTruthy();
    expect(container.querySelector(".sf-NavSubItem")).toBeTruthy();
    expect(container.querySelector(".sf-NavDrawer")).toBeTruthy();
    expect(container.querySelector(".sf-NavDrawer__header")).toBeTruthy();
  });

  it("exposes aria-expanded on expand buttons and aria-current on selected items", () => {
    const { container } = renderWithFluent(() => (
      <Nav
        defaultSelectedValue="guide"
        defaultOpenItems={["docs"]}
        items={[
          { value: "home", content: "Home" },
          {
            value: "docs",
            content: "Docs",
            children: [{ value: "guide", content: "Guide" }],
          },
        ]}
      />
    ));
    const expand = container.querySelector(".sf-NavItem__expand") as HTMLElement;
    expect(expand).toHaveAttribute("aria-expanded", "true");
    expect(expand.getAttribute("aria-controls")).toBeTruthy();

    const current = container.querySelector('[aria-current="page"]')!;
    expect(current.textContent).toContain("Guide");

    fireEvent.click(expand);
    expect(expand).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector("#" + expand.getAttribute("aria-controls"))).toBeNull();
  });

  it("supports href/icon/selected/disabled/onClick/value on NavItem and NavSection", () => {
    const onClick = vi.fn();
    const { container, getByText } = renderWithFluent(() => (
      <NavSection>
        <NavItem value="a" icon={<span aria-hidden="true">*</span>} href="#a" onClick={onClick} selected>
          A
        </NavItem>
        <NavItem value="b" disabled onClick={onClick}>
          B
        </NavItem>
      </NavSection>
    ));
    expect(container.querySelector(".sf-NavSection")).toHaveAttribute("role", "group");
    expect(getByText("A").closest("a")).toHaveAttribute("href", "#a");
    expect(getByText("A").closest("a")).toHaveAttribute("aria-current", "page");
    expect(container.querySelector('[data-value="a"]')).toBeTruthy();

    fireEvent.click(getByText("A").closest("a")!);
    expect(onClick).toHaveBeenCalledTimes(1);

    const disabledButton = getByText("B").closest("button")!;
    expect(disabledButton.disabled).toBe(true);
    fireEvent.click(disabledButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("honours the selected and onClick fields on data-driven items", () => {
    const onClick = vi.fn();
    const { container } = renderWithFluent(() => (
      <Nav items={[{ value: "x", content: "X", selected: true, onClick }]} />
    ));
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain("X");
    fireEvent.click(container.querySelector(".sf-NavItem__content")!);
    expect(onClick).toHaveBeenCalled();
  });

  it("clicking an item updates aria-current and fires onNavItemSelect", () => {
    const onNavItemSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <Nav
        items={[
          { value: "home", content: "Home" },
          { value: "docs", content: "Docs" },
        ]}
        onNavItemSelect={onNavItemSelect}
      />
    ));
    const contents = Array.from(container.querySelectorAll<HTMLElement>(".sf-NavItem__content"));
    fireEvent.click(contents[1]!);
    expect(contents[1]).toHaveAttribute("aria-current", "page");
    expect(contents[0]).not.toHaveAttribute("aria-current");
    expect(onNavItemSelect).toHaveBeenCalledWith("docs");
  });

  it("keeps a controlled selectedValue while reporting the clicked value", () => {
    const onNavItemSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <Nav
        selectedValue="home"
        items={[
          { value: "home", content: "Home" },
          { value: "docs", content: "Docs" },
        ]}
        onNavItemSelect={onNavItemSelect}
      />
    ));
    const contents = Array.from(container.querySelectorAll<HTMLElement>(".sf-NavItem__content"));
    fireEvent.click(contents[1]!);
    expect(contents[0]).toHaveAttribute("aria-current", "page");
    expect(contents[1]).not.toHaveAttribute("aria-current");
    expect(onNavItemSelect).toHaveBeenCalledWith("docs");
  });

  it("repeatedly toggles a group and its aria-expanded state", () => {
    const { container } = renderWithFluent(() => (
      <Nav
        items={[
          {
            value: "docs",
            content: "Docs",
            children: [{ value: "guide", content: "Guide" }],
          },
        ]}
      />
    ));
    const expand = container.querySelector<HTMLElement>(".sf-NavItem__expand")!;
    const groupId = expand.getAttribute("aria-controls")!;
    expect(expand).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector("#" + groupId)).toBeNull();

    fireEvent.click(expand);
    expect(expand).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("#" + groupId)?.getAttribute("role")).toBe("group");

    fireEvent.click(expand);
    expect(expand).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector("#" + groupId)).toBeNull();

    fireEvent.click(expand);
    expect(expand).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("#" + groupId)?.textContent).toContain("Guide");
  });

  it("renders the expand button as a labelled, focusable native button", () => {
    const { container } = renderWithFluent(() => (
      <Nav items={[{ value: "docs", content: "Docs", children: [{ value: "g", content: "G" }] }]} />
    ));
    const expand = container.querySelector<HTMLButtonElement>(".sf-NavItem__expand")!;
    expect(expand.tagName).toBe("BUTTON");
    expect(expand.type).toBe("button");
    expect(expand).toHaveAttribute("aria-label", "Toggle docs");
    expand.focus();
    expect(document.activeElement).toBe(expand);
  });

  it("applies density, appearance and custom classes to the nav root", () => {
    const { container } = renderWithFluent(() => (
      <Nav density="small" appearance="outline" class="custom-nav" items={[]} />
    ));
    const nav = container.querySelector("nav")!;
    expect(nav.classList.contains("sf-Nav--small")).toBe(true);
    expect(nav.classList.contains("sf-Nav--outline")).toBe(true);
    expect(nav.classList.contains("custom-nav")).toBe(true);
  });

  it("renders children when no items are provided", () => {
    const { container, getByText } = renderWithFluent(() => (
      <Nav>
        <NavItem value="a">A</NavItem>
      </Nav>
    ));
    expect(getByText("A")).toBeTruthy();
    expect(container.querySelector(".sf-NavItem")).toBeTruthy();
  });

  it("does not select or expand a disabled data-driven item", () => {
    const onClick = vi.fn();
    const onNavItemSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <Nav
        items={[
          {
            value: "x",
            content: "X",
            disabled: true,
            onClick,
            children: [{ value: "y", content: "Y" }],
          },
        ]}
        onNavItemSelect={onNavItemSelect}
      />
    ));
    const expand = container.querySelector<HTMLButtonElement>(".sf-NavItem__expand")!;
    const content = container.querySelector<HTMLButtonElement>(".sf-NavItem__content")!;
    expect(expand.disabled).toBe(true);
    expect(content.disabled).toBe(true);
    fireEvent.click(expand);
    fireEvent.click(content);
    expect(onClick).not.toHaveBeenCalled();
    expect(onNavItemSelect).not.toHaveBeenCalled();
    expect(container.querySelector(".sf-NavItem__group")).toBeNull();
  });
});
