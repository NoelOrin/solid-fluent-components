import { describe, expect, it } from "vitest";
import { Skeleton, SkeletonItem } from "./Skeleton";
import { renderWithFluent } from "../../test-utils/index";

describe("Skeleton", () => {
  it("renders a hidden circular placeholder with dimensions", () => {
    const { container } = renderWithFluent(() => (
      <Skeleton shape="circle" width={40} height={40} />
    ));
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton).toHaveClass("sf-Skeleton--circle");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton.style.width).toBe("40px");
    expect(skeleton.style.height).toBe("40px");
  });

  it("emits appearance, animation and shape hooks", () => {
    const { container } = renderWithFluent(() => (
      <Skeleton appearance="translucent" animation="pulse" shape="square" />
    ));
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton).toHaveClass(
      "sf-Skeleton--translucent",
      "sf-Skeleton--pulse",
      "sf-Skeleton--square",
    );
    expect(skeleton).toHaveAttribute("data-appearance", "translucent");
    expect(skeleton).toHaveAttribute("data-animation", "pulse");
    expect(skeleton).toHaveAttribute("data-shape", "square");
  });

  it("uses wave as the default animation", () => {
    const { container } = renderWithFluent(() => <SkeletonItem />);
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton).toHaveClass("sf-Skeleton--wave");
    expect(skeleton).toHaveAttribute("data-animation", "wave");
  });

  it("does not flash when animation is none", () => {
    const { container } = renderWithFluent(() => (
      <Skeleton animation="none" />
    ));
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton).toHaveClass("sf-Skeleton--none");
    expect(skeleton).toHaveAttribute("data-animation", "none");
    expect(skeleton.style.animation).toBe("none");
  });

  it("defaults to opaque wave rectangle with full width and 16px height", () => {
    const { container } = renderWithFluent(() => <Skeleton />);
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton).toHaveClass("sf-Skeleton--opaque", "sf-Skeleton--wave", "sf-Skeleton--rectangle");
    expect(skeleton).toHaveAttribute("data-appearance", "opaque");
    expect(skeleton).toHaveAttribute("data-shape", "rectangle");
    expect(skeleton.style.width).toBe("100%");
    expect(skeleton.style.height).toBe("16px");
  });

  it("gives circles a default square 32px height", () => {
    const { container } = renderWithFluent(() => <Skeleton shape="circle" />);
    expect((container.querySelector(".sf-Skeleton") as HTMLElement).style.height).toBe("32px");
  });

  it("preserves string dimensions", () => {
    const { container } = renderWithFluent(() => (
      <Skeleton width="50%" height="2rem" />
    ));
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton.style.width).toBe("50%");
    expect(skeleton.style.height).toBe("2rem");
  });

  it("forwards props through SkeletonItem", () => {
    const { container } = renderWithFluent(() => (
      <SkeletonItem shape="square" animation="pulse" appearance="translucent" width={24} />
    ));
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton).toHaveClass("sf-Skeleton--square", "sf-Skeleton--pulse", "sf-Skeleton--translucent");
    expect(skeleton.style.width).toBe("24px");
  });

  it("merges custom style and class", () => {
    const { container } = renderWithFluent(() => (
      <Skeleton class="my-skeleton" style={{ "background-color": "red" }} />
    ));
    const skeleton = container.querySelector(".sf-Skeleton") as HTMLElement;
    expect(skeleton).toHaveClass("my-skeleton");
    expect(skeleton.style.backgroundColor).toBe("red");
  });
});
