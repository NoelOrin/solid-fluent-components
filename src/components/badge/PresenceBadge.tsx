import { Show, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type PresenceBadgeStatus =
  | "available"
  | "away"
  | "busy"
  | "do-not-disturb"
  | "offline"
  | "out-of-office"
  | "unknown"
  | "blocked";

export type PresenceBadgeSize =
  | "tiny"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large";

export type PresenceBadgeProps = {
  status?: PresenceBadgeStatus;
  size?: PresenceBadgeSize;
  /** Overlay the "out of office" treatment on any status. */
  outOfOffice?: boolean;
  class?: string;
};

const statusText: Record<PresenceBadgeStatus, string> = {
  available: "available",
  away: "away",
  busy: "busy",
  "do-not-disturb": "do not disturb",
  offline: "offline",
  "out-of-office": "out of office",
  unknown: "unknown",
  blocked: "blocked",
};

/** Small inline SVG glyphs; `currentColor` lets the status color CSS drive them. */
function presenceIcon(status: PresenceBadgeStatus, outOfOffice: boolean): JSX.Element {
  const outlined = outOfOffice && status !== "out-of-office";
  let base: JSX.Element;

  switch (status) {
    case "away":
      base = (
        <>
          <circle cx="6" cy="6" r="5" fill={outlined ? "none" : "currentColor"} stroke={outlined ? "currentColor" : undefined} stroke-width={outlined ? "1.5" : undefined} />
          <path d="M6 1 A5 5 0 0 1 11 6 L6 6 Z" fill="var(--sf-colorNeutralBackground1)" />
        </>
      );
      break;
    case "do-not-disturb":
      base = (
        <>
          <circle cx="6" cy="6" r="5" fill={outlined ? "none" : "currentColor"} stroke={outlined ? "currentColor" : undefined} stroke-width={outlined ? "1.5" : undefined} />
          <rect x="2.5" y="5.2" width="7" height="1.6" rx="0.8" fill="var(--sf-colorNeutralBackground1)" />
        </>
      );
      break;
    case "offline":
      base = <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" stroke-width="1.5" />;
      break;
    case "out-of-office":
      base = (
        <>
          <circle cx="6" cy="6" r="5" fill="currentColor" />
          <path d="M3.2 7 7.4 2.8 9 4.4 4.8 8.6 3.2 8.6 Z" fill="var(--sf-colorNeutralBackground1)" />
        </>
      );
      break;
    case "unknown":
      base = (
        <>
          <circle cx="6" cy="6" r="5" fill={outlined ? "none" : "currentColor"} stroke={outlined ? "currentColor" : undefined} stroke-width={outlined ? "1.5" : undefined} />
          <text x="6" y="8.4" text-anchor="middle" font-size="7" font-weight="700" fill={outlined ? "currentColor" : "var(--sf-colorNeutralBackground1)"}>
            ?
          </text>
        </>
      );
      break;
    case "blocked":
      base = (
        <>
          <circle cx="6" cy="6" r="5" fill="currentColor" />
          <path d="M3.6 3.6 8.4 8.4 M8.4 3.6 3.6 8.4" stroke="var(--sf-colorNeutralBackground1)" stroke-width="1.4" stroke-linecap="round" />
        </>
      );
      break;
    case "busy":
    case "available":
    default:
      base = (
        <circle
          cx="6"
          cy="6"
          r={outlined ? "4.25" : "5"}
          fill={outlined ? "none" : "currentColor"}
          stroke={outlined ? "currentColor" : undefined}
          stroke-width={outlined ? "1.5" : undefined}
        />
      );
      break;
  }

  return (
    <>
      <svg viewBox="0 0 12 12" aria-hidden="true" class="sf-PresenceBadge__icon">
        {base}
      </svg>
      <Show when={outOfOffice && status !== "out-of-office"}>
        <svg viewBox="0 0 12 12" aria-hidden="true" class="sf-PresenceBadge__oof">
          <path d="M7 0h5v5h-1.6V2.5L8 4.9 6.9 3.8l2.4-2.4H7z" fill="currentColor" />
        </svg>
      </Show>
    </>
  );
}

export function PresenceBadge(props: PresenceBadgeProps) {
  const [local] = splitProps(props, ["status", "size", "outOfOffice", "class"]);
  const status = () => local.status ?? "available";
  const size = () => local.size ?? "medium";
  const label = () =>
    statusText[status()] +
    (local.outOfOffice && status() !== "out-of-office"
      ? ` ${statusText["out-of-office"]}`
      : "");

  return (
    <span
      class={cx(
        "sf-PresenceBadge",
        `sf-PresenceBadge--${status()}`,
        `sf-PresenceBadge--${size()}`,
        local.outOfOffice && "sf-PresenceBadge--out-of-office",
        local.class,
      )}
      role="img"
      aria-label={label()}
      data-status={status()}
      data-size={size()}
      data-out-of-office={local.outOfOffice ? "true" : undefined}
    >
      {presenceIcon(status(), !!local.outOfOffice)}
    </span>
  );
}
