import { createSignal } from "solid-js";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Some DOM environments (notably jsdom) do not implement layout, so
 * `getClientRects()` is always empty even for visible elements. Probe once per
 * document and only use the rect check when the document actually lays out.
 */
let layoutSupported: boolean | undefined;
function hasLayout(doc: Document): boolean {
  if (layoutSupported !== undefined) return layoutSupported;
  try {
    const probe = doc.createElement("div");
    probe.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;";
    (doc.body ?? doc.documentElement).appendChild(probe);
    layoutSupported = probe.getClientRects().length > 0;
    probe.remove();
  } catch {
    layoutSupported = false;
  }
  return layoutSupported;
}

/** True when the element is rendered and not inside a hidden/inert subtree. */
function isRendered(el: HTMLElement): boolean {
  // `[hidden]` / `[inert]` on the element or any ancestor removes the subtree.
  if (el.closest("[hidden], [inert]")) return false;

  const view = el.ownerDocument.defaultView;
  if (view) {
    // `display` is not inherited, so walk ancestors (visibility is inherited,
    // but checking each node covers both without layout support).
    let node: Element | null = el;
    while (node) {
      const style = view.getComputedStyle(node);
      if (style.display === "none") return false;
      if (style.visibility === "hidden" || style.visibility === "collapse") {
        return false;
      }
      node = node.parentElement;
    }
  }

  // Layout-based check catches zero-size elements that computed style misses.
  // Skipped in layout-less environments so programmatic focus still works.
  if (hasLayout(el.ownerDocument) && typeof el.getClientRects === "function") {
    if (el.getClientRects().length === 0) return false;
  }

  return true;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-disabled") !== "true" &&
      isRendered(el),
  );
}

export function focusElement(el?: HTMLElement | null) {
  if (!el) return;
  try {
    el.focus({ preventScroll: true });
  } catch {
    el.focus();
  }
}

export function createFocusTrap(getContainer: () => HTMLElement | undefined | null) {
  let previous: HTMLElement | null = null;
  let active = false;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const root = getContainer();
    if (!root) return;
    const items = getFocusableElements(root);
    if (items.length === 0) {
      event.preventDefault();
      focusElement(root);
      return;
    }
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const current = document.activeElement as HTMLElement | null;
    if (event.shiftKey) {
      if (current === first || !root.contains(current)) {
        event.preventDefault();
        focusElement(last);
      }
    } else if (current === last || !root.contains(current)) {
      // Forward Tab escaping the container (e.g. the last element was skipped,
      // or focus was moved programmatically) must be pulled back to the first.
      event.preventDefault();
      focusElement(first);
    }
  };

  // Focus can also leave via mouse/programmatic focus, not just Tab. Recapture
  // it so the trap stays intact between keydown events.
  const onFocusIn = (event: FocusEvent) => {
    if (!active) return;
    const root = getContainer();
    const target = event.target as Node | null;
    if (!root || !target || root.contains(target)) return;
    const items = getFocusableElements(root);
    focusElement(items[0] ?? root);
  };

  const deactivate = () => {
    if (!active) return;
    active = false;
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("focusin", onFocusIn, true);
    if (previous && document.contains(previous)) focusElement(previous);
    previous = null;
  };

  const activate = () => {
    deactivate();
    active = true;
    previous = document.activeElement as HTMLElement | null;
    const container = getContainer();
    if (container) {
      const focusables = getFocusableElements(container);
      focusElement(focusables[0] ?? container);
    }
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    return deactivate;
  };

  return { activate, deactivate };
}

export function moveActiveIndex(
  current: number,
  delta: number,
  count: number,
  options?: { loop?: boolean; disabled?: (index: number) => boolean },
): number {
  if (count <= 0) return -1;
  const loop = options?.loop ?? true;
  let next = current;
  for (let i = 0; i < count; i += 1) {
    next += delta;
    if (loop) {
      if (next < 0) next = count - 1;
      if (next >= count) next = 0;
    } else {
      next = Math.min(Math.max(next, 0), count - 1);
    }
    if (!options?.disabled?.(next)) return next;
    if (!loop && ((delta < 0 && next === 0) || (delta > 0 && next === count - 1))) {
      return current >= 0 ? current : next;
    }
  }
  return current;
}

export function useActiveIndex(initial = -1) {
  const [activeIndex, setActiveIndex] = createSignal(initial);
  return { activeIndex, setActiveIndex };
}

export function isTypingKey(event: KeyboardEvent) {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

export function scrollIntoViewIfNeeded(
  container: HTMLElement | undefined,
  item: HTMLElement | undefined,
) {
  if (!container || !item) return;
  const cRect = container.getBoundingClientRect();
  const iRect = item.getBoundingClientRect();
  if (iRect.top < cRect.top) {
    container.scrollTop -= cRect.top - iRect.top;
  } else if (iRect.bottom > cRect.bottom) {
    container.scrollTop += iRect.bottom - cRect.bottom;
  }
}
