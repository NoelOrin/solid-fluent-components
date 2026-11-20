import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import {
  Carousel,
  CarouselAutoplayButton,
  CarouselButton,
  CarouselCard,
  CarouselNavButton,
  CarouselViewport,
} from "./Carousel";
import { renderWithFluent } from "../../test-utils/index";

describe("Carousel", () => {
  it("renders viewport, cards and nav buttons", () => {
    const { container, getAllByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>One</div>, <div>Two</div>, <div>Three</div>]}
      />
    ));
    expect(container.querySelector(".sf-Carousel")).toBeTruthy();
    expect(container.querySelector(".sf-Carousel__viewport")).toBeTruthy();
    expect(container.querySelectorAll(".sf-Carousel__slide").length).toBe(3);
    expect(getAllByRole("tab").length).toBe(3);
  });

  it("CarouselButton exposes direction label", () => {
    const { getByRole } = renderWithFluent(() => <CarouselButton direction="next" />);
    expect(getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("navigates when a nav button is clicked", () => {
    const onActiveIndexChange = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>One</div>, <div>Two</div>]}
        defaultActiveIndex={0}
        onActiveIndexChange={onActiveIndexChange}
      />
    ));
    getAllByRole("tab")[1]!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it("moves the track by -index * 100% / groupSize", () => {
    const { container, getAllByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>1</div>, <div>2</div>, <div>3</div>, <div>4</div>]}
        defaultActiveIndex={1}
        groupSize={2}
      />
    ));
    const track = container.querySelector<HTMLElement>(".sf-Carousel__track")!;
    expect(track.style.transform).toBe("translateX(-50%)");
    expect(track.style.getPropertyValue("--sf-carousel-group-size")).toBe("2");
    getAllByRole("tab")[2]!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(track.style.transform).toBe("translateX(-100%)");
  });

  it("wraps to the first slide when advancing past the last one", () => {
    const onActiveIndexChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>One</div>, <div>Two</div>]}
        defaultActiveIndex={1}
        onActiveIndexChange={onActiveIndexChange}
      />
    ));
    getByRole("button", { name: "Next" }).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(onActiveIndexChange).toHaveBeenCalledWith(0);
  });

  it("nav tabs expose aria-controls and support arrow keys", () => {
    const onActiveIndexChange = vi.fn();
    const { container, getAllByRole } = renderWithFluent(() => (
      <Carousel items={[<div>One</div>, <div>Two</div>]} onActiveIndexChange={onActiveIndexChange} />
    ));
    const tabs = getAllByRole("tab");
    expect(tabs[0]!.getAttribute("aria-controls")).toBe("sf-carousel-slide-0");
    expect(container.querySelector("#sf-carousel-slide-1")).toBeTruthy();
    tabs[0]!.focus();
    tabs[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(document.activeElement).toBe(tabs[1]);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it("autoplay respects paused and clears the previous timer", async () => {
    vi.useFakeTimers();
    try {
      const setIndex = vi.fn();
      const [paused, setPaused] = createSignal(false);
      renderWithFluent(() => (
        <CarouselAutoplayButton
          index={() => 0}
          setIndex={setIndex}
          paused={paused()}
          interval={1000}
        />
      ));
      vi.advanceTimersByTime(3000);
      expect(setIndex).toHaveBeenCalledTimes(3);
      setPaused(true);
      await Promise.resolve();
      vi.advanceTimersByTime(3000);
      expect(setIndex).toHaveBeenCalledTimes(3);
      setPaused(false);
      await Promise.resolve();
      vi.advanceTimersByTime(1000);
      expect(setIndex).toHaveBeenCalledTimes(4);
    } finally {
      vi.useRealTimers();
    }
  });


  it("standalone sub-parts render", () => {
    const { container } = renderWithFluent(() => (
      <CarouselViewport>
        <CarouselCard>x</CarouselCard>
        <CarouselNavButton index={0} label="1" />
      </CarouselViewport>
    ));
    expect(container.querySelector(".sf-Carousel__slide")).toBeTruthy();
    expect(container.querySelector(".sf-Carousel__dot")).toBeTruthy();
  });

  it("wraps to the last slide when going previous from the first one", () => {
    const onActiveIndexChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>One</div>, <div>Two</div>]}
        defaultActiveIndex={0}
        onActiveIndexChange={onActiveIndexChange}
      />
    ));
    fireEvent.click(getByRole("button", { name: "Previous" }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it("clamps navigation at the last slide when circular is false", () => {
    const onActiveIndexChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>One</div>, <div>Two</div>]}
        defaultActiveIndex={1}
        circular={false}
        onActiveIndexChange={onActiveIndexChange}
      />
    ));
    fireEvent.click(getByRole("button", { name: "Next" }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it("keeps the active dot for a controlled activeIndex while reporting the request", () => {
    const onActiveIndexChange = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>One</div>, <div>Two</div>]}
        activeIndex={0}
        onActiveIndexChange={onActiveIndexChange}
      />
    ));
    const tabs = getAllByRole("tab") as HTMLElement[];
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.click(tabs[1]!);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).not.toHaveAttribute("aria-selected");
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it("renders no slides or nav tabs for an empty item list", () => {
    const { container, queryAllByRole } = renderWithFluent(() => <Carousel items={[]} />);
    expect(container.querySelectorAll(".sf-Carousel__slide").length).toBe(0);
    expect(queryAllByRole("tab").length).toBe(0);
  });

  it("aligns the track and applies padding for center alignment", () => {
    const { container } = renderWithFluent(() => (
      <Carousel items={[<div>1</div>, <div>2</div>]} align="center" />
    ));
    expect(container.querySelector(".sf-Carousel")).toHaveAttribute("data-align", "center");
    const track = container.querySelector<HTMLElement>(".sf-Carousel__track")!;
    expect(track).toHaveAttribute("data-align", "center");
    expect(track.style.paddingLeft).toBe("20%");
  });

  it("Home and End move focus and activate the first and last nav tabs", () => {
    const onActiveIndexChange = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <Carousel
        items={[<div>1</div>, <div>2</div>, <div>3</div>]}
        defaultActiveIndex={0}
        onActiveIndexChange={onActiveIndexChange}
      />
    ));
    const tabs = getAllByRole("tab") as HTMLElement[];
    tabs[0]!.focus();
    fireEvent.keyDown(tabs[0]!, { key: "End" });
    expect(document.activeElement).toBe(tabs[2]);
    expect(onActiveIndexChange).toHaveBeenLastCalledWith(2);

    fireEvent.keyDown(tabs[2]!, { key: "Home" });
    expect(document.activeElement).toBe(tabs[0]);
    expect(onActiveIndexChange).toHaveBeenLastCalledWith(0);
  });

  it("advances the slide when the viewport is swiped left", () => {
    const onActiveIndexChange = vi.fn();
    const { container } = renderWithFluent(() => (
      <Carousel
        items={[<div>1</div>, <div>2</div>]}
        defaultActiveIndex={0}
        onActiveIndexChange={onActiveIndexChange}
      />
    ));
    const viewport = container.querySelector(".sf-Carousel__viewport")!;
    fireEvent(
      viewport,
      new MouseEvent("pointerdown", { bubbles: true, clientX: 100 }),
    );
    fireEvent(viewport, new MouseEvent("pointerup", { bubbles: true, clientX: 40 }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it("toggles the autoplay button label between Pause and Play", () => {
    const { getByRole } = renderWithFluent(() => (
      <CarouselAutoplayButton
        index={() => 0}
        setIndex={vi.fn()}
        toggleable
        interval={1000}
      >
        <button>Child</button>
      </CarouselAutoplayButton>
    ));
    const toggle = getByRole("button", { name: "Pause" });
    fireEvent.click(toggle);
    expect(getByRole("button", { name: "Play" })).toBeTruthy();
  });
});

