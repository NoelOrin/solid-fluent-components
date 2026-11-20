import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Label } from "./Label";
import { renderWithFluent } from "../../test-utils/index";

describe("Label", () => {
  it("renders a label with its text and default weight/size hooks", () => {
    const { container } = renderWithFluent(() => <Label>Name</Label>);
    const label = container.querySelector(".sf-Label") as HTMLLabelElement;
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Name");
    expect(label).toHaveAttribute("data-weight", "semibold");
    expect(label).toHaveAttribute("data-size", "medium");
  });

  it("appends a visible required marker only when required", () => {
    const { getByText, queryByText } = renderWithFluent(() => (
      <>
        <Label required>Required field</Label>
        <Label>Optional field</Label>
      </>
    ));
    expect(getByText("Required field").querySelector(".sf-Label__required")).toHaveTextContent("*");
    expect(queryByText("Optional field")?.querySelector(".sf-Label__required")).toBeNull();
  });

  it("reflects disabled state with a class", () => {
    const { container } = renderWithFluent(() => <Label disabled>Name</Label>);
    expect(container.querySelector(".sf-Label")).toHaveClass("sf-Label--disabled");
  });

  it("maps weight and size props to data attributes", () => {
    const { container } = renderWithFluent(() => (
      <Label weight="regular" size="large">Name</Label>
    ));
    const label = container.querySelector(".sf-Label") as HTMLElement;
    expect(label).toHaveAttribute("data-weight", "regular");
    expect(label).toHaveAttribute("data-size", "large");
  });

  it("associates with a control through the for prop", () => {
    const { getByLabelText } = renderWithFluent(() => (
      <>
        <Label for="name-input">Name</Label>
        <input id="name-input" />
      </>
    ));
    expect(getByLabelText("Name")).toHaveAttribute("id", "name-input");
  });

  it("keeps the label out of the tab order while its control is focusable", () => {
    const { getByText, getByLabelText } = renderWithFluent(() => (
      <>
        <Label for="focus-input">Focus me</Label>
        <input id="focus-input" />
      </>
    ));
    const label = getByText("Focus me") as HTMLLabelElement;
    expect(label.tabIndex).toBe(-1);
    const input = getByLabelText("Focus me") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
  });

  it("merges a custom class and forwards native attributes", () => {
    const { container } = renderWithFluent(() => (
      <Label id="my-label" class="my-label" title="A name" disabled>
        Name
      </Label>
    ));
    const label = container.querySelector(".sf-Label") as HTMLElement;
    expect(label).toHaveClass("sf-Label", "my-label", "sf-Label--disabled");
    expect(label).toHaveAttribute("id", "my-label");
    expect(label).toHaveAttribute("title", "A name");
  });

  it("forwards click handlers through rest props even in the disabled style", () => {
    const onClick = vi.fn();
    const { getByText } = renderWithFluent(() => (
      <>
        <Label for="disabled-input" disabled onClick={onClick}>Name</Label>
        <input id="disabled-input" />
      </>
    ));
    fireEvent.click(getByText("Name"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(getByText("Name").tagName).toBe("LABEL");
  });
});
