import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type JSX,
} from "solid-js";
import { cx } from "../../utils/index";
import { Button } from "../button/Button";
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "../menu/Menu";

export type OverflowItemData = {
  id: string;
  content: JSX.Element;
  priority?: number;
  menuContent?: JSX.Element;
};

export type OverflowProps = {
  items?: OverflowItemData[];
  minimumVisible?: number;
  class?: string;
  padding?: number;
  children?: JSX.Element;
};

export const DATA_OVERFLOW_ITEM = "data-overflow-item";
export const DATA_OVERFLOW_MENU = "data-overflow-menu";
export const DATA_OVERFLOW_DIVIDER = "data-overflow-divider";
export const DATA_OVERFLOWING = "data-overflowing";

export function Overflow(props: OverflowProps) {
  let rootEl!: HTMLDivElement;
  const [visibleCount, setVisibleCount] = createSignal(props.items?.length ?? 0);
  const [itemCount, setItemCount] = createSignal(props.items?.length ?? 0);
  const minimumVisible = () => props.minimumVisible ?? 1;
  const hasItems = () => props.items !== undefined;

  const sorted = createMemo(() =>
    [...(props.items ?? [])].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)),
  );

  const measuredItems = () =>
    Array.from(rootEl?.querySelectorAll<HTMLElement>(`[${DATA_OVERFLOW_ITEM}]`) ?? []);

  const applyVisibility = (elements: HTMLElement[]) => {
    elements.forEach((el, index) => {
      const overflowing = index >= visibleCount();
      el.style.visibility = overflowing ? "hidden" : "visible";
      el.style.position = overflowing ? "absolute" : "relative";
      el.style.pointerEvents = overflowing ? "none" : "auto";
      if (overflowing) el.setAttribute(DATA_OVERFLOWING, "true");
      else el.removeAttribute(DATA_OVERFLOWING);
    });
  };

  const update = () => {
    if (!rootEl) return;
    const style = getComputedStyle(rootEl);
    const gap = Number.parseFloat(style.columnGap || style.gap || "0") || 0;
    const available = rootEl.clientWidth - (props.padding ?? 0);
    const children = measuredItems();
    setItemCount(children.length);
    let used = 0;
    let count = 0;
    const overflowBtnWidth = 40;
    for (const child of children) {
      const width = child.offsetWidth + (count > 0 ? gap : 0);
      const remainingItems = children.length - count - 1;
      const reserve = remainingItems > 0 ? overflowBtnWidth + gap : 0;
      if (used + width + reserve <= available || count < minimumVisible()) {
        used += width;
        count += 1;
      } else {
        break;
      }
    }
    setVisibleCount(Math.max(count, Math.min(minimumVisible(), children.length)));
    if (!hasItems()) applyVisibility(children);
  };

  onMount(() => {
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(rootEl);
    onCleanup(() => ro.disconnect());
  });

  createEffect(() => {
    // recompute when the data items or composed children change
    props.items?.length;
    props.children;
    queueMicrotask(update);
  });

  createEffect(() => {
    // reflect the latest visible count on composed children
    visibleCount();
    if (!hasItems()) queueMicrotask(() => applyVisibility(measuredItems()));
  });

  const overflowed = createMemo(() => sorted().slice(visibleCount()));
  const overflowCount = () => Math.max(0, itemCount() - visibleCount());

  return (
    <div
      ref={rootEl}
      class={cx("sf-Overflow", props.class)}
      data-overflowing={overflowCount() > 0 ? "true" : undefined}
    >
      <Show when={hasItems()} fallback={props.children}>
        <For each={sorted()}>
          {(item, index) => (
            <div
              {...{ [DATA_OVERFLOW_ITEM]: "" }}
              class="sf-Overflow__item"
              data-overflow-id={item.id}
              data-overflowing={index() >= visibleCount() ? "true" : undefined}
              style={{
                visibility: index() < visibleCount() ? "visible" : "hidden",
                position: index() < visibleCount() ? "relative" : "absolute",
                "pointer-events": index() < visibleCount() ? "auto" : "none",
              }}
            >
              {item.content}
            </div>
          )}
        </For>
      </Show>
      <Show when={overflowCount() > 0}>
        <Menu>
          <MenuTrigger>
            <Button
              appearance="subtle"
              size="small"
              class="sf-Overflow__menu"
              {...{ [DATA_OVERFLOW_MENU]: "" }}
            >
              +{overflowCount()}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <Show when={hasItems()} fallback={<span>{overflowCount()} hidden items</span>}>
                <For each={overflowed()}>
                  {(item) => <MenuItem>{item.menuContent ?? item.content}</MenuItem>}
                </For>
              </Show>
            </MenuList>
          </MenuPopover>
        </Menu>
      </Show>
      {/* ensure measurement nodes always present */}
      <span class="sf-Overflow__sizer" aria-hidden="true" />
    </div>
  );
}

export function OverflowItem(props: {
  id: string;
  class?: string;
  children?: JSX.Element;
}) {
  return (
    <div
      class={cx("sf-Overflow__item", props.class)}
      {...{ [DATA_OVERFLOW_ITEM]: "" }}
      data-overflow-id={props.id}
    >
      {props.children}
    </div>
  );
}

export function OverflowMenu(props: { class?: string; children?: JSX.Element }) {
  return (
    <div class={cx("sf-Overflow__menu", props.class)} {...{ [DATA_OVERFLOW_MENU]: "" }}>
      {props.children}
    </div>
  );
}

export function OverflowDivider(props: { class?: string; children?: JSX.Element }) {
  return (
    <div class={cx("sf-Overflow__divider", props.class)} role="separator" {...{ [DATA_OVERFLOW_DIVIDER]: "" }}>
      {props.children}
    </div>
  );
}
