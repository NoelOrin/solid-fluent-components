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
import { Portal } from "solid-js/web";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
} from "@floating-ui/dom";
import {
  cx,
  focusElement,
  getFocusableElements,
  isTypingKey,
  moveActiveIndex,
} from "../../utils/index";
import { useControllableOpen } from "../utilities/overlay/Overlay";

type MenuContextValue = {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerEl: () => HTMLElement | undefined;
  setTriggerEl: (el: HTMLElement | undefined) => void;
  positioning: () => MenuPopoverProps["positioning"];
};

const MenuContext = createContext<MenuContextValue>();

const MENU_ITEM_ROLES = new Set(["menuitem", "menuitemcheckbox", "menuitemradio"]);
function getMenuItems(container: HTMLElement): HTMLElement[] {
  const owner = container.closest(".sf-MenuSubmenu");
  return getFocusableElements(container).filter(
    (el) =>
      MENU_ITEM_ROLES.has(el.getAttribute("role") ?? "") &&
      el.closest(".sf-MenuSubmenu") === owner,
  );
}

export type MenuProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Root-level positioning, inherited by `<MenuPopover>` when it has no own value. */
  positioning?: MenuPopoverProps["positioning"];
  children?: JSX.Element;
};

export function Menu(props: MenuProps) {
  const [open, setOpen] = useControllableOpen(
    () => props.open,
    props.defaultOpen ?? false,
    props.onOpenChange,
  );
  const [triggerEl, setTriggerEl] = createSignal<HTMLElement>();

  const value: MenuContextValue = {
    open,
    setOpen,
    triggerEl,
    setTriggerEl,
    positioning: () => props.positioning,
  };

  return <MenuContext.Provider value={value}>{props.children}</MenuContext.Provider>;
}

function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("Menu components must be used within <Menu>");
  return ctx;
}

export type MenuTriggerProps = {
  children: JSX.Element;
};
export function MenuTrigger(props: MenuTriggerProps) {
  const menu = useMenu();
  return (
    <span
      ref={(el) => menu.setTriggerEl(el)}
      style={{ display: "inline-flex" }}
      onClick={(event) => {
        // Prefer enhanced child button; still toggle if click bubbles.
        event.stopPropagation();
        // A disabled trigger must never open the menu. Native `disabled`
        // suppresses the button's own handler, so check the DOM here too.
        const trigger = (event.target as HTMLElement).closest<HTMLElement>(
          "button, [role='button']",
        );
        if (
          trigger &&
          ((trigger as HTMLButtonElement).disabled ||
            trigger.getAttribute("aria-disabled") === "true")
        ) {
          return;
        }
        menu.setOpen(!menu.open());
      }}
    >
      <MenuTriggerChild open={menu.open()}>{props.children}</MenuTriggerChild>
    </span>
  );
}

function MenuTriggerChild(props: { open: boolean; children: JSX.Element }) {
  // Soft-enhance common button children with a11y attrs via DOM after mount.
  let wrap!: HTMLSpanElement;
  createEffect(() => {
    const button = wrap?.querySelector<HTMLElement>("button, [role='button']");
    if (!button) return;
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", props.open ? "true" : "false");
  });
  return (
    <span ref={wrap} style={{ display: "contents" }}>
      {props.children}
    </span>
  );
}

function toPlacement(
  positioning?: MenuPopoverProps["positioning"],
): Placement {
  const position = positioning?.position ?? "below";
  const align = positioning?.align ?? "start";
  const base =
    position === "above"
      ? "top"
      : position === "before"
        ? "left"
        : position === "after"
          ? "right"
          : "bottom";
  if (align === "center") return base;
  if (base === "left" || base === "right") {
    return `${base}-${align === "end" ? "end" : "start"}` as Placement;
  }
  return `${base}-${align}` as Placement;
}

