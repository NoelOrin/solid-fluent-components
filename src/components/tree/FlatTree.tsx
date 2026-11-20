import { type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type FlatTreeItemValue = string | number;

export type FlattenTreeItem<T extends { value: FlatTreeItemValue; children?: T[] }> = {
  item: T;
  depth: number;
  parentValue?: FlatTreeItemValue;
};

export type FlatTreeProps = {
  class?: string;
  children?: JSX.Element;
};

export function FlatTree(props: FlatTreeProps) {
  return (
    <div class={cx("sf-FlatTree", props.class)} role="tree">
      {props.children}
    </div>
  );
}

export type FlatTreeItemProps = {
  value: FlatTreeItemValue;
  class?: string;
  selected?: boolean;
  children?: JSX.Element;
  onClick?: () => void;
};

export function FlatTreeItem(props: FlatTreeItemProps) {
  return (
    <div
      class={cx("sf-FlatTreeItem", props.class)}
      role="treeitem"
      aria-selected={props.selected ? true : undefined}
      data-value={String(props.value)}
      onClick={() => props.onClick?.()}
    >
      {props.children}
    </div>
  );
}

export function HeadlessFlatTree(props: FlatTreeProps) {
  return (
    <div class={cx("sf-FlatTree", "sf-FlatTree--headless", props.class)}>
      {props.children}
    </div>
  );
}

/**
 * Headless variant: renders the visual item without `role="treeitem"` or
 * `aria-selected`, so the consumer can supply its own semantics.
 */
export function HeadlessFlatTreeItem(props: FlatTreeItemProps) {
  return (
    <div
      class={cx("sf-FlatTreeItem", props.class)}
      data-value={String(props.value)}
      onClick={() => props.onClick?.()}
    >
      {props.children}
    </div>
  );
}

export function FlattenTreeItem<T extends { value: FlatTreeItemValue; children?: T[] }>(
  items: T[],
  depth = 0,
  parentValue?: FlatTreeItemValue,
): Array<FlattenTreeItem<T>> {
  return items.flatMap((item) => [
    { item, depth, parentValue },
    ...(item.children ? FlattenTreeItem(item.children, depth + 1, item.value) : []),
  ]);
}
