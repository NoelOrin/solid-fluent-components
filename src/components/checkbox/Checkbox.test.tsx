import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Checkbox } from "./Checkbox";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("Checkbox", () => {
  it("renders a labelled checkbox with the default medium size", () => {
    const { container } = renderWithFluent(() => (
      <Checkbox label="Accept" name="accept" />
    ));
    expect(container.querySelector(".sf-Checkbox")).toHaveAttribute("data-size", "medium");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("checkbox");
    expect(input).toHaveClass("sf-Checkbox__input");
    expect(input.name).toBe("accept");
    expect(container.textContent).toContain("Accept");
  });

  it("supports the large size variant and children as the label", () => {
    const { container } = renderWithFluent(() => (
      <Checkbox size="large">I agree</Checkbox>
    ));
    expect(container.querySelector(".sf-Checkbox")).toHaveAttribute("data-size", "large");
    expect(container.textContent).toContain("I agree");
    expect(container.querySelector(".sf-Checkbox__check")).toBeTruthy();
  });

  it("renders a custom indicator instead of the default check mark", () => {
    const { container } = renderWithFluent(() => (
      <Checkbox label="X" indicator={<span data-testid="custom">custom</span>} />
    ));
    expect(container.querySelector(".sf-Checkbox__check")).toBeNull();
    expect(
      container.querySelector(".sf-Checkbox__indicator [data-testid='custom']"),
    ).toBeTruthy();
  });

  it("reflects checked and disabled states on the root and native input", () => {
    const { container } = renderWithFluent(() => (
      <Checkbox label="X" checked disabled />
    ));
    const root = container.querySelector(".sf-Checkbox") as HTMLElement;
    const input = container.querySelector("input") as HTMLInputElement;
    expect(root).toHaveClass("sf-Checkbox--disabled");
    expect(input.checked).toBe(true);
    expect(input.disabled).toBe(true);
    expect(container.querySelector(".sf-Checkbox__indicator")).toHaveAttribute(
      "data-checked",
      "true",
    );
  });

  it("marks the root and native control as disabled and blocks focus", () => {
    const { container } = renderWithFluent(() => (
      <Checkbox label="X" disabled />
    ));
    const root = container.querySelector(".sf-Checkbox") as HTMLElement;
    const input = container.querySelector("input") as HTMLInputElement;
    expect(root).toHaveClass("sf-Checkbox--disabled");
    expect(input.disabled).toBe(true);
    input.focus();
    expect(document.activeElement).not.toBe(input);
  });

  it("toggles an uncontrolled checkbox and reports both callback arguments", () => {
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Checkbox label="X" onCheckedChange={onCheckedChange} onChange={onChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    const indicator = container.querySelector(".sf-Checkbox__indicator") as HTMLElement;
    expect(indicator).not.toHaveAttribute("data-checked");

    fireEvent.click(input);
    expect(input.checked).toBe(true);
    expect(indicator).toHaveAttribute("data-checked", "true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target).toBe(input);

    fireEvent.click(input);
    expect(input.checked).toBe(false);
    expect(indicator).not.toHaveAttribute("data-checked");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("starts from defaultChecked without notifying on mount", () => {
    const onCheckedChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Checkbox label="X" defaultChecked onCheckedChange={onCheckedChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("keeps a signal-controlled checkbox in sync across repeated toggles", () => {
    const [checked, setChecked] = createSignal(false);
    const { container } = renderWithFluent(() => (
      <Checkbox label="X" checked={checked()} onCheckedChange={setChecked} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    const indicator = container.querySelector(".sf-Checkbox__indicator") as HTMLElement;
    fireEvent.click(input);
    expect(checked()).toBe(true);
    expect(input.checked).toBe(true);
    expect(indicator).toHaveAttribute("data-checked", "true");
    fireEvent.click(input);
    expect(checked()).toBe(false);
    expect(input.checked).toBe(false);
  });

  it("renders the mixed state as indeterminate with aria-checked=mixed", () => {
    const { container } = renderWithFluent(() => (
      <Checkbox mixed label="Some" />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input).toHaveAttribute("aria-checked", "mixed");
    expect(container.querySelector(".sf-Checkbox__indicator")).toHaveAttribute(
      "data-checked",
      "mixed",
    );
  });

  it("toggles when the wrapping label is clicked", () => {
    const onCheckedChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Checkbox label="Click me" onCheckedChange={onCheckedChange} />
    ));
    const label = container.querySelector("label.sf-Checkbox") as HTMLElement;
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.click(label);
    expect(input.checked).toBe(true);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("maps a Field error onto aria-invalid, aria-describedby and the invalid class", () => {
    const { container } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Required">
        <Checkbox label="Terms" />
      </Field>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(container.querySelector(".sf-Checkbox")).toHaveClass("sf-Checkbox--invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("tracks focus/blur and forwards the Space key to the handler", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = renderWithFluent(() => (
      <Checkbox
        label="X"
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input, { key: " " });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onKeyDown.mock.calls[0]![0].key).toBe(" ");
    input.blur();
    expect(document.activeElement).not.toBe(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("uses an explicit id or the Field control id", () => {
    const own = renderWithFluent(() => <Checkbox label="X" id="own-check" />);
    expect(own.container.querySelector("input")).toHaveAttribute("id", "own-check");

    const field = renderWithFluent(() => (
      <Field label="Terms">
        <Checkbox label="X" />
      </Field>
    ));
    const input = field.container.querySelector("input")!;
    const labelFor = field.container
      .querySelector("label.sf-Label")!
      .getAttribute("for");
    expect(input.id).toBe(labelFor);
  });
});
