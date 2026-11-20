import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import { PresenceBadge, type PresenceBadgeStatus } from "./PresenceBadge";
import { renderWithFluent } from "../../test-utils/index";

describe("PresenceBadge", () => {
  it("renders an image role with an accessible label", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="busy" />
    ));
    const badge = getByRole("img");
    expect(badge).toHaveClass("sf-PresenceBadge");
    expect(badge).toHaveAttribute("aria-label", "busy");
    expect(badge.querySelector("svg")).toBeTruthy();
  });

  it("combines outOfOffice with another status without replacing it", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="busy" outOfOffice />
    ));
    const badge = getByRole("img");
    expect(badge).toHaveClass("sf-PresenceBadge--busy");
    expect(badge).toHaveClass("sf-PresenceBadge--out-of-office");
    expect(badge).toHaveAttribute("data-status", "busy");
    expect(badge).toHaveAttribute("data-out-of-office", "true");
    expect(badge).toHaveAttribute("aria-label", "busy out of office");
  });

  it("does not duplicate the out of office label", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="out-of-office" outOfOffice />
    ));
    expect(getByRole("img")).toHaveAttribute("aria-label", "out of office");
  });

  it("uses human readable labels for compound statuses", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="do-not-disturb" />
    ));
    expect(getByRole("img")).toHaveAttribute("aria-label", "do not disturb");
  });

  it("defaults to available at medium size", () => {
    const { getByRole } = renderWithFluent(() => <PresenceBadge />);
    const badge = getByRole("img");
    expect(badge).toHaveClass("sf-PresenceBadge--available", "sf-PresenceBadge--medium");
    expect(badge).toHaveAttribute("aria-label", "available");
    expect(badge).toHaveAttribute("data-status", "available");
    expect(badge).toHaveAttribute("data-size", "medium");
  });

  it("reflects the size prop in a class and data hook", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="busy" size="large" />
    ));
    const badge = getByRole("img");
    expect(badge).toHaveClass("sf-PresenceBadge--large");
    expect(badge).toHaveAttribute("data-size", "large");
  });

  it("adds a separate out-of-office overlay glyph for non-OOO statuses", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <PresenceBadge status="busy" outOfOffice />
    ));
    expect(getByRole("img").querySelector(".sf-PresenceBadge__oof")).toBeTruthy();
    expect(container.querySelector(".sf-PresenceBadge__icon")).toBeTruthy();
  });

  it("does not add the overlay glyph when the status is already out-of-office", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="out-of-office" outOfOffice />
    ));
    expect(getByRole("img").querySelector(".sf-PresenceBadge__oof")).toBeNull();
  });

  it("reacts to status changes with updated class, data and label", () => {
    const [status, setStatus] = createSignal<PresenceBadgeStatus>("available");
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status={status()} />
    ));
    const badge = getByRole("img");
    expect(badge).toHaveAttribute("data-status", "available");

    setStatus("do-not-disturb");
    expect(badge).toHaveClass("sf-PresenceBadge--do-not-disturb");
    expect(badge).toHaveAttribute("data-status", "do-not-disturb");
    expect(badge).toHaveAttribute("aria-label", "do not disturb");
  });

  it("labels unknown and blocked statuses", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <>
        <PresenceBadge status="unknown" />
        <PresenceBadge status="blocked" />
      </>
    ));
    const badges = getAllByRole("img");
    expect(badges[0]).toHaveAttribute("aria-label", "unknown");
    expect(badges[1]).toHaveAttribute("aria-label", "blocked");
  });

  it("appends a custom class and stays non-interactive", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="away" class="my-status" />
    ));
    const badge = getByRole("img");
    expect(badge).toHaveClass("sf-PresenceBadge--away", "my-status");
    expect(badge).not.toHaveAttribute("tabindex");
  });
});
