import { t } from "../../i18n";
import {
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type JSX,
} from "solid-js";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
} from "@floating-ui/dom";
import { createId, cx } from "../../utils/index";
import { Button } from "../button/Button";
import { Carousel } from "../carousel/Carousel";

export type TeachingPopoverPosition = "above" | "below" | "before" | "after";
export type TeachingPopoverPositioning =
  | TeachingPopoverPosition
  | {
      position?: TeachingPopoverPosition;
      align?: "start" | "center" | "end";
    };
export type TeachingPopoverAppearance = "brand" | "inverse" | "light" | "dark";

function toPlacement(value: TeachingPopoverPositioning): Placement {
  const config = typeof value === "string" ? { position: value } : value;
  const base: Placement =
    config.position === "above"
      ? "top"
      : config.position === "before"
        ? "left"
        : config.position === "after"
          ? "right"
          : "bottom";
  const align = config.align ?? "center";
  if (align === "center") return base;
  if (base === "left" || base === "right") {
    return `${base}-${align === "end" ? "end" : "start"}` as Placement;
  }
  return `${base}-${align}` as Placement;
}

type TriggerContextValue = {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  setTriggerEl: (el: HTMLElement | undefined) => void;
  setSurfaceEl: (el: HTMLElement | undefined) => void;
  setHasSurface: (value: boolean) => void;
  positioning: () => TeachingPopoverPositioning;
  appearance: () => TeachingPopoverAppearance | undefined;
  surfaceId: string;
};

const TeachingPopoverTriggerContext = createContext<TriggerContextValue>();
function useTeachingPopover() {
  const ctx = useContext(TeachingPopoverTriggerContext);
  if (!ctx) throw new Error("TeachingPopover components must be used within <TeachingPopover>");
  return ctx;
}

export type TeachingPopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: JSX.Element;
  body?: JSX.Element;
  footer?: JSX.Element;
  withArrow?: boolean;
  positioning?: TeachingPopoverPositioning;
  appearance?: TeachingPopoverAppearance;
  class?: string;
  children?: JSX.Element;
};

export function TeachingPopover(props: TeachingPopoverProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultOpen ?? false);
  const open = createMemo(() => props.open ?? uncontrolled());
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setUncontrolled(next);
    props.onOpenChange?.(next);
  };
  const [triggerEl, setTriggerEl] = createSignal<HTMLElement>();
  const [surfaceEl, setSurfaceEl] = createSignal<HTMLElement>();
  const [hasSurface, setHasSurface] = createSignal(false);
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });
  const surfaceId = createId("sf-teaching-popover");

  createEffect(() => {
    if (!open()) return;
    const trigger = triggerEl();
    const surface = surfaceEl();
    if (trigger && surface) {
      let cancelled = false;
      const update = async () => {
        const result = await computePosition(trigger, surface, {
          placement: toPlacement(props.positioning ?? "below"),
          middleware: [offset(8), flip(), shift({ padding: 8 })],
        });
        if (!cancelled) setCoords({ x: result.x, y: result.y });
      };
      void update();
      const stopAutoUpdate = autoUpdate(trigger, surface, () => void update());
      onCleanup(() => {
        cancelled = true;
        stopAutoUpdate();
      });
    }

    const focusTrigger = () => {
      const el = triggerEl();
      if (!el) return;
      const selector = 'button, a[href], input, [tabindex], [role="button"]';
      const target = el.matches(selector)
        ? el
        : el.querySelector<HTMLElement>(selector);
      (target ?? el).focus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      focusTrigger();
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (surfaceEl()?.contains(target) || triggerEl()?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    onCleanup(() => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    });
  });

  const value: TriggerContextValue = {
    open,
    setOpen,
    setTriggerEl,
    setSurfaceEl,
    setHasSurface,
    positioning: () => props.positioning ?? "below",
    appearance: () => props.appearance,
    surfaceId,
  };

  return (
    <TeachingPopoverTriggerContext.Provider value={value}>
      <span class={cx("sf-TeachingPopoverWrap", props.class)} style={{ display: "inline-flex" }}>
        {props.children}
      </span>
      <Show when={open() && !hasSurface()}>
        <div
          ref={setSurfaceEl}
          id={surfaceId}
          class={cx(
            "sf-TeachingPopover",
            props.appearance && `sf-TeachingPopover--${props.appearance}`,
          )}
          role="note"
          style={{
            position: "absolute",
            left: `${coords().x}px`,
            top: `${coords().y}px`,
          }}
        >
          <Show when={props.withArrow !== false}>
            <div class="sf-TeachingPopover__arrow" aria-hidden="true" />
          </Show>
          <div class="sf-TeachingPopover__header">
            <TeachingPopoverTitle>{props.title}</TeachingPopoverTitle>
            <Button
              appearance="transparent"
              size="small"
              aria-label={t("common.close")}
              onClick={() => setOpen(false)}
            >
              ×
            </Button>
          </div>
          <TeachingPopoverBody>{props.body}</TeachingPopoverBody>
          <Show when={props.footer}>
            <TeachingPopoverFooter>{props.footer}</TeachingPopoverFooter>
          </Show>
        </div>
      </Show>
    </TeachingPopoverTriggerContext.Provider>
  );
}

