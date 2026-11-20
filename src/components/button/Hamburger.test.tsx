import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Hamburger } from "./Hamburger";
import { renderWithFluent } from "../../test-utils/index";

describe("Hamburger", () => {
  it("renders a fluent button with a default accessible label", () => {
    const { getByRole } = renderWithFluent(() => <Hamburger />);
    const btn = getByRole("button", { name: "Menu" });
    expect(btn).toHaveClass("sf-Hamburger", "sf-focus-ring");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("respects a custom aria-label", () => {
    const { getByRole } = renderWithFluent(() => (
      <Hamburger aria-label="菜单" />
    ));
    expect(getByRole("button", { name: "菜单" })).toBeInTheDocument();
  });

  it("exposes aria-expanded=true when open is provided", () => {
    const { getByRole } = renderWithFluent(() => <Hamburger open />);
    expect(getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("omits aria-expanded when the open prop is absent", () => {
    const { getByRole } = renderWithFluent(() => <Hamburger />);
    expect(getByRole("button")).not.toHaveAttribute("aria-expanded");
  });

  it("keeps aria-expanded in sync when open changes", () => {
    const [open, setOpen] = createSignal(false);
    const { getByRole } = renderWithFluent(() => <Hamburger open={open()} />);
    const btn = getByRole("button");
    expect(btn).not.toHaveAttribute("aria-expanded");
    setOpen(true);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    setOpen(false);
    expect(btn).not.toHaveAttribute("aria-expanded");
  });

  it("renders three decorative bars hidden from assistive technology", () => {
    const { container } = renderWithFluent(() => <Hamburger />);
    const bars = container.querySelector(".sf-Hamburger__bars") as HTMLElement;
    expect(bars).toBeInTheDocument();
    expect(bars).toHaveAttribute("aria-hidden", "true");
    expect(bars.querySelectorAll("span")).toHaveLength(3);
  });

  it("calls onClick with the event and counts repeated clicks", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Hamburger onClick={onClick} />
    ));
    const btn = getByRole("button");
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it("is keyboard focusable when enabled", () => {
    const { getByRole } = renderWithFluent(() => <Hamburger />);
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn.tabIndex).toBe(0);
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it("uses both native disabled and aria-disabled and ignores clicks when disabled", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Hamburger disabled onClick={onClick} />
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges a custom class with the hamburger class", () => {
    const { getByRole } = renderWithFluent(() => (
      <Hamburger class="my-menu" />
    ));
    expect(getByRole("button")).toHaveClass("sf-Hamburger", "my-menu");
  });
});
