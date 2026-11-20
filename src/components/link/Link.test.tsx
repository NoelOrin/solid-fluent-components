import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Link } from "./Link";
import { renderWithFluent } from "../../test-utils/index";

describe("Link", () => {
  it("renders an anchor with the given href and accessible name", () => {
    const { getByRole } = renderWithFluent(() => (
      <Link href="https://example.com">Docs</Link>
    ));
    const link = getByRole("link", { name: "Docs" }) as HTMLAnchorElement;
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveClass("sf-Link");
  });

  it("adds subtle and inline modifiers only when requested", () => {
    const { getByRole: getDefault } = renderWithFluent(() => (
      <Link href="#a" class="my-link">A</Link>
    ));
    const plain = getDefault("link", { name: "A" });
    expect(plain).toHaveClass("sf-Link", "my-link");
    expect(plain).not.toHaveClass("sf-Link--subtle", "sf-Link--inline");
  });

  it("applies subtle and inline appearance modifiers", () => {
    const { getByRole } = renderWithFluent(() => (
      <Link href="#b" appearance="subtle" inline>B</Link>
    ));
    expect(getByRole("link", { name: "B" })).toHaveClass(
      "sf-Link",
      "sf-Link--subtle",
      "sf-Link--inline",
    );
  });

  it("forwards native anchor attributes such as target, rel and title", () => {
    const { getByRole } = renderWithFluent(() => (
      <Link href="#c" target="_blank" rel="noreferrer" title="Open docs" id="docs">
        C
      </Link>
    ));
    const link = getByRole("link", { name: "C" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("title", "Open docs");
    expect(link).toHaveAttribute("id", "docs");
  });

  it("is focusable when it has an href", () => {
    const { getByRole } = renderWithFluent(() => <Link href="#d">D</Link>);
    const link = getByRole("link", { name: "D" }) as HTMLAnchorElement;
    expect(link.tabIndex).toBe(0);
    link.focus();
    expect(document.activeElement).toBe(link);
  });

  it("calls onClick with the event for an enabled anchor", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Link href="#e" onClick={onClick}>E</Link>
    ));
    const notPrevented = fireEvent.click(getByRole("link", { name: "E" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
    expect(notPrevented).toBe(true);
  });

  it("removes href, blocks navigation and ignores clicks when disabled", () => {
    const onClick = vi.fn();
    const { getByText } = renderWithFluent(() => (
      <Link href="#f" disabled onClick={onClick}>F</Link>
    ));
    const link = getByText("F");
    expect(link).toHaveClass("sf-Link--disabled");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    const notPrevented = fireEvent.click(link);
    expect(notPrevented).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a native button when as='button' is set, even with an href", () => {
    const { getByRole } = renderWithFluent(() => (
      <Link as="button" href="#g" aria-label="Button link">G</Link>
    ));
    const btn = getByRole("button", { name: "Button link" }) as HTMLButtonElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).not.toHaveAttribute("href");
  });

  it("falls back to a button when no href is supplied", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Link onClick={onClick}>No href</Link>
    ));
    const btn = getByRole("button", { name: "No href" });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables the button variant with the native disabled attribute", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Link as="button" disabled onClick={onClick}>Disabled link</Link>
    ));
    const btn = getByRole("button", { name: "Disabled link" }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn).toHaveClass("sf-Link--disabled");
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps the button variant keyboard focusable when enabled", () => {
    const { getByRole } = renderWithFluent(() => (
      <Link as="button">Focusable link</Link>
    ));
    const btn = getByRole("button", { name: "Focusable link" }) as HTMLButtonElement;
    expect(btn.tabIndex).toBe(0);
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });
});
