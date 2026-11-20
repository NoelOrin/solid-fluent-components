import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  MessageBarGroup,
  MessageBarDismissButton,
} from "./MessageBar";
import { renderWithFluent } from "../../test-utils/index";

describe("MessageBar", () => {
  it("renders a status message bar for info/success", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <MessageBar intent="info">
        <MessageBarBody>
          <MessageBarTitle>Title</MessageBarTitle>
          <MessageBarActions>OK</MessageBarActions>
        </MessageBarBody>
      </MessageBar>
    ));
    expect(container.querySelector(".sf-MessageBar")).toBeTruthy();
    expect(getByRole("status")).toBeTruthy();
    expect(container.textContent).toContain("Title");
  });

  it("uses role=alert for warning and error", () => {
    const warning = renderWithFluent(() => <MessageBar intent="warning">Warning</MessageBar>);
    expect(warning.getByRole("alert")).toBeTruthy();
    warning.unmount();

    const error = renderWithFluent(() => <MessageBar intent="error">Error</MessageBar>);
    expect(error.getByRole("alert")).toBeTruthy();
  });

  it("supports text and multiline layout", () => {
    const { container } = renderWithFluent(() => (
      <>
        <MessageBar intent="info">one line</MessageBar>
        <MessageBar intent="info" layout="multiline">
          multi line
        </MessageBar>
      </>
    ));
    const bars = container.querySelectorAll(".sf-MessageBar");
    expect(bars[0]).toHaveClass("sf-MessageBar--text");
    expect(bars[1]).toHaveClass("sf-MessageBar--multiline");
  });

  it("applies an intent class for every intent and a custom class", () => {
    const { container } = renderWithFluent(() => (
      <>
        <MessageBar intent="info">i</MessageBar>
        <MessageBar intent="success">s</MessageBar>
        <MessageBar intent="warning">w</MessageBar>
        <MessageBar intent="error">e</MessageBar>
        <MessageBar intent="info" class="custom">
          c
        </MessageBar>
      </>
    ));
    const bars = container.querySelectorAll(".sf-MessageBar");
    expect(bars[0]).toHaveClass("sf-MessageBar--info");
    expect(bars[1]).toHaveClass("sf-MessageBar--success");
    expect(bars[2]).toHaveClass("sf-MessageBar--warning");
    expect(bars[3]).toHaveClass("sf-MessageBar--error");
    expect(bars[4]).toHaveClass("custom");
  });

  it("defaults to info intent and text layout when no props are given", () => {
    const { container } = renderWithFluent(() => <MessageBar>plain</MessageBar>);
    const bar = container.querySelector(".sf-MessageBar")!;
    expect(bar).toHaveClass("sf-MessageBar--info");
    expect(bar).toHaveClass("sf-MessageBar--text");
  });

  it("renders the icon inside an aria-hidden wrapper", () => {
    const { container } = renderWithFluent(() => (
      <MessageBar icon={<span class="my-icon">!</span>}>text</MessageBar>
    ));
    const iconWrap = container.querySelector(".sf-MessageBar > span[aria-hidden='true']");
    expect(iconWrap).toBeTruthy();
    expect(iconWrap!.querySelector(".my-icon")).toBeTruthy();
  });

  it("renders body, title, actions and group sub-components with their classes", () => {
    const { container } = renderWithFluent(() => (
      <MessageBarGroup class="my-group">
        <MessageBar>
          <MessageBarBody>
            <MessageBarTitle>T</MessageBarTitle>
            <MessageBarActions containerAction={<button>Act</button>}>A</MessageBarActions>
          </MessageBarBody>
        </MessageBar>
      </MessageBarGroup>
    ));
    expect(container.querySelector(".sf-MessageBarGroup.my-group")).toBeTruthy();
    expect(container.querySelector(".sf-MessageBar__body")).toBeTruthy();
    expect(container.querySelector(".sf-MessageBar__title")?.textContent).toBe("T");
    expect(container.querySelector(".sf-MessageBar__actions")?.textContent).toContain("Act");
  });

  it("MessageBarDismissButton calls onClick and exposes an accessible label", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <MessageBarDismissButton onClick={onClick} />
    ));
    const button = getByRole("button", { name: "Dismiss" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an empty status bar when there are no children", () => {
    const { container, getByRole } = renderWithFluent(() => <MessageBar />);
    expect(getByRole("status")).toBeTruthy();
    expect(container.querySelector(".sf-MessageBar")?.textContent).toBe("");
  });
});
