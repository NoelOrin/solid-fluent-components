import {
  Show,
  createEffect,
  createSignal,
  onCleanup,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
} from "@floating-ui/dom";
import { createId, cx } from "../../utils/index";
import { useControllableOpen } from "../utilities/overlay/Overlay";

export type TooltipPosition = "above" | "below" | "before" | "after";
export type TooltipAlign = "start" | "center" | "end";
/** Accepts the legacy string form as well as the `{ position, align }` object form. */
export type TooltipPositioning =
  | TooltipPosition
  | { position?: TooltipPosition; align?: TooltipAlign };

function toPlacement(positioning?: TooltipPositioning): Placement {
  const config =
    typeof positioning === "string"
      ? { position: positioning }
      : positioning ?? {};
  const position = config.position ?? "above";
  const align = config.align ?? "center";
  const base: Placement =
    position === "below"
      ? "bottom"
      : position === "before"
        ? "left"
        : position === "after"
          ? "right"
          : "top";
  if (align === "center") return base;
  if (base === "left" || base === "right") {
    return `${base}-${align === "end" ? "end" : "start"}` as Placement;
  }
  return `${base}-${align}` as Placement;
}

export type TooltipProps = {
  content: JSX.Element;
  relationship?: "label" | "description" | "inaccessible";
  withArrow?: boolean;
  positioning?: TooltipPositioning;
  visible?: boolean;
  /** Delay in milliseconds before the tooltip becomes visible on hover/focus. */
  delay?: number;
  onVisibleChange?: (visible: boolean) => void;
  children: JSX.Element;
  class?: string;
};

export function Tooltip(props: TooltipProps) {
  const tipId = createId("sf-tooltip");
  let triggerWrap!: HTMLSpanElement;
  const [open, setOpen] = createSignal(false);
  const [tipEl, setTipEl] = createSignal<HTMLDivElement>();
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });
  const visible = () => props.visible ?? open();

  const setVisible = (next: boolean) => {
    if (visible() === next) return;
    if (props.visible === undefined) setOpen(next);
    props.onVisibleChange?.(next);
  };

  let timer: number | undefined;
  const show = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    const delay = props.delay ?? 0;
    if (delay <= 0) {
      setVisible(true);
      return;
    }
    timer = window.setTimeout(() => {
      timer = undefined;
      setVisible(true);
    }, delay);
  };
  const hide = () => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
    setVisible(false);
  };
  onCleanup(() => {
    if (timer !== undefined) window.clearTimeout(timer);
  });

  // Wire the trigger to the tooltip for assistive technology.
  createEffect(() => {
    const target =
      triggerWrap?.querySelector<HTMLElement>(
        "button, a[href], input, select, textarea, [role='button'], [tabindex]",
      ) ?? triggerWrap;
    if (!target) return;
    const relationship = props.relationship ?? "description";
    if (relationship === "label") {
      target.setAttribute("aria-labelledby", tipId);
      target.removeAttribute("aria-describedby");
    } else if (relationship === "description") {
      target.setAttribute("aria-describedby", tipId);
      target.removeAttribute("aria-labelledby");
    } else {
      target.removeAttribute("aria-labelledby");
      target.removeAttribute("aria-describedby");
    }
  });

  createEffect(() => {
    if (!visible()) return;
    const tip = tipEl();
    if (!tip || !triggerWrap) return;
    let cancelled = false;
    const update = async () => {
      const result = await computePosition(triggerWrap, tip, {
        placement: toPlacement(props.positioning),
        middleware: [offset(6), flip(), shift({ padding: 8 })],
      });
      if (!cancelled) setCoords({ x: result.x, y: result.y });
    };
    void update();
    const stopAutoUpdate = autoUpdate(triggerWrap, tip, () => void update());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      hide();
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      cancelled = true;
      stopAutoUpdate();
      window.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <>
      <span
        ref={triggerWrap}
        style={{ display: "inline-flex" }}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocusIn={show}
        onFocusOut={hide}
      >
        {props.children}
      </span>
      <Show when={visible()}>
        <Portal>
          <div
            ref={setTipEl}
            id={tipId}
            role="tooltip"
            class={cx("sf-Tooltip", props.class)}
            style={{
              position: "absolute",
              left: `${coords().x}px`,
              top: `${coords().y}px`,
            }}
          >
            {props.content}
            <Show when={props.withArrow}>
              <span
                class="sf-Tooltip__arrow"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "8px",
                  background: "inherit",
                  transform: "rotate(45deg)",
                }}
              />
            </Show>
          </div>
        </Portal>
      </Show>
    </>
  );
}

export type SimplePopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  content: JSX.Element;
  children: JSX.Element;
  class?: string;
};

export function SimplePopover(props: SimplePopoverProps) {
  const [open, setOpen] = useControllableOpen(
    () => props.open,
    props.defaultOpen ?? false,
    props.onOpenChange,
  );
  let triggerWrap!: HTMLSpanElement;
  let panelEl!: HTMLDivElement;
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });

  createEffect(() => {
    if (!open()) return;
    const update = async () => {
      if (!triggerWrap || !panelEl) return;
      const result = await computePosition(triggerWrap, panelEl, {
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({ padding: 8 })],
      });
      setCoords({ x: result.x, y: result.y });
    };
    void update();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelEl.contains(target) || triggerWrap.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", update);
    onCleanup(() => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", update);
    });
  });

  return (
    <>
      <span
        ref={triggerWrap}
        style={{ display: "inline-flex" }}
        onClick={() => setOpen(!open())}
      >
        {props.children}
      </span>
      <Show when={open()}>
        <Portal>
          <div
            ref={panelEl}
            class={cx("sf-Popover", props.class)}
            style={{
              position: "absolute",
              left: `${coords().x}px`,
              top: `${coords().y}px`,
            }}
          >
            {props.content}
          </div>
        </Portal>
      </Show>
    </>
  );
}
