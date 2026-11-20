import { describe, expect, it, vi } from "vitest";
import {
  callHandler,
  createId,
  createControllableSignal,
  cx,
  moveActiveIndex,
  omitProps,
} from "./index";

describe("utils", () => {
  it("merges cx parts", () => {
    expect(cx("a", false && "b", null, "c")).toBe("a c");
  });

  it("omits keys", () => {
    expect(omitProps({ a: 1, b: 2 }, ["a"])).toEqual({ b: 2 });
  });

  it("creates unique ids", () => {
    expect(createId("x")).not.toBe(createId("x"));
  });

  it("calls event handler unions", () => {
    const direct = (vi as any).fn();
    callHandler(direct, {} as MouseEvent & { currentTarget: Element; target: Element });
    expect(direct).toHaveBeenCalledTimes(1);
  });

  it("supports controlled and uncontrolled state", () => {
    const [current, set] = createControllableSignal(
      () => undefined,
      "a",
      (vi as any).fn(),
    );
    expect(current()).toBe("a");
    set("b");
    expect(current()).toBe("b");
  });

  it("cx drops all falsy parts", () => {
    expect(cx(false, null, undefined, "", "a")).toBe("a");
    expect(cx()).toBe("");
  });

  it("omitProps removes multiple keys without mutating the source", () => {
    const source = { a: 1, b: 2, c: 3 };
    expect(omitProps(source, ["a", "c"])).toEqual({ b: 2 });
    expect(source).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("createId prefixes generated ids and keeps them unique", () => {
    const id = createId("widget");
    expect(id).toMatch(/^widget-/);
    expect(id).not.toBe(createId("widget"));
  });

  it("callHandler forwards tuple handlers and ignores empty handlers", () => {
    const fn = vi.fn();
    const owner = { tag: "owner" };
    const event = {} as MouseEvent;
    // NOTE: implementation calls handler[0](handler[1], event), despite the
    // "[owner, fn]" wording in the source comment (reported as a mismatch).
    callHandler([fn, owner], event);
    expect(fn).toHaveBeenCalledWith(owner, event);

    callHandler(null, event);
    callHandler(undefined, event);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("createControllableSignal keeps controlled values fixed but reports changes", () => {
    const onChange = vi.fn();
    const [current, set] = createControllableSignal(() => "a", "fallback", onChange);
    expect(current()).toBe("a");
    set("b");
    expect(current()).toBe("a");
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("createControllableSignal supports functional updates when uncontrolled", () => {
    const [current, set] = createControllableSignal(() => undefined, 1);
    set((previous) => previous + 1);
    expect(current()).toBe(2);
  });

  it("re-exports a11y helpers from the utils entry point", () => {
    expect(moveActiveIndex(0, 1, 3)).toBe(1);
  });
});
