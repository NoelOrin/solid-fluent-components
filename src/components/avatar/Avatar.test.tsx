import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";
import { renderWithFluent } from "../../test-utils/index";

describe("Avatar", () => {
  it("renders initials and accessible name", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar name="Ada Lovelace" size={48} />
    ));
    const avatar = getByRole("img", { name: "Ada Lovelace" });
    expect(avatar).toHaveClass("sf-Avatar", "sf-Avatar--48");
    expect(avatar.textContent).toContain("AL");
  });

  it("renders an image when provided", () => {
    const { container } = renderWithFluent(() => (
      <Avatar name="Ada" image={{ src: "ada.png", alt: "Ada" }} />
    ));
    expect(container.querySelector(".sf-Avatar__image")).toHaveAttribute("src", "ada.png");
  });

  it("aligns defaults with Fluent v9 (neutral color, circular shape)", () => {
    const { getByRole } = renderWithFluent(() => <Avatar name="Ada Lovelace" />);
    const avatar = getByRole("img");
    expect(avatar).toHaveClass("sf-Avatar--neutral");
    expect(avatar).toHaveAttribute("data-color", "neutral");
    expect(avatar).toHaveAttribute("data-shape", "circular");
  });

  it("reflects shape, active state and active appearance", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar
        name="Ada Lovelace"
        shape="square"
        color="brand"
        active="active"
        activeAppearance="ring-shadow"
      />
    ));
    const avatar = getByRole("img");
    expect(avatar).toHaveClass(
      "sf-Avatar--square",
      "sf-Avatar--brand",
      "sf-Avatar--active",
      "sf-Avatar--ring-shadow",
    );
    expect(avatar).toHaveAttribute("data-active", "active");
    expect(avatar).toHaveAttribute("data-active-appearance", "ring-shadow");
    expect(avatar.getAttribute("aria-label")).toContain("active");
  });

  it("renders a single initial at size 16", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar name="Ada Lovelace" size={16} />
    ));
    expect(getByRole("img").textContent).toBe("A");
  });

  it("resolves colorful to a deterministic named color via idForColor", () => {
    const render = (id: string) =>
      renderWithFluent(() => (
        <Avatar name="Ada" color="colorful" idForColor={id} />
      )).getByRole("img");

    const first = render("user-1");
    const second = render("user-1");
    expect(first.getAttribute("data-color")).toBe(second.getAttribute("data-color"));
    expect(first.className).toMatch(/sf-Avatar--[a-z-]+/);
    expect(first).toHaveAttribute("data-id-for-color", "user-1");
  });

  it("renders a badge slot with a size derived from the avatar", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar name="Ada" size={48} badge={<span data-testid="badge">●</span>} />
    ));
    const avatar = getByRole("img");
    const badge = avatar.querySelector(".sf-Avatar__badge") as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge).toHaveAttribute("data-size", "small");
    expect(avatar).toHaveAttribute("data-badge-size", "small");
    expect(badge.textContent).toContain("●");
  });

  it("lets the initials prop override derived initials", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar name="Ada Lovelace" initials="XX" />
    ));
    const avatar = getByRole("img", { name: "Ada Lovelace" });
    expect(avatar.querySelector(".sf-Avatar__initials")?.textContent).toBe("XX");
    expect(avatar.textContent).not.toContain("AL");
  });

  it("appends an active phrase to a custom aria-label for inactive avatars", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar aria-label="Colleague" name="Ada" active="inactive" />
    ));
    expect(getByRole("img")).toHaveAttribute("aria-label", "Colleague inactive");
  });

  it("does not append a phrase for busy or out-of-office active states", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar name="Ada" active="busy" />
    ));
    expect(getByRole("img")).toHaveAttribute("aria-label", "Ada");
  });

  it("renders no initials and no aria-label when there is no name", () => {
    const { getByRole } = renderWithFluent(() => <Avatar />);
    const avatar = getByRole("img");
    expect(avatar.querySelector(".sf-Avatar__initials")).toBeNull();
    expect(avatar).not.toHaveAttribute("aria-label");
  });

  it("prefers the icon slot over initials and hides it from assistive tech", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar name="Ada" icon={<span data-testid="icon">★</span>} />
    ));
    const avatar = getByRole("img");
    const icon = avatar.querySelector(".sf-Avatar__icon") as HTMLElement;
    expect(icon).toBeTruthy();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon.textContent).toContain("★");
    expect(avatar.querySelector(".sf-Avatar__initials")).toBeNull();
  });

  it("falls back to the name for image alt and keeps the image aria-hidden", () => {
    const { container } = renderWithFluent(() => (
      <Avatar name="Grace" image={{ src: "grace.png" }} />
    ));
    const img = container.querySelector(".sf-Avatar__image") as HTMLImageElement;
    expect(img).toHaveAttribute("alt", "Grace");
    expect(img).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps a non-interactive role and does not steal focus", () => {
    const { getByRole } = renderWithFluent(() => <Avatar name="Ada" />);
    const avatar = getByRole("img");
    expect(avatar).not.toHaveAttribute("tabindex");
    expect(avatar).not.toHaveAttribute("role", "button");
  });

  it("appends a custom class and reflects size/shape data hooks", () => {
    const { getByRole } = renderWithFluent(() => (
      <Avatar name="Ada" size={56} shape="square" class="my-avatar" />
    ));
    const avatar = getByRole("img");
    expect(avatar).toHaveClass("sf-Avatar--56", "sf-Avatar--square", "my-avatar");
    expect(avatar).toHaveAttribute("data-size", "56");
    expect(avatar).toHaveAttribute("data-shape", "square");
  });

  it("scales the badge size hook with the avatar size", () => {
    const renderBadgeSize = (size: 24 | 32 | 96) =>
      renderWithFluent(() => (
        <Avatar name="Ada" size={size} badge={<span>•</span>} />
      )).getByRole("img").querySelector(".sf-Avatar__badge") as HTMLElement;

    expect(renderBadgeSize(24)).toHaveAttribute("data-size", "tiny");
    expect(renderBadgeSize(32)).toHaveAttribute("data-size", "extra-small");
    expect(renderBadgeSize(96)).toHaveAttribute("data-size", "extra-large");
  });
});
