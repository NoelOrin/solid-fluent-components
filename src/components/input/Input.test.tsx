import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Input } from "./Input";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("Input", () => {
  it("renders a field with the medium size by default and forwards native props", () => {
    const { container } = renderWithFluent(() => (
      <Input value="abc" placeholder="Name" name="userName" />
    ));
    const root = container.querySelector(".sf-Input") as HTMLElement;
    expect(root).toHaveClass("sf-Input--medium");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toHaveClass("sf-Input__field");
    expect(input.value).toBe("abc");
    expect(input.placeholder).toBe("Name");
    expect(input.name).toBe("userName");
  });

  it("applies the small and large size variants", () => {
    const small = renderWithFluent(() => <Input size="small" />);
    const large = renderWithFluent(() => <Input size="large" />);
    expect(small.container.querySelector(".sf-Input")).toHaveClass("sf-Input--small");
    expect(large.container.querySelector(".sf-Input")).toHaveClass("sf-Input--large");
  });

  it("renders before/after content around the native field in order", () => {
    const { container } = renderWithFluent(() => (
      <Input
        contentBefore={<span data-testid="before">Before</span>}
        contentAfter={<span data-testid="after">After</span>}
      />
    ));
    const contents = container.querySelectorAll(".sf-Input__content");
    expect(contents.length).toBe(2);
    expect(contents[0]!.textContent).toBe("Before");
    expect(contents[1]!.textContent).toBe("After");
    expect(container.querySelector(".sf-Input")!.children[1]).toBe(
      container.querySelector("input"),
    );
  });

  it("disables the native control and prevents it from taking focus", () => {
    const { container } = renderWithFluent(() => <Input disabled />);
    const root = container.querySelector(".sf-Input") as HTMLElement;
    const input = container.querySelector("input") as HTMLInputElement;
    expect(root).toHaveClass("sf-Input--disabled");
    expect(input.disabled).toBe(true);
    input.focus();
    expect(document.activeElement).not.toBe(input);
  });

  it("reports the typed value through the input event", () => {
    const onInput = vi.fn();
    const { container } = renderWithFluent(() => <Input onInput={onInput} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "hello" } });
    expect(input.value).toBe("hello");
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput.mock.calls[0]![0].target).toBe(input);
  });

  it("fires change with the current target value", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => <Input onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "done" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target.value).toBe("done");
  });

  it("tracks focus and blur and updates document.activeElement", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { container } = renderWithFluent(() => (
      <Input onFocus={onFocus} onBlur={onBlur} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    input.blur();
    expect(document.activeElement).not.toBe(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards keyboard events such as Enter and Escape", () => {
    const onKeyDown = vi.fn();
    const { container } = renderWithFluent(() => (
      <Input onKeyDown={onKeyDown} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onKeyDown.mock.calls.map((call) => call[0].key)).toEqual([
      "Enter",
      "Escape",
    ]);
  });

  it("reflects invalid state from the prop and from a Field error", () => {
    const own = renderWithFluent(() => <Input invalid />);
    expect(own.container.querySelector(".sf-Input")).toHaveClass("sf-Input--invalid");
    expect(own.container.querySelector("input")).toHaveAttribute("aria-invalid", "true");

    const fromField = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Bad value">
        <Input />
      </Field>
    ));
    const input = fromField.container.querySelector("input") as HTMLInputElement;
    const validation = fromField.container.querySelector(".sf-Field__validation")!;
    expect(fromField.container.querySelector(".sf-Input")).toHaveClass("sf-Input--invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("uses an explicit id or the Field control id for labelling", () => {
    const own = renderWithFluent(() => <Input id="my-input" />);
    expect(own.container.querySelector("input")).toHaveAttribute("id", "my-input");

    const field = renderWithFluent(() => (
      <Field label="Name">
        <Input />
      </Field>
    ));
    const input = field.container.querySelector("input")!;
    const labelFor = field.container
      .querySelector("label.sf-Label")!
      .getAttribute("for");
    expect(input.id).toBe(labelFor);
  });

  it("reflects a controlled value driven by a signal", () => {
    const [value, setValue] = createSignal("a");
    const { container } = renderWithFluent(() => (
      <Input value={value()} onInput={(event) => setValue(event.currentTarget.value)} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("a");
    fireEvent.input(input, { target: { value: "ab" } });
    expect(input.value).toBe("ab");
    setValue("z");
    expect(input.value).toBe("z");
  });
});