export function TeachingPopoverTrigger(props: { class?: string; children?: JSX.Element }) {
  const ctx = useTeachingPopover();
  let wrap!: HTMLSpanElement;
  createEffect(() => {
    const target =
      wrap?.querySelector<HTMLElement>("button, a[href], input, [role='button'], [tabindex]") ??
      wrap;
    if (!target) return;
    target.setAttribute("aria-haspopup", "dialog");
    target.setAttribute("aria-expanded", ctx.open() ? "true" : "false");
    target.setAttribute("aria-controls", ctx.surfaceId);
  });
  return (
    <span
      ref={(el) => {
        wrap = el;
        ctx.setTriggerEl(el);
      }}
      class={props.class}
      style={{ display: "inline-flex" }}
      onClick={() => ctx.setOpen(!ctx.open())}
    >
      {props.children}
    </span>
  );
}

export function TeachingPopoverSurface(props: {
  withArrow?: boolean;
  class?: string;
  children?: JSX.Element;
}) {
  const ctx = useContext(TeachingPopoverTriggerContext);
  if (ctx) {
    ctx.setHasSurface(true);
    onCleanup(() => ctx.setHasSurface(false));
  }
  const visible = () => (ctx ? ctx.open() : true);
  return (
    <Show when={visible()}>
      <div
        ref={(el) => ctx?.setSurfaceEl(el)}
        id={ctx?.surfaceId}
        class={cx(
          "sf-TeachingPopover",
          ctx?.appearance() && `sf-TeachingPopover--${ctx.appearance()}`,
          props.class,
        )}
        role="note"
      >
        <Show when={props.withArrow !== false}>
          <div class="sf-TeachingPopover__arrow" aria-hidden="true" />
        </Show>
        {props.children}
      </div>
    </Show>
  );
}

export function TeachingPopoverHeader(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TeachingPopover__header", props.class)}>{props.children}</div>;
}

export function TeachingPopoverTitle(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TeachingPopover__title", props.class)}>{props.children}</div>;
}

export function TeachingPopoverBody(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TeachingPopover__body", props.class)}>{props.children}</div>;
}

export function TeachingPopoverFooter(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TeachingPopover__footer", props.class)}>{props.children}</div>;
}

type TeachingCarouselContextValue = {
  index: () => number;
  total: () => number;
  setIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
};
const TeachingPopoverCarouselContext = createContext<TeachingCarouselContextValue>();
function useTeachingCarousel() {
  return useContext(TeachingPopoverCarouselContext);
}

