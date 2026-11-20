import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./ProgressBar";
import { renderWithFluent } from "../../test-utils/index";

describe("ProgressBar", () => {
  it("renders a progressbar with value attributes", () => {
    const { getByRole } = renderWithFluent(() => (
      <ProgressBar value={40} max={100} />
    ));
    const bar = getByRole("progressbar");
    expect(bar).toHaveClass("sf-ProgressBar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("reflects intent appearance", () => {
    const { getByRole } = renderWithFluent(() => (
      <ProgressBar value={50} color="error" />
    ));
    expect(getByRole("progressbar")).toHaveClass("sf-ProgressBar--error");
  });

  it("uses the indeterminate state when value is undefined", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <ProgressBar aria-label="Loading files" />
    ));
    const bar = getByRole("progressbar");
    expect(bar).toHaveClass("sf-ProgressBar--indeterminate");
    expect(bar).toHaveAttribute("data-indeterminate", "true");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-label", "Loading files");
    const fill = container.querySelector(".sf-ProgressBar__bar") as HTMLElement;
    expect(fill.style.width).toBe("");
  });

  it("passes through aria-valuetext and supports disabling the indeterminate motion", () => {
    const { getByRole } = renderWithFluent(() => (
      <ProgressBar aria-valuetext="Working" indeterminateMotion={false} />
    ));
    const bar = getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuetext", "Working");
    expect(bar).toHaveClass("sf-ProgressBar--no-motion");
  });

  it("updates the fill width reactively", () => {
    const [value, setValue] = createSignal(10);
    const { container } = renderWithFluent(() => (
      <ProgressBar value={value()} max={100} />
    ));
    const fill = container.querySelector(".sf-ProgressBar__bar") as HTMLElement;
    expect(fill.style.width).toBe("10%");
    setValue(50);
    expect(fill.style.width).toBe("50%");
  });

  it("exposes thickness and shape hooks in classes and inline styles", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <ProgressBar value={5} max={10} thickness="large" shape="square" />
    ));
    const bar = getByRole("progressbar") as HTMLElement;
    expect(bar).toHaveAttribute("data-thickness", "large");
    expect(bar).toHaveAttribute("data-shape", "square");
    expect(bar.style.height).toBe("8px");
    const fill = container.querySelector(".sf-ProgressBar__bar") as HTMLElement;
    expect(fill.style.borderRadius).toBe("0px");
  });

  it("uses a 4px default height and rounded fill", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <ProgressBar value={1} />
    ));
    expect((getByRole("progressbar") as HTMLElement).style.height).toBe("4px");
    const fill = container.querySelector(".sf-ProgressBar__bar") as HTMLElement;
    expect(fill.style.borderRadius).toBe("");
  });

  it("emits success and warning color classes", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <>
        <ProgressBar value={1} color="success" />
        <ProgressBar value={1} color="warning" />
      </>
    ));
    const bars = getAllByRole("progressbar");
    expect(bars[0]).toHaveClass("sf-ProgressBar--success");
    expect(bars[1]).toHaveClass("sf-ProgressBar--warning");
  });

  it("clamps values above max and below zero", () => {
    const { getAllByRole, container } = renderWithFluent(() => (
      <>
        <ProgressBar value={150} max={100} />
        <ProgressBar value={-5} max={100} />
      </>
    ));
    const bars = getAllByRole("progressbar");
    expect(bars[0]).toHaveAttribute("aria-valuenow", "100");
    expect(bars[1]).toHaveAttribute("aria-valuenow", "0");
    const fills = container.querySelectorAll(".sf-ProgressBar__bar");
    expect((fills[0] as HTMLElement).style.width).toBe("100%");
    expect((fills[1] as HTMLElement).style.width).toBe("0%");
  });

  it("computes the fill width relative to a custom max", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <ProgressBar value={50} max={200} />
    ));
    expect(getByRole("progressbar")).toHaveAttribute("aria-valuemax", "200");
    expect((container.querySelector(".sf-ProgressBar__bar") as HTMLElement).style.width).toBe("25%");
  });

  it("updates aria-valuenow reactively with the value", () => {
    const [value, setValue] = createSignal(20);
    const { getByRole } = renderWithFluent(() => (
      <ProgressBar value={value()} max={100} />
    ));
    const bar = getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "20");
    setValue(80);
    expect(bar).toHaveAttribute("aria-valuenow", "80");
  });

  it("avoids NaN when max is zero", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <ProgressBar value={5} max={0} />
    ));
    expect(getByRole("progressbar")).toHaveAttribute("aria-valuemax", "0");
    expect((container.querySelector(".sf-ProgressBar__bar") as HTMLElement).style.width).toBe("0%");
  });

  it("appends a custom class", () => {
    const { getByRole } = renderWithFluent(() => (
      <ProgressBar value={5} class="my-bar" />
    ));
    expect(getByRole("progressbar")).toHaveClass("sf-ProgressBar", "my-bar");
  });
});