export type MenuPopoverProps = {
  class?: string;
  children?: JSX.Element;
  positioning?: {
    position?: "below" | "above" | "before" | "after";
    align?: "start" | "center" | "end";
  };
};
export function MenuPopover(props: MenuPopoverProps) {
  const menu = useMenu();
  const [popoverEl, setPopoverEl] = createSignal<HTMLDivElement>();
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });

  createEffect(() => {
    if (!menu.open()) return;
    const trigger = menu.triggerEl();
    const popover = popoverEl();
    if (!trigger || !popover) return;

    let cancelled = false;
    const update = async () => {
      const result = await computePosition(trigger, popover, {
        placement: toPlacement(props.positioning ?? menu.positioning()),
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      });
      if (!cancelled) setCoords({ x: result.x, y: result.y });
    };
    void update();
    const stopAutoUpdate = autoUpdate(trigger, popover, () => void update());
    queueMicrotask(() => {
      const items = getMenuItems(popover);
      focusElement(items[0] ?? popover);
    });

    let typeahead = "";
    let typeaheadTimer: number | undefined;
    const clearTypeahead = () => {
      if (typeaheadTimer !== undefined) window.clearTimeout(typeaheadTimer);
      typeahead = "";
      typeaheadTimer = undefined;
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popover.contains(target) || trigger.contains(target)) return;
      menu.setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        menu.setOpen(false);
        menu
          .triggerEl()
          ?.querySelector<HTMLElement>("button, [tabindex]:not([tabindex='-1'])")
          ?.focus();
        return;
      }
      const items = getMenuItems(popover);
      if (!items.length) return;
      const current = items.findIndex((el) => el === document.activeElement);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = moveActiveIndex(current, 1, items.length);
        focusElement(items[next]);
        clearTypeahead();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = moveActiveIndex(current, -1, items.length);
        focusElement(items[next]);
        clearTypeahead();
      } else if (event.key === "Home") {
        event.preventDefault();
        focusElement(items[0]);
        clearTypeahead();
      } else if (event.key === "End") {
        event.preventDefault();
        focusElement(items[items.length - 1]);
        clearTypeahead();
      } else if (isTypingKey(event)) {
        typeahead += event.key.toLowerCase();
        if (typeaheadTimer !== undefined) window.clearTimeout(typeaheadTimer);
        typeaheadTimer = window.setTimeout(clearTypeahead, 500);
        const match = items.find((el) =>
          (el.textContent ?? "").trim().toLowerCase().startsWith(typeahead),
        );
        if (match) {
          event.preventDefault();
          focusElement(match);
        }
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      cancelled = true;
      clearTypeahead();
      stopAutoUpdate();
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <Show when={menu.open()}>
      <Portal>
        <div
          ref={setPopoverEl}
          class={cx("sf-MenuPopover", props.class)}
          style={{
            position: "absolute",
            left: `${coords().x}px`,
            top: `${coords().y}px`,
          }}
          role="menu"
        >
          {props.children}
        </div>
      </Portal>
    </Show>
  );
}

export type MenuListProps = { class?: string; children?: JSX.Element };
export function MenuList(props: MenuListProps) {
  return <div class={props.class} role="none">{props.children}</div>;
}

export type MenuItemProps = {
  class?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  icon?: JSX.Element;
  secondaryContent?: JSX.Element;
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";
  "aria-checked"?: boolean;
  children?: JSX.Element;
};
export function MenuItem(props: MenuItemProps) {
  const menu = useMenu();
  return (
    <button
      type="button"
      role={props.role ?? "menuitem"}
      aria-checked={props["aria-checked"]}
      class={cx("sf-MenuItem", props.class)}
      disabled={props.disabled}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) menu.setOpen(false);
      }}
    >
      {props.icon}
      <span style={{ flex: "1 1 auto" }}>{props.children}</span>
      {props.secondaryContent}
    </button>
  );
}

export function MenuDivider(props: { class?: string }) {
  return <hr class={cx("sf-MenuDivider", props.class)} />;
}

export function MenuGroup(props: { class?: string; children?: JSX.Element }) {
  return <div class={props.class}>{props.children}</div>;
}

export function MenuGroupHeader(props: { class?: string; children?: JSX.Element }) {
  return (
    <div
      class={props.class}
      style={{
        padding: "6px 8px",
        "font-size": "var(--sf-fontSizeBase200)",
        color: "var(--sf-colorNeutralForeground3)",
        "font-weight": "600",
      }}
    >
      {props.children}
    </div>
  );
}

export type MenuItemCheckboxProps = MenuItemProps & {
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};
export function MenuItemCheckbox(props: MenuItemCheckboxProps) {
  return (
    <MenuItem
      role="menuitemcheckbox"
      aria-checked={props.checked ?? false}
      class={props.class}
      disabled={props.disabled}
      onClick={(event) => {
        props.onChange?.(!props.checked);
        props.onClick?.(event);
      }}
      icon={<span aria-hidden="true">{props.checked ? "☑" : "☐"}</span>}
    >
      {props.children}
    </MenuItem>
  );
}

