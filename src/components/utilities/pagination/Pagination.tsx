import { For, createMemo, createSignal, type JSX } from "solid-js";
import { cx } from "../../../utils/index";
import { Button } from "../../button/Button";

export type PaginationProps = {
  page?: number;
  defaultPage?: number;
  pageCount?: number;
  siblingCount?: number;
  disabled?: boolean;
  class?: string;
  onPageChange?: (page: number) => void;
  /** Accessible name of the previous-page button. */
  prevButtonAriaLabel?: string;
  /** Accessible name of the next-page button. */
  nextButtonAriaLabel?: string;
  /** Accessible name for a numbered page button. */
  getItemAriaLabel?: (page: number) => string;
  /** Accessible name for an ellipsis jump button. */
  getDotsAriaLabel?: (direction: "start" | "end") => string;
  /** Visible text of the navigation buttons. */
  prevLabel?: JSX.Element;
  nextLabel?: JSX.Element;
  ellipsisLabel?: JSX.Element;
};

type PageItem =
  | { type: "page"; page: number }
  | { type: "dots"; direction: "start" | "end" };

function buildPages(page: number, pageCount: number, siblingCount: number): PageItem[] {
  const pages: PageItem[] = [];
  const start = Math.max(2, page - siblingCount);
  const end = Math.min(pageCount - 1, page + siblingCount);
  pages.push({ type: "page", page: 1 });
  if (start > 2) pages.push({ type: "dots", direction: "start" });
  for (let i = start; i <= end; i += 1) pages.push({ type: "page", page: i });
  if (end < pageCount - 1) pages.push({ type: "dots", direction: "end" });
  if (pageCount > 1) pages.push({ type: "page", page: pageCount });
  return pages;
}

export function Pagination(props: PaginationProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultPage ?? 1);
  const page = createMemo(() => props.page ?? uncontrolled());
  const pageCount = () => Math.max(props.pageCount ?? 1, 1);
  const siblingCount = () => props.siblingCount ?? 1;

  const setPage = (next: number) => {
    if (props.disabled) return;
    const clamped = Math.min(Math.max(next, 1), pageCount());
    if (props.page === undefined) setUncontrolled(clamped);
    props.onPageChange?.(clamped);
  };

  const items = createMemo(() => buildPages(page(), pageCount(), siblingCount()));

  const jumpFromDots = (direction: "start" | "end") => {
    const step = siblingCount() + 1;
    setPage(direction === "start" ? page() - step : page() + step);
  };

  const dotsLabel = (direction: "start" | "end") =>
    props.getDotsAriaLabel?.(direction) ??
    (direction === "start" ? "向前跳转若干页" : "向后跳转若干页");

  return (
    <nav class={cx("sf-Pagination", props.class)} aria-label="Pagination">
      <Button
        appearance="subtle"
        size="small"
        aria-label={props.prevButtonAriaLabel ?? "上一页"}
        disabled={props.disabled || page() <= 1}
        onClick={() => setPage(page() - 1)}
      >
        {props.prevLabel ?? "上一页"}
      </Button>
      <For each={items()}>
        {(item) =>
          item.type === "dots" ? (
            <Button
              appearance="transparent"
              size="small"
              class="sf-Pagination__dots"
              aria-label={dotsLabel(item.direction)}
              data-direction={item.direction}
              disabled={props.disabled}
              onClick={() => jumpFromDots(item.direction)}
            >
              {props.ellipsisLabel ?? "…"}
            </Button>
          ) : (
            <Button
              appearance={item.page === page() ? "primary" : "subtle"}
              size="small"
              disabled={props.disabled}
              aria-label={props.getItemAriaLabel?.(item.page)}
              aria-current={item.page === page() ? "page" : undefined}
              onClick={() => setPage(item.page)}
            >
              {item.page}
            </Button>
          )
        }
      </For>
      <Button
        appearance="subtle"
        size="small"
        aria-label={props.nextButtonAriaLabel ?? "下一页"}
        disabled={props.disabled || page() >= pageCount()}
        onClick={() => setPage(page() + 1)}
      >
        {props.nextLabel ?? "下一页"}
      </Button>
    </nav>
  );
}

export type SkeletonGroupProps = {
  class?: string;
  children?: JSX.Element;
};
export function SkeletonGroup(props: SkeletonGroupProps) {
  return <div class={cx("sf-SkeletonGroup", props.class)}>{props.children}</div>;
}
