import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { RadioGroup } from "./RadioGroup";
import { Radio } from "./Radio";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("RadioGroup", () => {
  it("renders a radiogroup from options", () => {
    const { getByRole } = renderWithFluent(() => (
      <RadioGroup
        value="a"
        options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]}
      />
    ));
    const group = getByRole("radiogroup");
    expect(group).toHaveClass("sf-RadioGroup");
    expect(group.querySelectorAll('input[type="radio"]').length).toBe(2);
  });

  it("defaults to vertical orientation and reflects the horizontal layout", () => {
    const vertical = renderWithFluent(() => (
      <RadioGroup options={[{ value: "a", label: "A" }]} />
    ));
    const verticalRoot = vertical.container.querySelector(".sf-RadioGroup")!;
    expect(verticalRoot).toHaveAttribute("data-orientation", "vertical");
    expect(verticalRoot).not.toHaveClass("sf-RadioGroup--horizontal");

    const horizontal = renderWithFluent(() => (
      <RadioGroup layout="horizontal" options={[{ value: "a", label: "A" }]} />
    ));
    const horizontalRoot = horizontal.container.querySelector(".sf-RadioGroup")!;
    expect(horizontalRoot).toHaveClass("sf-RadioGroup--horizontal");
    expect(horizontalRoot).toHaveAttribute("data-orientation", "horizontal");
  });

  it("lets compositional Radio children join the group context", () => {
    const onChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <RadioGroup name="fruit" aria-label="Fruit" defaultValue="a" onChange={onChange}>
        <Radio value="a" label="Apple" />
        <Radio value="b" label="Banana" />
      </RadioGroup>
    ));

    const group = getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-label", "Fruit");
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios.length).toBe(2);
    expect(radios[0]!.name).toBe("fruit");
    expect(radios[1]!.name).toBe("fruit");
    expect(radios[0]!.getAttribute("aria-checked")).toBe("true");
    expect(
      radios[0]!.parentElement!.querySelector(".sf-Radio__indicator")!.getAttribute("data-checked"),
    ).toBe("true");

    fireEvent.click(radios[1]!);
    expect(onChange).toHaveBeenCalledWith("b");
    expect(radios[1]!.checked).toBe(true);
    expect(radios[1]!.getAttribute("aria-checked")).toBe("true");
  });

  it("moves selection and focus with arrow keys and keeps one tab stop", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <RadioGroup defaultValue="a" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
        <Radio value="c" label="C" />
      </RadioGroup>
    ));
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');

    expect(radios[0]!.tabIndex).toBe(0);
    expect(radios[1]!.tabIndex).toBe(-1);
    expect(radios[2]!.tabIndex).toBe(-1);

    fireEvent.keyDown(radios[0]!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("b");
    expect(document.activeElement).toBe(radios[1]);
    expect(radios[0]!.tabIndex).toBe(-1);
    expect(radios[1]!.tabIndex).toBe(0);

    fireEvent.keyDown(radios[1]!, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("c");
    expect(document.activeElement).toBe(radios[2]);
  });

  it("supports Home and wraps with the opposite arrow and up/down keys", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <RadioGroup defaultValue="b" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
        <Radio value="c" label="C" />
      </RadioGroup>
    ));
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');

    fireEvent.keyDown(radios[1]!, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("a");
    expect(document.activeElement).toBe(radios[0]);

    fireEvent.keyDown(radios[0]!, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("c");
    expect(document.activeElement).toBe(radios[2]);

    fireEvent.keyDown(radios[2]!, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith("b");
    expect(document.activeElement).toBe(radios[1]);

    fireEvent.keyDown(radios[1]!, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith("c");
  });

  it("uses the group id for the field label instead of duplicating it on radios", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Plan">
        <RadioGroup>
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      </Field>
    ));
    const labelFor = container.querySelector("label.sf-Label")!.getAttribute("for")!;
    expect(container.querySelector(".sf-RadioGroup")).toHaveAttribute("id", labelFor);
    const radios = container.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => expect(radio).not.toHaveAttribute("id"));
  });

  it("skips disabled radios during keyboard navigation", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <RadioGroup defaultValue="a" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" disabled />
        <Radio value="c" label="C" />
      </RadioGroup>
    ));
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    fireEvent.keyDown(radios[0]!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("c");
  });

  it("skips option-level disabled radios during keyboard navigation", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <RadioGroup
        defaultValue="a"
        onChange={onChange}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B", disabled: true },
          { value: "c", label: "C" },
        ]}
      />
    ));
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[1]!.disabled).toBe(true);
    expect(radios[1]!.tabIndex).toBe(-1);
    fireEvent.keyDown(radios[0]!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("c");
    expect(document.activeElement).toBe(radios[2]);
  });

  it("renders an empty group with no radios", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <RadioGroup options={[]} aria-label="Empty" />
    ));
    expect(getByRole("radiogroup")).toHaveAttribute("aria-label", "Empty");
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(0);
  });

  it("keeps a signal-controlled value in sync across clicks", () => {
    const [value, setValue] = createSignal("a");
    const { container } = renderWithFluent(() => (
      <RadioGroup value={value()} onChange={setValue}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    ));
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[0]!.getAttribute("aria-checked")).toBe("true");
    expect(radios[0]!.tabIndex).toBe(0);

    fireEvent.click(radios[1]!);
    expect(value()).toBe("b");
    expect(radios[1]!.getAttribute("aria-checked")).toBe("true");
    expect(radios[0]!.getAttribute("aria-checked")).toBe("false");
    expect(radios[1]!.tabIndex).toBe(0);
    expect(radios[0]!.tabIndex).toBe(-1);
  });

  it("disables every radio in the group and blocks keyboard selection", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <RadioGroup disabled defaultValue="a" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    ));
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    radios.forEach((radio) => {
      expect(radio.disabled).toBe(true);
      expect(radio.tabIndex).toBe(-1);
    });
    fireEvent.keyDown(radios[0]!, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards aria-labelledby and an explicit id to the group", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <RadioGroup id="my-group" aria-labelledby="group-title" options={[{ value: "a", label: "A" }]} />
    ));
    const group = getByRole("radiogroup");
    expect(group).toHaveAttribute("id", "my-group");
    expect(group).toHaveAttribute("aria-labelledby", "group-title");
    expect(container.querySelector(".sf-RadioGroup")).toBe(group);
  });

  it("maps a Field error onto aria-invalid, aria-describedby and the invalid class", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Choose one">
        <RadioGroup options={[{ value: "a", label: "A" }]} />
      </Field>
    ));
    const group = getByRole("radiogroup");
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(group).toHaveClass("sf-RadioGroup--invalid");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("reports the chosen string value on every change", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <RadioGroup defaultValue="a" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
        <Radio value="c" label="C" />
      </RadioGroup>
    ));
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    fireEvent.click(radios[1]!);
    fireEvent.click(radios[2]!);
    expect(onChange.mock.calls.map((call) => call[0])).toEqual(["b", "c"]);
  });
});
