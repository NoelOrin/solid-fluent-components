import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { webLightTheme } from "../index";
import { Button } from "../components/button/Button";
import { renderWithFluent } from "./index";

describe("renderWithFluent", () => {
  it("renders inside FluentProvider", () => {
    const { getByRole } = renderWithFluent(() => <Button>OK</Button>);
    expect(getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("supports click events", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button onClick={onClick}>OK</Button>
    ));
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies the Fluent theme CSS variables to the provider element", () => {
    const { container } = renderWithFluent(() => <Button>OK</Button>);
    const provider = container.querySelector<HTMLElement>("[data-fluent-provider]")!;
    expect(provider.style.getPropertyValue("--sf-colorBrandBackground")).toBe(
      webLightTheme.colorBrandBackground,
    );
  });

  it("wraps content in a provider with the default dir and class", () => {
    const { container } = renderWithFluent(() => <span>content</span>);
    const provider = container.querySelector("[data-fluent-provider]")!;
    expect(provider).toHaveClass("sf-provider");
    expect(provider).toHaveAttribute("dir", "ltr");
  });

  it("removes rendered nodes from the document on unmount", () => {
    const { getByRole, unmount } = renderWithFluent(() => <Button>Bye</Button>);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    unmount();
    expect(document.body.contains(button)).toBe(false);
  });

  it("supports focus and keyboard interaction inside the provider", () => {
    const onKeyDown = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button onKeyDown={onKeyDown}>Focus me</Button>
    ));
    const button = getByRole("button");
    button.focus();
    expect(document.activeElement).toBe(button);

    fireEvent.keyDown(button, { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("exposes positive and negative queries from the render result", () => {
    const { queryByRole, queryByText, getByText } = renderWithFluent(() => (
      <span>Visible</span>
    ));
    expect(queryByRole("button")).toBeNull();
    expect(queryByText("Missing")).toBeNull();
    expect(getByText("Visible")).toBeInTheDocument();
  });
});