export type TeachingPopoverCarouselProps = {
  items?: JSX.Element[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  class?: string;
  children?: JSX.Element;
};

export function TeachingPopoverCarousel(props: TeachingPopoverCarouselProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultActiveIndex ?? 0);
  const items = createMemo(() => props.items ?? []);
  const total = createMemo(() => items().length);
  const index = createMemo(() => {
    const max = Math.max(total() - 1, 0);
    return props.activeIndex ?? Math.min(uncontrolled(), max);
  });
  const setIndex = (next: number) => {
    const max = Math.max(total() - 1, 0);
    const clamped = Math.min(Math.max(next, 0), max);
    if (props.activeIndex === undefined) setUncontrolled(clamped);
    props.onActiveIndexChange?.(clamped);
  };
  const value: TeachingCarouselContextValue = {
    index,
    total,
    setIndex,
    next: () => setIndex(index() + 1),
    previous: () => setIndex(index() - 1),
  };
  return (
    <TeachingPopoverCarouselContext.Provider value={value}>
      <Carousel
        items={props.items}
        activeIndex={props.activeIndex ?? index()}
        onActiveIndexChange={setIndex}
        class={cx("sf-TeachingPopover__carousel", props.class)}
      >
        {props.children}
      </Carousel>
      {/* When `items` drives the slides, Carousel ignores children, so render
          them here to keep footers/nav/page-count inside the state context. */}
      <Show when={props.items}>{props.children}</Show>
    </TeachingPopoverCarouselContext.Provider>
  );
}

export function TeachingPopoverCarouselCard(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TeachingPopover__carouselCard", props.class)}>{props.children}</div>;
}

export function TeachingPopoverCarouselFooter(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TeachingPopover__carouselFooter", props.class)}>{props.children}</div>;
}

export type TeachingPopoverCarouselFooterButtonProps = {
  class?: string;
  children?: JSX.Element;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
  /** Which navigation direction this button performs. */
  navType?: "previous" | "next";
  /** Accessible label override for the navigation button. */
  altText?: string;
};

/**
 * Previous/next control rendered inside a TeachingPopoverCarouselFooter.
 * Extends Button and injects the direction icon and accessible label.
 */
export function TeachingPopoverCarouselFooterButton(props: TeachingPopoverCarouselFooterButtonProps) {
  const carousel = useTeachingCarousel();
  const isNext = () => props.navType !== "previous";
  const label = () => props.altText ?? (isNext() ? t("common.next") : t("common.previous"));
  const icon = () => (isNext() ? "\u203A" : "\u2039");
  const disabled = () => {
    if (props.disabled !== undefined) return props.disabled;
    if (!carousel) return false;
    return isNext()
      ? carousel.index() >= carousel.total() - 1
      : carousel.index() <= 0;
  };
  const handleClick = (event: MouseEvent) => {
    props.onClick?.(event);
    if (!carousel) return;
    if (isNext()) carousel.next();
    else carousel.previous();
  };
  return (
    <Button
      class={cx("sf-TeachingPopover__carouselFooterButton", props.class)}
      appearance="subtle"
      shape="circular"
      size="small"
      aria-label={label()}
      icon={icon()}
      disabled={disabled()}
      onClick={handleClick}
    >
      {props.children}
    </Button>
  );
}

export function TeachingPopoverCarouselNav(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-TeachingPopover__carouselNav", props.class)} role="tablist">{props.children}</div>;
}

export function TeachingPopoverCarouselNavButton(props: {
  active?: boolean;
  index?: number;
  label?: string;
  class?: string;
  onClick?: () => void;
}) {
  const carousel = useTeachingCarousel();
  const active = () =>
    props.active ?? (carousel && props.index !== undefined
      ? carousel.index() === props.index
      : false);
  const handleClick = () => {
    props.onClick?.();
    if (carousel && props.index !== undefined) carousel.setIndex(props.index);
  };
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active() ? true : undefined}
      aria-label={props.label ?? `Go to slide ${props.index !== undefined ? props.index + 1 : ""}`}
      class={cx(
        "sf-TeachingPopover__carouselNavButton",
        active() && "sf-TeachingPopover__carouselNavButton--active",
        props.class,
      )}
      onClick={handleClick}
    />
  );
}

export function TeachingPopoverCarouselPageCount(props: { class?: string; current?: number; total?: number }) {
  const carousel = useTeachingCarousel();
  const current = () => props.current ?? (carousel ? carousel.index() + 1 : 1);
  const total = () => props.total ?? carousel?.total() ?? 1;
  return (
    <span class={cx("sf-TeachingPopover__pageCount", props.class)} aria-live="polite">
      {current()} / {total()}
    </span>
  );
}
