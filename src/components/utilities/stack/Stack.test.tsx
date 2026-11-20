import { describe, expect, it } from "vitest";
import { Stack, StackItem } from "./Stack";
import { renderWithFluent } from "../../../test-utils/index";

describe("Stack", () => {
  it("renders a vertical stack with items", () => {
    const { container } = renderWithFluent(() => (
      <Stack>
        <StackItem>A</StackItem>
        <StackItem>B</StackItem>
      </Stack>
    ));
    const stack = container.querySelector(".sf-Stack") as HTMLElement;
    expect(stack).toBeTruthy();
    expect(stack.classList.contains("sf-Stack--vertical")).toBe(true);
    expect(stack.children.length).toBe(2);
  });

  it("reflects horizontal layout", () => {
    const { container } = renderWithFluent(() => <Stack horizontal />);
    expect(container.querySelector(".sf-Stack--horizontal")).toBeTruthy();
  });

  it("supports verticalFill and horizontalFill", () => {
    const { container } = renderWithFluent(() => (
      <Stack verticalFill horizontalFill />
    ));
    const stack = container.querySelector(".sf-Stack") as HTMLElement;
    expect(stack.classList.contains("sf-Stack--vertical-fill")).toBe(true);
    expect(stack.classList.contains("sf-Stack--horizontal-fill")).toBe(true);
    expect(stack.style.height).toBe("100%");
    expect(stack.style.width).toBe("100%");
  });

  it("reverses a vertical stack into column-reverse", () => {
    const { container } = renderWithFluent(() => <Stack reversed />);
    const stack = container.querySelector<HTMLElement>(".sf-Stack")!;
    expect(stack.style.flexDirection).toBe("column-reverse");
  });

  it("reverses a horizontal stack into row-reverse", () => {
    const { container } = renderWithFluent(() => <Stack horizontal reversed />);
    const stack = container.querySelector<HTMLElement>(".sf-Stack")!;
    expect(stack.classList.contains("sf-Stack--horizontal")).toBe(true);
    expect(stack.style.flexDirection).toBe("row-reverse");
  });

  it("applies wrap, alignment and token spacing as real styles", () => {
    const { container } = renderWithFluent(() => (
      <Stack
        wrap
        verticalAlign="center"
        horizontalAlign="space-between"
        tokens={{ childrenGap: 8, padding: 4 }}
      />
    ));
    const stack = container.querySelector<HTMLElement>(".sf-Stack")!;
    expect(stack.classList.contains("sf-Stack--wrap")).toBe(true);
    expect(stack.style.alignItems).toBe("center");
    expect(stack.style.justifyContent).toBe("space-between");
    expect(stack.style.gap).toBe("8px");
    expect(stack.style.padding).toBe("4px");
  });

  it("maps StackItem grow, disableShrink, align, class and style", () => {
    const { container } = renderWithFluent(() => (
      <Stack>
        <StackItem grow={2} disableShrink align="center" class="custom" style={{ order: "3" }}>
          A
        </StackItem>
        <StackItem grow>B</StackItem>
      </Stack>
    ));
    const items = container.querySelectorAll<HTMLElement>(".sf-Stack > div");
    expect(items.length).toBe(2);
    expect(items[0]!.classList.contains("custom")).toBe(true);
    // jsdom folds the later flex-shrink:0 back into the flex shorthand.
    expect(items[0]!.style.flex).toBe("2 0 auto");
    expect(items[0]!.style.flexShrink).toBe("0");
    expect(items[0]!.style.alignSelf).toBe("center");
    expect(items[0]!.style.order).toBe("3");
    expect(items[1]!.style.flex).toBe("1 1 auto");
    expect(items[1]!.style.flexShrink).toBe("1");
  });

  it("passes a custom class and overrides inline styles", () => {
    const { container } = renderWithFluent(() => (
      <Stack class="my-stack" style={{ "background-color": "rgb(1, 2, 3)" }} />
    ));
    const stack = container.querySelector<HTMLElement>(".sf-Stack")!;
    expect(stack.classList.contains("my-stack")).toBe(true);
    expect(stack.style.backgroundColor).toBe("rgb(1, 2, 3)");
  });

  it("renders an empty stack without children", () => {
    const { container } = renderWithFluent(() => <Stack />);
    expect(container.querySelector<HTMLElement>(".sf-Stack")!.children.length).toBe(0);
  });
});
