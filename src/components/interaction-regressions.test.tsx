import { fireEvent, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { SplitButton } from "./button/SplitButton";
import { Field } from "./field/Field";
import { TeachingPopover, TeachingPopoverTrigger } from "./teaching-popover/TeachingPopover";
import { Textarea } from "./textarea/Textarea";
import { Toolbar, ToolbarButton } from "./toolbar/Toolbar";
import { ToolbarToggleButton } from "./utilities/extras/Extras";
import { renderWithFluent } from "../test-utils/index";

describe("交互修复回归", () => {
  it("SplitButton 合并内部 class 与调用方 class", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton
        primaryActionButton={{ class: "custom-primary" }}
        menuButton={{ class: "custom-menu" }}
      >
        Action
      </SplitButton>
    ));
    const buttons = getAllByRole("button");
    expect(buttons[0]!.className).toContain("sf-SplitButton__primary");
    expect(buttons[0]!.className).toContain("custom-primary");
    expect(buttons[1]!.className).toContain("sf-SplitButton__menu");
    expect(buttons[1]!.className).toContain("custom-menu");
  });

  it("TeachingPopover 按 Escape 后把焦点还给触发按钮", () => {
    const { getByRole } = renderWithFluent(() => (
      <TeachingPopover defaultOpen title="T" body="B">
        <TeachingPopoverTrigger><button>Trigger</button></TeachingPopoverTrigger>
      </TeachingPopover>
    ));
    const trigger = getByRole("button", { name: "Trigger" });
    const close = getByRole("button", { name: "Close" });
    close.focus();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
  });

  it("Field error 态下 Textarea 带 invalid 修饰类", () => {
    const { container } = renderWithFluent(() => (
      <Field validationState="error" validationMessage="必填">
        <Textarea />
      </Field>
    ));
    const textarea = container.querySelector("textarea")!;
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea.className).toContain("sf-Textarea--invalid");
  });

  it("ToolbarToggleButton 关闭态显式暴露 aria-pressed=false", () => {
    const { getByRole } = renderWithFluent(() => (
      <ToolbarToggleButton onChange={vi.fn()}>Off</ToolbarToggleButton>
    ));
    expect(getByRole("button", { name: "Off" })).toHaveAttribute("aria-pressed", "false");
  });

  it("禁用的 ToolbarButton 不进入 Tab 序列", async () => {
    const { getByRole } = renderWithFluent(() => (
      <Toolbar>
        <ToolbarButton>A</ToolbarButton>
        <ToolbarButton disabled>B</ToolbarButton>
      </Toolbar>
    ));
    await waitFor(() =>
      expect(getByRole("button", { name: "B" }).tabIndex).toBe(-1),
    );
  });
});
