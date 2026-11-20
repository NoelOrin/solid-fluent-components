import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  Anchor,
  Body1Stronger,
  Caption1Strong,
  Caption1Stronger,
  Caption2Strong,
  DialogContentContainer,
  DrawerHeaderTitle,
  EmptyState,
  FluentCombobox,
  FluentOption,
  ProgressBarLabel,
  Stepper,
  StepperItem,
  ToastContainer,
  ToolbarRadioButton,
  ToolbarToggleButton,
} from "./Extras";
import { renderWithFluent } from "../../../test-utils/index";

describe("Extras", () => {
  it("renders typography extras", () => {
    const { container } = renderWithFluent(() => (
      <Caption1Strong>Caption</Caption1Strong>
    ));
    expect(container.textContent).toContain("Caption");
  });

  it("gives FluentCombobox focusable combobox semantics and options a listbox", () => {
    const onSelect = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <FluentCombobox onOptionSelect={onSelect} label="Fruit">
        <FluentOption value="apple">Apple</FluentOption>
        <FluentOption value="pear" disabled>
          Pear
        </FluentOption>
      </FluentCombobox>
    ));

    const combobox = getByRole("combobox", { name: "Fruit" });
    expect(combobox).toHaveAttribute("tabindex", "0");
    expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(combobox.getAttribute("aria-controls")).toBe(getByRole("listbox").id);

    const options = getByRole("listbox").querySelectorAll('[role="option"]');
    expect(options.length).toBe(2);
    expect(options[1]).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(options[0]!);
    expect(onSelect).toHaveBeenCalledWith({ selectedOptions: ["apple"] });
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(combobox, { key: "Escape" });
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector(".sf-Combobox")).toBeTruthy();
  });

  it("exposes radio semantics on ToolbarRadioButton", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToolbarRadioButton value="left" checked onChange={onChange}>
        Left
      </ToolbarRadioButton>
    ));
    const radio = getByRole("radio", { name: "Left" });
    expect(radio).toHaveAttribute("aria-checked", "true");
    fireEvent.click(radio);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders Stepper sub-components and reports step clicks", () => {
    const onStepClick = vi.fn();
    const { container, getAllByRole } = renderWithFluent(() => (
      <Stepper activeStep={1} onStepClick={onStepClick}>
        <StepperItem label="One" description="First" />
        <StepperItem label="Two" description="Second" />
      </Stepper>
    ));
    const items = container.querySelectorAll(".sf-Stepper__item");
    expect(items.length).toBe(2);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(container.querySelector(".sf-Stepper__desc")?.textContent).toContain("First");

    const buttons = getAllByRole("button") as HTMLElement[];
    fireEvent.click(buttons[0]!);
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it("keeps the data-driven Stepper API working", () => {
    const onStepClick = vi.fn();
    const { container } = renderWithFluent(() => (
      <Stepper activeStep={0} steps={[{ label: "A" }, { label: "B" }]} onStepClick={onStepClick} />
    ));
    expect(container.querySelectorAll(".sf-Stepper__item").length).toBe(2);
    expect(container.querySelector(".sf-Stepper__label")?.textContent).toContain("A");
    fireEvent.click(container.querySelectorAll(".sf-Stepper__button")[1]!);
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it("toggles multiselect options and updates aria-selected on repeated clicks", () => {
    const onOptionSelect = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <FluentCombobox multiselect label="Fruit" onOptionSelect={onOptionSelect}>
        <FluentOption value="apple">Apple</FluentOption>
        <FluentOption value="pear">Pear</FluentOption>
      </FluentCombobox>
    ));
    expect(getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    const options = getByRole("listbox").querySelectorAll('[role="option"]');

    fireEvent.click(options[0]!);
    expect(onOptionSelect).toHaveBeenLastCalledWith({ selectedOptions: ["apple"] });
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.click(options[1]!);
    expect(onOptionSelect).toHaveBeenLastCalledWith({ selectedOptions: ["apple", "pear"] });
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    fireEvent.click(options[0]!);
    expect(onOptionSelect).toHaveBeenLastCalledWith({ selectedOptions: ["pear"] });
    expect(options[0]).toHaveAttribute("aria-selected", "false");
  });

  it("selects options with Enter/Space and ignores disabled options", () => {
    const onOptionSelect = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <FluentCombobox label="Fruit" onOptionSelect={onOptionSelect}>
        <FluentOption value="apple">Apple</FluentOption>
        <FluentOption value="pear" disabled>Pear</FluentOption>
      </FluentCombobox>
    ));
    const options = getByRole("listbox").querySelectorAll<HTMLElement>('[role="option"]');

    fireEvent.keyDown(options[0]!, { key: "Enter" });
    expect(onOptionSelect).toHaveBeenLastCalledWith({ selectedOptions: ["apple"] });
    fireEvent.keyDown(options[0]!, { key: " " });
    expect(onOptionSelect).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(options[1]!, { key: "Enter" });
    fireEvent.click(options[1]!);
    expect(onOptionSelect).toHaveBeenCalledTimes(2);
    expect(options[1]).toHaveAttribute("aria-disabled", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("opens with ArrowDown, moves focus to an option and reports open changes", () => {
    const onOpenChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <FluentCombobox label="Fruit" defaultOpen={false} onOpenChange={onOpenChange}>
        <FluentOption value="apple">Apple</FluentOption>
        <FluentOption value="pear">Pear</FluentOption>
      </FluentCombobox>
    ));
    const combobox = getByRole("combobox", { name: "Fruit" });
    expect(combobox).toHaveAttribute("aria-expanded", "false");

    fireEvent.keyDown(combobox, { key: "ArrowDown" });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    const options = getByRole("listbox").querySelectorAll('[role="option"]');
    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(combobox, { key: "Escape" });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps a controlled selection fixed while still reporting option clicks", () => {
    const onOptionSelect = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <FluentCombobox label="Fruit" selectedOptions={["apple"]} onOptionSelect={onOptionSelect}>
        <FluentOption value="apple">Apple</FluentOption>
        <FluentOption value="pear">Pear</FluentOption>
      </FluentCombobox>
    ));
    const options = getByRole("listbox").querySelectorAll('[role="option"]');
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.click(options[1]!);
    expect(onOptionSelect).toHaveBeenCalledWith({ selectedOptions: ["pear"] });
    expect(options[1]).toHaveAttribute("aria-selected", "false");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("ToolbarToggleButton reflects checked state and reports the next value", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <>
        <ToolbarToggleButton onChange={onChange}>Off</ToolbarToggleButton>
        <ToolbarToggleButton checked onChange={onChange}>On</ToolbarToggleButton>
      </>
    ));
    const off = getByRole("button", { name: "Off" });
    const on = getByRole("button", { name: "On" });
    expect(off).toHaveAttribute("aria-pressed", "false");
    expect(on).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(off);
    expect(onChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(on);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("Stepper marks disabled and complete items via ARIA and classes", () => {
    const onStepClick = vi.fn();
    const { container } = renderWithFluent(() => (
      <Stepper activeStep={1} onStepClick={onStepClick}>
        <StepperItem label="One" disabled />
        <StepperItem label="Two" />
      </Stepper>
    ));
    const items = container.querySelectorAll(".sf-Stepper__item");
    const buttons = container.querySelectorAll<HTMLButtonElement>(".sf-Stepper__button");
    expect(buttons[0]).toBeDisabled();
    expect(items[0]).toHaveClass("sf-Stepper__item--complete");
    expect(items[1]).toHaveClass("sf-Stepper__item--active");
    expect(items[1]).toHaveAttribute("aria-current", "step");

    fireEvent.click(buttons[0]!);
    expect(onStepClick).not.toHaveBeenCalled();
  });

  it("ToastContainer applies the position and offset props", () => {
    const { container } = renderWithFluent(() => (
      <ToastContainer position="bottom-start" offset={{ horizontal: 8, vertical: 24 }}>
        <div>Toast</div>
      </ToastContainer>
    ));
    const toast = container.querySelector<HTMLElement>(".sf-Toaster")!;
    expect(toast).toHaveClass("sf-Toaster", "sf-Toaster--bottom-start");
    expect(toast.style.getPropertyValue("padding-inline")).toBe("8px");
    expect(toast.style.getPropertyValue("padding-block")).toBe("24px");
  });

  it("renders the remaining typography and layout extras", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <>
        <Caption1Stronger>A</Caption1Stronger>
        <Caption2Strong>B</Caption2Strong>
        <Body1Stronger>C</Body1Stronger>
        <ProgressBarLabel>Progress</ProgressBarLabel>
        <EmptyState title="Nothing" description="desc" />
        <Anchor href="/x" target="_blank" rel="noopener">Link</Anchor>
        <DialogContentContainer>Dialog</DialogContentContainer>
        <DrawerHeaderTitle action={<button>close</button>}>Title</DrawerHeaderTitle>
      </>
    ));
    expect(container.querySelector(".sf-Text--bold")).toHaveTextContent("A");
    expect(container.querySelector(".sf-Text--100.sf-Text--semibold")).toHaveTextContent("B");
    expect(container.querySelector(".sf-Text--300.sf-Text--bold")).toHaveTextContent("C");
    expect(container.querySelector(".sf-ProgressBarLabel")).toHaveTextContent("Progress");
    expect(container.querySelector(".sf-EmptyState__title")).toHaveTextContent("Nothing");
    expect(getByRole("link", { name: "Link" })).toHaveAttribute("href", "/x");
    expect(getByRole("link")).toHaveAttribute("rel", "noopener");
    expect(container.querySelector(".sf-Dialog__body")).toHaveTextContent("Dialog");
    expect(container.querySelector(".sf-DrawerHeaderTitle__text")).toHaveTextContent("Title");
  });
});
