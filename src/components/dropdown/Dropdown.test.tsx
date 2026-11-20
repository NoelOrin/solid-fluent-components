import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import { Dropdown } from "./Dropdown";
import { renderWithFluent } from "../../test-utils/index";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

describe("Dropdown", () => {
  it("renders a select with options", () => {
    const onSelect = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Dropdown value="a" options={options} onOptionSelect={onSelect} />
    ));
    expect(container.querySelector(".sf-Dropdown")).toBeTruthy();
    getByRole("button").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.body.querySelectorAll(".sf-Option").length).toBe(2);
  });

  it("gives options ids and tracks the active option with aria-activedescendant", async () => {
    const { getByRole } = renderWithFluent(() => (
      <Dropdown
        defaultValue="a"
        options={options}
      />
    ));

    const trigger = getByRole("button");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-controls");
    trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const listbox = await waitFor(() => {
      const el = document.body.querySelector<HTMLElement>('[role="listbox"]');
      expect(el).toBeTruthy();
      return el!;
    });
    const opts = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="option"]'),
    );
    expect(opts.length).toBe(2);
    expect(opts[0]!.id).toBeTruthy();
    expect(opts[1]!.id).not.toBe(opts[0]!.id);

    await waitFor(() =>
      expect(trigger.getAttribute("aria-activedescendant")).toBe(opts[0]!.id),
    );
    expect(listbox).toHaveAttribute("aria-activedescendant", opts[0]!.id);

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await waitFor(() =>
      expect(trigger.getAttribute("aria-activedescendant")).toBe(opts[1]!.id),
    );
  });

  it("clears aria-activedescendant when closed", async () => {
    const { getByRole } = renderWithFluent(() => (
      <Dropdown options={[{ value: "a", label: "Apple" }]} />
    ));
    const trigger = getByRole("button");
    expect(trigger).not.toHaveAttribute("aria-activedescendant");
    trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() =>
      expect(trigger.getAttribute("aria-activedescendant")).toBeTruthy(),
    );
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await waitFor(() =>
      expect(trigger).not.toHaveAttribute("aria-activedescendant"),
    );
  });

  it("selects an option by click, reports data and returns focus to the trigger", async () => {
    const onOptionSelect = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Dropdown options={options} onOptionSelect={onOptionSelect} />
    ));
    const trigger = getByRole("button");
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="option"]').length).toBe(2),
    );
    fireEvent.click(document.body.querySelectorAll<HTMLElement>('[role="option"]')[1]!);
    expect(onOptionSelect).toHaveBeenCalledWith({ value: "b", option: options[1] });
    expect(container.querySelector(".sf-Dropdown__value")!.textContent).toBe("Banana");
    expect(document.activeElement).toBe(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() =>
      expect(document.body.querySelector('[role="listbox"]')).toBeNull(),
    );
  });

  it("a disabled trigger cannot be opened by keyboard and reflects disabled state", () => {
    const { getByRole } = renderWithFluent(() => (
      <Dropdown disabled options={options} placeholder="Choose" />
    ));
    const trigger = getByRole("button");
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.textContent).toContain("Choose");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(document.body.querySelector('[role="listbox"]')).toBeNull();
  });

  it("keyboard Enter opens then selects the active option and restores focus", async () => {
    const onOptionSelect = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Dropdown defaultValue="a" options={options} onOptionSelect={onOptionSelect} />
    ));
    const trigger = getByRole("button");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    await waitFor(() =>
      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy(),
    );
    await waitFor(() => expect(trigger.getAttribute("aria-activedescendant")).toBeTruthy());

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onOptionSelect).toHaveBeenCalledWith({ value: "b", option: options[1] });
    expect(document.activeElement).toBe(trigger);
  });

  it("skips disabled options in keyboard navigation and click", async () => {
    const onOptionSelect = vi.fn();
    const opts = [
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana", disabled: true },
      { value: "c", label: "Cherry" },
    ];
    const { getByRole } = renderWithFluent(() => (
      <Dropdown options={opts} onOptionSelect={onOptionSelect} />
    ));
    const trigger = getByRole("button");
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="option"]').length).toBe(3),
    );
    const rendered = document.body.querySelectorAll<HTMLElement>('[role="option"]');
    expect(rendered[1]).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(rendered[1]!);
    expect(onOptionSelect).not.toHaveBeenCalled();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() =>
      expect(trigger.getAttribute("aria-activedescendant")).toBe(rendered[2]!.id),
    );
  });

  it("respects a controlled value until the owner updates it", async () => {
    const onOptionSelect = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Dropdown value="a" options={options} onOptionSelect={onOptionSelect} />
    ));
    expect(container.querySelector(".sf-Dropdown__value")!.textContent).toBe("Apple");
    fireEvent.click(getByRole("button"));
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="option"]').length).toBe(2),
    );
    fireEvent.click(document.body.querySelectorAll<HTMLElement>('[role="option"]')[1]!);
    expect(onOptionSelect).toHaveBeenCalled();
    expect(container.querySelector(".sf-Dropdown__value")!.textContent).toBe("Apple");
  });

  it("typeahead moves the active option to a matching label", async () => {
    const { getByRole } = renderWithFluent(() => <Dropdown options={options} />);
    const trigger = getByRole("button");
    fireEvent.click(trigger);
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="option"]').length).toBe(2),
    );
    const rendered = document.body.querySelectorAll<HTMLElement>('[role="option"]');
    fireEvent.keyDown(trigger, { key: "b" });
    await waitFor(() =>
      expect(trigger.getAttribute("aria-activedescendant")).toBe(rendered[1]!.id),
    );
  });

  it("forwards placeholder and custom classes to root, button and listbox", async () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Dropdown
        class="my-dropdown"
        buttonClass="my-button"
        listboxClass="my-listbox"
        placeholder="Pick one"
        options={options}
      />
    ));
    expect(container.querySelector(".sf-Dropdown")!.classList.contains("my-dropdown")).toBe(true);
    const trigger = getByRole("button");
    expect(trigger.classList.contains("my-button")).toBe(true);
    expect(trigger.textContent).toContain("Pick one");

    fireEvent.click(trigger);
    await waitFor(() =>
      expect(document.body.querySelector(".sf-Dropdown__listbox")).toBeTruthy(),
    );
    expect(
      document.body.querySelector(".sf-Dropdown__listbox")!.classList.contains("my-listbox"),
    ).toBe(true);
  });
});
