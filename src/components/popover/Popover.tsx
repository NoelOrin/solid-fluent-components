import {
  Show,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
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

type PopoverContextValue = {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerEl: () => HTMLElement | undefined;
  setTriggerEl: (el: HTMLElement | undefined) => void;
  positioning: () => PopoverPositioning;
  surfaceId: string;
};

const PopoverContext = createContext<PopoverContextValue>();

export type PopoverPosition = "above" | "below" | "before" | "after";
/** Accepts the legacy string form as well as the `{ position, align }` object form. */
export type PopoverPositioning =
  | PopoverPosition
  | { position?: PopoverPosition; align?: "start" | "center" | "end" };

function toPlacement(value: PopoverPositioning): Placement {
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

export type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  positioning?: PopoverPositioning;
  children?: JSX.Element;
};

function createPopoverContext(props: PopoverProps): PopoverContextValue {
  const [open, setOpen] = useControllableOpen(
    () => props.open,
    props.defaultOpen ?? false,
    props.onOpenChange,
  );
  const [triggerEl, setTriggerEl] = createSignal<HTMLElement>();
  return {
    open,
    setOpen,
    triggerEl,
    setTriggerEl,
    positioning: () => props.positioning ?? "below",
    surfaceId: createId("sf-popover"),
  };
}

/** Standalone provider so trigger/surface can be used without a wrapping `<Popover>`. */
export function PopoverProvider(props: PopoverProps) {
  const value = createPopoverContext(props);
  return (
    <PopoverContext.Provider value={value}>{props.children}</PopoverContext.Provider>
  );
}

export function Popover(props: PopoverProps) {
  return <PopoverProvider {...props}>{props.children}</PopoverProvider>;
}

function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used within <Popover>");
  return ctx;
}

export type PopoverTriggerProps = {
  disableButtonEnhancement?: boolean;
  children: JSX.Element;
};

export function PopoverTrigger(props: PopoverTriggerProps) {
  const popover = usePopover();
  let wrap!: HTMLSpanElement;

  createEffect(() => {
    if (props.disableButtonEnhancement) return;
    const target =
      wrap?.querySelector<HTMLElement>(
        "button, a[href], input, select, textarea, [role='button'], [tabindex]",
      ) ?? wrap;
    if (!target) return;
    target.setAttribute("aria-haspopup", "dialog");
    target.setAttribute("aria-expanded", popover.open() ? "true" : "false");
  });

  return (
    <span
      ref={(el) => {
        wrap = el;
        popover.setTriggerEl(el);
      }}
      style={{ display: "inline-flex" }}
      onClick={() => popover.setOpen(!popover.open())}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          popover.setOpen(!popover.open());
        }
      }}
    >
      {props.children}
    </span>
  );
}

export type PopoverSurfaceProps = {
  class?: string;
  children?: JSX.Element;
  tabIndex?: number;
  size?: "small" | "medium" | "large" | "full";
  withArrow?: boolean;
  "aria-label"?: string;
};

export function PopoverSurface(props: PopoverSurfaceProps) {
  const popover = usePopover();
  const [surfaceEl, setSurfaceEl] = createSignal<HTMLDivElement>();
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });

  createEffect(() => {
    if (!popover.open()) return;
    const trigger = popover.triggerEl();
    const surface = surfaceEl();
    if (!trigger || !surface) return;

    let cancelled = false;
    const update = async () => {
      const result = await computePosition(trigger, surface, {
        placement: toPlacement(popover.positioning()),
        middleware: [offset(8), flip(), shift({ padding: 8 })],
      });
      if (!cancelled) setCoords({ x: result.x, y: result.y });
    };
    void update();
    const stopAutoUpdate = autoUpdate(trigger, surface, () => void update());

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (surface.contains(target) || trigger.contains(target)) return;
      popover.setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") popover.setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      cancelled = true;
      stopAutoUpdate();
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <Show when={popover.open()}>
      <Portal>
        <div
          ref={setSurfaceEl}
          id={popover.surfaceId}
          class={cx(
            "sf-Popover",
            "sf-PopoverSurface",
            props.size && `sf-PopoverSurface--size-${props.size}`,
            props.class,
          )}
          style={{
            position: "absolute",
            left: `${coords().x}px`,
            top: `${coords().y}px`,
          }}
          tabindex={props.tabIndex ?? 0}
          role="dialog"
          aria-label={props["aria-label"]}
        >
          <Show when={props.withArrow}>
            <div
              class="sf-PopoverSurface__arrow"
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                background: "inherit",
                transform: "rotate(45deg)",
              }}
            />
          </Show>
          {props.children}
        </div>
      </Portal>
    </Show>
  );
}
