import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { ToggleButton } from "./ToggleButton";
import { renderWithFluent } from "../../test-utils/index";

describe("ToggleButton", () => {
  it("marks a checked toggle with aria-pressed and the checked class", () => {
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton checked>Pin</ToggleButton>
    ));
    const btn = getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveClass("sf-ToggleButton--checked");
    expect(btn).toHaveClass("sf-Button", "sf-ToggleButton", "sf-focus-ring");
  });

  it("is unchecked by default", () => {
    const { getByRole } = renderWithFluent(() => <ToggleButton>Pin</ToggleButton>);
    const btn = getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).not.toHaveClass("sf-ToggleButton--checked");
  });

  it("uses defaultChecked as the initial uncontrolled state", () => {
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton defaultChecked>Pin</ToggleButton>
    ));
    const btn = getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveClass("sf-ToggleButton--checked");
  });

  it("toggles an uncontrolled button and reports the next state", () => {
    const onCheckedChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton defaultChecked={false} onCheckedChange={onCheckedChange}>
        Pin
      </ToggleButton>
    ));
    const btn = getByRole("button");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveClass("sf-ToggleButton--checked");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("cycles back to the original state on repeated toggles", () => {
    const onCheckedChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton onCheckedChange={onCheckedChange}>Pin</ToggleButton>
    ));
    const btn = getByRole("button");
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).not.toHaveClass("sf-ToggleButton--checked");
    expect(onCheckedChange.mock.calls.map((call) => call[0])).toEqual([true, false]);
  });

  it("does not change a controlled checked value when clicked", () => {
    const onCheckedChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton checked={false} onCheckedChange={onCheckedChange}>
        Pin
      </ToggleButton>
    ));
    const btn = getByRole("button");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("sets the native disabled attribute and blocks changes while disabled", () => {
    const onCheckedChange = vi.fn();
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton disabled onCheckedChange={onCheckedChange} onClick={onClick}>
        Pin
      </ToggleButton>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn).not.toHaveAttribute("aria-disabled");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps disabledFocusable toggles focusable but inert", () => {
    const onCheckedChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton disabledFocusable onCheckedChange={onCheckedChange}>
        Pin
      </ToggleButton>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn.disabled).toBe(false);
    btn.focus();
    expect(document.activeElement).toBe(btn);
    fireEvent.click(btn);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("maps appearance, shape and size props and renders an icon", () => {
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton
        appearance="primary"
        shape="circular"
        size="large"
        class="my-toggle"
        icon={<span>★</span>}
      >
        Pin
      </ToggleButton>
    ));
    const btn = getByRole("button");
    expect(btn).toHaveClass(
      "sf-Button--primary",
      "sf-Button--circular",
      "sf-Button--large",
      "my-toggle",
    );
    expect(btn.querySelector(".sf-Button__icon")).toHaveTextContent("★");
  });

  it("is a keyboard-focusable native button that forwards the click event", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton onClick={onClick}>Pin</ToggleButton>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.tabIndex).toBe(0);
    btn.focus();
    expect(document.activeElement).toBe(btn);
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
  });
});
