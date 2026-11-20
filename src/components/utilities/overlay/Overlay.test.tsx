import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Overlay, useControllableOpen } from "./Overlay";
import { renderWithFluent } from "../../../test-utils/index";

describe("Overlay", () => {
  it("renders an overlay element when open", () => {
    renderWithFluent(() => <Overlay open />);
    expect(document.body.querySelector(".sf-Overlay")).toBeTruthy();
  });

  it("renders nothing when closed", () => {
    const { container } = renderWithFluent(() => <Overlay open={false} />);
    expect(document.body.querySelector(".sf-Overlay")).toBeNull();
    expect(container.querySelector(".sf-Overlay")).toBeNull();
  });

  it("renders children and a custom class inside the overlay", () => {
    renderWithFluent(() => (
      <Overlay open class="my-overlay">
        <span class="overlay-child">Content</span>
      </Overlay>
    ));
    const overlay = document.body.querySelector(".sf-Overlay")!;
    expect(overlay).toHaveClass("my-overlay");
    expect(overlay.querySelector(".overlay-child")?.textContent).toBe("Content");
  });

  it("requests close on an outside mousedown", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => <Overlay open onOpenChange={onOpenChange} />);
    fireEvent.mouseDown(document.body.querySelector(".sf-Overlay")!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not request close on mousedown when closeOnOutsideClick is false", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <Overlay open closeOnOutsideClick={false} onOpenChange={onOpenChange} />
    ));
    fireEvent.mouseDown(document.body.querySelector(".sf-Overlay")!);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("requests close on Escape", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => <Overlay open onOpenChange={onOpenChange} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not request close on Escape when closeOnEscape is false", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <Overlay open closeOnEscape={false} onOpenChange={onOpenChange} />
    ));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("mounts into a custom node", () => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    renderWithFluent(() => <Overlay open mount={target} />);
    expect(target.querySelector(".sf-Overlay")).toBeTruthy();
    target.remove();
  });
});

describe("useControllableOpen", () => {
  it("manages uncontrolled state and reports the new value", () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useControllableOpen(undefined, false, onOpenChange);
      return (
        <button onClick={() => setOpen(!open())}>{open() ? "open" : "closed"}</button>
      );
    }
    const { getByRole } = renderWithFluent(() => <Harness />);
    expect(getByRole("button").textContent).toBe("closed");
    fireEvent.click(getByRole("button"));
    expect(getByRole("button").textContent).toBe("open");
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("defers to a controlled value until the parent updates it", () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useControllableOpen(() => true, false, onOpenChange);
      return (
        <button onClick={() => setOpen(false)}>{open() ? "open" : "closed"}</button>
      );
    }
    const { getByRole } = renderWithFluent(() => <Harness />);
    fireEvent.click(getByRole("button"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getByRole("button").textContent).toBe("open");
  });
});
