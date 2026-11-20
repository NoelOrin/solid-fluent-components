import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  partitionBreadcrumbItems,
} from "./Breadcrumb";
import { renderWithFluent } from "../../test-utils/index";

describe("Breadcrumb sub-components", () => {
  it("renders items as an ordered list in the given order", () => {
    const { container } = renderWithFluent(() => (
      <Breadcrumb
        items={[
          { children: "Home" },
          { children: "Lib" },
          { children: "File", current: true },
        ]}
      />
    ));
    const items = Array.from(container.querySelectorAll<HTMLElement>(".sf-Breadcrumb__item"));
    expect(items.map((item) => item.textContent)).toEqual(["Home", "Lib", "File"]);
  });

  it("marks the current item with aria-current=page", () => {
    const { container } = renderWithFluent(() => (
      <Breadcrumb
        items={[
          { key: "home", children: "Home", href: "#" },
          { key: "file", children: "File", current: true },
        ]}
      />
    ));
    const current = container.querySelector('[aria-current="page"]')!;
    expect(current.textContent).toContain("File");
    expect(current.getAttribute("data-key")).toBe("file");
    expect(container.querySelectorAll('[aria-current="page"]').length).toBe(1);
    expect(container.querySelector('[data-key="home"]')?.getAttribute("aria-current")).toBeNull();
  });

  it("renders presentational separators", () => {
    const { container } = renderWithFluent(() => (
      <Breadcrumb items={[{ children: "A" }, { children: "B" }]} />
    ));
    const separator = container.querySelector(".sf-Breadcrumb__separator")!;
    expect(separator.getAttribute("role")).toBe("presentation");
    expect(separator.getAttribute("aria-hidden")).toBe("true");
  });

  it("exposes aria-current on compound current items", () => {
    const { container } = renderWithFluent(() => (
      <nav aria-label="Breadcrumb">
        <ol class="sf-Breadcrumb">
          <BreadcrumbItem>
            <BreadcrumbButton href="#home">Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem current>
            <BreadcrumbButton current>Current</BreadcrumbButton>
          </BreadcrumbItem>
        </ol>
      </nav>
    ));
    expect(container.querySelector(".sf-Breadcrumb__separator")).toHaveAttribute("role", "presentation");
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain("Current");
  });

  it("uses the children fallback and an accessible nav label", () => {
    const { container } = renderWithFluent(() => (
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>
    ));
    const nav = container.querySelector("nav")!;
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
    expect(nav.querySelector(".sf-Breadcrumb__item")?.textContent).toBe("Home");
  });

  it("fires onClick when a non-current item is clicked", () => {
    const onClick = vi.fn();
    const { container } = renderWithFluent(() => (
      <Breadcrumb
        items={[
          { children: "Home", onClick },
          { children: "End", current: true },
        ]}
      />
    ));
    const linkButton = container.querySelector<HTMLElement>(".sf-Breadcrumb__item button")!;
    expect(linkButton.tagName).toBe("BUTTON");
    fireEvent.click(linkButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a custom divider only between items", () => {
    const { container } = renderWithFluent(() => (
      <Breadcrumb
        divider={<span>|</span>}
        items={[{ children: "A" }, { children: "B" }, { children: "C" }]}
      />
    ));
    const separators = Array.from(container.querySelectorAll(".sf-Breadcrumb__separator"));
    expect(separators.map((el) => el.textContent)).toEqual(["|", "|"]);
    expect(container.querySelector(".sf-Breadcrumb")?.lastElementChild?.classList.contains("sf-Breadcrumb__item")).toBe(true);
  });

  it("keeps the current item as non-interactive text", () => {
    const { container } = renderWithFluent(() => (
      <Breadcrumb items={[{ children: "Home", href: "#home" }, { children: "Here", current: true }]} />
    ));
    const current = container.querySelector<HTMLElement>('[aria-current="page"]')!;
    expect(current.querySelector("a")).toBeNull();
    expect(current.querySelector("button")).toBeNull();
    expect(current.textContent).toBe("Here");
  });

  it("partitions overflowing items into inline, overflow and end groups", () => {
    const result = partitionBreadcrumbItems({
      items: [{ children: "A" }, { children: "B" }, { children: "C" }, { children: "D" }, { children: "E" }],
      maxDisplayedItems: 3,
      overflowIndex: 1,
    });
    expect(result.inlineItems.map((i) => i.children)).toEqual(["A"]);
    expect(result.overflowItems.map((i) => i.children)).toEqual(["B", "C"]);
    expect(result.endDisplayedItems.map((i) => i.children)).toEqual(["D", "E"]);
  });

  it("keeps all items inline when they fit in maxDisplayedItems", () => {
    const items = [{ children: "A" }, { children: "B" }];
    const result = partitionBreadcrumbItems({ items, maxDisplayedItems: 5 });
    expect(result.inlineItems).toBe(items);
    expect(result.overflowItems).toEqual([]);
    expect(result.endDisplayedItems).toEqual([]);
  });

  it("renders no items or separators for empty data", () => {
    const { container } = renderWithFluent(() => <Breadcrumb items={[]} />);
    expect(container.querySelectorAll(".sf-Breadcrumb__item").length).toBe(0);
    expect(container.querySelectorAll(".sf-Breadcrumb__separator").length).toBe(0);
  });
});
