import { For, Show, createMemo, type JSX } from "solid-js";
import { cx } from "../../utils/index";
import { Link } from "../link/Link";

export type BreadcrumbItemData = {
  key?: string;
  href?: string;
  current?: boolean;
  children: JSX.Element;
  onClick?: () => void;
};

export type BreadcrumbProps = {
  items?: BreadcrumbItemData[];
  class?: string;
  children?: JSX.Element;
  divider?: JSX.Element;
};

export function Breadcrumb(props: BreadcrumbProps) {
  // key by the `key` field so <For> preserves row identity across reordering
  const items = createMemo(
    (previous: Array<BreadcrumbItemData & { key: string }> = []) => {
      const cache = new Map(previous.map((item) => [item.key, item]));
      return (props.items ?? []).map((item, index) => {
        const key = item.key ?? String(index);
        const cached = cache.get(key);
        if (
          cached &&
          cached.children === item.children &&
          cached.href === item.href &&
          cached.current === item.current &&
          cached.onClick === item.onClick
        ) {
          return cached;
        }
        return { ...item, key };
      });
    },
    [],
  );

  return (
    <nav aria-label="Breadcrumb" class={props.class}>
      <ol class="sf-Breadcrumb">
        <Show when={props.items} fallback={props.children}>
          <For each={items()}>
            {(item, index) => (
              <>
                <li
                  class="sf-Breadcrumb__item"
                  data-key={item.key}
                  data-current={item.current ? "true" : undefined}
                  aria-current={item.current ? "page" : undefined}
                >
                  <Show
                    when={!item.current && (item.href || item.onClick)}
                    fallback={<span>{item.children}</span>}
                  >
                    <Link href={item.href} onClick={item.onClick}>
                      {item.children}
                    </Link>
                  </Show>
                </li>
                <Show when={index() < items().length - 1}>
                  <li class="sf-Breadcrumb__separator" role="presentation" aria-hidden="true">
                    {props.divider ?? "/"}
                  </li>
                </Show>
              </>
            )}
          </For>
        </Show>
      </ol>
    </nav>
  );
}

export function BreadcrumbItem(props: {
  current?: boolean;
  class?: string;
  children?: JSX.Element;
}) {
  return (
    <li
      class={cx("sf-Breadcrumb__item", props.class)}
      data-current={props.current ? "true" : undefined}
      aria-current={props.current ? "page" : undefined}
    >
      {props.children}
    </li>
  );
}

export function BreadcrumbDivider(props: { class?: string; children?: JSX.Element }) {
  return (
    <li class={cx("sf-Breadcrumb__separator", props.class)} role="presentation" aria-hidden="true">
      {props.children ?? "/"}
    </li>
  );
}

export function BreadcrumbButton(props: {
  current?: boolean;
  href?: string;
  class?: string;
  children?: JSX.Element;
  onClick?: () => void;
}) {
  if (props.current) {
    return (
      <span class={props.class} aria-current="page">
        {props.children}
      </span>
    );
  }
  return (
    <Link href={props.href} class={props.class} onClick={props.onClick}>
      {props.children}
    </Link>
  );
}

export type PartitionBreadcrumbItemsOptions = {
  items: BreadcrumbItemData[];
  maxDisplayedItems?: number;
  overflowIndex?: number;
};
export type PartitionBreadcrumbItems = {
  inlineItems: BreadcrumbItemData[];
  overflowItems: BreadcrumbItemData[];
  endDisplayedItems: BreadcrumbItemData[];
};
export function partitionBreadcrumbItems(options: PartitionBreadcrumbItemsOptions): PartitionBreadcrumbItems {
  const { items } = options;
  const maxDisplayedItems = options.maxDisplayedItems ?? items.length;
  const overflowIndex = options.overflowIndex ?? 1;
  if (items.length <= maxDisplayedItems) {
    return { inlineItems: items, overflowItems: [], endDisplayedItems: [] };
  }
  const start = items.slice(0, overflowIndex);
  const end = items.slice(items.length - (maxDisplayedItems - overflowIndex));
  const overflow = items.slice(overflowIndex, items.length - (maxDisplayedItems - overflowIndex));
  return { inlineItems: start, overflowItems: overflow, endDisplayedItems: end };
}
