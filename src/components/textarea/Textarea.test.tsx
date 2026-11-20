import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Textarea } from "./Textarea";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("Textarea", () => {
  it("renders a focusable textarea with medium size and forwarded props", () => {
    const { container } = renderWithFluent(() => (
      <Textarea value="hi" placeholder="Notes" rows={4} name="notes" />
    ));
    const root = container.querySelector(".sf-Textarea") as HTMLElement;
    expect(root).toHaveClass("sf-focus-ring");
    expect(root).toHaveAttribute("data-size", "medium");
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(el.value).toBe("hi");
    expect(el.placeholder).toBe("Notes");
    expect(el.rows).toBe(4);
    expect(el.name).toBe("notes");
  });

  it("exposes small and large size variants through data-size", () => {
    const small = renderWithFluent(() => <Textarea size="small" />);
    const large = renderWithFluent(() => <Textarea size="large" />);
    expect(small.container.querySelector(".sf-Textarea")).toHaveAttribute("data-size", "small");
    expect(large.container.querySelector(".sf-Textarea")).toHaveAttribute("data-size", "large");
  });

  it("defaults to vertical resize and lets the resize prop change it", () => {
    const none = renderWithFluent(() => <Textarea resize="none" />);
    const both = renderWithFluent(() => <Textarea resize="both" />);
    expect(none.container.querySelector("textarea")).toHaveStyle({ resize: "none" });
    expect(both.container.querySelector("textarea")).toHaveStyle({ resize: "both" });
    const fallback = renderWithFluent(() => <Textarea />);
    expect(fallback.container.querySelector("textarea")).toHaveStyle({ resize: "vertical" });
  });

  it("merges a custom style object with the resize value", () => {
    const { container } = renderWithFluent(() => (
      <Textarea resize="horizontal" style={{ "min-height": "80px" }} />
    ));
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(el).toHaveStyle({ resize: "horizontal" });
    expect(el).toHaveStyle({ "min-height": "80px" });
  });

  it("reflects the invalid prop with a class and aria-invalid", () => {
    const { container } = renderWithFluent(() => <Textarea invalid />);
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(el).toHaveClass("sf-Textarea--invalid");
    expect(el).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the native control and blocks focus", () => {
    const { container } = renderWithFluent(() => <Textarea disabled />);
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(el.disabled).toBe(true);
    el.focus();
    expect(document.activeElement).not.toBe(el);
  });

  it("maps a Field error onto aria-invalid and aria-describedby", () => {
    const { container } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Too short" hint="Hint text">
        <Textarea />
      </Field>
    ));
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el.getAttribute("aria-describedby")).toContain(validation.id);
    expect(container.querySelector(".sf-Field__hint")).toBeNull();
  });

  it("links the hint and leaves aria-invalid off when the field is valid", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Bio" hint="Tell us about yourself">
        <Textarea />
      </Field>
    ));
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    const hint = container.querySelector(".sf-Field__hint")!;
    const labelFor = container.querySelector("label.sf-Label")!.getAttribute("for");
    expect(el.id).toBe(labelFor);
    expect(el.getAttribute("aria-describedby")).toBe(hint.id);
    expect(el).not.toHaveAttribute("aria-invalid");
  });

  it("reports typed text and change events with callback arguments", () => {
    const onInput = vi.fn();
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Textarea onInput={onInput} onChange={onChange} />
    ));
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.input(el, { target: { value: "first line" } });
    expect(el.value).toBe("first line");
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput.mock.calls[0]![0].target).toBe(el);
    fireEvent.change(el, { target: { value: "second line" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target.value).toBe("second line");
  });

  it("tracks focus/blur and forwards keyboard events", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = renderWithFluent(() => (
      <Textarea onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} />
    ));
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    el.focus();
    expect(document.activeElement).toBe(el);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(el, { key: "Enter" });
    fireEvent.keyDown(el, { key: "ArrowDown" });
    fireEvent.keyDown(el, { key: "Home" });
    expect(onKeyDown.mock.calls.map((call) => call[0].key)).toEqual([
      "Enter",
      "ArrowDown",
      "Home",
    ]);
    el.blur();
    expect(document.activeElement).not.toBe(el);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("keeps a controlled value in sync with a signal", () => {
    const [value, setValue] = createSignal("one");
    const { container } = renderWithFluent(() => (
      <Textarea value={value()} onInput={(event) => setValue(event.currentTarget.value)} />
    ));
    const el = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(el.value).toBe("one");
    fireEvent.input(el, { target: { value: "two" } });
    expect(el.value).toBe("two");
    setValue("three");
    expect(el.value).toBe("three");
  });

  it("prefers an explicit id over the Field control id", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Bio">
        <Textarea id="own-id" />
      </Field>
    ));
    const el = container.querySelector("textarea")!;
    expect(el).toHaveAttribute("id", "own-id");
    expect(container.querySelector("label.sf-Label")!.getAttribute("for")).not.toBe("own-id");
  });
});
