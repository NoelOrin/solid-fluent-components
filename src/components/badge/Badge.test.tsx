import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import { Badge, CounterBadge } from "./Badge";
import { renderWithFluent } from "../../test-utils/index";

describe("Badge", () => {
  it("renders a badge with content", () => {
    const { container } = renderWithFluent(() => <Badge>New</Badge>);
    expect(container.querySelector(".sf-Badge")).toBeTruthy();
    expect(container.textContent).toContain("New");
  });

  it("renders a counter badge with a count", () => {
    const { container } = renderWithFluent(() => (
      <CounterBadge count={5} />
    ));
    const badge = container.querySelector(".sf-Badge") as HTMLElement;
    expect(badge.textContent).toContain("5");
  });

  it("shows overflow count", () => {
    const { container } = renderWithFluent(() => (
      <CounterBadge count={120} overflowCount={99} />
    ));
    const badge = container.querySelector(".sf-Badge") as HTMLElement;
    expect(badge.textContent).toContain("99+");
  });

  it("reactively appears and disappears when count changes from 0", () => {
    const [count, setCount] = createSignal(0);
    const { container } = renderWithFluent(() => (
      <CounterBadge count={count()} />
    ));
    expect(container.querySelector(".sf-Badge")).toBeNull();

    setCount(5);
    expect(container.querySelector(".sf-Badge")?.textContent).toContain("5");

    setCount(0);
    expect(container.querySelector(".sf-Badge")).toBeNull();
  });

  it("defaults to the brand color and hides zero unless showZero", () => {
    const { container } = renderWithFluent(() => (
      <>
        <CounterBadge count={3} />
        <span data-testid="zero"><CounterBadge count={0} /></span>
        <span data-testid="show-zero"><CounterBadge count={0} showZero /></span>
      </>
    ));
    const badges = container.querySelectorAll(".sf-Badge");
    expect(badges[0]).toHaveClass("sf-Badge--brand");
    expect(container.querySelector('[data-testid="zero"] .sf-Badge')).toBeNull();
    expect(
      container.querySelector('[data-testid="show-zero"] .sf-Badge')?.textContent,
    ).toContain("0");
  });

  it("renders a dot without text and supports iconPosition", () => {
    const { container } = renderWithFluent(() => (
      <>
        <CounterBadge dot />
        <Badge icon={<span data-testid="badge-icon">i</span>} iconPosition="after">
          Text
        </Badge>
      </>
    ));
    const dot = container.querySelector(".sf-Badge") as HTMLElement;
    expect(dot.textContent).toBe("");
    const iconBadge = container.querySelectorAll(".sf-Badge")[1] as HTMLElement;
    expect(iconBadge).toHaveClass("sf-Badge--icon-after");
    expect(iconBadge).toHaveAttribute("data-icon-position", "after");
    expect(iconBadge.textContent).toContain("Text");
  });

  it("exposes size, shape, severe and subtle hooks", () => {
    const { container } = renderWithFluent(() => (
      <Badge size="large" shape="rounded" severe>
        S
      </Badge>
    ));
    const badge = container.querySelector(".sf-Badge") as HTMLElement;
    expect(badge).toHaveClass("sf-Badge--large", "sf-Badge--rounded", "sf-Badge--severe");
    expect(badge).toHaveAttribute("data-size", "large");
    expect(badge).toHaveAttribute("data-shape", "rounded");
    expect(badge).toHaveAttribute("data-severe", "true");
  });

  it("emits appearance variant classes", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Badge appearance="ghost">g</Badge>
        <Badge appearance="outline">o</Badge>
        <Badge appearance="tint">t</Badge>
      </>
    ));
    const badges = container.querySelectorAll(".sf-Badge");
    expect(badges[0]).toHaveClass("sf-Badge--ghost");
    expect(badges[1]).toHaveClass("sf-Badge--outline");
    expect(badges[2]).toHaveClass("sf-Badge--tint");
  });

  it("emits color classes and the subtle flag hook", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Badge color="danger">d</Badge>
        <Badge color="success">s</Badge>
        <Badge subtle>sub</Badge>
      </>
    ));
    const badges = container.querySelectorAll(".sf-Badge");
    expect(badges[0]).toHaveClass("sf-Badge--danger");
    expect(badges[1]).toHaveClass("sf-Badge--success");
    expect(badges[2]).toHaveClass("sf-Badge--subtle");
    expect(badges[2]).toHaveAttribute("data-subtle", "true");
  });

  it("places the icon before the content by default", () => {
    const { container } = renderWithFluent(() => (
      <Badge icon={<span data-testid="ic">i</span>}>Text</Badge>
    ));
    const badge = container.querySelector(".sf-Badge") as HTMLElement;
    expect(badge.firstElementChild).toHaveClass("sf-Badge__icon");
    expect(badge).toHaveAttribute("data-icon-position", "before");
    expect(badge.querySelector('[data-testid="ic"]')).toBeTruthy();
  });

  it("shows the exact number when count equals overflowCount", () => {
    const { container } = renderWithFluent(() => (
      <CounterBadge count={99} overflowCount={99} />
    ));
    expect(container.querySelector(".sf-Badge")?.textContent).toBe("99");
  });

  it("lets dot override count and showZero while still rendering", () => {
    const { container } = renderWithFluent(() => (
      <CounterBadge dot count={5} showZero />
    ));
    const badge = container.querySelector(".sf-Badge") as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.textContent).toBe("");
  });

  it("forwards a custom class and size/shape through CounterBadge", () => {
    const { container } = renderWithFluent(() => (
      <CounterBadge count={2} size="small" shape="rounded" class="my-counter" />
    ));
    const badge = container.querySelector(".sf-Badge") as HTMLElement;
    expect(badge).toHaveClass("sf-Badge--small", "sf-Badge--rounded", "my-counter");
    expect(badge).toHaveAttribute("data-size", "small");
  });
});
