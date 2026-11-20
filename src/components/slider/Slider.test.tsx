import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Slider } from "./Slider";
import { Field } from "../field/Field";
import { renderWithFluent } from "../../test-utils/index";

describe("Slider", () => {
  it("renders a range input with value and forwarded bounds", () => {
    const { container } = renderWithFluent(() => (
      <Slider value={30} min={0} max={100} name="volume" />
    ));
    expect(container.querySelector(".sf-Slider")).toHaveAttribute("data-size", "medium");
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input).toHaveClass("sf-Slider__input");
    expect(input.value).toBe("30");
    expect(input.min).toBe("0");
    expect(input.max).toBe("100");
    expect(input.name).toBe("volume");
  });

  it("exposes the small size variant", () => {
    const { container } = renderWithFluent(() => <Slider size="small" />);
    expect(container.querySelector(".sf-Slider")).toHaveAttribute("data-size", "small");
  });

  it("marks a vertical slider without adding a horizontal layout", () => {
    const vertical = renderWithFluent(() => <Slider vertical />);
    expect(vertical.container.querySelector(".sf-Slider")).toHaveAttribute("data-vertical", "true");
    const horizontal = renderWithFluent(() => <Slider />);
    expect(horizontal.container.querySelector(".sf-Slider")).not.toHaveAttribute("data-vertical");
  });

  it("defaults the origin to start and supports center", () => {
    const start = renderWithFluent(() => <Slider />);
    const center = renderWithFluent(() => <Slider origin="center" />);
    expect(start.container.querySelector(".sf-Slider")).toHaveAttribute("data-origin", "start");
    expect(center.container.querySelector(".sf-Slider")).toHaveAttribute("data-origin", "center");
  });

  it("uses defaultValue when no controlled value is given", () => {
    const { container } = renderWithFluent(() => (
      <Slider defaultValue={20} min={0} max={100} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("20");
  });

  it("renders numeric and labelled marks at the correct positions", () => {
    const { container } = renderWithFluent(() => (
      <Slider
        defaultValue={20}
        min={0}
        max={100}
        marks={[0, 50, { value: 100, label: "Max" }]}
      />
    ));
    const marksContainer = container.querySelector(".sf-Slider__marks") as HTMLElement;
    expect(marksContainer).toHaveAttribute("aria-hidden", "true");
    const marks = container.querySelectorAll(".sf-Slider__mark");
    expect(marks.length).toBe(3);
    expect(marks[0]).toHaveAttribute("data-value", "0");
    expect(marks[0]).toHaveStyle({ left: "0%" });
    expect(marks[1]).toHaveAttribute("data-value", "50");
    expect(marks[1]!).toHaveStyle({ left: "50%" });
    expect(marks[2]!).toHaveStyle({ left: "100%" });
    expect(marks[2]!.querySelector(".sf-Slider__markLabel")!.textContent).toBe("Max");
    expect(marks[0]!.querySelector(".sf-Slider__markLabel")).toBeNull();
  });

  it("computes mark positions relative to a non-zero minimum", () => {
    const { container } = renderWithFluent(() => (
      <Slider min={10} max={20} marks={[15]} />
    ));
    const mark = container.querySelector(".sf-Slider__mark") as HTMLElement;
    expect(mark).toHaveStyle({ left: "50%" });
  });

  it("does not render a marks container for empty data", () => {
    const { container } = renderWithFluent(() => <Slider marks={[]} />);
    expect(container.querySelector(".sf-Slider__marks")).toBeNull();
  });

  it("passes the numeric value as the second onChange argument", () => {
    const onChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Slider min={0} max={100} onChange={onChange} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.value = "40";
    fireEvent.change(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].target).toBe(input);
    expect(onChange.mock.calls[0]![1]).toEqual({ value: 40 });
  });

  it("keeps a controlled value in sync with a signal", () => {
    const [value, setValue] = createSignal(10);
    const { container } = renderWithFluent(() => (
      <Slider
        value={value()}
        min={0}
        max={100}
        onChange={(_event, data) => setValue(data.value)}
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("10");
    input.value = "25";
    fireEvent.change(input);
    expect(value()).toBe(25);
    expect(input.value).toBe("25");
  });

  it("marks a disabled slider and blocks focus", () => {
    const { container } = renderWithFluent(() => <Slider disabled />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    input.focus();
    expect(document.activeElement).not.toBe(input);
  });

  it("maps a Field error onto aria-invalid, describedBy and the invalid class", () => {
    const { container } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="Pick a value">
        <Slider />
      </Field>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    const validation = container.querySelector(".sf-Field__validation")!;
    expect(container.querySelector(".sf-Slider")).toHaveClass("sf-Slider--invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("tracks focus/blur and forwards keyboard events", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = renderWithFluent(() => (
      <Slider onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input, { key: "ArrowRight" });
    fireEvent.keyDown(input, { key: "Home" });
    fireEvent.keyDown(input, { key: "End" });
    expect(onKeyDown.mock.calls.map((call) => call[0].key)).toEqual([
      "ArrowRight",
      "Home",
      "End",
    ]);
    input.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("uses an explicit id or the Field control id", () => {
    const own = renderWithFluent(() => <Slider id="own-slider" />);
    expect(own.container.querySelector("input")).toHaveAttribute("id", "own-slider");

    const field = renderWithFluent(() => (
      <Field label="Volume">
        <Slider />
      </Field>
    ));
    const input = field.container.querySelector("input")!;
    const labelFor = field.container
      .querySelector("label.sf-Label")!
      .getAttribute("for");
    expect(input.id).toBe(labelFor);
  });
});
