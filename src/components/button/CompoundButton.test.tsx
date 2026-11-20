import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { CompoundButton } from "./CompoundButton";
import { renderWithFluent } from "../../test-utils/index";

describe("CompoundButton", () => {
  it("renders primary and secondary content in dedicated spans", () => {
    const { container } = renderWithFluent(() => (
      <CompoundButton secondaryContent="Subtitle">Primary</CompoundButton>
    ));
    const btn = container.querySelector(".sf-CompoundButton") as HTMLElement;
    expect(btn).toHaveClass("sf-CompoundButton");
    expect(btn.querySelector(".sf-CompoundButton__primary")).toHaveTextContent("Primary");
    expect(btn.querySelector(".sf-CompoundButton__secondary")).toHaveTextContent("Subtitle");
  });

  it("omits the secondary span when no secondary content is given", () => {
    const { container } = renderWithFluent(() => (
      <CompoundButton>Primary</CompoundButton>
    ));
    const btn = container.querySelector(".sf-CompoundButton") as HTMLElement;
    expect(btn.querySelector(".sf-CompoundButton__primary")).toBeInTheDocument();
    expect(btn.querySelector(".sf-CompoundButton__secondary")).toBeNull();
  });

  it("uses the default secondary/rounded/medium variants", () => {
    const { getByRole } = renderWithFluent(() => <CompoundButton>A</CompoundButton>);
    expect(getByRole("button")).toHaveClass(
      "sf-Button",
      "sf-CompoundButton",
      "sf-focus-ring",
      "sf-Button--secondary",
      "sf-Button--rounded",
      "sf-Button--medium",
    );
  });

  it("maps variant props and a custom class to the rendered button", () => {
    const { getByRole } = renderWithFluent(() => (
      <CompoundButton
        appearance="outline"
        shape="square"
        size="large"
        class="my-compound"
      >
        A
      </CompoundButton>
    ));
    expect(getByRole("button")).toHaveClass(
      "sf-Button--outline",
      "sf-Button--square",
      "sf-Button--large",
      "my-compound",
    );
  });

  it("renders an icon before the content wrapper", () => {
    const { container } = renderWithFluent(() => (
      <CompoundButton icon={<span>★</span>}>A</CompoundButton>
    ));
    const btn = container.querySelector(".sf-CompoundButton") as HTMLElement;
    expect(btn.querySelector(".sf-Button__icon")).toHaveTextContent("★");
    expect(btn.firstElementChild).toHaveClass("sf-Button__icon");
  });

  it("forwards native attributes and is keyboard focusable", () => {
    const { getByRole } = renderWithFluent(() => (
      <CompoundButton id="compound" aria-label="Save and more" title="Save">
        A
      </CompoundButton>
    ));
    const btn = getByRole("button", { name: "Save and more" }) as HTMLButtonElement;
    expect(btn).toHaveAttribute("id", "compound");
    expect(btn).toHaveAttribute("title", "Save");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.tabIndex).toBe(0);
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it("calls onClick with the event when clicked", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <CompoundButton onClick={onClick}>A</CompoundButton>
    ));
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it("reflects disabled via aria-disabled and ignores clicks", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <CompoundButton disabled onClick={onClick}>A</CompoundButton>
    ));
    const btn = getByRole("button");
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn).not.toHaveAttribute("disabled");
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps disabledFocusable buttons focusable while suppressing clicks and bubbling", () => {
    const onClick = vi.fn();
    const onParentClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <div onClick={onParentClick}>
        <CompoundButton disabledFocusable onClick={onClick}>A</CompoundButton>
      </div>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn).not.toHaveAttribute("disabled");
    btn.focus();
    expect(document.activeElement).toBe(btn);
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it("forwards focus and blur handlers for focus management", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <CompoundButton onFocus={onFocus} onBlur={onBlur}>A</CompoundButton>
    ));
    const btn = getByRole("button") as HTMLButtonElement;
    btn.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    btn.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