export type MenuItemRadioProps = MenuItemProps & {
  name?: string;
  checked?: boolean;
  onChange?: () => void;
};
export function MenuItemRadio(props: MenuItemRadioProps) {
  return (
    <MenuItem
      role="menuitemradio"
      aria-checked={props.checked ?? false}
      class={props.class}
      disabled={props.disabled}
      onClick={(event) => {
        props.onChange?.();
        props.onClick?.(event);
      }}
      icon={<span aria-hidden="true">{props.checked ? "●" : "○"}</span>}
    >
      {props.children}
    </MenuItem>
  );
}

export function MenuSplitGroup(props: { children?: JSX.Element; class?: string }) {
  return (
    <div class={props.class} style={{ display: "flex", gap: "4px" }}>
      {props.children}
    </div>
  );
}

export function useMenuOpen() {
  return createMemo(() => useMenu().open());
}

export type MenuItemLinkProps = {
  href?: string;
  class?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  children?: JSX.Element;
};
export function MenuItemLink(props: MenuItemLinkProps) {
  const menu = useMenu();
  return (
    <a
      href={props.disabled ? undefined : props.href}
      role="menuitem"
      class={cx("sf-MenuItem", "sf-MenuItem--link", props.disabled && "sf-MenuItem--disabled", props.class)}
      aria-disabled={props.disabled ? true : undefined}
      onClick={(event) => {
        if (props.disabled) {
          event.preventDefault();
          return;
        }
        menu.setOpen(false);
      }}
    >
      {props.icon}
      <span style={{ flex: "1 1 auto" }}>{props.children}</span>
    </a>
  );
}

export type MenuItemSwitchProps = {
  class?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  children?: JSX.Element;
};
export function MenuItemSwitch(props: MenuItemSwitchProps) {
  return (
    <label
      class={cx("sf-MenuItem", "sf-MenuItem--switch", props.disabled && "sf-MenuItem--disabled", props.class)}
      aria-disabled={props.disabled ? true : undefined}
    >
      <span style={{ flex: "1 1 auto" }}>{props.children}</span>
      {/* The input is natively focusable; give it a menu role so arrow navigation can reach it. */}
      <input
        type="checkbox"
        role="menuitemcheckbox"
        aria-checked={props.checked ?? false}
        checked={props.checked ?? false}
        disabled={props.disabled}
        onChange={(event) => props.onChange?.(event.currentTarget.checked)}
      />
    </label>
  );
}

export type MenuItemSubmenuProps = {
  class?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  /** Label shown on the parent menu item. */
  label: JSX.Element;
  /** Items rendered in the nested `role="menu"` surface. */
  children?: JSX.Element;
};

/**
 * A menu item that reveals a nested submenu. The parent item keeps the
 * `menuitem` role (and `aria-haspopup`/`aria-expanded`) so it remains part of
 * the parent menu's arrow-key navigation; nested items live in their own
 * `role="menu"` container and are navigated independently.
 */
export function MenuItemSubmenu(props: MenuItemSubmenuProps) {
  const [open, setOpen] = createSignal(false);
  let trigger!: HTMLButtonElement;
  let submenu!: HTMLDivElement;

  const focusFirst = () =>
    queueMicrotask(() => {
      const items = getMenuItems(submenu);
      focusElement(items[0] ?? submenu);
    });
  const openSubmenu = () => {
    if (props.disabled || open()) return;
    setOpen(true);
    focusFirst();
  };
  const closeSubmenu = (restoreFocus = false) => {
    if (!open()) return;
    setOpen(false);
    if (restoreFocus) focusElement(trigger);
  };

  return (
    <div class={cx("sf-MenuItemSubmenu", props.class)}>
      <button
        ref={trigger}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open()}
        class={cx(
          "sf-MenuItem",
          "sf-MenuItem--submenu",
          props.disabled && "sf-MenuItem--disabled",
        )}
        disabled={props.disabled}
        onClick={() => (open() ? closeSubmenu() : openSubmenu())}
        onMouseEnter={openSubmenu}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            event.stopPropagation();
            openSubmenu();
          } else if (event.key === "ArrowLeft" || event.key === "Escape") {
            if (!open()) return;
            event.preventDefault();
            event.stopPropagation();
            closeSubmenu(true);
          }
        }}
      >
        {props.icon}
        <span style={{ flex: "1 1 auto" }}>{props.label}</span>
        <span aria-hidden="true">›</span>
      </button>
      <Show when={open()}>
        <div
          ref={submenu}
          class="sf-MenuSubmenu"
          role="menu"
          onMouseLeave={() => closeSubmenu()}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
}
