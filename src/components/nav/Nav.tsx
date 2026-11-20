import { For, Show, createSignal, type JSX } from "solid-js";
import { createId, cx } from "../../utils/index";
import { Link } from "../link/Link";

export type NavItemValue = string | number;

export type NavItemData = {
  value: NavItemValue;
  content: JSX.Element;
  href?: string;
  icon?: JSX.Element;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: NavItemData[];
};

export type NavProps = {
  items?: NavItemData[];
  selectedValue?: NavItemValue;
  defaultSelectedValue?: NavItemValue;
  openItems?: NavItemValue[];
  defaultOpenItems?: NavItemValue[];
  density?: "small" | "medium";
  appearance?: "outline" | "subtle";
  class?: string;
  onNavItemSelect?: (value: NavItemValue) => void;
  children?: JSX.Element;
};

export function Nav(props: NavProps) {
  const [selected, setSelected] = createSignal<NavItemValue | undefined>(
    props.defaultSelectedValue,
  );
  const [openItems, setOpenItems] = createSignal<NavItemValue[]>(
    props.defaultOpenItems ?? [],
  );

  const selectedValue = () => props.selectedValue ?? selected();
  const open = () => props.openItems ?? openItems();

  const select = (item: NavItemData) => {
    if (item.disabled) return;
    if (props.selectedValue === undefined) setSelected(item.value);
    item.onClick?.();
    props.onNavItemSelect?.(item.value);
  };

  const toggleOpen = (item: NavItemData) => {
    if (item.disabled) return;
    const current = open();
    const next = current.includes(item.value)
      ? current.filter((value) => value !== item.value)
      : [...current, item.value];
    if (props.openItems === undefined) setOpenItems(next);
  };

  const renderItems = (items: NavItemData[], level = 0): JSX.Element => (
    <For each={items}>
      {(item) => {
        const hasChildren = () => Boolean(item.children?.length);
        const isOpen = () => open().includes(item.value);
        const isSelected = () => selectedValue() === item.value || Boolean(item.selected);
        const groupId = createId("sf-nav-group");
        return (
          <div class="sf-NavItem" data-value={String(item.value)} data-level={level}>
            <div
              class={cx(
                "sf-NavItem__layout",
                isSelected() && "sf-NavItem__layout--selected",
                item.disabled && "sf-NavItem__layout--disabled",
              )}
              style={{ "padding-inline-start": `${level * 12 + 10}px` }}
            >
              <Show when={hasChildren()}>
                <button
                  type="button"
                  class="sf-NavItem__expand"
                  aria-label={`Toggle ${String(item.value)}`}
                  aria-expanded={isOpen()}
                  aria-controls={groupId}
                  disabled={item.disabled}
                  onClick={() => toggleOpen(item)}
                >
                  {isOpen() ? "▾" : "▸"}
                </button>
              </Show>
              <Show
                when={item.href && !item.disabled}
                fallback={
                  <button
                    type="button"
                    class="sf-NavItem__content"
                    disabled={item.disabled}
                    aria-current={isSelected() ? "page" : undefined}
                    onClick={() => select(item)}
                  >
                    {item.icon}
                    <span>{item.content}</span>
                  </button>
                }
              >
                <Link
                  href={item.href}
                  class="sf-NavItem__content"
                  aria-current={isSelected() ? "page" : undefined}
                  onClick={() => select(item)}
                >
                  {item.icon}
                  <span>{item.content}</span>
                </Link>
              </Show>
            </div>
            <Show when={hasChildren() && isOpen()}>
              <div class="sf-NavItem__group" id={groupId} role="group">
                {renderItems(item.children ?? [], level + 1)}
              </div>
            </Show>
          </div>
        );
      }}
    </For>
  );

  return (
    <nav
      class={cx(
        "sf-Nav",
        `sf-Nav--${props.density ?? "medium"}`,
        `sf-Nav--${props.appearance ?? "subtle"}`,
        props.class,
      )}
    >
      <Show when={props.items} fallback={props.children}>
        {renderItems(props.items ?? [])}
      </Show>
    </nav>
  );
}

export type NavItemProps = {
  class?: string;
  children?: JSX.Element;
  value?: NavItemValue;
  href?: string;
  icon?: JSX.Element;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function NavItem(props: NavItemProps) {
  const content = (
    <>
      {props.icon}
      <span>{props.children}</span>
    </>
  );
  return (
    <div class={cx("sf-NavItem", props.class)} data-value={props.value !== undefined ? String(props.value) : undefined}>
      <Show
        when={props.href && !props.disabled}
        fallback={
          <button
            type="button"
            class="sf-NavItem__content"
            disabled={props.disabled}
            aria-current={props.selected ? "page" : undefined}
            onClick={() => !props.disabled && props.onClick?.()}
          >
            {content}
          </button>
        }
      >
        <Link
          href={props.href}
          class="sf-NavItem__content"
          aria-current={props.selected ? "page" : undefined}
          onClick={() => props.onClick?.()}
        >
          {content}
        </Link>
      </Show>
    </div>
  );
}

export function NavCategory(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavCategory", props.class)}>{props.children}</div>;
}

/** A labelled group of navigation items (v9 parity). */
export function NavSection(props: { class?: string; children?: JSX.Element }) {
  return (
    <div class={cx("sf-NavSection", props.class)} role="group">
      {props.children}
    </div>
  );
}

export function NavSectionHeader(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavSectionHeader", props.class)}>{props.children}</div>;
}

export function NavDivider(props: { class?: string }) {
  return <div class={cx("sf-NavDivider", props.class)} role="separator" />;
}

export type NavDensity = "small" | "medium";

export function NavCategoryItem(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavCategoryItem", props.class)}>{props.children}</div>;
}

export function NavSubItem(props: { class?: string; children?: JSX.Element }) {
  return (
    <div class={cx("sf-NavSubItem", props.class)} style={{ "padding-inline-start": "24px" }}>
      {props.children}
    </div>
  );
}

export function NavSubItemGroup(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavSubItemGroup", props.class)} role="group">{props.children}</div>;
}

export function SplitNavItem(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavSplitItem", props.class)} style={{ display: "flex", gap: "4px" }}>{props.children}</div>;
}

export function NavDrawer(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavDrawer", props.class)}>{props.children}</div>;
}

export function NavDrawerHeader(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavDrawer__header", props.class)}>{props.children}</div>;
}

export function NavDrawerBody(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavDrawer__body", props.class)}>{props.children}</div>;
}

export function NavDrawerFooter(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavDrawer__footer", props.class)}>{props.children}</div>;
}
