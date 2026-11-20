import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import { ComboboxField, OptionGroup } from "./ComboboxField";
import { renderWithFluent } from "../../test-utils/index";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

describe("ComboboxField", () => {
  it("renders a combobox field with options", () => {
    const { container } = renderWithFluent(() => (
      <ComboboxField value="a" open options={options} />
    ));
    expect(container.querySelector(".sf-ComboboxField")).toBeTruthy();
    expect(container.querySelector(".sf-Combobox")).toBeTruthy();
    expect(document.body.querySelectorAll(".sf-Option").length).toBe(2);
  });

  it("renders option groups", () => {
    const { container } = renderWithFluent(() => (
      <OptionGroup label="Group">
        <div class="sf-Option">A</div>
      </OptionGroup>
    ));
    expect(container.textContent).toContain("Group");
  });

  it("clears the query when Escape is pressed", () => {
    const onInput = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField open options={[{ value: "a", label: "Apple" }]} onInput={onInput} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;

    fireEvent.input(input, { target: { value: "app" } });
    expect(input.value).toBe("app");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.value).toBe("");
    expect(onInput).toHaveBeenLastCalledWith("");
  });

  it("reports the removed option value on multiselect Backspace", () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField
        multiselect
        selectedOptions={["a"]}
        options={options}
        onOptionSelect={onOptionSelect}
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onOptionSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "a",
        optionValue: "a",
        optionText: "Apple",
        selectedOptions: [],
      }),
    );
  });

  it("filters options by the typed query and shows the empty state", () => {
    const onInput = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField defaultOpen options={options} onInput={onInput} />
    ));
    const input = container.querySelector<HTMLInputElement>("input")!;
    fireEvent.input(input, { target: { value: "ban" } });
    expect(input.value).toBe("ban");
    expect(onInput).toHaveBeenLastCalledWith("ban");
    const shown = document.body.querySelectorAll<HTMLElement>(".sf-Option");
    expect(shown.length).toBe(1);
    expect(shown[0]!.textContent).toContain("Banana");

    fireEvent.input(input, { target: { value: "zzz" } });
    expect(document.body.querySelector(".sf-Option--empty")!.textContent).toBe("No results");
  });

  it("selects an option by click and closes the listbox when uncontrolled", async () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField defaultOpen options={options} onOptionSelect={onOptionSelect} />
    ));
    const listOptions = document.body.querySelectorAll<HTMLElement>(".sf-Option");
    fireEvent.click(listOptions[1]!);
    expect(onOptionSelect).toHaveBeenCalledWith({
      value: "b",
      selectedOptions: ["b"],
      optionValue: "b",
      optionText: "Banana",
    });
    expect(container.querySelector<HTMLInputElement>("input")!.value).toBe("Banana");
    await waitFor(() => expect(document.body.querySelector(".sf-Listbox")).toBeNull());
    expect(container.querySelector("input")!).toHaveAttribute("aria-expanded", "false");
  });

  it("multiselect renders selected tags and toggles options on click", () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField
        multiselect
        defaultOpen
        defaultSelectedOptions={["a"]}
        options={options}
        onOptionSelect={onOptionSelect}
      />
    ));
    const combobox = container.querySelector<HTMLElement>(".sf-Combobox")!;
    expect(combobox.classList.contains("sf-Combobox--multiselect")).toBe(true);
    expect(container.querySelector("input")!).toHaveAttribute("aria-multiselectable", "true");
    expect(container.querySelector(".sf-Tag")!.textContent).toContain("Apple");

    fireEvent.click(document.body.querySelectorAll<HTMLElement>(".sf-Option")[1]!);
    expect(onOptionSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedOptions: ["a", "b"] }),
    );
    expect(container.querySelectorAll(".sf-Tag").length).toBe(2);

    fireEvent.click(document.body.querySelectorAll<HTMLElement>(".sf-Option")[0]!);
    expect(onOptionSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedOptions: ["b"] }),
    );
    expect(container.querySelectorAll(".sf-Tag").length).toBe(1);
  });

  it("clear button resets the query and the selection", () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField clearable defaultValue="Apple" options={options} onOptionSelect={onOptionSelect} />
    ));
    const input = container.querySelector<HTMLInputElement>("input")!;
    expect(input.value).toBe("Apple");
    const clear = container.querySelector<HTMLButtonElement>(".sf-Combobox__clear")!;
    expect(clear).toHaveAttribute("aria-label", "Clear");
    fireEvent.click(clear);
    expect(input.value).toBe("");
    expect(onOptionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "", selectedOptions: [] }),
    );
  });

  it("disabled field blocks keyboard interaction and reflects disabled state", () => {
    const onInput = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField disabled options={options} onInput={onInput} />
    ));
    const input = container.querySelector<HTMLInputElement>("input")!;
    expect(input.disabled).toBe(true);
    expect(container.querySelector(".sf-Combobox")!.classList.contains("sf-Combobox--disabled")).toBe(true);
    expect(container.querySelector(".sf-Combobox__expand")!).toBeDisabled();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(onInput).not.toHaveBeenCalled();
  });

  it("keyboard Home/End/Arrow keys skip disabled options and update aria-activedescendant", () => {
    const { container } = renderWithFluent(() => (
      <ComboboxField
        defaultOpen
        options={[
          { value: "a", label: "Apple" },
          { value: "b", label: "Banana", disabled: true },
          { value: "c", label: "Cherry" },
        ]}
      />
    ));
    const input = container.querySelector<HTMLInputElement>("input")!;
    const id = input.getAttribute("aria-controls")!;

    expect(input.getAttribute("aria-activedescendant")).toBe(id + "-opt-a");
    fireEvent.keyDown(input, { key: "End" });
    expect(input.getAttribute("aria-activedescendant")).toBe(id + "-opt-c");
    fireEvent.keyDown(input, { key: "Home" });
    expect(input.getAttribute("aria-activedescendant")).toBe(id + "-opt-a");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(id + "-opt-c");
  });

  it("reports open state changes through onOpenChange", () => {
    const onOpenChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField defaultOpen options={options} onOpenChange={onOpenChange} />
    ));
    const input = container.querySelector<HTMLInputElement>("input")!;
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("controlled selectedOptions stay fixed until the owner updates them", () => {
    const onOptionSelect = vi.fn();
    const { container } = renderWithFluent(() => (
      <ComboboxField
        multiselect
        defaultOpen
        selectedOptions={["a"]}
        options={options}
        onOptionSelect={onOptionSelect}
      />
    ));
    fireEvent.click(document.body.querySelectorAll<HTMLElement>(".sf-Option")[1]!);
    // The controlled value is unchanged even though the callback fired.
    expect(container.querySelectorAll(".sf-Tag").length).toBe(1);
    expect(container.querySelector(".sf-Tag")!.textContent).toContain("Apple");
    expect(onOptionSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedOptions: ["a", "b"] }),
    );
  });
});
