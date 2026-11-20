import { describe, expect, it } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import {
  TeachingPopover,
  TeachingPopoverTrigger,
  TeachingPopoverSurface,
  TeachingPopoverBody,
  TeachingPopoverHeader,
  TeachingPopoverTitle,
  TeachingPopoverFooter,
  TeachingPopoverCarousel,
  TeachingPopoverCarouselCard,
  TeachingPopoverCarouselNav,
  TeachingPopoverCarouselNavButton,
  TeachingPopoverCarouselPageCount,
  TeachingPopoverCarouselFooter,
  TeachingPopoverCarouselFooterButton,
} from "./TeachingPopover";
import { renderWithFluent } from "../../test-utils/index";

describe("TeachingPopover sub-components", () => {
  it("renders prop-driven popover and sub-components", () => {
    const onOpenChange = (vi as any).fn();
    const { container, getByText } = renderWithFluent(() => (
      <TeachingPopover
        open
        onOpenChange={onOpenChange}
        title="Title"
        body="Body"
        footer={<button>Got it</button>}
      >
        <button>Trigger</button>
      </TeachingPopover>
    ));
    expect(container.querySelector(".sf-TeachingPopover")).toBeTruthy();
    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Body")).toBeInTheDocument();
  });

  it("standalone sub-parts render", () => {
    const { container } = renderWithFluent(() => (
      <TeachingPopoverHeader>
        <TeachingPopoverTitle>H</TeachingPopoverTitle>
      </TeachingPopoverHeader>
    ));
    expect(container.querySelector(".sf-TeachingPopover__header")).toBeTruthy();
    container.innerHTML = "";
    const { container: c2 } = renderWithFluent(() => (
      <TeachingPopoverCarousel>
        <TeachingPopoverCarouselCard>Card</TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselNav>
          <TeachingPopoverCarouselNavButton index={0} label="1" />
        </TeachingPopoverCarouselNav>
        <TeachingPopoverCarouselPageCount current={1} total={3} />
      </TeachingPopoverCarousel>
    ));
    expect(c2.querySelector(".sf-TeachingPopover__carouselCard")).toBeTruthy();
    expect(c2.querySelector(".sf-TeachingPopover__pageCount")?.textContent).toBe("1 / 3");
  });

  it("is closed by default and opens from its trigger", () => {
    const { container } = renderWithFluent(() => (
      <TeachingPopover title="Title" body="Body">
        <TeachingPopoverTrigger>
          <button>Trigger</button>
        </TeachingPopoverTrigger>
      </TeachingPopover>
    ));
    expect(container.querySelector(".sf-TeachingPopover")).toBeNull();
    const trigger = container.querySelector("button")!;
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(container.querySelector(".sf-TeachingPopover")).toBeTruthy();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes on Escape and on outside click", () => {
    const { container } = renderWithFluent(() => (
      <TeachingPopover title="Title" body="Body">
        <TeachingPopoverTrigger>
          <button>Trigger</button>
        </TeachingPopoverTrigger>
      </TeachingPopover>
    ));
    const trigger = container.querySelector("button")!;
    fireEvent.click(trigger);
    expect(container.querySelector(".sf-TeachingPopover")).toBeTruthy();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(container.querySelector(".sf-TeachingPopover")).toBeNull();

    fireEvent.click(trigger);
    expect(container.querySelector(".sf-TeachingPopover")).toBeTruthy();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(container.querySelector(".sf-TeachingPopover")).toBeNull();
  });

  it("a composed TeachingPopoverSurface avoids a duplicated built-in surface", () => {
    const { container } = renderWithFluent(() => (
      <TeachingPopover defaultOpen title="Built-in title" body="Built-in body">
        <TeachingPopoverTrigger>
          <button>Trigger</button>
        </TeachingPopoverTrigger>
        <TeachingPopoverSurface>
          <TeachingPopoverBody>Custom body</TeachingPopoverBody>
        </TeachingPopoverSurface>
      </TeachingPopover>
    ));
    expect(container.querySelectorAll(".sf-TeachingPopover")).toHaveLength(1);
    expect(container.textContent).toContain("Custom body");
    expect(container.textContent).not.toContain("Built-in title");
  });

  it("applies the appearance class", () => {
    const { container } = renderWithFluent(() => (
      <TeachingPopover defaultOpen appearance="brand" title="Title" body="Body">
        <button>Trigger</button>
      </TeachingPopover>
    ));
    expect(container.querySelector(".sf-TeachingPopover--brand")).toBeTruthy();
  });

  it("carousel footer buttons and nav buttons drive the shared carousel state", () => {
    const { container, getByLabelText } = renderWithFluent(() => (
      <TeachingPopoverCarousel
        items={[<div>One</div>, <div>Two</div>]}
      >
        <TeachingPopoverCarouselFooter>
          <TeachingPopoverCarouselFooterButton navType="previous" altText="Previous slide" />
          <TeachingPopoverCarouselFooterButton navType="next" altText="Next slide" />
        </TeachingPopoverCarouselFooter>
        <TeachingPopoverCarouselNav>
          <TeachingPopoverCarouselNavButton index={0} label="Dot 1" />
          <TeachingPopoverCarouselNavButton index={1} label="Dot 2" />
        </TeachingPopoverCarouselNav>
        <TeachingPopoverCarouselPageCount />
      </TeachingPopoverCarousel>
    ));
    const pageCount = container.querySelector(".sf-TeachingPopover__pageCount")!;
    expect(pageCount.textContent).toBe("1 / 2");
    fireEvent.click(getByLabelText("Next slide"));
    expect(pageCount.textContent).toBe("2 / 2");
    fireEvent.click(getByLabelText("Dot 1"));
    expect(pageCount.textContent).toBe("1 / 2");
  });

  it("trigger reports aria-controls and the expanded surface id", () => {
    const { container } = renderWithFluent(() => (
      <TeachingPopover defaultOpen title="T" body="B">
        <TeachingPopoverTrigger>
          <button>Trigger</button>
        </TeachingPopoverTrigger>
      </TeachingPopover>
    ));
    const trigger = container.querySelector("button")!;
    const surface = container.querySelector(".sf-TeachingPopover")!;
    expect(surface.id).toMatch(/^sf-teaching-popover/);
    expect(trigger).toHaveAttribute("aria-controls", surface.id);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("Escape closes the popover and leaves focus on the trigger", () => {
    const { container } = renderWithFluent(() => (
      <TeachingPopover title="T" body="B">
        <TeachingPopoverTrigger>
          <button>Trigger</button>
        </TeachingPopoverTrigger>
      </TeachingPopover>
    ));
    const trigger = container.querySelector("button")!;
    trigger.focus();
    fireEvent.click(trigger);
    expect(container.querySelector(".sf-TeachingPopover")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(container.querySelector(".sf-TeachingPopover")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("renders an arrow by default and hides it when withArrow is false", () => {
    const withArrow = renderWithFluent(() => (
      <TeachingPopoverSurface>content</TeachingPopoverSurface>
    ));
    expect(withArrow.container.querySelector(".sf-TeachingPopover__arrow")).toBeTruthy();
    withArrow.unmount();

    const withoutArrow = renderWithFluent(() => (
      <TeachingPopoverSurface withArrow={false}>content</TeachingPopoverSurface>
    ));
    expect(withoutArrow.container.querySelector(".sf-TeachingPopover__arrow")).toBeNull();
  });

  it("defers to a controlled open prop until the parent updates it", () => {
    const onOpenChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <TeachingPopover open onOpenChange={onOpenChange} title="T" body="B">
        <TeachingPopoverTrigger>
          <button>Trigger</button>
        </TeachingPopoverTrigger>
      </TeachingPopover>
    ));
    fireEvent.click(container.querySelector("button")!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector(".sf-TeachingPopover")).toBeTruthy();
  });

  it("carousel nav buttons are disabled at the item boundaries", () => {
    const onActiveIndexChange = vi.fn();
    const { getByLabelText } = renderWithFluent(() => (
      <TeachingPopoverCarousel
        items={[<div>One</div>, <div>Two</div>]}
        onActiveIndexChange={onActiveIndexChange}
      >
        <TeachingPopoverCarouselFooter>
          <TeachingPopoverCarouselFooterButton navType="previous" altText="Previous slide" />
          <TeachingPopoverCarouselFooterButton navType="next" altText="Next slide" />
        </TeachingPopoverCarouselFooter>
      </TeachingPopoverCarousel>
    ));
    const prev = getByLabelText("Previous slide");
    const next = getByLabelText("Next slide");
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(next).not.toHaveAttribute("aria-disabled");
    fireEvent.click(next);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
    expect(next).toHaveAttribute("aria-disabled", "true");
    expect(prev).not.toHaveAttribute("aria-disabled");
  });

  it("keeps a controlled carousel index until the parent updates it", () => {
    const onActiveIndexChange = vi.fn();
    const { container, getByLabelText } = renderWithFluent(() => (
      <TeachingPopoverCarousel
        items={[<div>One</div>, <div>Two</div>]}
        activeIndex={1}
        onActiveIndexChange={onActiveIndexChange}
      >
        <TeachingPopoverCarouselPageCount />
        <TeachingPopoverCarouselNav>
          <TeachingPopoverCarouselNavButton index={0} label="Dot 0" />
          <TeachingPopoverCarouselNavButton index={1} label="Dot 1" />
        </TeachingPopoverCarouselNav>
      </TeachingPopoverCarousel>
    ));
    const pageCount = container.querySelector(".sf-TeachingPopover__pageCount")!;
    expect(pageCount.textContent).toBe("2 / 2");
    expect(getByLabelText("Dot 1")).toHaveAttribute("aria-selected", "true");
    fireEvent.click(getByLabelText("Dot 0"));
    expect(onActiveIndexChange).toHaveBeenCalledWith(0);
    expect(pageCount.textContent).toBe("2 / 2");
  });

  it("disables carousel navigation when there are no items", () => {
    const { getByLabelText } = renderWithFluent(() => (
      <TeachingPopoverCarousel items={[]}>
        <TeachingPopoverCarouselFooter>
          <TeachingPopoverCarouselFooterButton navType="previous" altText="Empty prev" />
          <TeachingPopoverCarouselFooterButton navType="next" altText="Empty next" />
        </TeachingPopoverCarouselFooter>
      </TeachingPopoverCarousel>
    ));
    expect(getByLabelText("Empty prev")).toHaveAttribute("aria-disabled", "true");
    expect(getByLabelText("Empty next")).toHaveAttribute("aria-disabled", "true");
  });
});

describe("TeachingPopoverCarouselFooterButton", () => {
  it("renders a navigation button with direction icon and label", () => {
    const onClick = (vi as any).fn();
    const { container, getByLabelText } = renderWithFluent(() => (
      <TeachingPopoverCarouselFooter>
        <TeachingPopoverCarouselFooterButton navType="next" altText="Next slide" onClick={onClick} />
      </TeachingPopoverCarouselFooter>
    ));
    const btn = getByLabelText("Next slide");
    expect(btn.tagName).toBe("BUTTON");
    expect(container.querySelector(".sf-TeachingPopover__carouselFooterButton")).toBeTruthy();
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalled();
  });
});
