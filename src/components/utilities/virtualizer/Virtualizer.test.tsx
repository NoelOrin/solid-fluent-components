import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Virtualizer, type VirtualizerHandle } from "./Virtualizer";
import { renderWithFluent } from "../../../test-utils/index";

describe("Virtualizer", () => {
  it("renders a virtualized list viewport", () => {
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={["a", "b", "c"]}
        itemSize={24}
        height={100}
        children={(item: string) => <div>{item}</div>}
      />
    ));
    expect(container.querySelector(".sf-Virtualizer, [data-virtualizer]")).toBeTruthy();
  });

  it("supports variable item sizes and stable keys", () => {
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={["a", "b", "c"]}
        itemSize={24}
        height={100}
        overscan={0}
        getItemSize={(_item, index) => (index === 0 ? 40 : 24)}
        itemKey={(item) => `key-${item}`}
      >
        {(item: string) => <div>{item}</div>}
      </Virtualizer>
    ));
    const spacer = container.querySelector<HTMLElement>(".sf-Virtualizer > div")!;
    expect(spacer.style.height).toBe("88px");
    const rows = container.querySelectorAll<HTMLElement>(".sf-Virtualizer__item");
    expect(rows[0]!.getAttribute("data-key")).toBe("key-a");
    expect(rows[0]!.style.height).toBe("40px");
    expect(rows[1]!.style.top).toBe("40px");
  });

  it("exposes onScroll and an imperative scrollTo handle", () => {
    const onScroll = vi.fn();
    let handle: VirtualizerHandle | undefined;
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={["a", "b", "c"]}
        itemSize={24}
        height={48}
        onScroll={onScroll}
        virtualizerRef={(api) => {
          handle = api;
        }}
      >
        {(item: string) => <div>{item}</div>}
      </Virtualizer>
    ));
    const viewport = container.querySelector<HTMLElement>(".sf-Virtualizer")!;
    expect(handle).toBeTruthy();

    handle!.scrollToIndex(2);
    expect(viewport.scrollTop).toBe(48);

    viewport.scrollTop = 30;
    fireEvent.scroll(viewport);
    expect(onScroll).toHaveBeenCalledWith(30);
    expect(handle!.getScrollTop()).toBe(30);
  });

  it("applies a controlled scrollTo offset", async () => {
    const [offset, setOffset] = createSignal(0);
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={["a", "b", "c"]}
        itemSize={24}
        height={48}
        scrollTo={offset()}
      >
        {(item: string) => <div>{item}</div>}
      </Virtualizer>
    ));
    const viewport = container.querySelector<HTMLElement>(".sf-Virtualizer")!;
    setOffset(36);
    await waitFor(() => expect(viewport.scrollTop).toBe(36));
  });

  it("resets the scroll offset when the item list shrinks", async () => {
    const [count, setCount] = createSignal(100);
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={Array.from({ length: count() }, (_, index) => index)}
        itemSize={24}
        height={48}
        overscan={0}
      >
        {(item: number) => <div>{item}</div>}
      </Virtualizer>
    ));
    const viewport = container.querySelector<HTMLElement>(".sf-Virtualizer")!;
    viewport.scrollTop = 500;
    fireEvent.scroll(viewport);
    expect(viewport.scrollTop).toBe(500);

    setCount(2);
    await waitFor(() => expect(viewport.scrollTop).toBe(0));
  });

  it("applies a custom class and renders an empty spacer for no items", () => {
    const { container } = renderWithFluent(() => (
      <Virtualizer class="my-virtualizer" items={[] as string[]} itemSize={24} height={100}>
        {(item: string) => <div>{item}</div>}
      </Virtualizer>
    ));
    const viewport = container.querySelector<HTMLElement>(".sf-Virtualizer")!;
    expect(viewport.classList.contains("my-virtualizer")).toBe(true);
    expect(viewport.style.height).toBe("100px");
    expect(container.querySelector<HTMLElement>(".sf-Virtualizer > div")!.style.height).toBe("0px");
    expect(container.querySelectorAll(".sf-Virtualizer__item").length).toBe(0);
  });

  it("clamps scrollToIndex into range and ignores negative offsets", () => {
    let handle: VirtualizerHandle | undefined;
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={["a", "b", "c"]}
        itemSize={24}
        height={48}
        virtualizerRef={(api) => {
          handle = api;
        }}
      >
        {(item: string) => <div>{item}</div>}
      </Virtualizer>
    ));
    const viewport = container.querySelector<HTMLElement>(".sf-Virtualizer")!;

    handle!.scrollToIndex(-5);
    expect(viewport.scrollTop).toBe(0);
    handle!.scrollToIndex(99);
    expect(viewport.scrollTop).toBe(48);
    handle!.scrollTo(-10);
    expect(viewport.scrollTop).toBe(0);
    expect(handle!.getScrollTop()).toBe(0);
  });

  it("passes the viewport element to scrollRef and renders only the visible window", async () => {
    let scrollEl: HTMLDivElement | undefined;
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={[0, 1, 2, 3, 4, 5]}
        itemSize={24}
        height={48}
        overscan={0}
        scrollRef={(el) => {
          scrollEl = el;
        }}
      >
        {(item: number) => <div>{item}</div>}
      </Virtualizer>
    ));
    const viewport = container.querySelector<HTMLElement>(".sf-Virtualizer")!;
    expect(scrollEl).toBe(viewport);

    const keys = () =>
      Array.from(container.querySelectorAll<HTMLElement>(".sf-Virtualizer__item")).map((el) =>
        el.getAttribute("data-key"),
      );
    expect(keys()).toEqual(["0", "1", "2"]);

    viewport.scrollTop = 48;
    fireEvent.scroll(viewport);
    await waitFor(() => expect(keys()).toEqual(["2", "3", "4"]));
  });

  it("reuses the same row DOM nodes while scrolling the visible window", async () => {
    const { container } = renderWithFluent(() => (
      <Virtualizer items={[0, 1, 2, 3, 4, 5]} itemSize={24} height={48} overscan={0}>
        {(item: number) => <div>{item}</div>}
      </Virtualizer>
    ));
    const viewport = container.querySelector<HTMLElement>(".sf-Virtualizer")!;
    const rows = () =>
      Array.from(container.querySelectorAll<HTMLElement>(".sf-Virtualizer__item"));
    const before = rows();
    expect(before.map((row) => row.getAttribute("data-key"))).toEqual(["0", "1", "2"]);

    viewport.scrollTop = 24;
    fireEvent.scroll(viewport);
    await waitFor(() =>
      expect(rows().map((row) => row.getAttribute("data-key"))).toEqual(["1", "2", "3"]),
    );
    expect(rows()[0]).toBe(before[0]);
    expect(rows()[1]).toBe(before[1]);
    expect(rows()[2]).toBe(before[2]);
  });

  it("passes the item and its absolute index to children", () => {
    const { container } = renderWithFluent(() => (
      <Virtualizer
        items={["a", "b", "c"]}
        itemSize={24}
        height={48}
        overscan={0}
      >
        {(item: string, index: number) => (
          <div data-label={item} data-index={index} />
        )}
      </Virtualizer>
    ));
    const first = container.querySelector<HTMLElement>(".sf-Virtualizer__item > div")!;
    expect(first.getAttribute("data-label")).toBe("a");
    expect(first.getAttribute("data-index")).toBe("0");
  });
});
