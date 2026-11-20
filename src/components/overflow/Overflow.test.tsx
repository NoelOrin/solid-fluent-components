import { describe, expect, it } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import {
  Overflow,
  OverflowDivider,
  OverflowItem,
  OverflowMenu,
  DATA_OVERFLOW_DIVIDER,
  DATA_OVERFLOW_ITEM,
  DATA_OVERFLOW_MENU,
  DATA_OVERFLOWING,
} from "./Overflow";
import { renderWithFluent } from "../../test-utils/index";

describe("Overflow sub-components", () => {
  it("renders items and overflow divider with data attributes", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Overflow
          items={[{ id: "1", content: <span>One</span> }, { id: "2", content: <span>Two</span> }]}
        />
        <OverflowDivider>sep</OverflowDivider>
        <OverflowItem id="x">Item</OverflowItem>
        <OverflowMenu>menu</OverflowMenu>
      </>
    ));
    expect(container.querySelector(".sf-Overflow")).toBeTruthy();
    expect(container.querySelector(".sf-Overflow__divider")).toBeTruthy();
    expect(
      container.querySelector(".sf-Overflow__divider")!.hasAttribute(DATA_OVERFLOW_DIVIDER),
    ).toBe(true);
    expect(container.querySelector(`.sf-Overflow__item`)!.hasAttribute(DATA_OVERFLOW_ITEM)).toBe(true);
    expect(container.querySelector(".sf-Overflow__menu")!.hasAttribute(DATA_OVERFLOW_MENU)).toBe(true);
  });

  it("exports overflow data attribute constants", () => {
    expect(DATA_OVERFLOW_ITEM).toBe("data-overflow-item");
    expect(DATA_OVERFLOW_MENU).toBe("data-overflow-menu");
    expect(DATA_OVERFLOWING).toBe("data-overflowing");
  });

  it("accepts composed children and marks overflowing items", async () => {
    const { container } = renderWithFluent(() => (
      <Overflow minimumVisible={1}>
        <OverflowItem id="a">A</OverflowItem>
        <OverflowItem id="b">B</OverflowItem>
        <OverflowItem id="c">C</OverflowItem>
      </Overflow>
    ));

    const items = Array.from(container.querySelectorAll<HTMLElement>(`[${DATA_OVERFLOW_ITEM}]`));
    expect(items.length).toBe(3);
    await waitFor(() => expect(items.some((el) => el.hasAttribute(DATA_OVERFLOWING))).toBe(true));
    expect(container.querySelector(".sf-Overflow")).toHaveAttribute(DATA_OVERFLOWING, "true");
    expect(container.querySelector(`button[${DATA_OVERFLOW_MENU}]`)).toBeTruthy();
  });

  it("renders items from the items prop sorted by descending priority", () => {
    const { container } = renderWithFluent(() => (
      <Overflow
        items={[
          { id: "low", content: <span>Low</span>, priority: 0 },
          { id: "high", content: <span>High</span>, priority: 10 },
          { id: "mid", content: <span>Mid</span>, priority: 5 },
        ]}
      />
    ));
    const rendered = Array.from(
      container.querySelectorAll<HTMLElement>(`[${DATA_OVERFLOW_ITEM}]`),
    );
    expect(rendered.map((el) => el.getAttribute("data-overflow-id"))).toEqual([
      "high",
      "mid",
      "low",
    ]);
  });

  it("renders no overflow menu for an empty item set", () => {
    const { container } = renderWithFluent(() => <Overflow items={[]} />);
    expect(container.querySelector(".sf-Overflow__menu")).toBeNull();
    expect(container.querySelector(".sf-Overflow")!.hasAttribute(DATA_OVERFLOWING)).toBe(false);
  });

  it("applies a custom class and gives the divider a separator role", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Overflow class="my-overflow" />
        <OverflowDivider class="my-divider">sep</OverflowDivider>
      </>
    ));
    expect(container.querySelector(".sf-Overflow")!.classList.contains("my-overflow")).toBe(true);
    const divider = container.querySelector<HTMLElement>(".sf-Overflow__divider")!;
    expect(divider.classList.contains("my-divider")).toBe(true);
    expect(divider).toHaveAttribute("role", "separator");
  });

  it("opens the overflow menu and lists the hidden items with menu ARIA", async () => {
    const { container } = renderWithFluent(() => (
      <Overflow
        minimumVisible={1}
        items={[
          { id: "a", content: <span>A</span> },
          { id: "b", content: <span>B</span>, menuContent: <span>Menu B</span> },
          { id: "c", content: <span>C</span> },
        ]}
      />
    ));
    const menuButton = container.querySelector<HTMLButtonElement>(".sf-Overflow__menu")!;
    expect(menuButton.textContent).toContain("+2");
    await waitFor(() => expect(menuButton).toHaveAttribute("aria-haspopup", "menu"));

    fireEvent.click(menuButton);
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="menuitem"]').length).toBe(2),
    );
    const labels = Array.from(document.body.querySelectorAll('[role="menuitem"]')).map(
      (el) => el.textContent,
    );
    expect(labels[0]).toContain("Menu B");
    expect(labels[1]).toContain("C");
    await waitFor(() => expect(menuButton).toHaveAttribute("aria-expanded", "true"));
  });

  it("closes the overflow menu when Escape is pressed", async () => {
    const { container } = renderWithFluent(() => (
      <Overflow
        minimumVisible={1}
        items={[
          { id: "a", content: <span>A</span> },
          { id: "b", content: <span>B</span> },
          { id: "c", content: <span>C</span> },
        ]}
      />
    ));
    const menuButton = container.querySelector<HTMLButtonElement>(".sf-Overflow__menu")!;
    fireEvent.click(menuButton);
    await waitFor(() =>
      expect(document.body.querySelector('[role="menuitem"]')).toBeTruthy(),
    );
    fireEvent.keyDown(document.body, { key: "Escape" });
    await waitFor(() =>
      expect(document.body.querySelector('[role="menuitem"]')).toBeNull(),
    );
    await waitFor(() => expect(menuButton).toHaveAttribute("aria-expanded", "false"));
  });
});
