import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Card, CardHeader, CardPreview, CardFooter } from "./Card";
import { renderWithFluent } from "../../test-utils/index";

describe("Card", () => {
  it("renders a card with appearance classes", () => {
    const { container } = renderWithFluent(() => (
      <Card appearance="outline">Body</Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.classList.contains("sf-Card--outline")).toBe(true);
    expect(card.textContent).toContain("Body");
  });

  it("renders sub-components", () => {
    const { container } = renderWithFluent(() => (
      <Card>
        <CardHeader header="Head" />
        <CardPreview>Img</CardPreview>
        <CardFooter>Foot</CardFooter>
      </Card>
    ));
    expect(container.querySelector(".sf-Card__header")).toBeTruthy();
    expect(container.querySelector(".sf-Card__preview")).toBeTruthy();
    expect(container.querySelector(".sf-Card__footer")).toBeTruthy();
  });

  it("supports uncontrolled selection and onSelectionChange", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Card defaultSelected={false} onSelectionChange={onSelectionChange}>
        Content
      </Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;
    expect(card).toHaveAttribute("data-selected", "false");
    fireEvent.click(card);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange.mock.calls[0]![1]).toEqual({ selected: true });
    expect(card).toHaveAttribute("data-selected", "true");
    expect(card).toHaveClass("sf-Card--selected");
  });

  it("respects controlled selected and does not leak selection props to the DOM", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Card selected={true} defaultSelected={false} onSelectionChange={onSelectionChange}>
        Content
      </Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;
    expect(card).toHaveAttribute("data-selected", "true");
    expect(card.hasAttribute("selected")).toBe(false);
    expect(card.hasAttribute("defaultSelected")).toBe(false);
    expect(card.hasAttribute("onSelectionChange")).toBe(false);
    fireEvent.click(card);
    expect(card).toHaveAttribute("data-selected", "true");
  });

  it("does not select when disabled and reflects focusMode", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <>
        <Card defaultSelected={false} disabled onSelectionChange={onSelectionChange}>
          Disabled
        </Card>
        <Card focusMode="no-tab">Focusable</Card>
      </>
    ));
    const [disabled, focusable] = Array.from(container.querySelectorAll(".sf-Card"));
    fireEvent.click(disabled as HTMLElement);
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(disabled).toHaveClass("sf-Card--disabled");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(focusable).toHaveAttribute("tabindex", "0");
    expect(focusable).toHaveClass("sf-Card--focus-no-tab");
  });

  it("renders a floating action slot", () => {
    const { container } = renderWithFluent(() => (
      <Card floatingAction={<span data-testid="floating">★</span>}>Body</Card>
    ));
    expect(container.querySelector(".sf-Card__floatingAction [data-testid='floating']")).toBeTruthy();
    expect(container.querySelector('.sf-Card [data-testid="floating"]')).toBeTruthy();
  });

  it("toggles selection with Enter and Space", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Card defaultSelected={false} onSelectionChange={onSelectionChange}>Content</Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;

    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange.mock.calls[0]![0].type).toBe("keydown");
    expect(onSelectionChange.mock.calls[0]![1]).toEqual({ selected: true });
    expect(card).toHaveAttribute("data-selected", "true");

    fireEvent.keyDown(card, { key: " " });
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(onSelectionChange.mock.calls[1]![1]).toEqual({ selected: false });
    expect(card).toHaveAttribute("data-selected", "false");
  });

  it("ignores Escape and arrow keys for selection", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Card defaultSelected={false} onSelectionChange={onSelectionChange}>Content</Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;

    fireEvent.keyDown(card, { key: "Escape" });
    fireEvent.keyDown(card, { key: "ArrowRight" });
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(card).toHaveAttribute("data-selected", "false");
  });

  it("toggles back and forth on repeated clicks", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Card defaultSelected={false} onSelectionChange={onSelectionChange}>Content</Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;

    fireEvent.click(card);
    expect(card).toHaveAttribute("data-selected", "true");
    fireEvent.click(card);
    expect(card).toHaveAttribute("data-selected", "false");
    expect(onSelectionChange.mock.calls.map((c) => c[1])).toEqual([
      { selected: true },
      { selected: false },
    ]);
  });

  it("keeps the hidden checkbox in sync with selected state", () => {
    const { container } = renderWithFluent(() => (
      <Card defaultSelected={true} onSelectionChange={() => {}}>Content</Card>
    ));
    const checkbox = container.querySelector(".sf-Card__checkbox") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.type).toBe("checkbox");
    expect(checkbox.checked).toBe(true);
    expect(checkbox).toHaveAttribute("aria-hidden", "true");
    expect(checkbox.tabIndex).toBe(-1);
  });

  it("exposes size, orientation and appearance hooks", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Card size="small" orientation="horizontal" appearance="subtle" class="my-card">A</Card>
        <Card appearance="filled-alternative">B</Card>
      </>
    ));
    const [first, second] = Array.from(container.querySelectorAll(".sf-Card"));
    expect(first).toHaveAttribute("data-size", "small");
    expect(first).toHaveAttribute("data-orientation", "horizontal");
    expect(first).toHaveClass("sf-Card--subtle", "my-card");
    expect(second).toHaveClass("sf-Card--filled-alt");
  });

  it("forwards onClick and onKeyDown handlers", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = renderWithFluent(() => (
      <Card onClick={onClick} onKeyDown={onKeyDown}>Content</Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;

    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "a" });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("renders sub-component image, description and action slots", () => {
    const { container, getByTestId } = renderWithFluent(() => (
      <Card>
        <CardHeader
          image={<span data-testid="h-image">I</span>}
          header="Head"
          description="Desc"
          action={<span data-testid="h-action">A</span>}
        />
        <CardPreview logo={<span data-testid="p-logo">L</span>}>Img</CardPreview>
        <CardFooter action={<span data-testid="f-action">F</span>}>Foot</CardFooter>
      </Card>
    ));
    expect(getByTestId("h-image")).toBeTruthy();
    expect(container.querySelector(".sf-Card__headerMain")?.textContent).toContain("Desc");
    expect(getByTestId("h-action")).toBeTruthy();
    expect(getByTestId("p-logo")).toBeTruthy();
    expect(getByTestId("f-action")).toBeTruthy();
  });

  it("makes a disabled selectable card unfocusable and ignores keyboard selection", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Card defaultSelected={false} disabled onSelectionChange={onSelectionChange}>Content</Card>
    ));
    const card = container.querySelector(".sf-Card") as HTMLElement;
    expect(card.tabIndex).toBe(-1);
    expect(card).toHaveAttribute("aria-disabled", "true");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(card).toHaveAttribute("data-selected", "false");
  });
});
