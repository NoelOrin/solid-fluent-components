import { createSignal } from "solid-js";
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogTrigger,
} from "./Dialog";
import { renderWithFluent } from "../../test-utils/index";

describe("Dialog", () => {
  it("renders a modal dialog surface when open", () => {
    renderWithFluent(() => (
      <Dialog open modalType="modal">
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Title</DialogTitle>
            <DialogActions>Actions</DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    ));
    expect(document.body.querySelector(".sf-Dialog")).toBeTruthy();
    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("closes a NON-MODAL dialog on Escape", () => {
    const [open, setOpen] = createSignal(true);
    renderWithFluent(() => (
      <Dialog open={open()} onOpenChange={setOpen} modalType="non-modal">
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(open()).toBe(false);
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it("does not close an alert dialog on Escape", () => {
    const [open, setOpen] = createSignal(true);
    renderWithFluent(() => (
      <Dialog open={open()} onOpenChange={setOpen} modalType="alert">
        <DialogSurface>
          <DialogTitle>Alert</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    expect(document.body.querySelector('[role="alertdialog"]')).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(open()).toBe(true);
  });

  it("sets aria-labelledby only when a title is present and honours aria-label / aria-describedby", () => {
    const labelled = renderWithFluent(() => (
      <Dialog open>
        <DialogSurface aria-describedby="desc">
          <DialogTitle>标题</DialogTitle>
          <p id="desc">描述</p>
        </DialogSurface>
      </Dialog>
    ));
    const withTitle = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(withTitle.getAttribute("aria-labelledby")).toBeTruthy();
    expect(document.getElementById(withTitle.getAttribute("aria-labelledby")!)?.textContent).toBe(
      "标题",
    );
    expect(withTitle).toHaveAttribute("aria-describedby", "desc");
    labelled.unmount();

    renderWithFluent(() => (
      <Dialog open>
        <DialogSurface aria-label="无标题对话框">
          <p>Body</p>
        </DialogSurface>
      </Dialog>
    ));
    const noTitle = document.body.querySelector('[role="dialog"]') as HTMLElement;
    expect(noTitle.hasAttribute("aria-labelledby")).toBe(false);
    expect(noTitle).toHaveAttribute("aria-label", "无标题对话框");
  });

  it("keeps the subtree mounted (hidden) when unmountOnClose is false", () => {
    const [open, setOpen] = createSignal(true);
    renderWithFluent(() => (
      <Dialog open={open()} onOpenChange={setOpen} unmountOnClose={false}>
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    expect(document.body.querySelector(".sf-Dialog")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(open()).toBe(false);
    const surface = document.body.querySelector(".sf-Dialog") as HTMLElement;
    expect(surface).toBeTruthy();
    expect(surface).toHaveAttribute("hidden");
  });

  it("enhances the trigger button with aria-haspopup / aria-expanded", () => {
    renderWithFluent(() => (
      <Dialog>
        <DialogTrigger>
          <button>Open</button>
        </DialogTrigger>
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    const button = document.querySelector("button") as HTMLElement;
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("skips enhancement when disableButtonEnhancement is set", () => {
    renderWithFluent(() => (
      <Dialog>
        <DialogTrigger disableButtonEnhancement>
          <button>Open</button>
        </DialogTrigger>
      </Dialog>
    ));
    const button = document.querySelector("button") as HTMLElement;
    expect(button).not.toHaveAttribute("aria-haspopup");
    expect(button).not.toHaveAttribute("aria-expanded");
  });

  it("renders a single surface when using DialogContent", () => {
    renderWithFluent(() => (
      <Dialog open>
        <DialogContent title="标题">正文</DialogContent>
      </Dialog>
    ));
    expect(document.body.querySelectorAll(".sf-Dialog__surface").length).toBe(1);
    expect(document.body.textContent).toContain("正文");
  });

  it("calls onOpenChange when the overlay is clicked (modal only)", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <Dialog open onOpenChange={onOpenChange}>
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    fireEvent.mouseDown(document.body.querySelector(".sf-Overlay") as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies size and custom class variants to the dialog surface", () => {
    renderWithFluent(() => (
      <Dialog open>
        <DialogSurface size="large" class="my-surface">
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    const surface = document.body.querySelector(".sf-Dialog__surface")!;
    expect(surface).toHaveClass("sf-Dialog__surface--large");
    expect(surface).toHaveClass("my-surface");
  });

  it("DialogActions position sets justify-content and forwards a custom class", () => {
    const { container } = renderWithFluent(() => (
      <DialogActions position="start" class="my-actions">
        Actions
      </DialogActions>
    ));
    const actions = container.querySelector(".sf-Dialog__actions")!;
    expect(actions).toHaveClass("my-actions");
    expect(actions).toHaveStyle({ "justify-content": "flex-start" });
  });

  it("traps Tab focus inside a modal dialog", () => {
    renderWithFluent(() => (
      <Dialog open>
        <DialogSurface>
          <DialogBody>
            <button>First</button>
            <button>Last</button>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    ));
    const [first, last] = Array.from(document.body.querySelectorAll("button")) as [HTMLButtonElement, HTMLButtonElement];
    expect(document.activeElement).toBe(first);
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("updates trigger aria-expanded when the dialog is dismissed with Escape", () => {
    const [open, setOpen] = createSignal(false);
    renderWithFluent(() => (
      <Dialog open={open()} onOpenChange={setOpen}>
        <DialogTrigger>
          <button>Open</button>
        </DialogTrigger>
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    const button = document.querySelector("button") as HTMLElement;
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("supports uncontrolled defaultOpen", () => {
    renderWithFluent(() => (
      <Dialog defaultOpen modalType="non-modal">
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it("reports every open and close transition through onOpenChange", () => {
    const onOpenChange = vi.fn();
    const [open, setOpen] = createSignal(false);
    renderWithFluent(() => (
      <Dialog
        open={open()}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
      >
        <DialogTrigger>
          <button>Open</button>
        </DialogTrigger>
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
        </DialogSurface>
      </Dialog>
    ));
    const button = document.querySelector("button") as HTMLElement;
    fireEvent.click(button);
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.click(button);
    expect(onOpenChange.mock.calls).toEqual([[true], [false], [true]]);
  });

  it("DialogContent onClose calls the handler and closes the dialog", () => {
    const onClose = vi.fn();
    const [open, setOpen] = createSignal(true);
    renderWithFluent(() => (
      <Dialog open={open()} onOpenChange={setOpen}>
        <DialogContent title="Title" onClose={onClose}>
          Body
        </DialogContent>
      </Dialog>
    ));
    fireEvent.click(document.querySelector('[aria-label="Close"]') as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(open()).toBe(false);
  });
});
