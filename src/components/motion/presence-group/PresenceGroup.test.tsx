import { describe, expect, it, vi } from "vitest";
import { waitFor } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import {
  PresenceComponent,
  PresenceGroup,
  PresenceGroupPopover,
  presenceEnterMotion,
  presenceExitMotion,
  ShowWithPresence,
} from "./PresenceGroup";
import { renderWithFluent } from "../../../test-utils/index";

describe("PresenceGroup", () => {
  it("renders group and presence components", () => {
    const { container } = renderWithFluent(() => (
      <PresenceGroup>
        <PresenceComponent status="available" />
        <PresenceComponent status="busy" />
      </PresenceGroup>
    ));
    expect(container.querySelector(".sf-PresenceGroup")).toBeTruthy();
    expect(container.querySelectorAll(".sf-PresenceBadge").length).toBe(2);
  });

  it("applies enter/exit motions and delays unmount", async () => {
    const onExited = vi.fn();
    const [show, setShow] = createSignal(true);
    const { container } = renderWithFluent(() => (
      <ShowWithPresence when={show()} onExited={onExited}>
        content
      </ShowWithPresence>
    ));
    expect(container.querySelector(".sf-Presence")).toBeTruthy();
    await waitFor(() =>
      expect(container.querySelector(".sf-Presence--entered")).toBeTruthy(),
    );

    setShow(false);
    await waitFor(() => expect(container.querySelector(".sf-Presence--exit")).toBeTruthy());
    expect(container.querySelector(".sf-Presence")).toBeTruthy();
    await waitFor(() => expect(container.querySelector(".sf-Presence")).toBeNull());
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it("re-enters when when toggles back during exit", async () => {
    const [show, setShow] = createSignal(true);
    const { container } = renderWithFluent(() => (
      <ShowWithPresence
        when={show()}
        enterMotion={() => ({ duration: 5 })}
        exitMotion={() => ({ duration: 200 })}
      >
        content
      </ShowWithPresence>
    ));
    await waitFor(() =>
      expect(container.querySelector(".sf-Presence--entered")).toBeTruthy(),
    );
    setShow(false);
    await waitFor(() => expect(container.querySelector(".sf-Presence--exit")).toBeTruthy());
    setShow(true);
    await waitFor(() =>
      expect(container.querySelector(".sf-Presence--entered")).toBeTruthy(),
    );
    expect(container.querySelector(".sf-Presence")).toBeTruthy();
  });

  it("provides enter and exit keyframes", () => {
    const element = document.createElement("div");
    expect(presenceEnterMotion({ element }).keyframes).toEqual([
      { opacity: 0 },
      { opacity: 1 },
    ]);
    expect(presenceExitMotion({ element }).keyframes).toEqual([
      { opacity: 1 },
      { opacity: 0 },
    ]);
    expect(presenceEnterMotion({ element }).duration).toBe(200);
    expect(presenceExitMotion({ element }).duration).toBe(150);
    expect(presenceExitMotion({ element }).easing).toBe("ease");
  });

  it("renders nothing and never calls onExited when initially hidden", () => {
    const onExited = vi.fn();
    const { container } = renderWithFluent(() => (
      <ShowWithPresence when={false} onExited={onExited}>
        hidden
      </ShowWithPresence>
    ));
    expect(container.querySelector(".sf-Presence")).toBeNull();
    expect(onExited).not.toHaveBeenCalled();
  });

  it("forwards class names and badge variants in the group and popover", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <>
        <PresenceGroup class="my-group">
          <PresenceComponent status="busy" size="large" outOfOffice />
        </PresenceGroup>
        <PresenceGroupPopover
          class="my-popover"
          items={[{ status: "away" }, { status: "offline", size: "small" }]}
        />
      </>
    ));
    expect(container.querySelector(".sf-PresenceGroup")).toHaveClass("my-group");
    expect(getByRole("group", { name: "Presence" })).toBeInTheDocument();
    const badge = getByRole("img", { name: "busy out of office" });
    expect(badge).toHaveClass(
      "sf-PresenceBadge--busy",
      "sf-PresenceBadge--large",
      "sf-PresenceBadge--out-of-office",
    );
    expect(container.querySelector(".sf-PresenceGroup__popover")).toHaveClass("my-popover");
    expect(container.querySelectorAll(".sf-PresenceBadge")).toHaveLength(3);
  });

  it("keeps the class prop on the presence wrapper through phase changes", async () => {
    const [show, setShow] = createSignal(true);
    const { container } = renderWithFluent(() => (
      <ShowWithPresence
        when={show()}
        class="custom-presence"
        enterMotion={() => ({ duration: 5 })}
        exitMotion={() => ({ duration: 5 })}
      >
        body
      </ShowWithPresence>
    ));
    expect(container.querySelector(".sf-Presence")).toHaveClass("custom-presence");
    await waitFor(() =>
      expect(container.querySelector(".sf-Presence")).toHaveClass("sf-Presence--entered"),
    );
    setShow(false);
    await waitFor(() =>
      expect(container.querySelector(".sf-Presence")).toHaveClass("sf-Presence--exit"),
    );
    expect(container.querySelector(".sf-Presence")).toHaveClass("custom-presence");
  });

  it("does not call onExited when a pending exit is cancelled by re-entering", async () => {
    const onExited = vi.fn();
    const [show, setShow] = createSignal(true);
    renderWithFluent(() => (
      <ShowWithPresence
        when={show()}
        onExited={onExited}
        enterMotion={() => ({ duration: 5 })}
        exitMotion={() => ({ duration: 200 })}
      >
        content
      </ShowWithPresence>
    ));
    await waitFor(() => expect(document.querySelector(".sf-Presence--entered")).toBeTruthy());
    setShow(false);
    await waitFor(() => expect(document.querySelector(".sf-Presence--exit")).toBeTruthy());
    setShow(true);
    await waitFor(() => expect(document.querySelector(".sf-Presence--entered")).toBeTruthy());
    expect(onExited).not.toHaveBeenCalled();
  });
});
