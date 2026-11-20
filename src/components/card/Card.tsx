import {
  createSignal,
  Show,
  splitProps,
  type JSX,
} from "solid-js";
import { callHandler, cx } from "../../utils/index";

export type CardAppearance = "filled" | "filled-alternative" | "outline" | "subtle";
export type CardSize = "small" | "medium" | "large";
export type CardFocusMode = "off" | "no-tab" | "tab-exit" | "tab-only";
export type CardSelectionEvent = MouseEvent | KeyboardEvent;
export type CardOnSelectData = { selected: boolean };

type CardClickEvent = MouseEvent & {
  currentTarget: HTMLDivElement;
  target: Element;
};
type CardKeyDownEvent = KeyboardEvent & {
  currentTarget: HTMLDivElement;
  target: Element;
};

export type CardProps = {
  appearance?: CardAppearance;
  size?: CardSize;
  orientation?: "horizontal" | "vertical";
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectionChange?: (event: CardSelectionEvent, data: CardOnSelectData) => void;
  disabled?: boolean;
  focusMode?: CardFocusMode;
  /** Action anchored to the top-right corner. */
  floatingAction?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>;
  onKeyDown?: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent>;
  "aria-label"?: string;
};

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, [
    "appearance",
    "size",
    "orientation",
    "selected",
    "defaultSelected",
    "onSelectionChange",
    "disabled",
    "focusMode",
    "floatingAction",
    "class",
    "style",
    "children",
    "onClick",
    "onKeyDown",
    "aria-label",
  ]);

  const [uncontrolledSelected, setUncontrolledSelected] = createSignal(
    local.defaultSelected ?? false,
  );

  const appearance = () => local.appearance ?? "filled";
  const selected = () => local.selected ?? uncontrolledSelected();
  const disabled = () => local.disabled ?? false;
  const focusMode = () => local.focusMode ?? "off";
  const selectable = () =>
    local.selected !== undefined ||
    local.defaultSelected !== undefined ||
    local.onSelectionChange !== undefined;

  const toggle = (event: CardSelectionEvent) => {
    if (!selectable() || disabled()) return;
    const next = !selected();
    if (local.selected === undefined) setUncontrolledSelected(next);
    local.onSelectionChange?.(event, { selected: next });
  };

  const handleClick = (event: CardClickEvent) => {
    callHandler(local.onClick as never, event as never);
    toggle(event);
  };

  const handleKeyDown = (event: CardKeyDownEvent) => {
    callHandler(local.onKeyDown as never, event as never);
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      toggle(event);
    }
  };

  return (
    <div
      {...rest}
      class={cx(
        "sf-Card",
        appearance() === "filled-alternative" && "sf-Card--filled-alt",
        appearance() === "outline" && "sf-Card--outline",
        appearance() === "subtle" && "sf-Card--subtle",
        selectable() && "sf-Card--selectable",
        selected() && "sf-Card--selected",
        disabled() && "sf-Card--disabled",
        focusMode() !== "off" && `sf-Card--focus-${focusMode()}`,
        local.class,
      )}
      style={local.style}
      data-size={local.size ?? "medium"}
      data-orientation={local.orientation ?? "vertical"}
      data-selected={selected() ? "true" : "false"}
      data-selectable={selectable() ? "true" : undefined}
      data-disabled={disabled() ? "true" : undefined}
      data-focus-mode={focusMode()}
      aria-label={local["aria-label"]}
      aria-disabled={disabled() ? true : undefined}
      tabIndex={
        selectable() || focusMode() !== "off"
          ? disabled()
            ? -1
            : 0
          : undefined
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Show when={local.floatingAction}>
        <div class="sf-Card__floatingAction">{local.floatingAction}</div>
      </Show>
      <Show when={selectable()}>
        <input
          type="checkbox"
          class="sf-Card__checkbox"
          checked={selected()}
          disabled={disabled()}
          tabIndex={-1}
          aria-hidden="true"
        />
      </Show>
      {local.children}
    </div>
  );
}

export type CardHeaderProps = {
  image?: JSX.Element;
  header?: JSX.Element;
  description?: JSX.Element;
  action?: JSX.Element;
  class?: string;
};

export function CardHeader(props: CardHeaderProps) {
  return (
    <div class={cx("sf-Card__header", props.class)}>
      {props.image}
      <div class="sf-Card__headerMain">
        {props.header}
        {props.description}
      </div>
      {props.action ? <div class="sf-Card__headerAction">{props.action}</div> : null}
    </div>
  );
}

export type CardPreviewProps = {
  class?: string;
  children?: JSX.Element;
  logo?: JSX.Element;
};

export function CardPreview(props: CardPreviewProps) {
  return (
    <div class={cx("sf-Card__preview", props.class)}>
      {props.children}
      {props.logo}
    </div>
  );
}

export type CardFooterProps = {
  class?: string;
  children?: JSX.Element;
  action?: JSX.Element;
};

export function CardFooter(props: CardFooterProps) {
  return (
    <div class={cx("sf-Card__footer", props.class)}>
      {props.children}
      {props.action}
    </div>
  );
}
