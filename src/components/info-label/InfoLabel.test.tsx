import { describe, expect, it, vi } from "vitest";
import { fireEvent, within } from "@solidjs/testing-library";
import { InfoLabel } from "./InfoLabel";
import { renderWithFluent } from "../../test-utils/index";

vi.mock("@floating-ui/dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@floating-ui/dom")>();
  return {
    ...actual,
    computePosition: async () => ({ x: 0, y: 0 }),
    autoUpdate: () => () => {},
  };
});

describe("InfoLabel", () => {
  it("renders a label and an accessible info button", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <InfoLabel>Name</InfoLabel>
    ));
    expect(container.querySelector(".sf-InfoLabel")).toBeInTheDocument();
    expect(container.querySelector(".sf-Label")).toHaveTextContent("Name");
    const btn = getByRole("button", { name: "More info" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveTextContent("ⓘ");
  });

  it("adds a required marker to the embedded label", () => {
    const { container } = renderWithFluent(() => (
      <InfoLabel required>Name</InfoLabel>
    ));
    expect(container.querySelector(".sf-Label__required")).toHaveTextContent("*");
  });

  it("disables both the label and the info button", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <InfoLabel disabled>Name</InfoLabel>
    ));
    expect(container.querySelector(".sf-Label")).toHaveClass("sf-Label--disabled");
    expect(getByRole("button", { name: "More info" })).toBeDisabled();
  });

  it("links the embedded label to a control via htmlFor", () => {
    const { getByLabelText } = renderWithFluent(() => (
      <>
        <InfoLabel htmlFor="info-input">Full name</InfoLabel>
        <input id="info-input" />
      </>
    ));
    expect(getByLabelText("Full name")).toHaveAttribute("id", "info-input");
  });

  it("forwards weight, size and a custom info button", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <InfoLabel
        weight="regular"
        size="large"
        infoButton={<span>(?)</span>}
      >
        Name
      </InfoLabel>
    ));
    const label = container.querySelector(".sf-Label") as HTMLElement;
    expect(label).toHaveAttribute("data-weight", "regular");
    expect(label).toHaveAttribute("data-size", "large");
    expect(getByRole("button", { name: "More info" })).toHaveTextContent("(?)");
  });

  it("merges a custom class with the info label class", () => {
    const { container } = renderWithFluent(() => (
      <InfoLabel class="my-info">Name</InfoLabel>
    ));
    expect(container.querySelector(".sf-InfoLabel")).toHaveClass(
      "sf-InfoLabel",
      "my-info",
    );
  });

  it("shows the supplied tooltip content on keyboard focus and links it with aria-describedby", () => {
    const { getByRole } = renderWithFluent(() => (
      <InfoLabel info="Enter your full name">Name</InfoLabel>
    ));
    const btn = getByRole("button", { name: "More info" });
    fireEvent.focusIn(btn);
    const tooltip = within(document.body).getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Enter your full name");
    expect(btn).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("uses default tooltip content when no info is supplied", () => {
    const { getByRole } = renderWithFluent(() => <InfoLabel>Name</InfoLabel>);
    fireEvent.focusIn(getByRole("button", { name: "More info" }));
    expect(within(document.body).getByRole("tooltip")).toHaveTextContent(
      "More information",
    );
  });

  it("hides the tooltip on Escape while keeping the button focused", () => {
    const { getByRole } = renderWithFluent(() => (
      <InfoLabel info="Helpful hint">Name</InfoLabel>
    ));
    const btn = getByRole("button", { name: "More info" }) as HTMLButtonElement;
    btn.focus();
    expect(within(document.body).getByRole("tooltip")).toBeInTheDocument();
    fireEvent.keyDown(btn, { key: "Escape" });
    expect(within(document.body).queryByRole("tooltip")).toBeNull();
    expect(document.activeElement).toBe(btn);
  });

  it("hides the tooltip when focus leaves the info button", () => {
    const { getByRole } = renderWithFluent(() => (
      <InfoLabel info="Helpful hint">Name</InfoLabel>
    ));
    const btn = getByRole("button", { name: "More info" });
    fireEvent.focusIn(btn);
    expect(within(document.body).getByRole("tooltip")).toBeInTheDocument();
    fireEvent.focusOut(btn);
    expect(within(document.body).queryByRole("tooltip")).toBeNull();
  });
});
