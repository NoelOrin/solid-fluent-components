import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { SwatchPicker, ColorSwatch, ImageSwatch, SwatchPickerRow, EmptySwatch } from "./SwatchPicker";
import { renderWithFluent } from "../../test-utils/index";

describe("SwatchPicker sub-components", () => {
  it("selects a swatch and renders row/image/empty", () => {
    const onSelectionChange = vi.fn();
    const { getByRole, container } = renderWithFluent(() => (
      <SwatchPicker
        items={[{ value: "r", color: "#f00", label: "Red" }]}
        onSelectionChange={onSelectionChange}
      >
        <SwatchPickerRow>
          <ImageSwatch src="x.png" value="img" label="Image" />
        </SwatchPickerRow>
        <EmptySwatch label="Empty" />
      </SwatchPicker>
    ));
    fireEvent.click(getByRole("option", { name: "Red" }));
    expect(onSelectionChange).toHaveBeenCalledWith(["r"]);
    expect(container.querySelector(".sf-ColorSwatch--image")).toBeTruthy();
    expect(container.querySelector(".sf-ColorSwatch--empty")).toBeTruthy();
    expect(ColorSwatch).toBeTypeOf("function");
  });

  it("uses roving tabindex and arrow keys skip disabled swatches", () => {
    const { container } = renderWithFluent(() => (
      <SwatchPicker
        items={[
          { value: "r", color: "#f00", label: "Red" },
          { value: "g", color: "#0f0", label: "Green", disabled: true },
          { value: "b", color: "#00f", label: "Blue" },
        ]}
      />
    ));
    const swatches = Array.from(
      container.querySelectorAll<HTMLButtonElement>(".sf-SwatchPicker > button"),
    );
    expect(swatches).toHaveLength(3);
    expect(swatches.map((s) => s.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    swatches[0]!.focus();
    fireEvent.keyDown(swatches[0]!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(swatches[2]);
    expect(swatches[2]!.getAttribute("tabindex")).toBe("0");
  });

  it("supports the legacy onChange callback", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <SwatchPicker
        items={[{ value: "r", color: "#f00", label: "Red" }]}
        onChange={onChange}
      />
    ));
    fireEvent.click(getByRole("option", { name: "Red" }));
    expect(onChange).toHaveBeenCalledWith(["r"]);
  });

  it("applies size, shape, spacing and class variants to the listbox", () => {
    const { getByRole } = renderWithFluent(() => (
      <SwatchPicker
        items={[{ value: "r", color: "#f00", label: "Red" }]}
        size="large"
        shape="circular"
        spacing="small"
        class="my-picker"
      />
    ));
    const list = getByRole("listbox");
    expect(list).toHaveClass(
      "sf-SwatchPicker",
      "sf-SwatchPicker--large",
      "sf-SwatchPicker--circular",
      "sf-SwatchPicker--spacing-small",
      "my-picker",
    );
    expect(list).not.toHaveAttribute("aria-multiselectable");
  });

  it("toggles multiple selection and updates aria-selected on repeated clicks", () => {
    const onSelectionChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <SwatchPicker
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
        items={[
          { value: "r", color: "#f00", label: "Red" },
          { value: "g", color: "#0f0", label: "Green" },
        ]}
      />
    ));
    const list = getByRole("listbox");
    expect(list).toHaveAttribute("aria-multiselectable", "true");
    const red = getByRole("option", { name: "Red" });
    const green = getByRole("option", { name: "Green" });

    fireEvent.click(red);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["r"]);
    expect(red).toHaveAttribute("aria-selected", "true");
    fireEvent.click(green);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["r", "g"]);
    expect(green).toHaveAttribute("aria-selected", "true");
    fireEvent.click(red);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["g"]);
    expect(red).toHaveAttribute("aria-selected", "false");
  });

  it("keeps a controlled selection fixed while still notifying on click", () => {
    const onSelectionChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <SwatchPicker
        selectedItems={["r"]}
        onSelectionChange={onSelectionChange}
        items={[
          { value: "r", color: "#f00", label: "Red" },
          { value: "b", color: "#00f", label: "Blue" },
        ]}
      />
    ));
    const red = getByRole("option", { name: "Red" });
    const blue = getByRole("option", { name: "Blue" });
    expect(red).toHaveAttribute("aria-selected", "true");
    expect(blue).toHaveAttribute("aria-selected", "false");

    fireEvent.click(blue);
    expect(onSelectionChange).toHaveBeenCalledWith(["b"]);
    expect(blue).toHaveAttribute("aria-selected", "false");
    expect(red).toHaveAttribute("aria-selected", "true");
  });

  it("renders no options for empty items and ignores arrow keys", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <SwatchPicker items={[]} />
    ));
    const list = getByRole("listbox");
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(0);
    fireEvent.keyDown(list, { key: "ArrowRight" });
    fireEvent.keyDown(list, { key: "Home" });
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(0);
  });

  it("supports Home/End navigation and ignores disabled swatch clicks", () => {
    const onSelectionChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <SwatchPicker
        onSelectionChange={onSelectionChange}
        items={[
          { value: "r", color: "#f00", label: "Red" },
          { value: "g", color: "#0f0", label: "Green", disabled: true },
          { value: "b", color: "#00f", label: "Blue" },
        ]}
      />
    ));
    const swatches = Array.from(
      container.querySelectorAll<HTMLButtonElement>(".sf-SwatchPicker > button"),
    );
    const green = swatches[1]!;
    expect(green).toBeDisabled();
    expect(green).toHaveClass("sf-ColorSwatch--disabled");
    swatches[2]!.focus();
    fireEvent.keyDown(swatches[2]!, { key: "Home" });
    expect(document.activeElement).toBe(swatches[0]);
    fireEvent.keyDown(swatches[0]!, { key: "End" });
    expect(document.activeElement).toBe(swatches[2]);

    fireEvent.click(green);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("forwards clicks and selected state from ColorSwatch and ImageSwatch", () => {
    const onImage = vi.fn();
    const onColor = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <>
        <ImageSwatch src="x.png" value="img" label="Image" selected onClick={onImage} />
        <ColorSwatch color="#f00" value="r" aria-label="Red swatch" onClick={onColor} />
      </>
    ));
    const image = getByRole("option", { name: "Image" });
    expect(image).toHaveAttribute("aria-selected", "true");
    fireEvent.click(image);
    expect(onImage).toHaveBeenCalledWith("img");

    const color = getByRole("option", { name: "Red swatch" });
    fireEvent.click(color);
    expect(onColor).toHaveBeenCalledTimes(1);
  });
});
