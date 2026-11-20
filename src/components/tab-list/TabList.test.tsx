import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "./TabList";
import { renderWithFluent } from "../../test-utils/index";

function BasicTabs(props: { vertical?: boolean; activationMode?: "automatic" | "manual" }) {
  return (
    <TabList defaultSelectedValue="a" vertical={props.vertical} activationMode={props.activationMode}>
      <Tab value="a">Tab A</Tab>
      <Tab value="b" disabled>
        Tab B
      </Tab>
      <Tab value="c">Tab C</Tab>
    </TabList>
  );
}

function selectedValue(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[role="tab"]')).find(
    (el) => el.getAttribute("aria-selected") === "true",
  )?.textContent;
}

describe("TabList", () => {
  it("renders a tablist with tabs and panels", () => {
    const { container } = renderWithFluent(() => (
      <TabList selectedValue="a">
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <TabPanels>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </TabPanels>
      </TabList>
    ));
    expect(container.querySelector(".sf-TabList")).toBeTruthy();
    expect(container.querySelectorAll('[role="tab"]').length).toBe(2);
    expect(container.querySelectorAll('[role="tabpanel"]').length).toBe(2);
  });

  it("marks the selected tab", () => {
    const { container } = renderWithFluent(() => (
      <TabList selectedValue="b">
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
      </TabList>
    ));
    expect(selectedValue(container)).toContain("Tab B");
  });

  it("uses roving tabindex and skips disabled tabs with arrow/Home/End keys", () => {
    const { container, getAllByRole } = renderWithFluent(() => <BasicTabs />);
    const [a, b, c] = getAllByRole("tab") as [HTMLElement, HTMLElement, HTMLElement];

    expect(a.tabIndex).toBe(0);
    expect(b.tabIndex).toBe(-1);
    expect(c.tabIndex).toBe(-1);

    fireEvent.keyDown(a, { key: "ArrowRight" });
    expect(selectedValue(container)).toContain("Tab C"); // b disabled → skipped
    expect(document.activeElement).toBe(c);
    expect(c.tabIndex).toBe(0);
    expect(a.tabIndex).toBe(-1);

    fireEvent.keyDown(c, { key: "ArrowRight" }); // wraps around
    expect(selectedValue(container)).toContain("Tab A");

    fireEvent.keyDown(a, { key: "End" });
    expect(selectedValue(container)).toContain("Tab C");
    fireEvent.keyDown(c, { key: "Home" });
    expect(selectedValue(container)).toContain("Tab A");
  });

  it("respects the vertical axis", () => {
    const { container, getAllByRole } = renderWithFluent(() => <BasicTabs vertical />);
    const [a, , c] = getAllByRole("tab") as [HTMLElement, HTMLElement, HTMLElement];
    const list = container.querySelector('[role="tablist"]')!;
    expect(list.getAttribute("aria-orientation")).toBe("vertical");

    fireEvent.keyDown(a, { key: "ArrowDown" });
    expect(selectedValue(container)).toContain("Tab C");
    fireEvent.keyDown(c, { key: "ArrowUp" });
    expect(selectedValue(container)).toContain("Tab A");
  });

  it("supports manual activation", () => {
    const { container, getAllByRole } = renderWithFluent(() => <BasicTabs activationMode="manual" />);
    const [a, , c] = getAllByRole("tab") as [HTMLElement, HTMLElement, HTMLElement];

    fireEvent.keyDown(a, { key: "ArrowRight" });
    expect(document.activeElement).toBe(c);
    expect(selectedValue(container)).toContain("Tab A"); // focus moved, selection unchanged

    fireEvent.keyDown(c, { key: "Enter" });
    expect(selectedValue(container)).toContain("Tab C");
  });

  it("only shows the selected panel and links tabs/panels via ARIA", () => {
    const { container } = renderWithFluent(() => (
      <Tabs defaultSelectedValue="a">
        <TabList>
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </TabPanels>
      </Tabs>
    ));

    const panels = Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    expect(panels.length).toBe(2);
    expect(panels[0]!.hidden).toBe(false);
    expect(panels[1]!.hidden).toBe(true);
    expect(panels[0]!.tabIndex).toBe(0);

    const [tabA, tabB] = Array.from(container.querySelectorAll<HTMLElement>('[role="tab"]'));
    expect(tabA!.getAttribute("aria-controls")).toBe(panels[0]!.id);
    expect(tabB!.getAttribute("aria-controls")).toBe(panels[1]!.id);
    expect(panels[0]!.getAttribute("aria-labelledby")).toBe(tabA!.id);
    expect(panels[1]!.getAttribute("aria-labelledby")).toBe(tabB!.id);
  });

  it("lets a TabPanels nested inside TabList read the selection from context", () => {
    const { container } = renderWithFluent(() => (
      <TabList defaultSelectedValue="b">
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <TabPanels>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </TabPanels>
      </TabList>
    ));
    const visible = Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
      .filter((panel) => !panel.hidden)
      .map((panel) => panel.textContent);
    expect(visible).toEqual(["Panel B"]);
  });

  it("clicking a tab updates aria-selected and reveals its panel", () => {
    const { container, getAllByRole } = renderWithFluent(() => (
      <Tabs defaultSelectedValue="a">
        <TabList>
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </TabPanels>
      </Tabs>
    ));
    const [a, b] = getAllByRole("tab") as HTMLElement[];
    const panels = Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    expect(a).toHaveAttribute("aria-selected", "true");
    expect(b).toHaveAttribute("aria-selected", "false");

    fireEvent.click(b!);
    expect(a).toHaveAttribute("aria-selected", "false");
    expect(b).toHaveAttribute("aria-selected", "true");
    expect(panels[0]!.hidden).toBe(true);
    expect(panels[1]!.hidden).toBe(false);
  });

  it("reports the clicked tab value through onTabSelect", () => {
    const onTabSelect = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <TabList defaultSelectedValue="a" onTabSelect={onTabSelect}>
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <Tab value="c">Tab C</Tab>
      </TabList>
    ));
    const tabs = getAllByRole("tab") as HTMLElement[];
    fireEvent.click(tabs[2]!);
    expect(onTabSelect).toHaveBeenCalledTimes(1);
    expect(onTabSelect).toHaveBeenCalledWith({ value: "c" });
  });

  it("keeps a controlled selection in the DOM while reporting the requested value", () => {
    const onTabSelect = vi.fn();
    const { container, getAllByRole } = renderWithFluent(() => (
      <TabList selectedValue="a" onTabSelect={onTabSelect}>
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
      </TabList>
    ));
    const tabs = getAllByRole("tab") as HTMLElement[];
    fireEvent.click(tabs[1]!);
    expect(selectedValue(container)).toContain("Tab A");
    expect(onTabSelect).toHaveBeenCalledWith({ value: "b" });
  });

  it("does not select a disabled tab on click", () => {
    const onTabSelect = vi.fn();
    const { container, getAllByRole } = renderWithFluent(() => (
      <TabList defaultSelectedValue="a" onTabSelect={onTabSelect}>
        <Tab value="a">Tab A</Tab>
        <Tab value="b" disabled>
          Tab B
        </Tab>
      </TabList>
    ));
    const tabs = getAllByRole("tab") as HTMLElement[];
    fireEvent.click(tabs[1]!);
    expect(selectedValue(container)).toContain("Tab A");
    expect(onTabSelect).not.toHaveBeenCalled();
  });

  it("applies size and appearance attributes with horizontal orientation by default", () => {
    const { container } = renderWithFluent(() => (
      <TabList size="large" appearance="subtle">
        <Tab value="a">Tab A</Tab>
      </TabList>
    ));
    const list = container.querySelector('[role="tablist"]')!;
    expect(list).toHaveAttribute("data-size", "large");
    expect(list).toHaveAttribute("data-appearance", "subtle");
    expect(list).toHaveAttribute("aria-orientation", "horizontal");
    expect(list.classList.contains("sf-TabList--vertical")).toBe(false);
  });

  it("puts the first enabled tab in the tab order when the default selection is disabled", async () => {
    const { getAllByRole } = renderWithFluent(() => (
      <TabList defaultSelectedValue="b">
        <Tab value="a">Tab A</Tab>
        <Tab value="b" disabled>
          Tab B
        </Tab>
        <Tab value="c">Tab C</Tab>
      </TabList>
    ));
    const tabs = getAllByRole("tab") as HTMLElement[];
    await waitFor(() => expect(tabs[0]!.tabIndex).toBe(0));
    expect(tabs[1]!.tabIndex).toBe(-1);
    expect(tabs[2]!.tabIndex).toBe(-1);
  });

  it("selects a tab with Space in automatic activation mode", () => {
    const { container, getAllByRole } = renderWithFluent(() => (
      <TabList defaultSelectedValue="a">
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
      </TabList>
    ));
    const tabs = getAllByRole("tab") as HTMLElement[];
    fireEvent.keyDown(tabs[1]!, { key: " " });
    expect(selectedValue(container)).toContain("Tab B");
  });
});
