import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("Radio", () => {
  it("renders a labelled radio with role, value and indicator", () => {
    const { container } = renderWithFluent(() => (
      <Radio value="1" label="One" name="choice" />
    ));
    expect(container.querySelector(".sf-Radio")).toBeTruthy();
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("radio");
    expect(input).toHaveAttribute("role", "radio");
    expect(input).toHaveClass("sf-Radio__input");
    expect(input.value).toBe("1");
    expect(input.name).toBe("choice");
    expect(container.textContent).toContain("One");
    expect(container.querySelector(".sf-Radio__indicator")).toBeTruthy();
  });

  it("coerces a numeric value to a string and accepts children as the label", () => {
    const { container } = renderWithFluent(() => (
      <Radio value={42}>Forty two</Radio>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("42");
    expect(container.textContent).toContain("Forty two");
  });

  it("reflects defaultChecked in aria-checked and the indicator", () => {
    const { container } = renderWithFluent(() => (
      <Radio value="a" label="A" defaultChecked />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(input).toHaveAttribute("aria-checked", "true");
    expect(container.querySelector(".sf-Radio__indicator")).toHaveAttribute(
      "data-checked",
      "true",
    );
  });

  it("starts unchecked with aria-checked=false", () => {
    const { container } = renderWithFluent(() => <Radio value="a" label="A" />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.checked).toBe(false);
    expect(input).toHaveAttribute("aria-checked", "false");
    expect(container.querySelector(".sf-Radio__indicator")).not.toHaveAttribute(
      "data-checked",
    );
  });

  it("checks an uncontrolled radio and reports the change event", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Radio value="a" label="A" onChange={onChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(true);
    expect(input).toHaveAttribute("aria-checked", "true");
    expect(container.querySelector(".sf-Radio__indicator")).toHaveAttribute(
      "data-checked",
      "true",
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target).toBe(input);
  });

  it("keeps a signal-controlled radio in sync with its source of truth", () => {
    const [checked, setChecked] = createSignal(false);
    const { container } = renderWithFluent(() => (
      <Radio value="a" label="A" checked={checked()} onChange={() => setChecked(true)} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.click(input);
    expect(checked()).toBe(true);
    expect(input.checked).toBe(true);
    setChecked(false);
    expect(input.checked).toBe(false);
  });

  it("disables the radio and blocks focus", () => {
    const { container } = renderWithFluent(() => (
      <Radio value="a" label="A" disabled />
    ));
    const root = container.querySelector(".sf-Radio") as HTMLElement;
    const input = container.querySelector("input") as HTMLInputElement;
    expect(root).toHaveClass("sf-Radio--disabled");
    expect(input.disabled).toBe(true);
    input.focus();
    expect(document.activeElement).not.toBe(input);
  });

  it("has no roving tabindex when used outside a group", () => {
    const { container } = renderWithFluent(() => (
      <Radio value="a" label="A" />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).not.toHaveAttribute("tabindex");
  });

  it("joins a group context for name and roving tabindex", () => {
    const { container } = renderWithFluent(() => (
      <RadioGroup name="fruit" defaultValue="a">
        <Radio value="a" label="Apple" />
        <Radio value="b" label="Banana" />
      </RadioGroup>
    ));
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(inputs.length).toBe(2);
    expect(inputs[0]!.name).toBe("fruit");
    expect(inputs[1]!.name).toBe("fruit");
    expect(inputs[0]!.tabIndex).toBe(0);
    expect(inputs[1]!.tabIndex).toBe(-1);
  });

  it("maps a Field error onto aria-invalid, describedBy and the invalid class", () => {
    const { container } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Pick one">
        <Radio value="a" label="A" />
      </Field>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(container.querySelector(".sf-Radio")).toHaveClass("sf-Radio--invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("tracks focus/blur and forwards arrow and activation keys when standalone", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = renderWithFluent(() => (
      <Radio
        value="a"
        label="A"
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input, { key: "ArrowRight" });
    fireEvent.keyDown(input, { key: " " });
    fireEvent.keyDown(input, { key: "Home" });
    expect(onKeyDown.mock.calls.map((call) => call[0].key)).toEqual([
      "ArrowRight",
      " ",
      "Home",
    ]);
    input.blur();
    expect(document.activeElement).not.toBe(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("uses an explicit id when no group provides one", () => {
    const { container } = renderWithFluent(() => (
      <Radio value="a" label="A" id="own-radio" />
    ));
    expect(container.querySelector("input")).toHaveAttribute("id", "own-radio");
  });
});
