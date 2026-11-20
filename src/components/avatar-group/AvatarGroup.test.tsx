import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import {
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  partitionAvatarGroupItems,
} from "./AvatarGroup";
import { renderWithFluent } from "../../test-utils/index";

const items = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }] as any[];

describe("AvatarGroup sub-components", () => {
  it("renders group and partition helper", () => {
    const { container } = renderWithFluent(() => (
      <AvatarGroup items={items} maxInlineItems={2} />
    ));
    expect(container.querySelector(".sf-AvatarGroup")).toBeTruthy();
    expect(container.querySelector(".sf-AvatarGroup__overflow")?.textContent).toContain("+2");

    const partitioned = partitionAvatarGroupItems({ items, maxInlineItems: 2 });
    expect(partitioned.inlineItems.length).toBe(2);
    expect(partitioned.overflowItems.length).toBe(2);
  });

  it("AvatarGroupItem and Popover render", () => {
    const { container } = renderWithFluent(() => (
      <>
        <AvatarGroupItem name="X" />
        <AvatarGroupPopover>More</AvatarGroupPopover>
      </>
    ));
    expect(container.querySelector(".sf-Avatar")).toBeTruthy();
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain("More");
  });

  it("defaults to the spread layout and exposes a layout hook", () => {
    const { container } = renderWithFluent(() => <AvatarGroup items={items} />);
    const root = container.querySelector(".sf-AvatarGroup") as HTMLElement;
    expect(root).toHaveClass("sf-AvatarGroup--spread");
    expect(root).toHaveAttribute("data-layout", "spread");
  });

  it("renders a focusable overflow button with an aria-label", () => {
    const { getByRole } = renderWithFluent(() => (
      <AvatarGroup items={items} maxInlineItems={2} />
    ));
    const overflow = getByRole("button", { name: "2 more people" });
    expect(overflow.tagName).toBe("BUTTON");
    expect(overflow).toHaveAttribute("type", "button");
    expect(overflow).toHaveAttribute("aria-haspopup", "dialog");
    expect(overflow).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the popover from the overflow button", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <AvatarGroup
        items={items}
        maxInlineItems={2}
        overflowContent={<span data-testid="overflow-content">Everyone</span>}
      />
    ));
    expect(container.querySelector('[data-testid="overflow-content"]')).toBeNull();
    const overflow = getByRole("button", { name: "2 more people" });
    fireEvent.click(overflow);
    expect(overflow).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector('[data-testid="overflow-content"]')?.textContent).toContain("Everyone");
  });

  it("exposes a pie layout hook", () => {
    const { container } = renderWithFluent(() => (
      <AvatarGroup items={items} layout="pie" />
    ));
    const root = container.querySelector(".sf-AvatarGroup") as HTMLElement;
    expect(root).toHaveClass("sf-AvatarGroup--pie");
    expect(root).toHaveAttribute("data-layout", "pie");
  });

  it("repeated clicks toggle the popover and keep aria-expanded in sync", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <AvatarGroup
        items={items}
        maxInlineItems={2}
        overflowContent={<span data-testid="content">List</span>}
      />
    ));
    const overflow = getByRole("button", { name: "2 more people" });
    const dialog = () => container.querySelector('[role="dialog"]');

    fireEvent.click(overflow);
    expect(overflow).toHaveAttribute("aria-expanded", "true");
    expect(dialog()).toBeTruthy();

    fireEvent.click(overflow);
    expect(overflow).toHaveAttribute("aria-expanded", "false");
    expect(dialog()).toBeNull();

    fireEvent.click(overflow);
    expect(overflow).toHaveAttribute("aria-expanded", "true");
    expect(dialog()).toBeTruthy();
  });

  it("uses a singular label when exactly one person overflows", () => {
    const { getByRole } = renderWithFluent(() => (
      <AvatarGroup items={items} maxInlineItems={3} />
    ));
    expect(getByRole("button", { name: "1 more person" })).toBeTruthy();
  });

  it("defaults maxInlineItems to three and reports the overflow count", () => {
    const { container, getAllByRole } = renderWithFluent(() => (
      <AvatarGroup items={items} />
    ));
    const root = container.querySelector(".sf-AvatarGroup") as HTMLElement;
    expect(root).toHaveAttribute("data-overflow-count", "1");
    expect(getAllByRole("img").length).toBe(3);
  });

  it("passes the size prop to inline avatars and the overflow button", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <AvatarGroup items={items} maxInlineItems={1} size={48} />
    ));
    const inline = container.querySelector(".sf-Avatar__initials")?.closest(".sf-Avatar") as HTMLElement;
    expect(inline).toHaveClass("sf-Avatar--48");
    const overflow = getByRole("button", { name: "3 more people" });
    expect(overflow).toHaveClass("sf-Avatar--48");
    expect(overflow).toHaveAttribute("data-size", "48");
  });

  it("renders no overflow button when all items fit", () => {
    const { container, queryByRole } = renderWithFluent(() => (
      <AvatarGroup items={items} maxInlineItems={10} />
    ));
    expect(queryByRole("button")).toBeNull();
    expect(container.querySelector(".sf-AvatarGroup")).toHaveAttribute("data-overflow-count", "0");
  });

  it("falls back to children when no items are provided", () => {
    const { container, getByTestId } = renderWithFluent(() => (
      <AvatarGroup>
        <span data-testid="child">Child</span>
      </AvatarGroup>
    ));
    expect(getByTestId("child").textContent).toBe("Child");
    expect(container.querySelector(".sf-AvatarGroup__overflow")).toBeNull();
  });

  it("supports the stack layout and a custom group aria-label", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <AvatarGroup items={items} layout="stack" aria-label="Team members" />
    ));
    const root = container.querySelector(".sf-AvatarGroup") as HTMLElement;
    expect(root).toHaveClass("sf-AvatarGroup--stack");
    expect(root).toHaveAttribute("data-layout", "stack");
    expect(getByRole("group", { name: "Team members" })).toBeTruthy();
  });

  it("partitionAvatarGroupItems handles empty input and default max", () => {
    expect(partitionAvatarGroupItems({ items: [] })).toEqual({
      inlineItems: [],
      overflowItems: [],
    });
    expect(partitionAvatarGroupItems({ items })).toEqual({
      inlineItems: items,
      overflowItems: [],
    });
  });
});
