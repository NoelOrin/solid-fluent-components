import {
  createEffect,
  createSignal,
  onMount,
  type JSX,
} from "solid-js";
import { cx } from "../../utils/index";
import { Button, type ButtonProps } from "../button/Button";

export type ToolbarProps = {
  size?: "small" | "medium" | "large";
  vertical?: boolean;
  class?: string;
  children?: JSX.Element;
};

export function Toolbar(props: ToolbarProps) {
  let rootEl!: HTMLDivElement;

  // only plain toolbar controls participate in roving focus; a radiogroup owns
  // its own arrow-key handling and counts as one tab stop
  const getControls = () =>
    Array.from(
      rootEl?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? [],
    ).filter(
      (el) =>
        el.getAttribute("role") !== "radio" &&
        !el.closest('[role="radiogroup"]') &&
        el.getAttribute("aria-disabled") !== "true",
    );

  onMount(() => {
    queueMicrotask(() => {
      getControls().forEach((el, index) => {
        el.tabIndex = index === 0 ? 0 : -1;
      });
      rootEl?.querySelectorAll<HTMLElement>('button[aria-disabled="true"]').forEach((el) => {
        el.tabIndex = -1;
      });
    });
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const nextKey = props.vertical ? "ArrowDown" : "ArrowRight";
    const prevKey = props.vertical ? "ArrowUp" : "ArrowLeft";
    if (
      event.key !== nextKey &&
      event.key !== prevKey &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    const controls = getControls();
    if (controls.length === 0) return;
    const current = controls.indexOf(document.activeElement as HTMLElement);
    let target: HTMLElement | undefined;
    if (event.key === "Home") target = controls[0];
    else if (event.key === "End") target = controls[controls.length - 1];
    else if (event.key === nextKey) target = controls[(Math.max(current, 0) + 1) % controls.length];
    else target = controls[(Math.max(current, 0) - 1 + controls.length) % controls.length];
    event.preventDefault();
    controls.forEach((el) => {
      el.tabIndex = el === target ? 0 : -1;
    });
    target?.focus();
  };

  return (
    <div
      ref={rootEl}
      role="toolbar"
      aria-orientation={props.vertical ? "vertical" : "horizontal"}
      class={cx("sf-Toolbar", props.class)}
      style={{ "flex-direction": props.vertical ? "column" : "row" }}
      data-size={props.size ?? "medium"}
      onKeyDown={handleKeyDown}
    >
      {props.children}
    </div>
  );
}

export type ToolbarButtonProps = ButtonProps;
export function ToolbarButton(props: ToolbarButtonProps) {
  return (
    <Button {...props} appearance={props.appearance ?? "subtle"} size={props.size ?? "medium"} />
  );
}

export function ToolbarDivider(props: { class?: string; vertical?: boolean }) {
  return (
    <div
      class={cx("sf-Toolbar__divider", props.class)}
      role="separator"
      aria-orientation={props.vertical ? "vertical" : "horizontal"}
      data-vertical={props.vertical ? "true" : undefined}
    />
  );
}

export function ToolbarGroup(props: { class?: string; children?: JSX.Element }) {
  return (
    <div class={props.class} style={{ display: "inline-flex", gap: "4px", "align-items": "center" }}>
      {props.children}
    </div>
  );
}

export type ToolbarRadioGroupProps = {
  class?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  children?: JSX.Element;
};

export function ToolbarRadioGroup(props: ToolbarRadioGroupProps) {
  const [selected, setSelected] = createSignal<string | number | undefined>(props.defaultValue);
  const value = () => props.value ?? selected();
  let groupEl!: HTMLDivElement;

  const radioItems = () =>
    Array.from(groupEl?.querySelectorAll<HTMLElement>("[data-toolbar-radio]") ?? []);
  const isDisabled = (el: HTMLElement) =>
    el.getAttribute("aria-disabled") === "true" || el.hasAttribute("disabled");

  const syncItems = () => {
    const items = radioItems();
    const current = value();
    let checkedFound = false;
    for (const el of items) {
      const checked = current !== undefined && String(current) === el.dataset.toolbarRadio;
      if (!isDisabled(el)) {
        el.setAttribute("role", "radio");
        const isChecked = checked && !checkedFound;
        if (isChecked) checkedFound = true;
        el.setAttribute("aria-checked", isChecked ? "true" : "false");
        el.tabIndex = isChecked ? 0 : -1;
      } else {
        el.setAttribute("role", "radio");
        el.setAttribute("aria-checked", "false");
        el.setAttribute("aria-disabled", "true");
        el.tabIndex = -1;
      }
    }
    // ensure there is a single tab stop even with no controlled value
    if (!checkedFound) {
      const first = items.find((el) => !isDisabled(el));
      if (first) first.tabIndex = 0;
    }
  };

  const select = (el: HTMLElement) => {
    if (isDisabled(el)) return;
    const next = el.dataset.toolbarRadio!;
    if (props.value === undefined) setSelected(next);
    props.onChange?.(next);
  };

  onMount(() => {
    queueMicrotask(syncItems);
  });

  // reapply ARIA state whenever the controlled/uncontrolled value changes
  createEffect(() => {
    value();
    queueMicrotask(syncItems);
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-toolbar-radio]");
    if (!target || isDisabled(target)) return;
    const items = radioItems().filter((el) => !isDisabled(el));
    const index = items.indexOf(target);
    let next: HTMLElement | undefined;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = items[(Math.max(index, 0) + 1) % items.length];
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = items[(Math.max(index, 0) - 1 + items.length) % items.length];
        break;
      case "Home":
        next = items[0];
        break;
      case "End":
        next = items[items.length - 1];
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        event.stopPropagation();
        select(target);
        return;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    next?.focus();
    if (next) select(next);
  };

  return (
    <div
      ref={groupEl}
      class={cx("sf-ToolbarRadioGroup", props.class)}
      role="radiogroup"
      data-value={String(value())}
      onClick={(event) => {
        const radio = (event.target as HTMLElement).closest<HTMLElement>("[data-toolbar-radio]");
        if (radio) select(radio);
      }}
      onKeyDown={handleKeyDown}
    >
      {props.children}
    </div>
  );
}

/** A radio control to be placed inside a ToolbarRadioGroup. */
export function ToolbarRadio(props: {
  value: string | number;
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
}) {
  return (
    <span
      class={cx("sf-ToolbarRadio", props.class)}
      data-toolbar-radio={String(props.value)}
      role="radio"
      aria-checked="false"
      aria-disabled={props.disabled ? true : undefined}
      tabIndex={-1}
    >
      {props.children}
    </span>
  );
}
