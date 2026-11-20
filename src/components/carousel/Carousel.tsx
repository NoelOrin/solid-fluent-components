import { t } from "../../i18n";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  type JSX,
} from "solid-js";
import { cx } from "../../utils/index";
import { Button } from "../button/Button";

export type CarouselAlign = "start" | "center" | "end";

export type CarouselProps = {
  items?: JSX.Element[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** 每页显示的卡片数量，默认 1 */
  groupSize?: number;
  /** 首尾循环，默认 true */
  circular?: boolean;
  align?: CarouselAlign;
  /** 设为 false 关闭自动播放，默认开启 */
  autoplay?: boolean;
  autoplayInterval?: number;
  class?: string;
  children?: JSX.Element;
};

export function Carousel(props: CarouselProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultActiveIndex ?? 0);
  const items = createMemo(() => props.items ?? []);
  const index = createMemo(() => {
    const max = Math.max(items().length - 1, 0);
    const raw = props.activeIndex ?? uncontrolled();
    return Math.min(Math.max(raw, 0), max);
  });
  const groupSize = createMemo(() => Math.max(1, Math.floor(props.groupSize ?? 1) || 1));

  const setIndex = (next: number) => {
    const count = items().length;
    if (count === 0) return;
    const max = count - 1;
    let value = next;
    if (props.circular !== false) {
      if (value < 0) value = max;
      else if (value > max) value = 0;
    } else {
      value = Math.min(Math.max(value, 0), max);
    }
    if (props.activeIndex === undefined) setUncontrolled(value);
    props.onActiveIndexChange?.(value);
  };

  const slideId = (i: number) => `sf-carousel-slide-${i}`;

  return (
    <div class={cx("sf-Carousel", props.class)} data-align={props.align ?? "start"}>
      <CarouselViewport onSwipe={(direction) => setIndex(index() + (direction === "next" ? 1 : -1))}>
        <Show when={props.items} fallback={props.children}>
          <CarouselSlider index={index()} groupSize={groupSize()} align={props.align}>
            <For each={items()}>
              {(item, i) => <CarouselCard id={slideId(i())}>{item}</CarouselCard>}
            </For>
          </CarouselSlider>
        </Show>
      </CarouselViewport>
      <CarouselAutoplayButton
        index={index}
        setIndex={setIndex}
        paused={props.autoplay === false || items().length <= 1}
        interval={props.autoplayInterval}
      >
        <CarouselButton direction="prev" onClick={() => setIndex(index() - 1)} />
        <CarouselNav>
          <For each={items()}>
            {(_, i) => (
              <CarouselNavButton
                active={i() === index()}
                index={i()}
                controls={slideId(i())}
                onClick={() => setIndex(i())}
              />
            )}
          </For>
        </CarouselNav>
        <CarouselButton direction="next" onClick={() => setIndex(index() + 1)} />
      </CarouselAutoplayButton>
    </div>
  );
}

export type CarouselViewportProps = {
  class?: string;
  children?: JSX.Element;
  onSwipe?: (direction: "prev" | "next") => void;
};
export function CarouselViewport(props: CarouselViewportProps) {
  let startX: number | undefined;
  const onPointerDown = (event: PointerEvent) => {
    startX = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (startX === undefined) return;
    const delta = event.clientX - startX;
    startX = undefined;
    if (Math.abs(delta) >= 30) props.onSwipe?.(delta < 0 ? "next" : "prev");
  };
  return (
    <div
      class={cx("sf-Carousel__viewport", props.class)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (startX = undefined)}
    >
      {props.children}
    </div>
  );
}

export type CarouselSliderProps = {
  class?: string;
  children?: JSX.Element;
  index?: number;
  groupSize?: number;
  align?: CarouselAlign;
};
export function CarouselSlider(props: CarouselSliderProps) {
  const group = createMemo(() => Math.max(1, Math.floor(props.groupSize ?? 1) || 1));
  const transform = createMemo(
    () => `translateX(-${((props.index ?? 0) / group()) * 100}%)`,
  );
  return (
    <div
      class={cx("sf-Carousel__track", props.class)}
      data-align={props.align ?? "start"}
      style={{
        transform: transform(),
        "padding-left": props.align === "center" ? "20%" : props.align === "end" ? "40%" : undefined,
        "--sf-carousel-group-size": String(group()),
      }}
    >
      {props.children}
    </div>
  );
}

