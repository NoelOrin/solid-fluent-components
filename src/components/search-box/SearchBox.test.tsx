import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { SearchBox } from "./SearchBox";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("SearchBox", () => {
  it("renders a search input with default content, appearance and size", () => {
    const { container } = renderWithFluent(() => (
      <SearchBox placeholder="Search" name="q" />
    ));
    const root = container.querySelector(".sf-SearchBox") as HTMLElement;
    expect(root).toHaveClass("sf-Input");
    expect(root).toHaveClass("sf-Input--medium");
    expect(root).toHaveAttribute("data-appearance", "outline");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("search");
    expect(input.placeholder).toBe("Search");
    expect(input.name).toBe("q");
    const before = container.querySelector(".sf-Input__content") as HTMLElement;
    expect(before.getAttribute("aria-hidden")).toBe("true");
    expect(before.textContent).toBe("⌕");
  });

  it("applies size and appearance variants", () => {
    const { container } = renderWithFluent(() => (
      <SearchBox size="large" appearance="filled-darker" />
    ));
    const root = container.querySelector(".sf-SearchBox") as HTMLElement;
    expect(root).toHaveClass("sf-Input--large");
    expect(root).toHaveAttribute("data-appearance", "filled-darker");
  });

  it("renders custom before/after content", () => {
    const { container } = renderWithFluent(() => (
      <SearchBox
        contentBefore={<span data-testid="before">Find</span>}
        contentAfter={<span data-testid="after">Go</span>}
      />
    ));
    const contents = container.querySelectorAll(".sf-Input__content");
    expect(contents.length).toBe(2);
    expect(contents[0]!.textContent).toBe("Find");
    expect(contents[1]!.textContent).toBe("Go");
  });

  it("hides the clear button for an empty uncontrolled value", () => {
    const { container } = renderWithFluent(() => <SearchBox />);
    expect(container.querySelector(".sf-SearchBox__dismiss")).toBeNull();
  });

  it("shows the clear button after typing and clears an uncontrolled value once", () => {
    const onDismiss = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <SearchBox onDismiss={onDismiss} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "hello" } });
    expect(input.value).toBe("hello");
    const clear = getByRole("button", { name: "Clear" });
    expect(clear).toHaveClass("sf-SearchBox__dismiss");
    fireEvent.click(clear);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("");
    expect(container.querySelector(".sf-SearchBox__dismiss")).toBeNull();
  });

  it("forwards the input event with its target value", () => {
    const onInput = vi.fn();
    const { container } = renderWithFluent(() => <SearchBox onInput={onInput} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "query" } });
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput.mock.calls[0]![0].target).toBe(input);
    expect(input.value).toBe("query");
  });

  it("keeps a controlled value after dismiss is requested", () => {
    const onDismiss = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <SearchBox value="fixed" onDismiss={onDismiss} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("fixed");
    fireEvent.click(getByRole("button", { name: "Clear" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("fixed");
    expect(container.querySelector(".sf-SearchBox__dismiss")).toBeTruthy();
  });

  it("hides the clear button and blocks focus when disabled", () => {
    const onDismiss = vi.fn();
    const { container } = renderWithFluent(() => (
      <SearchBox value="fixed" disabled onDismiss={onDismiss} />
    ));
    const root = container.querySelector(".sf-Input") as HTMLElement;
    const input = container.querySelector("input") as HTMLInputElement;
    expect(root).toHaveClass("sf-Input--disabled");
    expect(input.disabled).toBe(true);
    expect(container.querySelector(".sf-SearchBox__dismiss")).toBeNull();
    input.focus();
    expect(document.activeElement).not.toBe(input);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("renders a custom dismiss glyph", () => {
    const { container } = renderWithFluent(() => (
      <SearchBox value="x" dismiss={<span data-testid="custom-clear">X</span>} />
    ));
    const clear = container.querySelector(".sf-SearchBox__dismiss") as HTMLElement;
    expect(clear).toBeTruthy();
    expect(clear.querySelector("[data-testid='custom-clear']")).toBeTruthy();
  });

  it("maps a Field error onto the root class and aria-invalid", () => {
    const { container } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="No results">
        <SearchBox />
      </Field>
    ));
    const root = container.querySelector(".sf-SearchBox") as HTMLElement;
    const input = container.querySelector("input") as HTMLInputElement;
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(root).toHaveClass("sf-Input--invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("tracks focus and forwards keyboard events to the handler", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = renderWithFluent(() => (
      <SearchBox onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input, { key: "Escape" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onKeyDown.mock.calls.map((call) => call[0].key)).toEqual([
      "Escape",
      "Enter",
    ]);
    input.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("uses an explicit id or the Field control id for labelling", () => {
    const own = renderWithFluent(() => <SearchBox id="search-own" />);
    expect(own.container.querySelector("input")).toHaveAttribute("id", "search-own");

    const field = renderWithFluent(() => (
      <Field label="Search">
        <SearchBox />
      </Field>
    ));
    const input = field.container.querySelector("input")!;
    const labelFor = field.container
      .querySelector("label.sf-Label")!
      .getAttribute("for");
    expect(input.id).toBe(labelFor);
  });
});
