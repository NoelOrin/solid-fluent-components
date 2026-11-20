import { splitProps, type JSX } from "solid-js";
import { createId, cx } from "../../utils/index";
import { Label } from "../label/Label";
import { Tooltip } from "../tooltip/Tooltip";

export type InfoLabelProps = {
  info?: JSX.Element;
  infoButton?: JSX.Element;
  size?: "small" | "medium" | "large";
  weight?: "regular" | "semibold";
  required?: boolean;
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
  htmlFor?: string;
};

export function InfoLabel(props: InfoLabelProps) {
  const [local] = splitProps(props, [
    "info",
    "infoButton",
    "size",
    "weight",
    "required",
    "disabled",
    "class",
    "children",
    "htmlFor",
  ]);
  const id = createId("info-label");

  return (
    <span class={cx("sf-InfoLabel", local.class)}>
      <Label
        for={local.htmlFor}
        required={local.required}
        disabled={local.disabled}
        size={local.size}
        weight={local.weight}
      >
        {local.children}
      </Label>
      <Tooltip content={local.info ?? "More information"}>
        <button
          type="button"
          id={id}
          class="sf-InfoLabel__button sf-focus-ring"
          aria-label="More info"
          disabled={local.disabled}
        >
          {local.infoButton ?? "ⓘ"}
        </button>
      </Tooltip>
    </span>
  );
}
