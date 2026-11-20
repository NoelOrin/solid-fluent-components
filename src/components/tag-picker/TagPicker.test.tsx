import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import {
  TagPicker,
  TagPickerButton,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  TagPickerOptionGroup,
} from "./TagPicker";
import { renderWithFluent } from "../../test-utils/index";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
];

describe("TagPicker sub-components", () => {
  it("renders the picker and option selection sub-parts", () => {
    const onSelect = vi.fn();
    const r1 = renderWithFluent(() => <TagPicker options={options} />);
    expect(r1.container.querySelector(".sf-TagPicker")).toBeTruthy();

    const r2 = renderWithFluent(() => (
      <TagPickerList>
        <TagPickerOption value="a" label="Apple" onClick={onSelect} />
        <TagPickerOptionGroup label="g">
          <TagPickerOption value="b" label="Banana" />
        </TagPickerOptionGroup>
      </TagPickerList>
    ));
    r2.getByText("Apple").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  it("standalone TagPickerButton / Group / Input render", () => {
    const { container } = renderWithFluent(() => (
      <TagPickerGroup>
        <TagPickerButton>Open</TagPickerButton>
        <TagPickerInput placeholder="type" />
      </TagPickerGroup>
    ));
    expect(container.querySelector(".sf-TagPicker__group")).toBeTruthy();
    expect(container.querySelector(".sf-TagPicker__button")).toBeTruthy();
    expect(container.querySelector(".sf-TagPicker__input")).toBeTruthy();
  });

  it("TagPickerOption exposes selected/disabled ARIA and blocks disabled clicks", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <TagPickerList>
        <TagPickerOption value="a" label="Apple" selected />
        <TagPickerOption value="b" label="Banana" disabled onClick={onClick} />
      </TagPickerList>
    ));
    expect(getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "true");
    const disabled = getByRole("option", { name: "Banana" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(disabled);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("TagPicker keyboard and ARIA", () => {
  it("exposes combobox ARIA and supports ArrowDown / Enter / Escape", async () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <TagPicker options={options} defaultOpen onOptionSelect={onOptionSelect} />
    ));
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-multiselectable")).toBe("true");
    const listboxId = input.getAttribute("aria-controls")!;
    await waitFor(() => expect(document.querySelector("#" + listboxId)).toBeTruthy());
    expect(input.getAttribute("aria-activedescendant")).toBe(listboxId + "-opt-a");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(input.getAttribute("aria-activedescendant")).toBe(listboxId + "-opt-b");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(onOptionSelect).toHaveBeenCalledWith(["b"]);
    expect(container.textContent).toContain("Banana");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await waitFor(() => expect(document.querySelector("#" + listboxId)).toBeNull());
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("skips disabled options and supports Home / End / Backspace", () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <TagPicker
        options={options}
        defaultSelectedOptions={["a"]}
        defaultOpen
        onOptionSelect={onOptionSelect}
      />
    ));
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    // The trailing Cherry is disabled, so the active item falls back to Banana.
    expect(input.getAttribute("aria-activedescendant")?.endsWith("-opt-b")).toBe(true);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }));
    expect(onOptionSelect).toHaveBeenCalledWith([]);
  });

  it("supports controlled open state", async () => {
    const [open, setOpen] = createSignal(false);
    const { container } = renderWithFluent(() => (
      <TagPicker options={options} open={open()} onOpenChange={setOpen} />
    ));
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    expect(input.getAttribute("aria-expanded")).toBe("false");
    input.focus();
    await waitFor(() => expect(input.getAttribute("aria-expanded")).toBe("true"));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await waitFor(() => expect(input.getAttribute("aria-expanded")).toBe("false"));
    expect(document.querySelector(".sf-Listbox")).toBeNull();
  });

  it("closing the picker on blur", async () => {
    const { container, getByRole } = renderWithFluent(() => (
      <>
        <TagPicker options={options} defaultOpen />
        <button type="button">outside</button>
      </>
    ));
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    input.focus();
    getByRole("button", { name: "outside" }).focus();
    await waitFor(() => expect(document.querySelector(".sf-Listbox")).toBeNull());
  });

  it("does not reopen when a selected tag is dismissed", async () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <TagPicker
        options={options}
        defaultSelectedOptions={["a"]}
        onOptionSelect={onOptionSelect}
      />
    ));
    container.querySelector<HTMLElement>(".sf-Tag__dismiss")!.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(onOptionSelect).toHaveBeenCalledWith([]);
    await waitFor(() => expect(document.querySelector(".sf-Listbox")).toBeNull());
  });

  it("typing filters the options and keeps aria-activedescendant in sync", async () => {
    const { container } = renderWithFluent(() => <TagPicker options={options} defaultOpen />);
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    fireEvent.input(input, { target: { value: "ban" } });
    expect(input.value).toBe("ban");
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="option"]').length).toBe(1),
    );
    expect(document.body.querySelector('[role="option"]')!.textContent).toContain("Banana");
    expect(input.getAttribute("aria-activedescendant")?.endsWith("-opt-b")).toBe(true);
  });

  it("shows an empty fallback when no option matches the query", async () => {
    const { container } = renderWithFluent(() => <TagPicker options={options} defaultOpen />);
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    fireEvent.input(input, { target: { value: "zzz" } });
    await waitFor(() => expect(document.querySelector(".sf-Option--empty")).toBeTruthy());
    expect(document.querySelector(".sf-Option--empty")!.textContent).toBe("没有更多选项");
  });

  it("Tab closes the listbox", async () => {
    const { container } = renderWithFluent(() => <TagPicker options={options} defaultOpen />);
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    fireEvent.keyDown(input, { key: "Tab" });
    await waitFor(() => expect(document.querySelector(".sf-Listbox")).toBeNull());
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("a disabled picker ignores input and keyboard interaction", () => {
    const { container } = renderWithFluent(() => <TagPicker options={options} disabled />);
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    expect(input.disabled).toBe(true);
    expect(container.querySelector(".sf-TagPicker__control--disabled")).toBeTruthy();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(document.querySelector(".sf-Listbox")).toBeNull();
  });

  it("controlled selectedOptions stay fixed until the owner updates them", async () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <TagPicker
        options={options}
        selectedOptions={["a"]}
        defaultOpen
        onOptionSelect={onOptionSelect}
      />
    ));
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="option"]').length).toBeGreaterThan(0),
    );
    fireEvent.click(document.body.querySelector<HTMLElement>('[role="option"]')!);
    expect(onOptionSelect).toHaveBeenCalledWith(["a", "b"]);
    expect(container.querySelectorAll(".sf-Tag").length).toBe(1);
    expect(container.querySelector(".sf-Tag")!.textContent).toContain("Apple");
  });

  it("clicking an option adds a selected tag and reports the new value", async () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <TagPicker options={options} defaultOpen onOptionSelect={onOptionSelect} />
    ));
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="option"]').length).toBe(3),
    );
    fireEvent.click(document.body.querySelector<HTMLElement>('[role="option"]')!);
    expect(onOptionSelect).toHaveBeenCalledWith(["a"]);
    expect(container.querySelector(".sf-Tag")!.textContent).toContain("Apple");
  });
});
