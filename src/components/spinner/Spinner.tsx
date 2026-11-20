import { t } from "../../i18n";
import {
  createSignal,
  onCleanup,
  onMount,
  Show,
  splitProps,
  type JSX,
} from "solid-js";
import { createId, cx } from "../../utils/index";

export type SpinnerSize =
  | "extra-tiny"
  | "tiny"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large"
  | "huge";

export type SpinnerProps = {
  size?: SpinnerSize;
  label?: JSX.Element;
  labelPosition?: "before" | "after" | "above" | "below";
  appearance?: "primary" | "inverted";
  /** Milliseconds to wait before the spinner is visible. @default 0 */
  delay?: number;
  class?: string;
};

export function Spinner(props: SpinnerProps) {
  const [local] = splitProps(props, [
    "size",
    "label",
    "labelPosition",
    "appearance",
    "delay",
    "class",
  ]);

  const labelId = createId("sf-spinner-label");
  const size = () => local.size ?? "medium";
  const labelPosition = () => local.labelPosition ?? "after";
  const delay = () => local.delay ?? 0;

  const [visible, setVisible] = createSignal(delay() <= 0);
  onMount(() => {
    if (delay() <= 0) return;
    const timer = setTimeout(() => setVisible(true), delay());
    onCleanup(() => clearTimeout(timer));
  });

  const labelNode = () => (
    <label class="sf-Spinner__label" id={labelId}>
      {local.label}
    </label>
  );
  const isLeading = () =>
    labelPosition() === "before" || labelPosition() === "above";

  return (
    <span
      class={cx(
        "sf-Spinner",
        `sf-Spinner--${size()}`,
        local.class,
      )}
      role="progressbar"
      aria-label={typeof local.label === "string" ? local.label : t("common.loading")}
      aria-labelledby={local.label ? labelId : undefined}
      data-appearance={local.appearance ?? "primary"}
      data-label-position={labelPosition()}
      data-size={size()}
      data-delay={delay()}
    >
      <Show when={local.label && isLeading()}>{labelNode()}</Show>
      <Show when={visible()}>
        <span class="sf-Spinner__spinner" aria-hidden="true" />
      </Show>
      <Show when={local.label && !isLeading()}>{labelNode()}</Show>
    </span>
  );
}
