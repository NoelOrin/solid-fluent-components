import {
  Index,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  type JSX,
} from "solid-js";
import { cx } from "../../../utils/index";
import { Button } from "../../button/Button";

export type VirtualizerProps<T> = {
  items: T[];
  itemSize: number;
  height: number;
  overscan?: number;
  class?: string;
  scrollRef?: (el: HTMLDivElement) => void;
  children: (item: T, index: number) => JSX.Element;
  /** Override the size of an individual item (variable-height rows). */
  getItemSize?: (item: T, index: number) => number;
  /** Stable key per item, reflected on the rendered row as `data-key`. */
  itemKey?: (item: T, index: number) => string | number;
  /** Called with the viewport scroll offset whenever the viewport scrolls. */
  onScroll?: (scrollTop: number) => void;
  /** Controlled scroll offset. Changing it scrolls the viewport. */
  scrollTo?: number;
  /** Receive an imperative handle for imperative scrolling. */
  virtualizerRef?: (handle: VirtualizerHandle) => void;
};

export type VirtualizerHandle = {
  scrollTo: (offset: number) => void;
  scrollToIndex: (index: number) => void;
  getScrollTop: () => number;
};

export function Virtualizer<T>(props: VirtualizerProps<T>) {
  const [scrollTop, setScrollTop] = createSignal(0);
  let viewport!: HTMLDivElement;
  let previousCount = props.items.length;

  const overscan = () => props.overscan ?? 4;
  const sizeFor = (item: T, index: number) =>
    Math.max(0, props.getItemSize?.(item, index) ?? props.itemSize);

  const offsets = createMemo(() => {
    let acc = 0;
    return props.items.map((item, index) => {
      const offset = acc;
      const size = sizeFor(item, index);
      acc += size;
      return { offset, size };
    });
  });

  const total = createMemo(() => {
    const arr = offsets();
    if (!arr.length) return 0;
    const last = arr[arr.length - 1]!;
    return last.offset + last.size;
  });

  const startIndex = createMemo(() => {
    const arr = offsets();
    if (!arr.length) return 0;
    const top = scrollTop();
    let found = arr.length - 1;
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i]!.offset + arr[i]!.size > top) {
        found = i;
        break;
      }
    }
    return Math.max(0, found - overscan());
  });

  const endIndex = createMemo(() => {
    const arr = offsets();
    if (!arr.length) return 0;
    const bottom = scrollTop() + props.height;
    let found = arr.length - 1;
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i]!.offset >= bottom) {
        found = i;
        break;
      }
    }
    return Math.min(arr.length, found + overscan() + 1);
  });

  const visibleItems = createMemo(() =>
    props.items.slice(startIndex(), endIndex()).map((item, localIndex) => {
      const index = startIndex() + localIndex;
      const metrics = offsets()[index];
      return {
        item,
        index,
        offset: metrics?.offset ?? index * props.itemSize,
        size: metrics?.size ?? props.itemSize,
        key: props.itemKey?.(item, index) ?? index,
      };
    }),
  );

  const applyScroll = (value: number) => {
    if (!viewport) return;
    viewport.scrollTop = Math.max(0, value);
  };

  const handle: VirtualizerHandle = {
    scrollTo: applyScroll,
    scrollToIndex: (index) => {
      const arr = offsets();
      if (!arr.length) return;
      const clamped = Math.min(Math.max(index, 0), arr.length - 1);
      applyScroll(arr[clamped]!.offset);
    },
    getScrollTop: () => viewport?.scrollTop ?? 0,
  };

  onMount(() => props.virtualizerRef?.(handle));

  createEffect(() => {
    const target = props.scrollTo;
    if (target === undefined) return;
    applyScroll(target);
  });

  // When the item set shrinks the previous scroll offset becomes invalid —
  // reset both the DOM scroll position and the derived window.
  createEffect(() => {
    const count = props.items.length;
    if (count < previousCount && viewport && viewport.scrollTop > 0) {
      viewport.scrollTop = 0;
      setScrollTop(0);
      props.onScroll?.(0);
    }
    previousCount = count;
  });

  return (
    <div
      ref={(el) => {
        viewport = el;
        props.scrollRef?.(el);
      }}
      class={cx("sf-Virtualizer", props.class)}
      style={{ height: `${props.height}px`, overflow: "auto", position: "relative" }}
      onScroll={(event) => {
        const value = event.currentTarget.scrollTop;
        setScrollTop(value);
        props.onScroll?.(value);
      }}
    >
      <div style={{ height: `${total()}px`, position: "relative" }}>
        <Index each={visibleItems()}>
          {(entry) => (
            <div
              class="sf-Virtualizer__item"
              data-key={String(entry().key)}
              style={{
                position: "absolute",
                top: `${entry().offset}px`,
                left: 0,
                right: 0,
                height: `${entry().size}px`,
              }}
            >
              {props.children(entry().item, entry().index)}
            </div>
          )}
        </Index>
      </div>
    </div>
  );
}

export type InfoButtonProps = {
  size?: "small" | "medium" | "large";
  class?: string;
  info?: JSX.Element;
  onClick?: () => void;
};

export function InfoButton(props: InfoButtonProps) {
  return (
    <Button
      appearance="transparent"
      size={props.size === "large" ? "medium" : "small"}
      class={cx("sf-InfoButton", props.class)}
      aria-label="More info"
      onClick={props.onClick}
    >
      ⓘ
    </Button>
  );
}

export type AppItemProps = {
  href?: string;
  icon?: JSX.Element;
  selected?: boolean;
  class?: string;
  children?: JSX.Element;
  onClick?: () => void;
};

export function AppItem(props: AppItemProps) {
  return (
    <button
      type="button"
      class={cx(
        "sf-AppItem",
        props.selected && "sf-AppItem--selected",
        props.class,
      )}
      onClick={props.onClick}
    >
      {props.icon}
      <span>{props.children}</span>
    </button>
  );
}

export function AppItemStatic(props: {
  icon?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}) {
  return (
    <div class={cx("sf-AppItem", "sf-AppItem--static", props.class)}>
      {props.icon}
      <span>{props.children}</span>
    </div>
  );
}
