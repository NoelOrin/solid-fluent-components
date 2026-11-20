import { describe, expect, it } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import { AnnounceProvider, AriaLiveAnnouncer, useAnnouncer } from "./Announcer";
import { renderWithFluent } from "../../../test-utils/index";

describe("Announcer", () => {
  it("renders polite and assertive live regions", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <AnnounceProvider>
        <AriaLiveAnnouncer />
      </AnnounceProvider>
    ));
    expect(container.querySelectorAll('[aria-live="polite"]').length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-live="assertive"]')).toBeTruthy();
    expect(getByRole("status")).toBeTruthy();
  });

  it("renders an announcement with status/alert roles", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <>
        <AriaLiveAnnouncer announcement="Saved" />
        <AriaLiveAnnouncer role="alert" announcement="Failed" />
      </>
    ));
    expect(getByRole("status")).toHaveTextContent("Saved");
    expect(getByRole("alert")).toHaveTextContent("Failed");
    expect(getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    expect(container.querySelectorAll(".sf-AriaLive--assertive").length).toBe(1);
  });

  it("supports assertive messages in the useAnnouncer fallback", () => {
    let announce!: (message: string, assertive?: boolean) => void;
    function Consumer() {
      const announcer = useAnnouncer();
      announce = announcer.announce;
      return null;
    }
    renderWithFluent(() => <Consumer />);

    announce("Be careful", true);
    const region = document.querySelector('[aria-live="assertive"][role="alert"]')!;
    expect(region).toHaveTextContent("Be careful");
    region.remove();
  });

  it("publishes polite messages into the provider's polite region on click", async () => {
    const { container, getByRole } = renderWithFluent(() => (
      <AnnounceProvider>
        {(() => {
          const { announce } = useAnnouncer();
          return <button onClick={() => announce("Saved")}>Save</button>;
        })()}
      </AnnounceProvider>
    ));
    const polite = container.querySelector('[aria-live="polite"]')!;
    const assertive = container.querySelector('[aria-live="assertive"]')!;
    expect(polite).toHaveTextContent("");

    fireEvent.click(getByRole("button", { name: "Save" }));
    await waitFor(() => expect(polite).toHaveTextContent("Saved"));
    expect(assertive).toHaveTextContent("");
  });

  it("publishes assertive messages into the provider's assertive region", async () => {
    const { container, getByRole } = renderWithFluent(() => (
      <AnnounceProvider>
        {(() => {
          const { announce } = useAnnouncer();
          return <button onClick={() => announce("Failed", true)}>Fail</button>;
        })()}
      </AnnounceProvider>
    ));
    const polite = container.querySelector('[aria-live="polite"]')!;
    const assertive = container.querySelector('[aria-live="assertive"]')!;

    fireEvent.click(getByRole("button", { name: "Fail" }));
    await waitFor(() => expect(assertive).toHaveTextContent("Failed"));
    expect(polite).toHaveTextContent("");
  });

  it("falls back to a polite status region when no provider is present", () => {
    let announce!: (message: string, assertive?: boolean) => void;
    function Consumer() {
      announce = useAnnouncer().announce;
      return null;
    }
    renderWithFluent(() => <Consumer />);

    announce("Saved politely");
    const region = document.querySelector('[aria-live="polite"][role="status"]')!;
    expect(region).toHaveTextContent("Saved politely");
    region.remove();
  });

  it("lets the assertive prop control aria-live independently of role", () => {
    const { getByRole } = renderWithFluent(() => (
      <AriaLiveAnnouncer announcement="注意" assertive class="my-live" />
    ));
    const region = getByRole("status");
    expect(region).toHaveTextContent("注意");
    expect(region).toHaveAttribute("aria-live", "assertive");
    expect(region).toHaveAttribute("aria-atomic", "true");
    expect(region).toHaveClass("sf-AriaLive", "sf-AriaLive--assertive", "my-live");
  });
});
