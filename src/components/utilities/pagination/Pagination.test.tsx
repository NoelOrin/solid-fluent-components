import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Pagination } from "./Pagination";
import { renderWithFluent } from "../../../test-utils/index";

describe("Pagination", () => {
  it("renders a pagination with the current page marked", () => {
    const onPage = (vi as any).fn();
    const { container } = renderWithFluent(() => (
      <Pagination pageCount={3} page={2} onPageChange={onPage} />
    ));
    expect(container.querySelector(".sf-Pagination")).toBeTruthy();
    const current = container.querySelector('[aria-current="page"]');
    expect(current?.textContent).toContain("2");
  });

  it("supports configurable button text and aria labels", () => {
    const { getByRole } = renderWithFluent(() => (
      <Pagination
        pageCount={3}
        page={2}
        prevLabel="Prev"
        nextLabel="Next"
        ellipsisLabel="..."
        prevButtonAriaLabel="Go to previous page"
        nextButtonAriaLabel="Go to next page"
        getItemAriaLabel={(page) => `Page ${page}`}
        getDotsAriaLabel={(direction) => `Jump ${direction}`}
      />
    ));
    expect(getByRole("button", { name: "Go to previous page" }).textContent).toContain("Prev");
    expect(getByRole("button", { name: "Go to next page" }).textContent).toContain("Next");
    expect(getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("makes ellipses interactive and fires page changes", () => {
    const onPage = (vi as any).fn();
    const { getByRole } = renderWithFluent(() => (
      <Pagination pageCount={10} defaultPage={5} siblingCount={1} onPageChange={onPage} />
    ));

    const startDots = getByRole("button", { name: "向前跳转若干页" });
    expect(startDots.getAttribute("data-direction")).toBe("start");
    fireEvent.click(startDots);
    expect(onPage).toHaveBeenLastCalledWith(3);

    // re-query: the ellipsis buttons are rebuilt after the page changes
    const endDots = getByRole("button", { name: "向后跳转若干页" });
    fireEvent.click(endDots);

    expect(onPage).toHaveBeenLastCalledWith(5); // 3 + siblingCount + 1
  });

  it("clicking next advances aria-current and reports the new page", () => {
    const onPageChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Pagination pageCount={3} defaultPage={1} onPageChange={onPageChange} />
    ));
    fireEvent.click(getByRole("button", { name: "下一页" }));
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain("2");
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("clicking previous goes back a page and reports it", () => {
    const onPageChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Pagination pageCount={3} defaultPage={3} onPageChange={onPageChange} />
    ));
    fireEvent.click(getByRole("button", { name: "上一页" }));
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain("2");
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("marks the previous button unavailable on the first page", () => {
    const { getByRole } = renderWithFluent(() => <Pagination pageCount={3} page={1} />);
    expect(getByRole("button", { name: "上一页" })).toHaveAttribute("aria-disabled", "true");
    expect(getByRole("button", { name: "下一页" })).not.toHaveAttribute("aria-disabled", "true");
  });

  it("marks the next button unavailable on the last page", () => {
    const { getByRole } = renderWithFluent(() => <Pagination pageCount={3} page={3} />);
    expect(getByRole("button", { name: "下一页" })).toHaveAttribute("aria-disabled", "true");
  });

  it("ignores a click on an unavailable boundary button", () => {
    const onPageChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Pagination pageCount={3} page={1} onPageChange={onPageChange} />
    ));
    fireEvent.click(getByRole("button", { name: "上一页" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("keeps a controlled page marked while reporting the requested change", () => {
    const onPageChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Pagination pageCount={3} page={1} onPageChange={onPageChange} />
    ));
    fireEvent.click(getByRole("button", { name: "3" }));
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain("1");
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("prevents all page changes when disabled", () => {
    const onPageChange = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <Pagination pageCount={5} defaultPage={2} disabled onPageChange={onPageChange} />
    ));
    fireEvent.click(getByRole("button", { name: "下一页" }));
    fireEvent.click(getByRole("button", { name: "5" }));
    expect(onPageChange).not.toHaveBeenCalled();
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain("2");
  });

  it("renders a single page with both navigation buttons unavailable when pageCount is one", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Pagination pageCount={1} defaultPage={1} />
    ));
    const buttons = Array.from(container.querySelectorAll("button"));
    expect(buttons.length).toBe(3);
    expect(getByRole("button", { name: "上一页" })).toHaveAttribute("aria-disabled", "true");
    expect(getByRole("button", { name: "下一页" })).toHaveAttribute("aria-disabled", "true");
  });

  it("keeps the current page button focusable", () => {
    const { container } = renderWithFluent(() => <Pagination pageCount={3} page={2} />);
    const current = container.querySelector<HTMLButtonElement>('[aria-current="page"]')!;
    expect(current.tagName).toBe("BUTTON");
    current.focus();
    expect(document.activeElement).toBe(current);
  });

  it("widens the visible page range with siblingCount", () => {
    const { container } = renderWithFluent(() => (
      <Pagination pageCount={9} page={5} siblingCount={2} />
    ));
    const pageNumbers = Array.from(container.querySelectorAll<HTMLElement>("button"))
      .map((b) => b.textContent?.trim() ?? "")
      .filter((text) => /^\d+$/.test(text));
    expect(pageNumbers).toEqual(["1", "3", "4", "5", "6", "7", "9"]);
  });
});

