import { Show, onCleanup, splitProps, type JSX } from "solid-js";
import {
  callHandler,
  createControllableSignal,
  cx,
  type IntrinsicElementProps,
} from "../../utils/index";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";
import { useRadioGroupContext } from "./context";

export type RadioProps = Omit<IntrinsicElementProps<"input">, "type"> & {
  label?: JSX.Element;
  defaultChecked?: boolean;
};

export function Radio(props: RadioProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const group = useRadioGroupContext();
  const [local, rest] = splitProps(props, [
    "class",
    "label",
    "disabled",
    "checked",
    "defaultChecked",
    "children",
    "value",
    "name",
    "id",
    "onChange",
    "onKeyDown",
  ]);

  const radioValue = () => String(local.value ?? "");
  const groupChecked = () =>
    group ? group.value() === radioValue() : undefined;
  const [isChecked, setChecked] = createControllableSignal<boolean>(
    () => local.checked ?? groupChecked(),
    local.defaultChecked ?? false,
  );
  const disabled = () => Boolean(local.disabled || group?.disabled());
  const name = () => local.name ?? group?.name();
  const tabbable = () => {
    if (!group) return undefined;
    if (disabled()) return -1;
    return group.isTabbable(radioValue()) ? 0 : -1;
  };

  onCleanup(() => group?.unregister(radioValue()));

  const handleKeyDown = (
    event: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element },
  ) => {
    const key = event.key;
    if (
      group &&
      !disabled() &&
      (key === "ArrowRight" ||
        key === "ArrowDown" ||
        key === "ArrowLeft" ||
        key === "ArrowUp" ||
        key === "Home" ||
        key === "End")
    ) {
      event.preventDefault();
      const direction =
        key === "ArrowRight" || key === "ArrowDown"
          ? "next"
          : key === "ArrowLeft" || key === "ArrowUp"
            ? "prev"
            : key === "Home"
              ? "first"
              : "last";
      group.move(radioValue(), direction);
    }
    callHandler(local.onKeyDown, event);
  };

  return (
    <label
      class={cx(
        "sf-Radio",
        disabled() && "sf-Radio--disabled",
        fieldA11y().invalid && "sf-Radio--invalid",
        local.class,
      )}
    >
      <input
        ref={(el) => group?.register(radioValue(), el)}
        id={local.id ?? (group ? undefined : fieldId)}
        type="radio"
        role="radio"
        class="sf-Radio__input"
        value={radioValue()}
        name={name()}
        disabled={disabled()}
        checked={isChecked()}
        aria-checked={isChecked()}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        tabindex={tabbable()}
        onChange={(event) => {
          setChecked(event.currentTarget.checked);
          group?.setValue(radioValue());
          callHandler(local.onChange, event);
        }}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      <span
        class="sf-Radio__indicator"
        data-checked={isChecked() ? "true" : undefined}
        aria-hidden="true"
      />
      <Show when={local.label ?? local.children}>
        <span>{local.label ?? local.children}</span>
      </Show>
    </label>
  );
}
