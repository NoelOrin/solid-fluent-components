import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Switch } from "./Switch";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("Switch", () => {
  it("renders a switch role with checked state and a thumb", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Switch checked label="On" />
    ));
    expect(container.querySelector(".sf-Switch")).toBeTruthy();
    const sw = getByRole("switch") as HTMLInputElement;
    expect(sw.type).toBe("checkbox");
    expect(sw).toHaveClass("sf-Switch__input");
    expect(sw.checked).toBe(true);
    expect(sw).toHaveAttribute("aria-checked", "true");
    const track = container.querySelector(".sf-Switch__track") as HTMLElement;
    expect(track.getAttribute("data-checked")).toBe("true");
    expect(track.querySelector(".sf-Switch__thumb")).toBeTruthy();
    expect(container.textContent).toContain("On");
  });

  it("starts unchecked without a data-checked marker", () => {
    const { container, getByRole } = renderWithFluent(() => <Switch label="Off" />);
    const sw = getByRole("switch") as HTMLInputElement;
    expect(sw.checked).toBe(false);
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(container.querySelector(".sf-Switch__track")).not.toHaveAttribute("data-checked");
  });

  it("respects labelPosition before and after the input", () => {
    const before = renderWithFluent(() => (
      <Switch label="Before" labelPosition="before" />
    ));
    const after = renderWithFluent(() => (
      <Switch label="After" labelPosition="after" />
    ));
    const beforeLabel = before.container.querySelector(".sf-Switch")!;
    const afterLabel = after.container.querySelector(".sf-Switch")!;
    expect(beforeLabel.children[0]!.textContent).toBe("Before");
    expect(beforeLabel.children[1]!.tagName).toBe("INPUT");
    expect(afterLabel.children[0]!.tagName).toBe("INPUT");
    expect(afterLabel.lastElementChild!.textContent).toBe("After");
  });

  it("accepts children as the label", () => {
    const { container } = renderWithFluent(() => (
      <Switch>Notifications</Switch>
    ));
    expect(container.textContent).toContain("Notifications");
  });

  it("reflects defaultChecked without notifying on mount", () => {
    const onCheckedChange = vi.fn();
    const { getByRole, container } = renderWithFluent(() => (
      <Switch label="X" defaultChecked onCheckedChange={onCheckedChange} />
    ));
    expect((getByRole("switch") as HTMLInputElement).checked).toBe(true);
    expect(container.querySelector(".sf-Switch__track")).toHaveAttribute("data-checked", "true");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("marks the root and native control as disabled and blocks focus", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Switch disabled label="Off" />
    ));
    const root = container.querySelector(".sf-Switch") as HTMLElement;
    const sw = getByRole("switch") as HTMLInputElement;
    expect(root).toHaveClass("sf-Switch--disabled");
    expect(sw.disabled).toBe(true);
    sw.focus();
    expect(document.activeElement).not.toBe(sw);
  });

  it("toggles an uncontrolled switch and syncs aria-checked with callbacks", () => {
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Switch label="X" onCheckedChange={onCheckedChange} onChange={onChange} />
    ));
    const sw = getByRole("switch") as HTMLInputElement;
    const track = container.querySelector(".sf-Switch__track") as HTMLElement;
    expect(track).not.toHaveAttribute("data-checked");

    fireEvent.click(sw);
    expect(sw.checked).toBe(true);
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(track).toHaveAttribute("data-checked", "true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(onChange.mock.calls[0]![0].target).toBe(sw);

    fireEvent.click(sw);
    expect(sw.checked).toBe(false);
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(track).not.toHaveAttribute("data-checked");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("keeps a signal-controlled switch in sync across repeated toggles", () => {
    const [checked, setChecked] = createSignal(false);
    const { container, getByRole } = renderWithFluent(() => (
      <Switch label="X" checked={checked()} onCheckedChange={setChecked} />
    ));
    const sw = getByRole("switch") as HTMLInputElement;
    const track = container.querySelector(".sf-Switch__track") as HTMLElement;
    fireEvent.click(sw);
    expect(checked()).toBe(true);
    expect(sw.checked).toBe(true);
    expect(track).toHaveAttribute("data-checked", "true");
    fireEvent.click(sw);
    expect(checked()).toBe(false);
    expect(sw.checked).toBe(false);
    expect(track).not.toHaveAttribute("data-checked");
  });

  it("maps a Field error onto aria-invalid, describedBy and the invalid class", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Turn this on">
        <Switch label="X" />
      </Field>
    ));
    const sw = getByRole("switch") as HTMLInputElement;
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(container.querySelector(".sf-Switch")).toHaveClass("sf-Switch--invalid");
    expect(sw).toHaveAttribute("aria-invalid", "true");
    expect(sw.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("tracks focus/blur and forwards activation keys", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Switch label="X" onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} />
    ));
    const sw = getByRole("switch") as HTMLInputElement;
    sw.focus();
    expect(document.activeElement).toBe(sw);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(sw, { key: " " });
    fireEvent.keyDown(sw, { key: "Enter" });
    expect(onKeyDown.mock.calls.map((call) => call[0].key)).toEqual([" ", "Enter"]);
    sw.blur();
    expect(document.activeElement).not.toBe(sw);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("uses an explicit id or the Field control id for labelling", () => {
    const own = renderWithFluent(() => <Switch label="X" id="own-switch" />);
    expect(own.container.querySelector("input")).toHaveAttribute("id", "own-switch");

    const field = renderWithFluent(() => (
      <Field label="Enabled">
        <Switch label="X" />
      </Field>
    ));
    const sw = field.container.querySelector("input")!;
    const labelFor = field.container
      .querySelector("label.sf-Label")!
      .getAttribute("for");
    expect(sw.id).toBe(labelFor);
  });
});
