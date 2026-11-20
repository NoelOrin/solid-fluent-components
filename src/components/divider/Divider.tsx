import { Show, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type DividerProps = {
  vertical?: boolean;
  inset?: boolean;
  alignContent?: "start" | "center" | "end";
  appearance?: "strong" | "brand" | "subtle" | "default";
  class?: string;
  children?: JSX.Element;
};

export function Divider(props: DividerProps) {
  const [local] = splitProps(props, [
    "vertical",
    "inset",
    "alignContent",
    "appearance",
    "class",
    "children",
  ]);

  return (
    <div
      role="separator"
      aria-orientation={local.vertical ? "vertical" : "horizontal"}
      class={cx(
        "sf-Divider",
        local.vertical && "sf-Divider--vertical",
        local.inset && "sf-Divider--inset",
        `sf-Divider--appearance-${local.appearance ?? "default"}`,
        `sf-Divider--align-${local.alignContent ?? "center"}`,
        local.class,
      )}
      data-align={local.alignContent ?? "center"}
      data-appearance={local.appearance ?? "default"}
      data-inset={local.inset ? "true" : "false"}
    >
      <Show when={local.children}>
        <span>{local.children}</span>
      </Show>
    </div>
  );
}
