import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  AlphaSlider,
  ColorArea,
  ColorPicker,
  ColorPreview,
  ColorSlider,
  HexInput,
  hsvaToCss,
  hsvaToHex,
  parseColor,
} from "./ColorPicker";
import { renderWithFluent } from "../../test-utils/index";

describe("ColorPicker", () => {
  it("renders color surfaces", () => {
    const { container } = renderWithFluent(() => (
      <ColorPicker color={{ h: 0, s: 0, v: 1, a: 1 }} />
    ));
    expect(container.querySelector(".sf-ColorPicker")).toBeTruthy();
    expect(container.querySelector(".sf-ColorArea")).toBeTruthy();
    expect(container.querySelectorAll(".sf-ColorSlider").length).toBe(2);
  });

  it("converts hsva to css and parses supported color formats", () => {
    expect(hsvaToHex({ h: 0, s: 0, v: 1, a: 1 })).toBe("#ffffff");
    expect(hsvaToCss({ h: 0, s: 0, v: 1, a: 0.5 })).toBe("rgba(255, 255, 255, 0.5)");
    expect(parseColor("#fff")?.v).toBe(1);
    expect(parseColor("#f008")?.a).toBeCloseTo(136 / 255);
    expect(parseColor("#ff0000")?.h).toBe(0);
    expect(parseColor("#ff000080")?.a).toBeCloseTo(128 / 255);
    expect(parseColor("rgba(255, 0, 0, 0.5)")?.a).toBe(0.5);
    expect(parseColor("rgb(0, 0, 255)")?.h).toBe(240);
    expect(parseColor("#12")).toBeUndefined();
    expect(parseColor("rgba(300, 0, 0, 1)")).toBeUndefined();
    expect(parseColor("nonsense")).toBeUndefined();
  });

  it("ColorArea is focusable and arrow keys adjust saturation / value", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ColorArea h={0} s={0.5} v={0.5} onChange={onChange} />
    ));
    const area = getByRole("slider", { name: "Color area" });
    expect(area.getAttribute("tabindex")).toBe("0");
    expect(area.getAttribute("aria-valuenow")).toBe("50");
    fireEvent.keyDown(area, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(0.51, 0.5);
    fireEvent.keyDown(area, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(0.5, 0.51);
  });

  it("AlphaSlider gradient avoids the transparent keyword", () => {
    const { container } = renderWithFluent(() => (
      <AlphaSlider color={{ h: 0, s: 1, v: 1, a: 1 }} value={1} />
    ));
    const style = container.querySelector<HTMLInputElement>(".sf-ColorSlider--alpha")!.style.background;
    expect(style).toContain("rgba(255, 0, 0, 0)");
    expect(style).not.toContain("transparent");
  });

  it("HexInput and ColorPreview round-trip colors", () => {
    const onColorChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <>
        <HexInput defaultValue="#ff0000" onColorChange={onColorChange} />
        <ColorPreview color="#00ff00" label="Green" />
      </>
    ));
    const input = getByRole("textbox", { name: "Hex color" }) as HTMLInputElement;
    expect(input.value).toBe("#ff0000");
    input.value = "#0000ff";
    fireEvent.input(input);
    expect(onColorChange).toHaveBeenCalledWith(
      expect.objectContaining({ v: 1, a: 1 }),
      "#0000ff",
    );
    expect(getByRole("img", { name: "Green" }).style.background).toContain("0, 255, 0");
  });

  it("keeps a controlled color fixed while reporting the merged color and css", () => {
    const onColorChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ColorPicker color={{ h: 0, s: 0, v: 1, a: 1 }} onColorChange={onColorChange} />
    ));
    const area = getByRole("slider", { name: "Color area" });
    fireEvent.keyDown(area, { key: "ArrowRight" });

    expect(onColorChange).toHaveBeenCalledWith(
      expect.objectContaining({ h: 0, s: expect.closeTo(0.01, 5), v: 1, a: 1 }),
      expect.any(String),
    );
    expect(onColorChange.mock.calls[0]![1]).toBe(hsvaToCss({ h: 0, s: 0.01, v: 1, a: 1 }));
    expect(area).toHaveAttribute("aria-valuetext", "Saturation 0%, Value 100%");
  });

  it("updates the preview and hex input when an uncontrolled slider changes", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <ColorPicker defaultColor={{ h: 0, s: 1, v: 1, a: 1 }} />
    ));
    const hue = container.querySelector<HTMLInputElement>(".sf-ColorSlider--hue")!;
    const hex = getByRole("textbox", { name: "Hex color" }) as HTMLInputElement;
    expect(hex.value).toBe("#ff0000");

    fireEvent.input(hue, { target: { value: "120" } });
    expect(hex.value).toBe("#00ff00");
    expect(getByRole("img").style.background).toContain("0, 255, 0");
  });

  it("ColorSlider uses a 0-360 hue range and reports numeric input", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ColorSlider type="hue" value={0} onChange={onChange} />
    ));
    const slider = getByRole("slider", { name: "hue" });
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "360");
    expect(slider).toHaveAttribute("step", "1");
    fireEvent.input(slider, { target: { value: "180" } });
    expect(onChange).toHaveBeenCalledWith(180);
  });

  it("AlphaSlider reports numeric alpha input changes", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <AlphaSlider color={{ h: 0, s: 1, v: 1, a: 1 }} value={1} onChange={onChange} />
    ));
    const slider = getByRole("slider", { name: "alpha" });
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "1");
    expect(slider).toHaveAttribute("step", "0.01");
    fireEvent.input(slider, { target: { value: "0.5" } });
    expect(onChange).toHaveBeenCalledWith(0.5);
  });

  it("ColorArea clamps pointer positions to the surface bounds", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ColorArea h={0} s={0} v={0} onChange={onChange} />
    ));
    const area = getByRole("slider", { name: "Color area" });
    area.setPointerCapture = () => {};
    area.getBoundingClientRect = () =>
      ({
        left: 0, top: 0, width: 100, height: 100,
        right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.pointerDown(area, { clientX: 150, clientY: -50, pointerId: 1 });
    expect(onChange).toHaveBeenCalledWith(1, 1);
    fireEvent.pointerDown(area, { clientX: -10, clientY: 150, pointerId: 1 });
    expect(onChange).toHaveBeenCalledWith(0, 0);
  });

  it("ColorArea supports Home/End/PageUp/PageDown and shift-stepping", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ColorArea h={0} s={0.5} v={0.5} onChange={onChange} />
    ));
    const area = getByRole("slider", { name: "Color area" });
    fireEvent.keyDown(area, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(0, 0.5);
    fireEvent.keyDown(area, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(1, 0.5);
    fireEvent.keyDown(area, { key: "PageUp" });
    expect(onChange).toHaveBeenLastCalledWith(0.5, 1);
    fireEvent.keyDown(area, { key: "PageDown" });
    expect(onChange).toHaveBeenLastCalledWith(0.5, 0);
    fireEvent.keyDown(area, { key: "ArrowRight", shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(0.6, 0.5);
  });

  it("HexInput keeps invalid text and only commits parsed colors", () => {
    const onColorChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <HexInput defaultValue="#ff0000" onColorChange={onColorChange} />
    ));
    const input = getByRole("textbox", { name: "Hex color" }) as HTMLInputElement;

    fireEvent.input(input, { target: { value: "not-a-color" } });
    expect(input.value).toBe("not-a-color");
    expect(onColorChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "#00f" } });
    expect(onColorChange).toHaveBeenCalledWith(
      expect.objectContaining({ h: 240, s: 1, v: 1, a: 1 }),
      "#0000ff",
    );
  });

  it("applies the shape and class props to the ColorPicker root", () => {
    const { container } = renderWithFluent(() => (
      <ColorPicker color={{ h: 0, s: 0, v: 1, a: 1 }} shape="square" class="my-picker" />
    ));
    const root = container.querySelector(".sf-ColorPicker")!;
    expect(root).toHaveClass("sf-ColorPicker", "my-picker");
    expect(root).toHaveAttribute("data-shape", "square");
  });

  it("renders children instead of the default surfaces when provided", () => {
    const { container, getByTestId } = renderWithFluent(() => (
      <ColorPicker>
        <span data-testid="custom-surface">Custom</span>
      </ColorPicker>
    ));
    expect(getByTestId("custom-surface")).toBeInTheDocument();
    expect(container.querySelector(".sf-ColorArea")).toBeNull();
  });
});
