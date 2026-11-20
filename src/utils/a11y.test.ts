import { fireEvent } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import {
  createFocusTrap,
  focusElement,
  getFocusableElements,
  isTypingKey,
  moveActiveIndex,
  scrollIntoViewIfNeeded,
} from "./a11y";

describe("moveActiveIndex", () => {
  it("loops forward", () => {
    expect(moveActiveIndex(0, 1, 3)).toBe(1);
    expect(moveActiveIndex(2, 1, 3)).toBe(0);
  });

  it("skips disabled indexes", () => {
    expect(
      moveActiveIndex(0, 1, 3, { disabled: (i) => i === 1 }),
    ).toBe(2);
  });

  it("does not loop when loop=false", () => {
    expect(moveActiveIndex(2, 1, 3, { loop: false })).toBe(2);
  });
});

describe("getFocusableElements", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("filters display:none / visibility:hidden / hidden / inert subtrees", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <button id="ok">ok</button>
      <button id="display-none" style="display:none">hidden</button>
      <button id="visibility-hidden" style="visibility:hidden">hidden</button>
      <div style="display:none"><button id="ancestor-display-none">hidden</button></div>
      <button id="hidden-attr" hidden>hidden</button>
      <div inert><button id="inert-child">hidden</button></div>
      <button id="aria-disabled" aria-disabled="true">disabled</button>
      <button id="disabled" disabled>disabled</button>
    `;
    document.body.appendChild(container);

    const ids = getFocusableElements(container).map((el) => el.id);
    expect(ids).toEqual(["ok"]);
  });

  it("keeps descendants of a visible container", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">a</button><button id="b">b</button>`;
    document.body.appendChild(container);
    expect(getFocusableElements(container).map((el) => el.id)).toEqual(["a", "b"]);
  });
});

describe("createFocusTrap", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  function setup() {
    const container = document.createElement("div");
    container.innerHTML = `<button id="first">first</button><button id="last">last</button>`;
    const outside = document.createElement("button");
    outside.id = "outside";
    document.body.append(container, outside);
    const first = container.querySelector<HTMLElement>("#first")!;
    const last = container.querySelector<HTMLElement>("#last")!;
    return { container, first, last, outside };
  }

  it("wraps forward Tab from the last element to the first", () => {
    const { container, first, last } = setup();
    const trap = createFocusTrap(() => container);
    trap.activate();
    last.focus();
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    trap.deactivate();
  });

  it("pulls focus back when a forward Tab starts outside the container", () => {
    const { container, first, outside } = setup();
    const trap = createFocusTrap(() => container);
    trap.activate();

    // Simulate focus having escaped the container before Tab is pressed.
    const original = Object.getOwnPropertyDescriptor(document, "activeElement");
    let mockActive: Element | null = null;
    Object.defineProperty(document, "activeElement", {
      configurable: true,
      get: () => mockActive ?? original?.get?.call(document) ?? document.body,
    });
    mockActive = outside;
    try {
      fireEvent.keyDown(document, { key: "Tab" });
    } finally {
      mockActive = null;
      if (original) Object.defineProperty(document, "activeElement", original);
      else delete (document as any).activeElement;
    }
    expect(document.activeElement).toBe(first);
    trap.deactivate();
  });

  it("recaptures focus that escapes via programmatic focus (focusin)", () => {
    const { container, first, outside } = setup();
    const trap = createFocusTrap(() => container);
    trap.activate();
    outside.focus();
    expect(document.activeElement).toBe(first);
    trap.deactivate();
  });

  it("wraps Shift+Tab from the first element to the last", () => {
    const { container, first, last } = setup();
    const trap = createFocusTrap(() => container);
    trap.activate();
    first.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
    trap.deactivate();
  });

  it("focuses the first element on activate and restores prior focus on deactivate", () => {
    const { container, first, outside } = setup();
    outside.focus();
    const deactivate = createFocusTrap(() => container).activate();
    expect(document.activeElement).toBe(first);
    deactivate();
    expect(document.activeElement).toBe(outside);
  });

  it("keeps focus on the container when there are no focusable descendants", () => {
    const container = document.createElement("div");
    container.tabIndex = -1;
    document.body.appendChild(container);
    const trap = createFocusTrap(() => container);
    trap.activate();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(container);
    trap.deactivate();
  });
});

describe("a11y helpers", () => {
  it("moveActiveIndex handles empty lists, backward looping and all-disabled sets", () => {
    expect(moveActiveIndex(0, 1, 0)).toBe(-1);
    expect(moveActiveIndex(0, -1, 3)).toBe(2);
    expect(moveActiveIndex(0, -1, 3, { loop: false })).toBe(0);
    expect(moveActiveIndex(0, 1, 2, { disabled: () => true })).toBe(0);
  });

  it("focusElement focuses a real element and ignores null", () => {
    const button = document.createElement("button");
    document.body.appendChild(button);
    focusElement(button);
    expect(document.activeElement).toBe(button);
    focusElement(null);
    expect(document.activeElement).toBe(button);
  });

  it("isTypingKey recognizes printable keys but not modifiers or shortcuts", () => {
    const key = (value: string, init: KeyboardEventInit = {}) =>
      new KeyboardEvent("keydown", { key: value, ...init });
    expect(isTypingKey(key("a"))).toBe(true);
    expect(isTypingKey(key("Enter"))).toBe(false);
    expect(isTypingKey(key("a", { ctrlKey: true }))).toBe(false);
    expect(isTypingKey(key("a", { metaKey: true }))).toBe(false);
    expect(isTypingKey(key("a", { altKey: true }))).toBe(false);
  });

  it("scrollIntoViewIfNeeded scrolls for items above and below the viewport", () => {
    const container = document.createElement("div");
    const item = document.createElement("div");
    container.appendChild(item);
    document.body.appendChild(container);
    container.getBoundingClientRect = () =>
      ({ top: 0, bottom: 100, left: 0, right: 100, height: 100, width: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    container.scrollTop = 50;
    item.getBoundingClientRect = () =>
      ({ top: -10, bottom: 10, left: 0, right: 10, height: 20, width: 10, x: 0, y: -10, toJSON: () => ({}) }) as DOMRect;
    scrollIntoViewIfNeeded(container, item);
    expect(container.scrollTop).toBe(40);

    item.getBoundingClientRect = () =>
      ({ top: 90, bottom: 120, left: 0, right: 10, height: 30, width: 10, x: 0, y: 90, toJSON: () => ({}) }) as DOMRect;
    scrollIntoViewIfNeeded(container, item);
    expect(container.scrollTop).toBe(60);
  });
});
