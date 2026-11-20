import {
  For,
  Show,
  splitProps,
  type JSX,
} from "solid-js";
import {
  callHandler,
  cx,
  type IntrinsicElementProps,
} from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type SliderMark = number | { value: number; label?: JSX.Element };

export type SliderProps = Omit<
  IntrinsicElementProps<"input">,
  "type" | "size" | "onChange"
> & {
  size?: "small" | "medium";
  vertical?: boolean;
  defaultValue?: number | string;
  marks?: SliderMark[];
  origin?: "start" | "center";
  onChange?: (
    event: Event & { currentTarget: HTMLInputElement; target: Element },
    data: { value: number },
  ) => void;
};

export function Slider(props: SliderProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [local, rest] = splitProps(props, [
    "class",
    "size",
    "vertical",
    "marks",
    "origin",
    "onChange",
    "id",
    "defaultValue",
  ]);

  const min = () => Number(props.min ?? 0);
  const max = () => Number(props.max ?? 100);
  const markValue = (mark: SliderMark) =>
    typeof mark === "number" ? mark : mark.value;
  const markPosition = (value: number) => {
    const range = max() - min();
    if (range <= 0) return 0;
    return ((value - min()) / range) * 100;
  };

  const handleChange = (
    event: Event & { currentTarget: HTMLInputElement; target: Element },
  ) => {
    const handler = local.onChange;
    if (typeof handler === "function") {
      handler(event, { value: Number(event.currentTarget.value) });
    } else if (Array.isArray(handler)) {
      callHandler(handler as never, event);
    }
  };

  return (
    <label
      class={cx(
        "sf-Slider",
        fieldA11y().invalid && "sf-Slider--invalid",
        local.class,
      )}
      data-size={local.size ?? "medium"}
      data-vertical={local.vertical ? "true" : undefined}
      data-origin={local.origin ?? "start"}
    >
      <input
        type="range"
        {...rest}
        id={local.id ?? fieldId}
        class="sf-Slider__input"
        value={props.value ?? local.defaultValue}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        onChange={handleChange}
      />
      <Show when={local.marks && local.marks.length > 0}>
        <span class="sf-Slider__marks" aria-hidden="true">
          <For each={local.marks}>
            {(mark) => (
              <span
                class="sf-Slider__mark"
                data-value={markValue(mark)}
                style={{ left: `${markPosition(markValue(mark))}%` }}
              >
                <Show when={typeof mark !== "number" && mark.label}>
                  <span class="sf-Slider__markLabel">
                    {typeof mark !== "number" ? mark.label : null}
                  </span>
                </Show>
              </span>
            )}
          </For>
        </span>
      </Show>
    </label>
  );
}
