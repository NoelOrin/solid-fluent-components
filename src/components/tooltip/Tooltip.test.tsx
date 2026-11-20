import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Tooltip } from "./Tooltip";
import { renderWithFluent } from "../../test-utils/index";

const { computePositionMock } = vi.hoisted(() => ({
  computePositionMock: vi.fn(async (..._args: unknown[]) => ({ x: 12, y: 34 })),
}));
vi.mock("@floating-ui/dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@floating-ui/dom")>();
  return {
    ...actual,
    computePosition: (...args: unknown[]) => computePositionMock(...args),
    autoUpdate: () => () => {},
  };
});

describe("Tooltip", () => {
  it("renders a visible tooltip in a portal", () => {
    renderWithFluent(() => (
      <Tooltip visible content="Helpful text">
        <button>Help</button>
      </Tooltip>
    ));
    const tooltip = document.body.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveClass("sf-Tooltip");
    expect(tooltip?.textContent).toContain("Helpful text");
  });

  it("associates the trigger via aria-labelledby for relationship=label", () => {
    renderWithFluent(() => (
      <Tooltip visible relationship="label" content="Label text">
        <button>Help</button>
      </Tooltip>
    ));
    const tooltip = document.body.querySelector('[role="tooltip"]')!;
    const button = document.body.querySelector("button")!;
    expect(tooltip.id).toMatch(/^sf-tooltip/);
    expect(button).toHaveAttribute("aria-labelledby", tooltip.id);
    expect(button).not.toHaveAttribute("aria-describedby");
  });

  it("associates the trigger via aria-describedby for relationship=description", () => {
    renderWithFluent(() => (
      <Tooltip visible relationship="description" content="Description text">
        <button>Help</button>
      </Tooltip>
    ));
    const tooltip = document.body.querySelector('[role="tooltip"]')!;
    const button = document.body.querySelector("button")!;
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);
    expect(button).not.toHaveAttribute("aria-labelledby");
  });

  it("does not add aria relationships for relationship=inaccessible", () => {
    renderWithFluent(() => (
      <Tooltip visible relationship="inaccessible" content="Hidden from AT">
        <button>Help</button>
      </Tooltip>
    ));
    const button = document.body.querySelector("button")!;
    expect(button).not.toHaveAttribute("aria-labelledby");
    expect(button).not.toHaveAttribute("aria-describedby");
  });

  it("maps object positioning { position, align } to a floating-ui placement", () => {
    computePositionMock.mockClear();
    renderWithFluent(() => (
      <Tooltip visible positioning={{ position: "below", align: "end" }} content="x">
        <button>Help</button>
      </Tooltip>
    ));
    expect(computePositionMock).toHaveBeenCalled();
    const options = computePositionMock.mock.calls[0]?.[2] as { placement: string };
    expect(options.placement).toBe("bottom-end");
  });

  it("keeps the legacy string positioning form working", () => {
    computePositionMock.mockClear();
    renderWithFluent(() => (
      <Tooltip visible positioning="after" content="x">
        <button>Help</button>
      </Tooltip>
    ));
    const options = computePositionMock.mock.calls[0]?.[2] as { placement: string };
    expect(options.placement).toBe("right");
  });

  it("renders an arrow when withArrow is set", () => {
    renderWithFluent(() => (
      <Tooltip visible withArrow content="x">
        <button>Help</button>
      </Tooltip>
    ));
    expect(document.body.querySelector(".sf-Tooltip__arrow")).toBeTruthy();
  });

  it("honors delay and reports visibility changes", () => {
    vi.useFakeTimers();
    try {
      const onVisibleChange = vi.fn();
      const { container } = renderWithFluent(() => (
        <Tooltip content="Delayed" delay={100} onVisibleChange={onVisibleChange}>
          <button>Help</button>
        </Tooltip>
      ));
      const triggerWrap = container.querySelector("button")!.parentElement!;
      fireEvent.mouseEnter(triggerWrap);
      expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
      vi.advanceTimersByTime(100);
      expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
      expect(onVisibleChange).toHaveBeenCalledWith(true);
      fireEvent.mouseLeave(triggerWrap);
      expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
      expect(onVisibleChange).toHaveBeenCalledWith(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes on Escape", () => {
    const { container } = renderWithFluent(() => (
      <Tooltip content="Esc">
        <button>Help</button>
      </Tooltip>
    ));
    const triggerWrap = container.querySelector("button")!.parentElement!;
    fireEvent.mouseEnter(triggerWrap);
    expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("shows and hides on focus and blur of the trigger", () => {
    const { container } = renderWithFluent(() => (
      <Tooltip content="Focus tip">
        <button>Help</button>
      </Tooltip>
    ));
    const triggerWrap = container.querySelector("button")!.parentElement!;
    fireEvent.focusIn(triggerWrap);
    expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
    fireEvent.focusOut(triggerWrap);
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("applies a custom class to the tooltip element", () => {
    renderWithFluent(() => (
      <Tooltip visible class="my-tooltip" content="Classy">
        <button>Help</button>
      </Tooltip>
    ));
    expect(document.body.querySelector('[role="tooltip"]')).toHaveClass("my-tooltip");
  });

  it("uses aria-describedby by default when relationship is omitted", () => {
    renderWithFluent(() => (
      <Tooltip visible content="Default">
        <button>Help</button>
      </Tooltip>
    ));
    const tooltip = document.body.querySelector('[role="tooltip"]')!;
    const button = document.body.querySelector("button")!;
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);
    expect(button).not.toHaveAttribute("aria-labelledby");
  });

  it("does not render an arrow when withArrow is absent", () => {
    renderWithFluent(() => (
      <Tooltip visible content="No arrow">
        <button>Help</button>
      </Tooltip>
    ));
    expect(document.body.querySelector(".sf-Tooltip__arrow")).toBeNull();
  });

  it("keeps a controlled-visible tooltip open while reporting an Escape close request", () => {
    const onVisibleChange = vi.fn();
    renderWithFluent(() => (
      <Tooltip visible content="Locked" onVisibleChange={onVisibleChange}>
        <button>Help</button>
      </Tooltip>
    ));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy();
    expect(onVisibleChange).toHaveBeenCalledWith(false);
  });

  it("can be reopened after being dismissed by hover", () => {
    const { container } = renderWithFluent(() => (
      <Tooltip content="Toggle">
        <button>Help</button>
      </Tooltip>
    ));
    const triggerWrap = container.querySelector("button")!.parentElement!;
    fireEvent.mouseEnter(triggerWrap);
    fireEvent.mouseLeave(triggerWrap);
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
    fireEvent.mouseEnter(triggerWrap);
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toContain("Toggle");
  });
});
