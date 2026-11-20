import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Tag, TagGroup } from "./Tag";
import { renderWithFluent } from "../../test-utils/index";

describe("Tag", () => {
  it("renders a tag with text", () => {
    const { container } = renderWithFluent(() => <Tag>Label</Tag>);
    expect(container.querySelector(".sf-Tag")).toBeTruthy();
    expect(container.textContent).toContain("Label");
  });

  it("renders a brand tag group", () => {
    const { container } = renderWithFluent(() => (
      <TagGroup>
        <Tag>One</Tag>
      </TagGroup>
    ));
    expect(container.querySelector(".sf-Tag")).toBeTruthy();
    expect(container.querySelector(".sf-TagGroup")).toBeTruthy();
  });

  it("distinguishes ghost / filled / brand appearances", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Tag appearance="ghost">Ghost</Tag>
        <Tag appearance="filled">Filled</Tag>
        <Tag appearance="brand">Brand</Tag>
      </>
    ));
    expect(container.querySelector(".sf-Tag--ghost")).toBeTruthy();
    expect(container.querySelector(".sf-Tag--filled")).toBeTruthy();
    expect(container.querySelector(".sf-Tag--brand")).toBeTruthy();
    expect(
      container.querySelector<HTMLElement>('[data-appearance="ghost"]'),
    ).toBeTruthy();
  });

  it("stops dismiss clicks from bubbling", () => {
    const onParentClick = vi.fn();
    const onDismiss = vi.fn();
    const { container } = renderWithFluent(() => (
      <div onClick={onParentClick}>
        <Tag dismissible onDismiss={onDismiss}>
          Label
        </Tag>
      </div>
    ));
    container.querySelector<HTMLElement>(".sf-Tag__dismiss")!.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(onDismiss).toHaveBeenCalled();
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it("reflects size, shape, outline appearance, disabled and custom class", () => {
    const { container } = renderWithFluent(() => (
      <Tag
        appearance="outline"
        size="small"
        shape="rounded"
        disabled
        class="my-tag"
        icon={<span class="sf-Tag__icon">i</span>}
      >
        Label
      </Tag>
    ));
    const tag = container.querySelector<HTMLElement>(".sf-Tag")!;
    expect(tag.classList.contains("sf-Tag--outline")).toBe(true);
    expect(tag.classList.contains("my-tag")).toBe(true);
    expect(tag.getAttribute("data-size")).toBe("small");
    expect(tag.getAttribute("data-shape")).toBe("rounded");
    expect(tag.getAttribute("data-appearance")).toBe("outline");
    expect(tag.getAttribute("data-disabled")).toBe("true");
    expect(tag.querySelector(".sf-Tag__icon")!.textContent).toBe("i");
  });

  it("defaults to medium size and circular shape", () => {
    const { container } = renderWithFluent(() => <Tag>Label</Tag>);
    const tag = container.querySelector<HTMLElement>(".sf-Tag")!;
    expect(tag.getAttribute("data-size")).toBe("medium");
    expect(tag.getAttribute("data-shape")).toBe("circular");
    expect(tag.hasAttribute("data-disabled")).toBe(false);
  });

  it("only renders an accessible dismiss button when dismissible", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Tag>Plain</Tag>
        <Tag dismissible>Closable</Tag>
      </>
    ));
    const tags = container.querySelectorAll<HTMLElement>(".sf-Tag");
    expect(tags[0]!.querySelector("button")).toBeNull();
    const dismiss = tags[1]!.querySelector<HTMLButtonElement>("button.sf-Tag__dismiss")!;
    expect(dismiss).toBeTruthy();
    expect(dismiss.type).toBe("button");
    expect(dismiss).toHaveAttribute("aria-label", "Remove");
    expect(dismiss.textContent).toBe("×");
  });

  it("disables the dismiss control when the tag is disabled", () => {
    const { container } = renderWithFluent(() => (
      <Tag dismissible disabled>Label</Tag>
    ));
    const dismiss = container.querySelector<HTMLButtonElement>(".sf-Tag__dismiss")!;
    expect(dismiss.disabled).toBe(true);
    expect(container.querySelector(".sf-Tag")!.getAttribute("data-disabled")).toBe("true");
  });

  it("passes the click event to onDismiss", () => {
    const onDismiss = vi.fn();
    const { container } = renderWithFluent(() => (
      <Tag dismissible onDismiss={onDismiss}>Label</Tag>
    ));
    fireEvent.click(container.querySelector<HTMLButtonElement>(".sf-Tag__dismiss")!);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss.mock.calls[0]![0]).toBeInstanceOf(MouseEvent);
  });

  it("applies a custom class and flex layout to TagGroup", () => {
    const { container } = renderWithFluent(() => (
      <TagGroup class="my-group">
        <Tag>One</Tag>
        <Tag>Two</Tag>
      </TagGroup>
    ));
    const group = container.querySelector<HTMLElement>(".sf-TagGroup")!;
    expect(group.classList.contains("my-group")).toBe(true);
    expect(group.style.display).toBe("flex");
    expect(group.querySelectorAll(".sf-Tag").length).toBe(2);
  });
});
