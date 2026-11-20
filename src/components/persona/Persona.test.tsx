import { describe, expect, it } from "vitest";
import { Persona } from "./Persona";
import { renderWithFluent } from "../../test-utils/index";

describe("Persona", () => {
  it("renders a persona with a name", () => {
    const { container } = renderWithFluent(() => (
      <Persona name="Ada Lovelace" />
    ));
    expect(container.querySelector(".sf-Persona")).toBeTruthy();
    expect(container.textContent).toContain("Ada Lovelace");
  });

  it("renders a presence badge for the given status", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Persona name="Ada Lovelace" presence="busy" />
    ));
    const presence = container.querySelector(".sf-PresenceBadge") as HTMLElement;
    expect(presence).toBeTruthy();
    expect(presence).toHaveClass("sf-PresenceBadge--busy");
    expect(getByRole("img", { name: "busy" })).toBeTruthy();
  });

  it("uses distinct classes for tertiary and quaternary text", () => {
    const { container } = renderWithFluent(() => (
      <Persona
        primaryText="Primary"
        secondaryText="Secondary"
        tertiaryText="Tertiary"
        quaternaryText="Quaternary"
      />
    ));
    expect(container.querySelector(".sf-Persona__primary")?.textContent).toBe("Primary");
    expect(container.querySelector(".sf-Persona__secondary")?.textContent).toBe("Secondary");
    expect(container.querySelector(".sf-Persona__tertiary")?.textContent).toBe("Tertiary");
    expect(container.querySelector(".sf-Persona__quaternary")?.textContent).toBe("Quaternary");
  });

  it("supports presenceOnly and textPosition hooks", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Persona name="Ada" presence="away" presenceOnly />
        <Persona name="Grace" textPosition="below" />
      </>
    ));
    const personas = container.querySelectorAll(".sf-Persona");
    expect(personas[0]).toHaveClass("sf-Persona--presence-only");
    expect(personas[0]!.querySelector(".sf-Persona__text")).toBeNull();
    expect(personas[1]).toHaveClass("sf-Persona--below");
    expect(personas[1]).toHaveAttribute("data-text-position", "below");
  });

  it("accepts a custom avatar node slot", () => {
    const { container } = renderWithFluent(() => (
      <Persona
        name="Ada"
        avatar={<span data-testid="custom-avatar">Custom</span>}
      />
    ));
    expect(container.querySelector('[data-testid="custom-avatar"]')).toBeTruthy();
  });

  it("maps the size prop to the underlying avatar size", () => {
    const { container } = renderWithFluent(() => (
      <Persona name="Ada" size="huge" />
    ));
    const root = container.querySelector(".sf-Persona") as HTMLElement;
    expect(root).toHaveAttribute("data-size", "huge");
    const avatar = container.querySelector(".sf-Avatar") as HTMLElement;
    expect(avatar).toHaveClass("sf-Avatar--56");
  });

  it("scales the presence badge from the avatar size", () => {
    const { container } = renderWithFluent(() => (
      <Persona name="Ada" presence="busy" size="large" />
    ));
    const presence = container.querySelector(".sf-PresenceBadge") as HTMLElement;
    expect(presence).toHaveClass("sf-PresenceBadge--small");
  });

  it("lets primaryText override the name and renders children in the text block", () => {
    const { container, getByTestId } = renderWithFluent(() => (
      <Persona name="Ada" primaryText="Primary text">
        <span data-testid="extra">Extra</span>
      </Persona>
    ));
    expect(container.querySelector(".sf-Persona__primary")?.textContent).toBe("Primary text");
    expect(container.querySelector(".sf-Persona__text")?.textContent).not.toContain("Ada");
    expect(getByTestId("extra")).toBeTruthy();
  });

  it("applies textAlignment to the text block", () => {
    const { container } = renderWithFluent(() => (
      <Persona name="Ada" textAlignment="center" />
    ));
    const text = container.querySelector(".sf-Persona__text") as HTMLElement;
    expect(text.style.textAlign).toBe("center");
  });

  it("forwards an avatar config object to the underlying Avatar", () => {
    const { container } = renderWithFluent(() => (
      <Persona
        name="Ada"
        avatar={{ initials: "XY", color: "brand", shape: "square", size: 48 }}
      />
    ));
    const avatar = container.querySelector(".sf-Avatar") as HTMLElement;
    expect(avatar).toHaveClass("sf-Avatar--48", "sf-Avatar--brand", "sf-Avatar--square");
    expect(avatar.querySelector(".sf-Avatar__initials")?.textContent).toBe("XY");
  });

  it("appends a custom class and reflects presence in a data hook", () => {
    const { container } = renderWithFluent(() => (
      <Persona name="Ada" presence="away" class="my-persona" />
    ));
    const root = container.querySelector(".sf-Persona") as HTMLElement;
    expect(root).toHaveClass("my-persona");
    expect(root).toHaveAttribute("data-presence", "away");
  });
});
