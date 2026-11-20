import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Select, Option, Combobox, Listbox, OptionItem } from "./Select";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("Select", () => {
  it("renders a native select with option children and base classes", () => {
    const { getByRole } = renderWithFluent(() => (
      <Select>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Select>
    ));
    const select = getByRole("combobox");
    expect(select).toHaveClass("sf-Select");
    expect(select).toHaveClass("sf-focus-ring");
    expect(select.querySelectorAll("option").length).toBe(2);
    expect(select.textContent).toContain("B");
  });

  it("defaults to medium data-size and supports small and large", () => {
    const medium = renderWithFluent(() => <Select />);
    const small = renderWithFluent(() => <Select size="small" />);
    const large = renderWithFluent(() => <Select size="large" />);
    expect(medium.getByRole("combobox")).toHaveAttribute("data-size", "medium");
    expect(small.getByRole("combobox")).toHaveAttribute("data-size", "small");
    expect(large.getByRole("combobox")).toHaveAttribute("data-size", "large");
  });

  it("merges a custom class and forwards native props", () => {
    const { getByRole } = renderWithFluent(() => (
      <Select class="my-select" name="color" required aria-label="Color">
        <Option value="r">Red</Option>
      </Select>
    ));
    const select = getByRole("combobox", { name: "Color" }) as HTMLSelectElement;
    expect(select).toHaveClass("sf-Select");
    expect(select).toHaveClass("my-select");
    expect(select.name).toBe("color");
    expect(select.required).toBe(true);
  });

  it("renders an empty select without options", () => {
    const { getByRole } = renderWithFluent(() => <Select />);
    expect(getByRole("combobox").querySelectorAll("option").length).toBe(0);
  });

  it("reports the selected value through change with callback arguments", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Select onChange={onChange}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Select>
    ));
    const select = getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "b" } });
    expect(select.value).toBe("b");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target).toBe(select);
  });

  it("keeps a controlled value in sync with a signal", () => {
    const [value, setValue] = createSignal("a");
    const { getByRole } = renderWithFluent(() => (
      <Select value={value()} onChange={(event) => setValue(event.currentTarget.value)}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Select>
    ));
    const select = getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("a");
    fireEvent.change(select, { target: { value: "b" } });
    expect(value()).toBe("b");
    expect(select.value).toBe("b");
  });

  it("disables the select and blocks focus", () => {
    const { getByRole } = renderWithFluent(() => (
      <Select disabled>
        <Option value="a">A</Option>
      </Select>
    ));
    const select = getByRole("combobox") as HTMLSelectElement;
    expect(select.disabled).toBe(true);
    select.focus();
    expect(document.activeElement).not.toBe(select);
  });

  it("tracks focus/blur and forwards keyboard events", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Select onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>
        <Option value="a">A</Option>
      </Select>
    ));
    const select = getByRole("combobox") as HTMLSelectElement;
    select.focus();
    expect(document.activeElement).toBe(select);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(select, { key: "ArrowDown" });
    fireEvent.keyDown(select, { key: "Enter" });
    fireEvent.keyDown(select, { key: "Escape" });
    expect(onKeyDown.mock.calls.map((call) => call[0].key)).toEqual([
      "ArrowDown",
      "Enter",
      "Escape",
    ]);
    select.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("maps a Field error onto aria-invalid, describedBy and connects the label", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Field label="Color" validationState="error" validationMessage="Pick a color">
        <Select>
          <Option value="a">A</Option>
        </Select>
      </Field>
    ));
    const select = getByRole("combobox") as HTMLSelectElement;
    const labelFor = container.querySelector("label.sf-Label")!.getAttribute("for");
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(select.id).toBe(labelFor);
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("uses an explicit id over the Field control id", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Field label="Color">
        <Select id="own-select" />
      </Field>
    ));
    expect(getByRole("combobox")).toHaveAttribute("id", "own-select");
    expect(container.querySelector("label.sf-Label")!.getAttribute("for")).not.toBe("own-select");
  });

  it("keeps the deprecated Combobox renderable with props and input callbacks", () => {
    const onInput = vi.fn();
    const { container } = renderWithFluent(() => (
      <Combobox class="legacy" placeholder="Pick" value="a" onInput={onInput} />
    ));
    const root = container.querySelector(".sf-Combobox") as HTMLElement;
    expect(root).toHaveClass("legacy");
    const input = container.querySelector(".sf-Combobox__input") as HTMLInputElement;
    expect(input.placeholder).toBe("Pick");
    expect(input.value).toBe("a");
    fireEvent.input(input, { target: { value: "b" } });
    expect(onInput).toHaveBeenCalledWith("b");
  });

  it("keeps the deprecated Listbox and OptionItem parts renderable", () => {
    const onSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <Listbox class="my-listbox">
        <OptionItem value="a" selected active onSelect={onSelect}>Apple</OptionItem>
        <OptionItem value="b" disabled onSelect={onSelect}>Banana</OptionItem>
      </Listbox>
    ));
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    expect(listbox).toHaveClass("sf-Listbox");
    expect(listbox).toHaveClass("my-listbox");
    const options = container.querySelectorAll('[role="option"]');
    expect(options.length).toBe(2);
    expect(options[0]).toHaveClass("sf-Option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("data-active", "true");
    expect(options[1]).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(options[0]!);
    expect(onSelect).toHaveBeenCalledWith("a");
    fireEvent.click(options[1]!);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
