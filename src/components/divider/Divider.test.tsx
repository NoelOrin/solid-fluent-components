import { describe, expect, it } from "vitest";
import { createSignal } from "solid-js";
import { Divider } from "./Divider";
import { renderWithFluent } from "../../test-utils/index";

describe("Divider", () => {
  it("renders a horizontal separator with default hooks", () => {
    const { getByRole } = renderWithFluent(() => <Divider />);
    const sep = getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "horizontal");
    expect(sep).toHaveClass(
      "sf-Divider",
      "sf-Divider--appearance-default",
      "sf-Divider--align-center",
    );
    expect(sep).toHaveAttribute("data-appearance", "default");
    expect(sep).toHaveAttribute("data-align", "center");
    expect(sep).toHaveAttribute("data-inset", "false");
  });

  it("renders a vertical divider with the correct ARIA orientation", () => {
    const { getByRole } = renderWithFluent(() => <Divider vertical />);
    const sep = getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
    expect(sep).toHaveClass("sf-Divider--vertical");
  });

  it("updates orientation when the vertical prop changes", () => {
    const [vertical, setVertical] = createSignal(false);
    const { getByRole } = renderWithFluent(() => <Divider vertical={vertical()} />);
    const sep = getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "horizontal");
    setVertical(true);
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
    expect(sep).toHaveClass("sf-Divider--vertical");
    setVertical(false);
    expect(sep).not.toHaveClass("sf-Divider--vertical");
  });

  it("emits appearance, inset and alignContent hooks", () => {
    const { getByRole } = renderWithFluent(() => (
      <Divider appearance="brand" inset alignContent="start" />
    ));
    const sep = getByRole("separator");
    expect(sep).toHaveClass(
      "sf-Divider--inset",
      "sf-Divider--appearance-brand",
      "sf-Divider--align-start",
    );
    expect(sep).toHaveAttribute("data-appearance", "brand");
    expect(sep).toHaveAttribute("data-align", "start");
    expect(sep).toHaveAttribute("data-inset", "true");
  });

  it("wraps children in a content span", () => {
    const { getByRole: getWithChild } = renderWithFluent(() => (
      <Divider>or</Divider>
    ));
    const withChild = getWithChild("separator");
    expect(withChild.querySelector("span")).toHaveTextContent("or");
    expect(withChild).toHaveClass("sf-Divider--align-center");
  });

  it("does not render a content span without children", () => {
    const { getByRole } = renderWithFluent(() => <Divider />);
    expect(getByRole("separator").querySelector("span")).toBeNull();
  });

  it("merges a custom class with the divider class", () => {
    const { getByRole } = renderWithFluent(() => (
      <Divider class="my-divider" vertical />
    ));
    expect(getByRole("separator")).toHaveClass("sf-Divider", "my-divider");
  });

  it("is a non-interactive separator outside the tab order", () => {
    const { getByRole } = renderWithFluent(() => <Divider />);
    const sep = getByRole("separator") as HTMLElement;
    expect(sep.tagName).toBe("DIV");
    expect(sep.tabIndex).toBe(-1);
  });
});
