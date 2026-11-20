import { describe, expect, it } from "vitest";
import { Field, useFieldA11yProps, useFieldContext } from "./Field";
import { Input } from "../input/Input";
import { Switch } from "../switch/Switch";
import { Slider } from "../slider/Slider";
import { SpinButton } from "../spin-button/SpinButton";
import { Dropdown } from "../dropdown/Dropdown";
import { ComboboxField } from "../combobox/ComboboxField";
import { Rating } from "../rating/Rating";
import { renderWithFluent } from "../../test-utils/index";

describe("Field", () => {
  it("renders a labelled field with a control and default vertical orientation", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Email">
        <input />
      </Field>
    ));
    const root = container.querySelector(".sf-Field") as HTMLElement;
    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(root).toHaveAttribute("data-validation", "none");
    expect(container.querySelector(".sf-Field__control input")).toBeTruthy();
    expect(container.textContent).toContain("Email");
  });

  it("applies the horizontal orientation and a custom class", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Email" orientation="horizontal" class="my-field">
        <input />
      </Field>
    ));
    const root = container.querySelector(".sf-Field") as HTMLElement;
    expect(root).toHaveAttribute("data-orientation", "horizontal");
    expect(root).toHaveClass("my-field");
  });

  it("renders the required marker on the label", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Email" required>
        <input />
      </Field>
    ));
    expect(container.querySelector(".sf-Label__required")!.textContent).toBe("*");
  });

  it("does not render a label element when no label is supplied", () => {
    const { container } = renderWithFluent(() => (
      <Field hint="Helpful text">
        <input />
      </Field>
    ));
    expect(container.querySelector(".sf-Label")).toBeNull();
    expect(container.querySelector(".sf-Field__hint")).toBeTruthy();
  });

  it("associates the hint with the control via aria-describedby when valid", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Email" hint="Required">
        <Input />
      </Field>
    ));
    const input = container.querySelector("input")!;
    const hint = container.querySelector(".sf-Field__hint")!;
    expect(input.getAttribute("aria-describedby")).toBe(hint.id);
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("hides the hint and shows an alert for the error state", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Email" hint="Required" validationState="error" validationMessage="Invalid email">
        <Input />
      </Field>
    ));
    expect(container.querySelector(".sf-Field__hint")).toBeNull();
    const validation = container.querySelector(".sf-Field__validation") as HTMLElement;
    expect(validation).toHaveAttribute("role", "alert");
    expect(validation).toHaveClass("sf-Field__validation--error");
    expect(container.querySelector(".sf-Field")).toHaveAttribute("data-validation", "error");
  });

  it("uses a status role and no invalid marker for warning and success states", () => {
    const warning = renderWithFluent(() => (
      <Field validationState="warning" validationMessage="Check this">
        <Input />
      </Field>
    ));
    const warningInput = warning.container.querySelector("input")!;
    const warningMsg = warning.container.querySelector(".sf-Field__validation")!;
    expect(warningMsg).toHaveAttribute("role", "status");
    expect(warningMsg).not.toHaveClass("sf-Field__validation--error");
    expect(warning.container.querySelector(".sf-Field")).toHaveAttribute("data-validation", "warning");
    expect(warningInput).not.toHaveAttribute("aria-invalid");
    expect(warningInput.getAttribute("aria-describedby")).toContain(warningMsg.id);

    const success = renderWithFluent(() => (
      <Field validationState="success" validationMessage="Looks good">
        <Input />
      </Field>
    ));
    expect(success.container.querySelector(".sf-Field")).toHaveAttribute("data-validation", "success");
  });

  it("does not render a validation message when no validation state is set", () => {
    const { container } = renderWithFluent(() => (
      <Field label="Email" validationMessage="Invalid email">
        <Input />
      </Field>
    ));
    expect(container.querySelector(".sf-Field__validation")).toBeNull();
  });

  it("exposes ids, flags and derived a11y props through context", () => {
    let snapshot: ReturnType<typeof useFieldContext> | undefined;
    let a11y: ReturnType<typeof useFieldA11yProps> | undefined;
    const Probe = () => {
      snapshot = useFieldContext();
      a11y = useFieldA11yProps();
      return null;
    };

    renderWithFluent(() => (
      <Field
        label="Email"
        hint="Hint text"
        validationMessage="Bad email"
        validationState="error"
      >
        <Probe />
      </Field>
    ));

    expect(snapshot?.controlId).toBeTruthy();
    expect(snapshot?.hintId).toBeTruthy();
    expect(snapshot?.validationMessageId).toBeTruthy();
    expect(snapshot?.validationState()).toBe("error");
    expect(snapshot?.hasHint()).toBe(true);
    expect(snapshot?.hasValidationMessage()).toBe(true);
    expect(a11y?.().invalid).toBe(true);
    expect(a11y?.().describedBy).toContain(snapshot!.validationMessageId);
    expect(a11y?.().describedBy).not.toContain(snapshot!.hintId);
  });

  it("wires aria-describedby and aria-invalid on a nested control (error)", () => {
    const { container } = renderWithFluent(() => (
      <Field
        label="Email"
        hint="We never share it"
        validationState="error"
        validationMessage="Invalid email"
      >
        <Input />
      </Field>
    ));

    const input = container.querySelector("input")!;
    const label = container.querySelector("label.sf-Label")!;
    const validation = container.querySelector(".sf-Field__validation")!;

    expect(input.id).toBeTruthy();
    expect(label.getAttribute("for")).toBe(input.id);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(validation.id);
  });

  it("connects a wide range of controls to the field label via control id", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Field label="Switch">
          <Switch />
        </Field>
        <Field label="Slider">
          <Slider />
        </Field>
        <Field label="Number">
          <SpinButton />
        </Field>
        <Field label="Choice">
          <Dropdown options={[{ value: "a", label: "A" }]} />
        </Field>
        <Field label="Search">
          <ComboboxField options={[{ value: "a", label: "A" }]} />
        </Field>
        <Field label="Stars">
          <Rating />
        </Field>
      </>
    ));

    const fields = container.querySelectorAll(".sf-Field");
    expect(fields.length).toBe(6);
    fields.forEach((field) => {
      const labelFor = field.querySelector("label.sf-Label")!.getAttribute("for")!;
      const control = field.querySelector(".sf-Field__control [id]")!;
      expect(labelFor).toBeTruthy();
      expect(control.id).toBe(labelFor);
    });
  });

  it("generates a distinct control id for each field", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Field label="First">
          <Input />
        </Field>
        <Field label="Second">
          <Input />
        </Field>
      </>
    ));
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBe(2);
    expect(inputs[0]!.id).toBeTruthy();
    expect(inputs[1]!.id).toBeTruthy();
    expect(inputs[0]!.id).not.toBe(inputs[1]!.id);
  });
});
