import {
  Show,
  createContext,
  createMemo,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { createId, cx } from "../../utils/index";
import { Label } from "../label/Label";

export type FieldProps = {
  label?: JSX.Element;
  hint?: JSX.Element;
  validationMessage?: JSX.Element;
  validationState?: "error" | "warning" | "success" | "none";
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  class?: string;
  children?: JSX.Element;
};

type FieldContextValue = {
  controlId: string;
  hintId: string;
  validationMessageId: string;
  validationState: () => NonNullable<FieldProps["validationState"]>;
  hasHint: () => boolean;
  hasValidationMessage: () => boolean;
};

const FieldContext = createContext<FieldContextValue>();

export function useFieldContext() {
  return useContext(FieldContext);
}

export function useFieldControlId() {
  return useContext(FieldContext)?.controlId;
}

export type FieldA11yProps = {
  describedBy?: string;
  invalid?: boolean;
};

/**
 * Reactive helper for form controls rendered inside a Field. It exposes the
 * ids of the rendered hint / validation message and the derived
 * `aria-describedby` and `aria-invalid` values.
 */
export function useFieldA11yProps(): () => FieldA11yProps {
  const context = useContext(FieldContext);
  return createMemo(() => {
    if (!context) return {};
    const state = context.validationState();
    const ids: string[] = [];
    if (context.hasHint() && state === "none") ids.push(context.hintId);
    if (context.hasValidationMessage() && state !== "none") {
      ids.push(context.validationMessageId);
    }
    return {
      describedBy: ids.length ? ids.join(" ") : undefined,
      invalid: state === "error" ? true : undefined,
    };
  });
}

export function Field(props: FieldProps) {
  const [local] = splitProps(props, [
    "label",
    "hint",
    "validationMessage",
    "validationState",
    "required",
    "orientation",
    "class",
    "children",
  ]);

  const controlId = createId("field");
  const validationMessageId = createId("field-validation");
  const hintId = createId("field-hint");
  const validationState = () => local.validationState ?? "none";

  const context: FieldContextValue = {
    controlId,
    hintId,
    validationMessageId,
    validationState,
    hasHint: () => Boolean(local.hint),
    hasValidationMessage: () => Boolean(local.validationMessage),
  };

  return (
    <FieldContext.Provider value={context}>
      <div
        class={cx("sf-Field", local.class)}
        data-orientation={local.orientation ?? "vertical"}
        data-validation={validationState()}
      >
        <Show when={local.label}>
          <Label required={local.required} for={controlId}>
            {local.label}
          </Label>
        </Show>
        <div class="sf-Field__control">{local.children}</div>
        <Show when={local.hint && validationState() === "none"}>
          <div id={hintId} class="sf-Field__hint">
            {local.hint}
          </div>
        </Show>
        <Show when={local.validationMessage && validationState() !== "none"}>
          <div
            id={validationMessageId}
            class={cx(
              "sf-Field__validation",
              validationState() === "error" && "sf-Field__validation--error",
            )}
            role={validationState() === "error" ? "alert" : "status"}
          >
            {local.validationMessage}
          </div>
        </Show>
      </div>
    </FieldContext.Provider>
  );
}
