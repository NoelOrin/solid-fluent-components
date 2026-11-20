import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { SpinButton, type SpinButtonBounds } from "./SpinButton";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("SpinButton", () => {
  it("renders a spinbutton input with aria value attributes and default appearance", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <SpinButton defaultValue={5} min={0} max={10} name="qty" />
    ));
    const root = container.querySelector(".sf-SpinButton") as HTMLElement;
    expect(root).toHaveClass("sf-SpinButton--medium");
    expect(root).toHaveAttribute("data-appearance", "outline");
    const input = getByRole("spinbutton") as HTMLInputElement;
    expect(input.type).toBe("text");
    expect(input).toHaveAttribute("inputmode", "decimal");
    expect(input).toHaveClass("sf-SpinButton__input");
    expect(input.value).toBe("5");
    expect(input.name).toBe("qty");
    expect(input).toHaveAttribute("aria-valuenow", "5");
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "10");
  });

  it("applies size and appearance variants", () => {
    const { container } = renderWithFluent(() => (
      <SpinButton size="small" appearance="filled-lighter" />
    ));
    const root = container.querySelector(".sf-SpinButton") as HTMLElement;
    expect(root).toHaveClass("sf-SpinButton--small");
    expect(root).toHaveAttribute("data-appearance", "filled-lighter");
  });

  it("keeps the SpinButtonBounds type alias exported", () => {
    const bounds: SpinButtonBounds = { min: 1, max: 10, step: 2 };
    expect(bounds.step).toBe(2);
  });

  it("increments and decrements through buttons with numeric callbacks", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton defaultValue={5} min={0} max={10} onChange={onChange} />
    ));
    const [increment, decrement] = container.querySelectorAll<HTMLButtonElement>("button");
    expect(increment).toHaveAttribute("aria-label", "Increment");
    expect(decrement).toHaveAttribute("aria-label", "Decrement");

    fireEvent.click(increment!);
    expect(onChange).toHaveBeenLastCalledWith(6, "6");
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("6");
    fireEvent.click(decrement!);
    expect(onChange).toHaveBeenLastCalledWith(5, "5");
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("5");
  });

  it("clamps button commits to the configured bounds", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton min={0} max={5} defaultValue={5} onChange={onChange} />
    ));
    const increment = container.querySelectorAll("button")[0] as HTMLButtonElement;
    fireEvent.click(increment);
    expect(onChange).toHaveBeenCalledWith(5, "5");
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("5");
  });

  it("rounds commits to the requested precision", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton defaultValue={0} step={0.25} precision={2} onChange={onChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "3.14159" } });
    expect(onChange).toHaveBeenCalledWith(3.14, "3.14");
    expect(input.value).toBe("3.14");
  });

  it("handles Arrow/Page/Home/End keys with step and bounds", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton min={0} max={100} step={2} defaultValue={10} onChange={onChange} />
    ));
    const input = container.querySelector("input")!;
    const press = (key: string) => fireEvent.keyDown(input, { key });

    press("ArrowUp");
    expect(onChange).toHaveBeenLastCalledWith(12, "12");
    press("ArrowDown");
    expect(onChange).toHaveBeenLastCalledWith(10, "10");
    press("PageUp");
    expect(onChange).toHaveBeenLastCalledWith(30, "30");
    press("PageDown");
    expect(onChange).toHaveBeenLastCalledWith(10, "10");
    press("Home");
    expect(onChange).toHaveBeenLastCalledWith(0, "0");
    press("End");
    expect(onChange).toHaveBeenLastCalledWith(100, "100");
  });

  it("ignores Home and End when no bounds are configured", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton defaultValue={5} onChange={onChange} />
    ));
    const input = container.querySelector("input")!;
    fireEvent.keyDown(input, { key: "Home" });
    fireEvent.keyDown(input, { key: "End" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("parses numeric input and clamps it before committing", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton min={0} max={10} defaultValue={5} onChange={onChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "42" } });
    expect(onChange).toHaveBeenCalledWith(10, "10");
    expect(input.value).toBe("10");
  });

  it("reports null with the raw text and leaves it visible for non-numeric input", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton defaultValue={5} onChange={onChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith(null, "abc");
    expect(input.value).toBe("abc");
  });

  it("reports null and an empty display string when cleared", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SpinButton defaultValue={5} onChange={onChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(null, "");
    expect(input.value).toBe("");
    expect(input).not.toHaveAttribute("aria-valuenow");
  });

  it("uses displayValue for presentation while keeping the numeric value", () => {
    const { getByRole } = renderWithFluent(() => (
      <SpinButton value={5} displayValue="five" />
    ));
    const input = getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("five");
    expect(input).toHaveAttribute("aria-valuenow", "5");
  });

  it("keeps a signal-controlled value in sync with button commits", () => {
    const [value, setValue] = createSignal(5);
    const { container, getByRole } = renderWithFluent(() => (
      <SpinButton
        value={value()}
        min={0}
        max={10}
        onChange={(next) => next !== null && setValue(next)}
      />
    ));
    const input = getByRole("spinbutton") as HTMLInputElement;
    const increment = container.querySelectorAll("button")[0] as HTMLButtonElement;
    fireEvent.click(increment);
    expect(value()).toBe(6);
    expect(input.value).toBe("6");
    expect(input).toHaveAttribute("aria-valuenow", "6");
  });

  it("disables the input, buttons and keyboard handling", () => {
    const onChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <SpinButton disabled defaultValue={5} onChange={onChange} />
    ));
    const root = container.querySelector(".sf-SpinButton") as HTMLElement;
    const input = getByRole("spinbutton") as HTMLInputElement;
    const buttons = container.querySelectorAll<HTMLButtonElement>("button");
    expect(root).toHaveClass("sf-SpinButton--disabled");
    expect(input.disabled).toBe(true);
    buttons.forEach((button) => expect(button).toHaveAttribute("aria-disabled", "true"));
    input.focus();
    expect(document.activeElement).not.toBe(input);
    fireEvent.click(buttons[0]!);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("maps a Field error onto aria-invalid, describedBy and the invalid class", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Enter a number">
        <SpinButton />
      </Field>
    ));
    const input = getByRole("spinbutton") as HTMLInputElement;
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(container.querySelector(".sf-SpinButton")).toHaveClass("sf-SpinButton--invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("tracks focus/blur and uses an explicit id or the Field control id", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const own = renderWithFluent(() => (
      <SpinButton id="own-spin" onFocus={onFocus} onBlur={onBlur} />
    ));
    const input = own.container.querySelector("input") as HTMLInputElement;
    expect(input).toHaveAttribute("id", "own-spin");
    input.focus();
    expect(document.activeElement).toBe(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    input.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);

    const field = renderWithFluent(() => (
      <Field label="Quantity">
        <SpinButton />
      </Field>
    ));
    const fieldInput = field.container.querySelector("input")!;
    const labelFor = field.container
      .querySelector("label.sf-Label")!
      .getAttribute("for");
    expect(fieldInput.id).toBe(labelFor);
  });
});
