import { createSignal } from "solid-js";
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { InlineDrawer, OverlayDrawer } from "./InlineDrawer";
import { renderWithFluent } from "../../test-utils/index";

describe("InlineDrawer", () => {
  it("renders an inline drawer collapsed by default", () => {
    const { container } = renderWithFluent(() => <InlineDrawer>Content</InlineDrawer>);
    expect(container.querySelector(".sf-InlineDrawer")).toBeTruthy();
    expect(container.querySelector(".sf-InlineDrawer--collapsed")).toBeTruthy();
    // Toggle button is localizable and labelled.
    const button = container.querySelector("button") as HTMLElement;
    expect(button).toHaveAttribute("aria-label", "展开");
    expect(button.textContent).toContain("展开");
  });

  it("supports localised labels and a custom aria-label", () => {
    const { container } = renderWithFluent(() => (
      <InlineDrawer open expandLabel="Open" collapseLabel="Close" aria-label="切换抽屉" />
    ));
    const button = container.querySelector("button") as HTMLElement;
    expect(button.textContent).toContain("Close");
    expect(button).toHaveAttribute("aria-label", "切换抽屉");
  });

  it("toggles open state", () => {
    const onOpenChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <InlineDrawer onOpenChange={onOpenChange} />
    ));
    const button = container.querySelector("button") as HTMLElement;
    fireEvent.click(button);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("OverlayDrawer", () => {
  it("renders a real dialog in a portal with an overlay", () => {
    renderWithFluent(() => (
      <OverlayDrawer open position="end" aria-label="覆盖抽屉">
        <div>Drawer content</div>
      </OverlayDrawer>
    ));
    // Portalled to document.body, not the render container.
    const drawer = document.body.querySelector('aside[role="dialog"]') as HTMLElement;
    expect(drawer).toBeTruthy();
    expect(drawer).toHaveAttribute("aria-modal", "true");
    expect(drawer).toHaveAttribute("aria-label", "覆盖抽屉");
    expect(drawer).toHaveClass("sf-Drawer--end");
    expect(drawer).toHaveAttribute("data-open", "true");
    expect(drawer.textContent).toContain("Drawer content");
    expect(document.body.querySelector(".sf-Overlay")).toBeTruthy();
  });

  it("closes on Escape via onOpenChange", () => {
    const [open, setOpen] = createSignal(true);
    renderWithFluent(() => (
      <OverlayDrawer open={open()} onOpenChange={setOpen} modalType="non-modal" />
    ));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(open()).toBe(false);
    expect(document.body.querySelector('aside[role="dialog"]')).toBeNull();
  });

  it("closes on outside click and supports non-modal (no overlay)", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <OverlayDrawer open onOpenChange={onOpenChange} modalType="non-modal" />
    ));
    expect(document.body.querySelector(".sf-Overlay")).toBeNull();
    // Still closes via Escape when non-modal.
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports controlled positioning and size", () => {
    renderWithFluent(() => (
      <OverlayDrawer open position="end" size={420}>
        <div>content</div>
      </OverlayDrawer>
    ));
    const drawer = document.body.querySelector('aside[role="dialog"]') as HTMLElement;
    expect(drawer).toHaveClass("sf-Drawer--end");
    expect(drawer.style.width).toBe("420px");
  });

  it("traps Tab focus inside a modal overlay drawer", () => {
    renderWithFluent(() => (
      <OverlayDrawer open aria-label="Focus drawer">
        <button>First</button>
        <button>Last</button>
      </OverlayDrawer>
    ));
    const [first, last] = Array.from(document.body.querySelectorAll("button")) as [HTMLButtonElement, HTMLButtonElement];
    expect(document.activeElement).toBe(first);
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
  });

  it("reports each dismissal request for a controlled overlay drawer", () => {
    const [open, setOpen] = createSignal(true);
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <OverlayDrawer
        open={open()}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
      />
    ));
    fireEvent.keyDown(window, { key: "Escape" });
    setOpen(true);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange.mock.calls).toEqual([[false], [false]]);
  });
});

describe("InlineDrawer variants and state", () => {
  it("expands to the configured size and drops the collapsed class when defaultOpen", () => {
    const { container } = renderWithFluent(() => (
      <InlineDrawer defaultOpen size={320}>
        Content
      </InlineDrawer>
    ));
    const aside = container.querySelector(".sf-InlineDrawer")!;
    expect(aside).not.toHaveClass("sf-InlineDrawer--collapsed");
    expect(aside).toHaveStyle({ width: "320px" });
    expect(aside.textContent).toContain("Content");
  });

  it("applies position end and a custom class to the host", () => {
    const { container } = renderWithFluent(() => (
      <InlineDrawer class="my-drawer" position="end" />
    ));
    expect(container.querySelector(".sf-InlineDrawerHost")).toHaveClass("my-drawer");
    expect(container.querySelector(".sf-InlineDrawer")).toHaveClass("sf-InlineDrawer--end");
  });

  it("collapses uncontrolled state on click and reports the new value", () => {
    const onOpenChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <InlineDrawer defaultOpen onOpenChange={onOpenChange} />
    ));
    const aside = container.querySelector(".sf-InlineDrawer")!;
    expect(aside).not.toHaveClass("sf-InlineDrawer--collapsed");
    fireEvent.click(container.querySelector("button")!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(aside).toHaveClass("sf-InlineDrawer--collapsed");
    expect(aside).toHaveStyle({ width: "0px" });
  });

  it("defers to a controlled open prop until the parent updates it", () => {
    const onOpenChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <InlineDrawer open onOpenChange={onOpenChange} />
    ));
    fireEvent.click(container.querySelector("button")!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector(".sf-InlineDrawer")).not.toHaveClass(
      "sf-InlineDrawer--collapsed",
    );
  });
});
