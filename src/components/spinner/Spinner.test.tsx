import { describe, expect, it, vi } from "vitest";
import { Spinner } from "./Spinner";
import { renderWithFluent } from "../../test-utils/index";

describe("Spinner", () => {
  it("renders a progressbar with an accessible label", () => {
    const { getByRole } = renderWithFluent(() => (
      <Spinner label="Loading" />
    ));
    const spinner = getByRole("progressbar");
    expect(spinner).toHaveClass("sf-Spinner");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("links the rendered label with aria-labelledby", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <Spinner label="Fetching data" />
    ));
    const spinner = getByRole("progressbar");
    const label = container.querySelector(".sf-Spinner__label") as HTMLLabelElement;
    expect(label).toBeTruthy();
    expect(label.tagName).toBe("LABEL");
    expect(label.id).toBeTruthy();
    expect(spinner).toHaveAttribute("aria-labelledby", label.id);
  });

  it("supports the extra-tiny size", () => {
    const { getByRole } = renderWithFluent(() => <Spinner size="extra-tiny" />);
    const spinner = getByRole("progressbar");
    expect(spinner).toHaveClass("sf-Spinner--extra-tiny");
    expect(spinner).toHaveAttribute("data-size", "extra-tiny");
  });

  it("delays the spinner ring until the delay elapses", () => {
    vi.useFakeTimers();
    try {
      const { container } = renderWithFluent(() => (
        <Spinner delay={100} label="Loading" />
      ));
      expect(container.querySelector(".sf-Spinner__spinner")).toBeNull();
      vi.advanceTimersByTime(100);
      expect(container.querySelector(".sf-Spinner__spinner")).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it("defaults to medium size and primary appearance", () => {
    const { getByRole } = renderWithFluent(() => <Spinner />);
    const spinner = getByRole("progressbar");
    expect(spinner).toHaveClass("sf-Spinner--medium");
    expect(spinner).toHaveAttribute("data-size", "medium");
    expect(spinner).toHaveAttribute("data-appearance", "primary");
  });

  it("renders the ring immediately when there is no delay", () => {
    const { container } = renderWithFluent(() => <Spinner />);
    expect(container.querySelector(".sf-Spinner__spinner")).toBeTruthy();
  });

  it("places the label before the ring for leading positions", () => {
    const renderOrder = (position: "before" | "above") => {
      const { container } = renderWithFluent(() => (
        <Spinner label="L" labelPosition={position} />
      ));
      return Array.from(container.querySelector(".sf-Spinner")!.children)
        .map((child) => child.className.replace("sf-Spinner__", ""));
    };
    expect(renderOrder("before")).toEqual(["label", "spinner"]);
    expect(renderOrder("above")).toEqual(["label", "spinner"]);
  });

  it("places the label after the ring for trailing positions", () => {
    const renderOrder = (position: "after" | "below") => {
      const { container } = renderWithFluent(() => (
        <Spinner label="L" labelPosition={position} />
      ));
      const spinner = container.querySelector(".sf-Spinner") as HTMLElement;
      expect(spinner).toHaveAttribute("data-label-position", position);
      return Array.from(spinner.children).map((child) => child.className.replace("sf-Spinner__", ""));
    };
    expect(renderOrder("after")).toEqual(["spinner", "label"]);
    expect(renderOrder("below")).toEqual(["spinner", "label"]);
  });

  it("reflects the inverted appearance hook", () => {
    const { getByRole } = renderWithFluent(() => (
      <Spinner appearance="inverted" />
    ));
    expect(getByRole("progressbar")).toHaveAttribute("data-appearance", "inverted");
  });

  it("falls back to a Loading label when no label is given", () => {
    const { getByRole, container } = renderWithFluent(() => <Spinner />);
    const spinner = getByRole("progressbar", { name: "Loading" });
    expect(spinner).not.toHaveAttribute("aria-labelledby");
    expect(container.querySelector(".sf-Spinner__label")).toBeNull();
  });

  it("uses a generic label but keeps the labelledby link for JSX labels", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <Spinner label={<span data-testid="js-label">Working</span>} />
    ));
    const spinner = getByRole("progressbar");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    const label = container.querySelector(".sf-Spinner__label") as HTMLElement;
    expect(spinner).toHaveAttribute("aria-labelledby", label.id);
    expect(container.querySelector('[data-testid="js-label"]')).toBeTruthy();
  });

  it("gives each spinner a unique label id", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <>
        <Spinner label="One" />
        <Spinner label="Two" />
      </>
    ));
    const [first, second] = getAllByRole("progressbar") as [HTMLElement, HTMLElement];
    const firstId = first.getAttribute("aria-labelledby");
    expect(firstId).toBeTruthy();
    expect(second.getAttribute("aria-labelledby")).not.toBe(firstId);
  });

  it("appends a custom class", () => {
    const { getByRole } = renderWithFluent(() => <Spinner class="my-spinner" />);
    expect(getByRole("progressbar")).toHaveClass("sf-Spinner", "my-spinner");
  });
});
