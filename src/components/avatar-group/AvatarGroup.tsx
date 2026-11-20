import { createSignal, For, Show, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";
import { Avatar, type AvatarProps, type AvatarSize } from "../avatar/Avatar";

export type AvatarGroupLayout = "spread" | "stack" | "pie";

export type AvatarGroupProps = {
  items?: AvatarProps[];
  maxInlineItems?: number;
  size?: AvatarSize;
  /** @default "spread" (Fluent v9 default) */
  layout?: AvatarGroupLayout;
  class?: string;
  children?: JSX.Element;
  /** Content rendered inside the popover opened by the `+N` overflow button. */
  overflowContent?: JSX.Element;
  "aria-label"?: string;
};

export function AvatarGroup(props: AvatarGroupProps) {
  const [local] = splitProps(props, [
    "items",
    "maxInlineItems",
    "size",
    "layout",
    "class",
    "children",
    "overflowContent",
    "aria-label",
  ]);

  const [open, setOpen] = createSignal(false);
  const max = () => local.maxInlineItems ?? 3;
  const items = () => local.items ?? [];
  const visible = () => items().slice(0, max());
  const overflow = () => Math.max(0, items().length - max());
  const layout = () => local.layout ?? "spread";
  const overflowLabel = () =>
    `${overflow()} more ${overflow() === 1 ? "person" : "people"}`;

  return (
    <div
      class={cx("sf-AvatarGroup", `sf-AvatarGroup--${layout()}`, local.class)}
      role="group"
      aria-label={local["aria-label"] ?? "Avatar group"}
      data-layout={layout()}
      data-overflow-count={overflow()}
    >
      <Show when={local.items} fallback={local.children}>
        <For each={visible()}>
          {(item) => <Avatar size={local.size ?? 32} {...item} />}
        </For>
        <Show when={overflow() > 0}>
          <button
            type="button"
            class={cx(
              "sf-Avatar",
              `sf-Avatar--${local.size ?? 32}`,
              "sf-AvatarGroup__overflow",
            )}
            aria-label={overflowLabel()}
            aria-haspopup="dialog"
            aria-expanded={open()}
            data-size={local.size ?? 32}
            onClick={() => setOpen(!open())}
          >
            +{overflow()}
          </button>
        </Show>
        <Show when={overflow() > 0 && local.overflowContent}>
          <AvatarGroupPopover open={open()}>
            {local.overflowContent}
          </AvatarGroupPopover>
        </Show>
      </Show>
    </div>
  );
}

export function AvatarGroupItem(props: AvatarProps) {
  return <Avatar {...props} />;
}

export type AvatarGroupPopoverProps = {
  children?: JSX.Element;
  class?: string;
  /** Controls visibility; defaults to `true` for backwards compatibility. */
  open?: boolean;
};

export function AvatarGroupPopover(props: AvatarGroupPopoverProps) {
  const isOpen = () => props.open ?? true;
  return (
    <Show when={isOpen()}>
      <div
        class={cx("sf-AvatarGroup__popover", props.class)}
        role="dialog"
        data-open={isOpen() ? "true" : "false"}
      >
        {props.children}
      </div>
    </Show>
  );
}

export type PartitionAvatarGroupItemsOptions = {
  items: AvatarProps[];
  maxInlineItems?: number;
};
export type PartitionAvatarGroupItems = {
  inlineItems: AvatarProps[];
  overflowItems: AvatarProps[];
};
export function partitionAvatarGroupItems(
  options: PartitionAvatarGroupItemsOptions,
): PartitionAvatarGroupItems {
  const max = options.maxInlineItems ?? options.items.length;
  if (options.items.length <= max) {
    return { inlineItems: options.items, overflowItems: [] };
  }
  return {
    inlineItems: options.items.slice(0, max),
    overflowItems: options.items.slice(max),
  };
}
