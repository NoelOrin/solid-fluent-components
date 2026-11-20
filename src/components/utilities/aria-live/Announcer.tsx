import { createContext, useContext, createSignal, type JSX } from "solid-js";
import { cx } from "../../../utils/index";

type AnnounceContextValue = {
  announce: (message: string, assertive?: boolean) => void;
};

const AnnounceContext = createContext<AnnounceContextValue>();

export function useAnnouncer(): AnnounceContextValue {
  return (
    useContext(AnnounceContext) ?? {
      announce: (message: string, assertive = false) => {
        if (typeof document !== "undefined") {
          // Fallback: briefly append a live region to the body for screen readers.
          const live = document.createElement("div");
          live.setAttribute("aria-live", assertive ? "assertive" : "polite");
          live.setAttribute("role", assertive ? "alert" : "status");
          live.style.position = "absolute";
          live.style.width = "1px";
          live.style.height = "1px";
          live.style.overflow = "hidden";
          live.textContent = message;
          document.body.appendChild(live);
          setTimeout(() => live.remove(), 1000);
        }
      },
    }
  );
}

export function AnnounceProvider(props: { children?: JSX.Element; class?: string }) {
  const [polite, setPolite] = createSignal("");
  const [assertive, setAssertive] = createSignal("");

  const value: AnnounceContextValue = {
    announce: (message: string, isAssertive = false) => {
      if (isAssertive) setAssertive(""); // reset to retrigger
      else setPolite("");
      queueMicrotask(() => (isAssertive ? setAssertive(message) : setPolite(message)));
    },
  };

  return (
    <AnnounceContext.Provider value={value}>
      {props.children}
      <div class={cx("sf-AriaLive", props.class)} aria-live="polite" aria-atomic="true">
        {polite()}
      </div>
      <div class={cx("sf-AriaLive", "sf-AriaLive--assertive", props.class)} aria-live="assertive" aria-atomic="true">
        {assertive()}
      </div>
    </AnnounceContext.Provider>
  );
}

export type AriaLiveAnnouncerProps = {
  class?: string;
  /** Text to announce. */
  announcement?: string;
  /** `alert` maps to an assertive live region, `status` to a polite one. */
  role?: "status" | "alert";
  assertive?: boolean;
};

export function AriaLiveAnnouncer(props: AriaLiveAnnouncerProps) {
  const role = () => props.role ?? "status";
  const assertive = () => props.assertive ?? role() === "alert";
  return (
    <div
      class={cx("sf-AriaLive", assertive() && "sf-AriaLive--assertive", props.class)}
      role={role()}
      aria-live={assertive() ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {props.announcement}
    </div>
  );
}
