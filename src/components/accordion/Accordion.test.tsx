import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "./Accordion";
import { renderWithFluent } from "../../test-utils/index";

describe("Accordion", () => {
  it("renders an accordion with sub-components", () => {
    const { container } = renderWithFluent(() => (
      <Accordion defaultOpenItems={["a"]}>
        <AccordionItem value="a">
          <AccordionHeader>Head</AccordionHeader>
          <AccordionPanel>Body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    expect(container.querySelector(".sf-Accordion")).toBeTruthy();
    expect(container.querySelector(".sf-AccordionItem")).toBeTruthy();
    expect(container.querySelector(".sf-AccordionHeader")).toBeTruthy();
    expect(container.querySelector(".sf-AccordionPanel")).toBeTruthy();
  });

  it("exposes aria-expanded on the header", () => {
    const { getByRole } = renderWithFluent(() => (
      <Accordion collapsible defaultOpenItems={["a"]}>
        <AccordionItem value="a">
          <AccordionHeader>Head</AccordionHeader>
          <AccordionPanel>Body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    expect(getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("does not expand a disabled item", () => {
    const onToggle = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Accordion onToggle={onToggle}>
        <AccordionItem value="a" disabled>
          <AccordionHeader>Disabled</AccordionHeader>
          <AccordionPanel>Body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const header = getByRole("button", { name: "Disabled" }) as HTMLButtonElement;
    expect(header.disabled).toBe(true);
    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector(".sf-AccordionPanel")?.hasAttribute("hidden")).toBe(true);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("links header and panel with aria-controls / aria-labelledby and region role", () => {
    const { container } = renderWithFluent(() => (
      <Accordion defaultOpenItems={["a"]}>
        <AccordionItem value="a">
          <AccordionHeader>Head</AccordionHeader>
          <AccordionPanel>Body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const header = container.querySelector(".sf-AccordionHeader")!;
    const panel = container.querySelector(".sf-AccordionPanel")!;
    expect(header.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("aria-labelledby")).toBe(header.id);
  });

  it("honours expandIconPosition and multiple + collapsible={false}", () => {
    const { container, getAllByRole } = renderWithFluent(() => (
      <Accordion multiple collapsible={false} defaultOpenItems={["a"]}>
        <AccordionItem value="a">
          <AccordionHeader expandIconPosition="end">A</AccordionHeader>
          <AccordionPanel>A body</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>B</AccordionHeader>
          <AccordionPanel>B body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const headerA = container.querySelector(".sf-AccordionHeader")!;
    expect(headerA.getAttribute("data-expand-icon-position")).toBe("end");
    expect(headerA.lastElementChild?.classList.contains("sf-AccordionHeader__icon")).toBe(true);

    const [headerAElement, headerB] = getAllByRole("button") as HTMLElement[];
    fireEvent.click(headerB!); // b opens → a + b open
    fireEvent.click(headerB!); // b collapses while another item stays open
    expect(headerB).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(headerAElement!); // a is the last open item and must stay open
    expect(headerAElement).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking a header toggles panel visibility and the expand icon", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Accordion>
        <AccordionItem value="a">
          <AccordionHeader>A</AccordionHeader>
          <AccordionPanel>Body A</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const header = getByRole("button");
    const panel = container.querySelector<HTMLElement>(".sf-AccordionPanel")!;
    const icon = header.querySelector<HTMLElement>(".sf-AccordionHeader__icon")!;

    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(panel.hidden).toBe(true);
    expect(panel.textContent).toBe("");
    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(panel.hidden).toBe(false);
    expect(panel.textContent).toContain("Body A");
    expect(icon).toHaveAttribute("data-open", "true");

    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(panel.hidden).toBe(true);
    expect(icon).not.toHaveAttribute("data-open");
  });

  it("closes the previously open item in single-expand mode", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <Accordion>
        <AccordionItem value="a">
          <AccordionHeader>A</AccordionHeader>
          <AccordionPanel>A body</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>B</AccordionHeader>
          <AccordionPanel>B body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const [a, b] = getAllByRole("button") as HTMLElement[];
    fireEvent.click(a!);
    expect(a).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(b!);
    expect(a).toHaveAttribute("aria-expanded", "false");
    expect(b).toHaveAttribute("aria-expanded", "true");
  });

  it("reports the value and resulting open items through onToggle", () => {
    const onToggle = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <Accordion multiple onToggle={onToggle}>
        <AccordionItem value="a">
          <AccordionHeader>A</AccordionHeader>
          <AccordionPanel>A body</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>B</AccordionHeader>
          <AccordionPanel>B body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const [a, b] = getAllByRole("button") as HTMLElement[];
    fireEvent.click(a!);
    fireEvent.click(b!);
    expect(onToggle).toHaveBeenNthCalledWith(1, { value: "a", openItems: ["a"] });
    expect(onToggle).toHaveBeenNthCalledWith(2, { value: "b", openItems: ["a", "b"] });
  });

  it("keeps a controlled openItems value in the DOM while reporting the requested change", () => {
    const onToggle = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <Accordion openItems={["a"]} onToggle={onToggle}>
        <AccordionItem value="a">
          <AccordionHeader>A</AccordionHeader>
          <AccordionPanel>A body</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>B</AccordionHeader>
          <AccordionPanel>B body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const [a, b] = getAllByRole("button") as HTMLElement[];
    fireEvent.click(b!);
    expect(a).toHaveAttribute("aria-expanded", "true");
    expect(b).toHaveAttribute("aria-expanded", "false");
    expect(onToggle).toHaveBeenCalledWith({ value: "b", openItems: ["b"] });
  });

  it("keeps the last open item expanded when collapsible is false in single mode", () => {
    const { getByRole } = renderWithFluent(() => (
      <Accordion collapsible={false} defaultOpenItems={["a"]}>
        <AccordionItem value="a">
          <AccordionHeader>A</AccordionHeader>
          <AccordionPanel>A body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const header = getByRole("button");
    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
  });

  it("renders an empty accordion container when there are no items", () => {
    const { container } = renderWithFluent(() => <Accordion />);
    expect(container.querySelector(".sf-Accordion")).toBeTruthy();
    expect(container.querySelectorAll(".sf-AccordionHeader").length).toBe(0);
  });

  it("keeps only enabled headers focusable as native buttons", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <Accordion>
        <AccordionItem value="a" disabled>
          <AccordionHeader>A</AccordionHeader>
          <AccordionPanel>A body</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>B</AccordionHeader>
          <AccordionPanel>B body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const [disabled, enabled] = getAllByRole("button") as [HTMLButtonElement, HTMLButtonElement];
    expect(disabled.tagName).toBe("BUTTON");
    expect(disabled.type).toBe("button");
    expect(enabled.tagName).toBe("BUTTON");
    disabled.focus();
    expect(document.activeElement).not.toBe(disabled);
    enabled.focus();
    expect(document.activeElement).toBe(enabled);
  });
});
