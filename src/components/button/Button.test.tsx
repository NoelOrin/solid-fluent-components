import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Button } from "./Button";
import { renderWithFluent } from "../../test-utils/index";

describe("Button", () => {
  it("renders its children inside a fluent button", () => {
    const { container } = renderWithFluent(() => <Button>Hello</Button>);
    const btn = container.querySelector(".sf-Button") as HTMLButtonElement;
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Hello");
  });

  it("uses secondary/rounded/medium as the default variants", () => {
    const { getByRole } = renderWithFluent(() => <Button>Hello</Button>);
    expect(getByRole("button")).toHaveClass(
      "sf-Button",
      "sf-focus-ring",
      "sf-Button--secondary",
      "sf-Button--rounded",
      "sf-Button--medium",
    );
  });

  it("keeps a custom class alongside the computed variant classes", () => {
    const { getByRole } = renderWithFluent(() => (
      <Button class="my-button" appearance="primary">Hello</Button>
    ));
    expect(getByRole("button")).toHaveClass(
      "sf-Button",
      "sf-Button--primary",
      "my-button",
    );
  });

  it("maps appearance, shape and size props to real class modifiers", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <>
        <Button appearance="primary" shape="circular" size="large">A</Button>
        <Button appearance="outline" shape="square" size="small">B</Button>
        <Button appearance="transparent">C</Button>
      </>
    ));
    const [a, b, c] = getAllByRole("button") as HTMLElement[];
    expect(a).toHaveClass("sf-Button--primary", "sf-Button--circular", "sf-Button--large");
    expect(b).toHaveClass("sf-Button--outline", "sf-Button--square", "sf-Button--small");
    expect(c).toHaveClass("sf-Button--transparent", "sf-Button--rounded", "sf-Button--medium");
  });

  it("renders an icon before the label by default", () => {
    const { container } = renderWithFluent(() => (
      <Button icon={<span data-testid="star">★</span>}>Save</Button>
    ));
    const btn = container.querySelector(".sf-Button") as HTMLElement;
    const icon = btn.querySelector(".sf-Button__icon") as HTMLElement;
    expect(icon).toHaveTextContent("★");
    expect(btn.firstElementChild).toBe(icon);
  });

  it("renders the icon after the label when iconPosition is after", () => {
    const { container } = renderWithFluent(() => (
      <Button icon={<span>★</span>} iconPosition="after">Save</Button>
    ));
    const btn = container.querySelector(".sf-Button") as HTMLElement;
    expect(btn.lastElementChild).toHaveClass("sf-Button__icon");
    expect(btn).toHaveTextContent("Save");
  });

  it("forwards native button attributes to the rendered element", () => {
    const { getByRole } = renderWithFluent(() => (
      <Button id="save" name="saveButton" title="Save file" aria-label="Save file">
        Go
      </Button>
    ));
    const btn = getByRole("button", { name: "Save file" });
    expect(btn).toHaveAttribute("id", "save");
    expect(btn).toHaveAttribute("name", "saveButton");
    expect(btn).toHaveAttribute("title", "Save file");
  });

  it("is a focusable native button, so keyboard users can reach it", () => {
    const { getByRole } = renderWithFluent(() => <Button>Go</Button>);
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.tabIndex).toBe(0);
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it("calls onClick once with the click event", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button onClick={onClick}>Go</Button>
    ));
    const btn = getByRole("button");
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it("is natively disabled when disabled, so it leaves the tab order and native form semantics", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button disabled onClick={onClick}>Go</Button>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn).toHaveAttribute("aria-disabled", "true");
    btn.focus();
    expect(document.activeElement).not.toBe(btn);
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps disabledFocusable buttons focusable and inert", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button disabledFocusable onClick={onClick}>Disabled but focusable</Button>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn).not.toHaveAttribute("disabled");
    btn.focus();
    expect(document.activeElement).toBe(btn);
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("stops a focusable-disabled button click from reaching ancestor handlers", () => {
    const onParentClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <div onClick={onParentClick}>
        {/* Native `disabled` suppresses the click entirely in a browser; the
            aria-only variant still needs the component to stop propagation. */}
        <Button disabledFocusable>Go</Button>
      </div>
    ));
    fireEvent.click(getByRole("button"));
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it("forwards focus and blur handlers so focus changes can be observed", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button onFocus={onFocus} onBlur={onBlur}>Go</Button>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    btn.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    btn.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
