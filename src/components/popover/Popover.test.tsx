import { describe, expect, it, vi } from "vitest";
import { fireEvent, within } from "@solidjs/testing-library";
import {
  Popover,
  PopoverProvider,
  PopoverTrigger,
  PopoverSurface,
} from "./Popover";
import { renderWithFluent } from "../../test-utils/index";

describe("Popover", () => {
  it("renders a trigger and a dialog surface", () => {
    const { getByRole } = renderWithFluent(() => (
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeTruthy();
    expect(getByRole("button", { name: "Open" })).toBeTruthy();
  });

  it("adds aria-haspopup and toggles aria-expanded on the trigger", () => {
    const { getByRole } = renderWithFluent(() => (
      <Popover>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    const button = getByRole("button", { name: "Open" });
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeTruthy();
  });

  it("disableButtonEnhancement skips aria attributes", () => {
    const { getByRole } = renderWithFluent(() => (
      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    const button = getByRole("button", { name: "Open" });
    expect(button).not.toHaveAttribute("aria-haspopup");
    expect(button).not.toHaveAttribute("aria-expanded");
  });

  it("PopoverSurface supports size, withArrow and aria-label", () => {
    renderWithFluent(() => (
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface size="large" withArrow aria-label="Details">
          Content
        </PopoverSurface>
      </Popover>
    ));
    const surface = document.body.querySelector(".sf-PopoverSurface")!;
    expect(surface).toHaveClass("sf-PopoverSurface--size-large");
    expect(surface).toHaveAttribute("aria-label", "Details");
    expect(surface.querySelector(".sf-PopoverSurface__arrow")).toBeTruthy();
  });

  it("PopoverProvider provides a working context", () => {
    const { getByRole } = renderWithFluent(() => (
      <PopoverProvider defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>From provider</PopoverSurface>
      </PopoverProvider>
    ));
    const dialog = within(document.body).getByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog.textContent).toContain("From provider");
  });

  it("closes on Escape", () => {
    const { getByRole } = renderWithFluent(() => (
      <Popover>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeTruthy();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeNull();
  });

  it("toggles with Enter and Space on the trigger wrapper", () => {
    const { getByRole } = renderWithFluent(() => (
      <Popover>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    const button = getByRole("button", { name: "Open" });
    const wrap = button.parentElement as HTMLElement;
    fireEvent.keyDown(wrap, { key: "Enter" });
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeTruthy();
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(wrap, { key: " " });
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeNull();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on a mousedown outside the surface and trigger", () => {
    const { getByRole } = renderWithFluent(() => (
      <Popover>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeNull();
  });

  it("supports uncontrolled defaultOpen and reports state changes", () => {
    const onOpenChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeTruthy();
    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("defers to a controlled open prop until the parent updates it", () => {
    const onOpenChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Popover open onOpenChange={onOpenChange}>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.body.querySelector(".sf-PopoverSurface")).toBeTruthy();
  });

  it("applies size, custom class and tabIndex to the surface", () => {
    renderWithFluent(() => (
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverSurface size="small" class="my-surface" tabIndex={3}>
          Content
        </PopoverSurface>
      </Popover>
    ));
    const surface = document.body.querySelector(".sf-PopoverSurface")!;
    expect(surface).toHaveClass("sf-PopoverSurface--size-small");
    expect(surface).toHaveClass("my-surface");
    expect(surface).toHaveAttribute("tabindex", "3");
  });
});
