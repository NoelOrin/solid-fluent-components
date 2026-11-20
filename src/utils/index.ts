import { createSignal } from "solid-js";
import type { JSX } from "solid-js";

export type IntrinsicElementProps<T extends keyof JSX.HTMLElementTags> =
  JSX.HTMLElementTags[T];

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function omitProps<T extends Record<string, unknown>, K extends keyof T>(
  props: T,
  keys: readonly K[],
): Omit<T, K> {
  const clone = { ...props };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
}

let idSeed = 0;
export function createId(prefix = "sf"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  idSeed += 1;
  return `${prefix}-${idSeed}`;
}

/**
 * Forward a Solid event handler (function or `[fn, data]` tuple).
 * Handler/event types are intentionally loose here: each component narrows its
 * own event types at the call site, while this helper only needs to dispatch.
 */
export function callHandler(handler: unknown, event: unknown): void {
  if (!handler) return;
  if (typeof handler === "function") {
    (handler as (value: unknown) => void)(event);
    return;
  }
  if (Array.isArray(handler)) {
    (handler[0] as (data: unknown, value: unknown) => void)(handler[1], event);
  }
}


export function createControllableSignal<T>(
  value: () => T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [internal, setInternal] = createSignal(defaultValue);
  const isControlled = () => value() !== undefined;
  const current = () => (isControlled() ? (value() as T) : internal());
  const set = (next: T | ((prev: T) => T)) => {
    const resolved: T =
      typeof next === "function" ? (next as (prev: T) => T)(current()) : next;
    if (!isControlled()) (setInternal as (v: T) => void)(resolved);
    onChange?.(resolved);
  };
  return [current, set] as const;
}

export * from "./a11y";

export type Slot<T> = T;
export type AtomMotion = {
  duration?: number;
  delay?: number;
  easing?: string;
  keyframes?: Keyframe[];
};
export type AtomMotionFn = (options: AtomMotion) => { keyframes: PropertyIndexedKeyframes };
export type MotionImperativeRef = { play: () => void; pause: () => void };
