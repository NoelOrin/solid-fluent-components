import { t } from "../../i18n";
import {
  Show,
  createEffect,
  createSignal,
  splitProps,
  type JSX,
} from "solid-js";
import { callHandler, cx, type IntrinsicElementProps } from "../../utils/index";
import { Button } from "../button/Button";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type SearchBoxProps = Omit<
  IntrinsicElementProps<"input">,
  "size" | "type"
> & {
  size?: "small" | "medium" | "large";
  appearance?: "outline" | "underline" | "filled-darker" | "filled-lighter";
  contentBefore?: JSX.Element;
  contentAfter?: JSX.Element;
  dismiss?: JSX.Element;
  onDismiss?: () => void;
};

export function SearchBox(props: SearchBoxProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, [
    "class",
    "size",
    "appearance",
    "contentBefore",
    "contentAfter",
    "dismiss",
    "onDismiss",
    "disabled",
    "value",
    "id",
    "onInput",
  ]);

  const size = () => local.size ?? "medium";
  const [internalValue, setInternalValue] = createSignal(local.value ?? "");
  createEffect(() => {
    if (local.value !== undefined) setInternalValue(local.value);
  });
  const currentValue = () => local.value ?? internalValue();

  const clear = () => {
    setInternalValue("");
    local.onDismiss?.();
  };

  return (
    <span
      class={cx(
        "sf-Input",
        "sf-SearchBox",
        `sf-Input--${size()}`,
        local.disabled && "sf-Input--disabled",
        fieldA11y().invalid && "sf-Input--invalid",
        local.class,
      )}
      data-appearance={local.appearance ?? "outline"}
    >
      <span class="sf-Input__content" aria-hidden="true">
        {local.contentBefore ?? "⌕"}
      </span>
      <input
        {...rest}
        id={local.id ?? fieldId}
        class="sf-Input__field"
        type="search"
        disabled={local.disabled}
        value={currentValue()}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        onInput={(event) => {
          setInternalValue(event.currentTarget.value);
          callHandler(local.onInput, event);
        }}
      />
      <Show when={Boolean(currentValue()) && !local.disabled}>
        <Button
          appearance="transparent"
          size="small"
          class="sf-SearchBox__dismiss"
          aria-label={t("common.clear")}
          onClick={clear}
        >
          {local.dismiss ?? "×"}
        </Button>
      </Show>
      <Show when={local.contentAfter}>
        <span class="sf-Input__content">{local.contentAfter}</span>
      </Show>
    </span>
  );
}
