import { Show, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";
import { Button } from "../button/Button";

export type MessageBarIntent = "info" | "success" | "warning" | "error";
export type MessageBarLayout = "text" | "multiline";

export type MessageBarProps = {
  intent?: MessageBarIntent;
  /** `text` (default) keeps the bar on one line, `multiline` wraps long content. */
  layout?: MessageBarLayout;
  icon?: JSX.Element;
  class?: string;
  children?: JSX.Element;
};

export function MessageBar(props: MessageBarProps) {
  const [local] = splitProps(props, ["intent", "layout", "icon", "class", "children"]);
  const intent = () => local.intent ?? "info";
  const layout = () => local.layout ?? "text";
  const isAlert = () => intent() === "warning" || intent() === "error";

  return (
    <div
      role={isAlert() ? "alert" : "status"}
      class={cx(
        "sf-MessageBar",
        `sf-MessageBar--${intent()}`,
        `sf-MessageBar--${layout()}`,
        local.class,
      )}
    >
      <Show when={local.icon}>
        <span aria-hidden="true">{local.icon}</span>
      </Show>
      {local.children}
    </div>
  );
}

export type MessageBarBodyProps = {
  class?: string;
  children?: JSX.Element;
};
export function MessageBarBody(props: MessageBarBodyProps) {
  return <div class={cx("sf-MessageBar__body", props.class)}>{props.children}</div>;
}

export type MessageBarTitleProps = {
  class?: string;
  children?: JSX.Element;
};
export function MessageBarTitle(props: MessageBarTitleProps) {
  return (
    <div class={cx("sf-MessageBar__title", props.class)} style={{ "font-weight": "600", "margin-bottom": "2px" }}>
      {props.children}
    </div>
  );
}

export type MessageBarActionsProps = {
  class?: string;
  children?: JSX.Element;
  containerAction?: JSX.Element;
};
export function MessageBarActions(props: MessageBarActionsProps) {
  return (
    <div class={cx("sf-MessageBar__actions", props.class)}>
      {props.children}
      {props.containerAction}
    </div>
  );
}

export type MessageBarGroupProps = {
  class?: string;
  children?: JSX.Element;
};
export function MessageBarGroup(props: MessageBarGroupProps) {
  return (
    <div class={cx("sf-MessageBarGroup", props.class)} style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
      {props.children}
    </div>
  );
}

export function MessageBarDismissButton(props: { onClick?: () => void; class?: string }) {
  return (
    <Button
      appearance="transparent"
      size="small"
      class={props.class}
      onClick={props.onClick}
      aria-label="Dismiss"
    >
      ×
    </Button>
  );
}
