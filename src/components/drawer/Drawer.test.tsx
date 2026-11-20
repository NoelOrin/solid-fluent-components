import { createSignal } from "solid-js";
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerHeaderNavigation,
  DrawerHeaderTitle,
} from "./Drawer";
import { renderWithFluent } from "../../test-utils/index";

describe("Drawer sub-components", () => {
  it("renders header/body/footer and header navigation", () => {
    const onClose = vi.fn();
    renderWithFluent(() => (
      <Drawer open onOpenChange={() => {}}>
        <DrawerHeader onClose={onClose}>Title</DrawerHeader>
        <DrawerBody>Body</DrawerBody>
        <DrawerFooter>Footer</DrawerFooter>
        <DrawerHeaderNavigation>Nav</DrawerHeaderNavigation>
      </Drawer>
    ));
    expect(document.querySelector(".sf-Drawer")).toBeTruthy();
    expect(document.querySelector(".sf-Drawer__headerNavigation")).toBeTruthy();
    expect(document.body.textContent).toContain("Title");
  });

  it("DrawerHeaderTitle is exported from the drawer module", () => {
    expect(typeof DrawerHeaderTitle).toBe("function");
  });

  it("closes a NON-MODAL drawer on Escape", () => {
    const [open, setOpen] = createSignal(true);
    renderWithFluent(() => (
      <Drawer open={open()} onOpenChange={setOpen} modalType="non-modal">
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();
    expect(document.body.querySelector(".sf-Overlay")).toBeNull();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(open()).toBe(false);
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it("closes a modal drawer on Escape", () => {
    const [open, setOpen] = createSignal(true);
    renderWithFluent(() => (
      <Drawer open={open()} onOpenChange={setOpen}>
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(open()).toBe(false);
  });

  it("closes a modal drawer on outside click", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    fireEvent.mouseDown(document.body.querySelector(".sf-Overlay") as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("forwards aria-label / aria-labelledby / aria-describedby to the dialog", () => {
    renderWithFluent(() => (
      <Drawer
        open
        aria-label="我的抽屉"
        aria-labelledby="drawer-heading"
        aria-describedby="drawer-desc"
      >
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    const drawer = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(drawer).toHaveAttribute("aria-label", "我的抽屉");
    expect(drawer).toHaveAttribute("aria-labelledby", "drawer-heading");
    expect(drawer).toHaveAttribute("aria-describedby", "drawer-desc");
  });

  it("applies position, numeric size and custom class variants to the drawer", () => {
    renderWithFluent(() => (
      <Drawer open position="end" size={360} class="my-drawer">
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    const drawer = document.body.querySelector('aside[role="dialog"]')!;
    expect(drawer).toHaveClass("sf-Drawer--end");
    expect(drawer).toHaveClass("my-drawer");
    expect(drawer).toHaveStyle({ width: "360px" });
  });

  it("defaults to start position and accepts a string size", () => {
    renderWithFluent(() => (
      <Drawer open size="20rem">
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    const drawer = document.body.querySelector('aside[role="dialog"]')!;
    expect(drawer).toHaveClass("sf-Drawer--start");
    expect(drawer).toHaveStyle({ width: "20rem" });
  });

  it("traps Tab focus inside a modal drawer", () => {
    renderWithFluent(() => (
      <Drawer open>
        <DrawerBody>
          <button>First</button>
          <button>Last</button>
        </DrawerBody>
      </Drawer>
    ));
    const [first, last] = Array.from(document.body.querySelectorAll("button")) as [HTMLButtonElement, HTMLButtonElement];
    expect(document.activeElement).toBe(first);
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
  });

  it("supports uncontrolled defaultOpen", () => {
    renderWithFluent(() => (
      <Drawer defaultOpen>
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    expect(document.body.querySelector('aside[role="dialog"]')).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.querySelector('aside[role="dialog"]')).toBeNull();
  });

  it("reports each dismissal through onOpenChange with controlled state", () => {
    const [open, setOpen] = createSignal(true);
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <Drawer
        open={open()}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
      >
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    fireEvent.keyDown(window, { key: "Escape" });
    setOpen(true);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange.mock.calls).toEqual([[false], [false]]);
  });

  it("DrawerHeader close button calls its onClose handler", () => {
    const onClose = vi.fn();
    renderWithFluent(() => (
      <Drawer open onOpenChange={() => {}}>
        <DrawerHeader onClose={onClose}>Title</DrawerHeader>
      </Drawer>
    ));
    fireEvent.click(document.querySelector('[aria-label="Close"]') as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sets aria-modal for modal drawers only", () => {
    const modal = renderWithFluent(() => (
      <Drawer open>
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    expect(document.body.querySelector('aside[role="dialog"]')).toHaveAttribute(
      "aria-modal",
      "true",
    );
    modal.unmount();

    renderWithFluent(() => (
      <Drawer open modalType="non-modal">
        <DrawerBody>Body</DrawerBody>
      </Drawer>
    ));
    expect(document.body.querySelector('aside[role="dialog"]')).not.toHaveAttribute("aria-modal");
  });
});
