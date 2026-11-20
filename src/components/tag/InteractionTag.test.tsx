import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
} from "./InteractionTag";
import { renderWithFluent } from "../../test-utils/index";

describe("InteractionTag", () => {
  it("renders a brand interaction tag with primary and secondary", () => {
    const { container } = renderWithFluent(() => (
      <InteractionTag appearance="brand">
        <InteractionTagPrimary>Primary</InteractionTagPrimary>
        <InteractionTagSecondary aria-label="More" />
      </InteractionTag>
    ));
    expect(container.querySelector(".sf-InteractionTag")).toBeTruthy();
    expect(container.querySelector(".sf-InteractionTag--brand")).toBeTruthy();
    expect(container.textContent).toContain("Primary");
  });

  it("passes disabled / aria-label / media to sub-components", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <InteractionTag appearance="ghost" disabled>
        <InteractionTagPrimary
          disabled
          aria-label="Primary action"
          media={<span class="sf-InteractionTag__media">M</span>}
        >
          Primary
        </InteractionTagPrimary>
        <InteractionTagSecondary disabled aria-label="More options" />
      </InteractionTag>
    ));
    expect(container.querySelector(".sf-InteractionTag--ghost")).toBeTruthy();
    expect(container.querySelector(".sf-InteractionTag__media")).toBeTruthy();
    expect(getByRole("button", { name: "Primary action" })).toBeDisabled();
    expect(getByRole("button", { name: "More options" })).toBeDisabled();
  });

  it("reflects selected, size, shape and secondary text", () => {
    const { container } = renderWithFluent(() => (
      <InteractionTag selected size="small" shape="rounded" secondaryText="Secondary">
        Primary
      </InteractionTag>
    ));
    const tag = container.querySelector<HTMLElement>(".sf-InteractionTag")!;
    expect(tag.classList.contains("sf-InteractionTag--selected")).toBe(true);
    expect(tag.getAttribute("data-size")).toBe("small");
    expect(tag.getAttribute("data-shape")).toBe("rounded");
    expect(container.querySelector(".sf-InteractionTag__secondary")!.textContent).toBe(
      "Secondary",
    );
  });

  it("fires onClick and onDismiss from the primary and dismiss controls", () => {
    const onClick = vi.fn();
    const onDismiss = vi.fn();
    const { container } = renderWithFluent(() => (
      <InteractionTag onClick={onClick} onDismiss={onDismiss} aria-label="Tag action">
        Primary
      </InteractionTag>
    ));
    const primary = container.querySelector<HTMLButtonElement>(".sf-InteractionTag__primary")!;
    const dismiss = container.querySelector<HTMLButtonElement>(".sf-InteractionTag__dismiss")!;
    expect(primary).toHaveAttribute("aria-label", "Tag action");
    expect(dismiss).toHaveAttribute("aria-label", "Remove");
    fireEvent.click(primary);
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(dismiss);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("omits the dismiss control when onDismiss is not provided", () => {
    const { container } = renderWithFluent(() => (
      <InteractionTag onClick={() => {}}>Primary</InteractionTag>
    ));
    expect(container.querySelector(".sf-InteractionTag__primary")).toBeTruthy();
    expect(container.querySelector(".sf-InteractionTag__dismiss")).toBeNull();
  });

  it("standalone Primary/Secondary forward class, aria-label and click handlers", () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    const { container } = renderWithFluent(() => (
      <>
        <InteractionTagPrimary class="my-primary" aria-label="P" onClick={onPrimary}>
          P
        </InteractionTagPrimary>
        <InteractionTagSecondary class="my-secondary" onClick={onSecondary} />
      </>
    ));
    const primary = container.querySelector<HTMLButtonElement>(".sf-InteractionTag__primary")!;
    const secondary = container.querySelector<HTMLButtonElement>(".sf-InteractionTag__dismiss")!;
    expect(primary.classList.contains("my-primary")).toBe(true);
    expect(secondary.classList.contains("my-secondary")).toBe(true);
    expect(secondary).toHaveAttribute("aria-label", "Remove");
    fireEvent.click(primary);
    fireEvent.click(secondary);
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });
});