export type CarouselCardProps = {
  id?: string;
  class?: string;
  children?: JSX.Element;
};
export function CarouselCard(props: CarouselCardProps) {
  return (
    <div id={props.id} class={cx("sf-Carousel__slide", props.class)}>
      {props.children}
    </div>
  );
}

export type CarouselButtonProps = {
  direction: "prev" | "next";
  class?: string;
  onClick?: () => void;
};
export function CarouselButton(props: CarouselButtonProps) {
  return (
    <Button
      appearance="secondary"
      size="small"
      class={cx("sf-Carousel__button", props.class)}
      aria-label={props.direction === "prev" ? t("common.previous") : t("common.next")}
      onClick={props.onClick}
    >
      {props.direction === "prev" ? "上一张" : "下一张"}
    </Button>
  );
}

export function CarouselNav(props: { class?: string; children?: JSX.Element }) {
  return <CarouselNavContainer class={props.class}>{props.children}</CarouselNavContainer>;
}

export function CarouselNavContainer(props: { class?: string; children?: JSX.Element }) {
  const onKeyDown = (event: KeyboardEvent) => {
    const tabs = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]'),
    );
    if (!tabs.length) return;
    let next = tabs.findIndex((tab) => tab === document.activeElement);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (next + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (next - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next]!.focus();
    tabs[next]!.click();
  };
  return (
    <div
      class={cx("sf-Carousel__dots", props.class)}
      role="tablist"
      aria-label="Carousel navigation"
      onKeyDown={onKeyDown}
    >
      {props.children}
    </div>
  );
}

export type CarouselNavButtonProps = {
  active?: boolean;
  index?: number;
  class?: string;
  onClick?: () => void;
  image?: JSX.Element;
  imageSrc?: string;
  label?: string;
  /** 关联幻灯片 id，供 aria-controls 使用 */
  controls?: string;
};
export function CarouselNavButton(props: CarouselNavButtonProps) {
  const isActive = () => props.active ?? props.index === 0;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive() ? true : undefined}
      aria-controls={props.controls}
      tabindex={isActive() ? 0 : -1}
      aria-label={props.label ?? `Go to slide ${props.index !== undefined ? props.index + 1 : ""}`}
      class={cx(
        "sf-Carousel__dot",
        isActive() && "sf-Carousel__dot--active",
        props.imageSrc && "sf-Carousel__dot--image",
        props.class,
      )}
      onClick={props.onClick}
    >
      <Show when={props.imageSrc}>
        <img class="sf-Carousel__dotImage" src={props.imageSrc} alt={props.label ?? ""} />
      </Show>
    </button>
  );
}

export function CarouselNavImageButton(props: CarouselNavButtonProps) {
  return <CarouselNavButton {...props} imageSrc={props.imageSrc} />;
}

export type CarouselAutoplayButtonProps = {
  index?: () => number;
  setIndex?: (index: number) => void;
  class?: string;
  children?: JSX.Element;
  paused?: boolean | (() => boolean);
  interval?: number;
  /** 渲染一个独立的播放/暂停切换按钮（独立使用时） */
  toggleable?: boolean;
  toggleLabel?: JSX.Element;
};
export function CarouselAutoplayButton(props: CarouselAutoplayButtonProps) {
  let timer: number | undefined;
  const [internalPaused, setInternalPaused] = createSignal(false);
  const isPaused = () => {
    const value = props.paused;
    if (typeof value === "function") return value();
    if (value !== undefined) return value;
    return internalPaused();
  };
  const stop = () => {
    if (timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
  const start = () => {
    stop();
    if (!props.setIndex || !props.index || isPaused()) return;
    const delay = Math.max(100, props.interval ?? 5000);
    timer = window.setInterval(() => {
      props.setIndex!(props.index!() + 1);
    }, delay);
  };
  createEffect(() => {
    // 旧的 interval 总是先清理，paused 变化时重新计时
    const paused = isPaused();
    stop();
    if (!paused) start();
  });
  onCleanup(stop);

  return (
    <div
      class={cx("sf-Carousel__controls", props.class)}
      onMouseEnter={stop}
      onMouseLeave={() => {
        if (!isPaused()) start();
      }}
    >
      <Show when={props.toggleable}>
        <button
          type="button"
          class="sf-Carousel__autoplayToggle"
          aria-label={isPaused() ? "Play" : "Pause"}
          onClick={() => setInternalPaused(!internalPaused())}
        >
          {props.toggleLabel ?? (isPaused() ? "▶" : "⏸")}
        </button>
      </Show>
      {props.children}
    </div>
  );
}
