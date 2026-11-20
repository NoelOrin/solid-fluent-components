import { Show, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type AvatarSize =
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 48
  | 56
  | 64
  | 72
  | 96
  | 120
  | 128;

/** Named colors used by Fluent v9 when `color="colorful"` is resolved. */
export type AvatarNamedColor =
  | "dark-red"
  | "cranberry"
  | "red"
  | "pumpkin"
  | "peach"
  | "marigold"
  | "gold"
  | "brass"
  | "brown"
  | "forest"
  | "seafoam"
  | "dark-green"
  | "light-teal"
  | "teal"
  | "steel"
  | "blue"
  | "royal-blue"
  | "cornflower"
  | "navy"
  | "lavender"
  | "purple"
  | "grape"
  | "lilac"
  | "pink"
  | "magenta"
  | "plum"
  | "beige"
  | "mink"
  | "platinum"
  | "anchor";

export type AvatarColor = "brand" | "neutral" | "colorful" | AvatarNamedColor;
export type AvatarActive = "active" | "inactive" | "busy" | "out-of-office" | "unset";
export type AvatarActiveAppearance = "ring" | "shadow" | "ring-shadow";
export type AvatarBadgeSize =
  | "tiny"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large";

export type AvatarProps = {
  name?: string;
  image?: { src: string; alt?: string };
  size?: AvatarSize;
  /** @default "neutral" (Fluent v9 default) */
  color?: AvatarColor;
  shape?: "circular" | "square";
  icon?: JSX.Element;
  initials?: string;
  active?: AvatarActive;
  /** @default "ring" */
  activeAppearance?: AvatarActiveAppearance;
  /** Presence badge rendered at the bottom-right corner. */
  badge?: JSX.Element;
  /** Seed used to pick a deterministic color when `color="colorful"`. */
  idForColor?: string;
  class?: string;
  "aria-label"?: string;
};

const avatarColors: AvatarNamedColor[] = [
  "dark-red",
  "cranberry",
  "red",
  "pumpkin",
  "peach",
  "marigold",
  "gold",
  "brass",
  "brown",
  "forest",
  "seafoam",
  "dark-green",
  "light-teal",
  "teal",
  "steel",
  "blue",
  "royal-blue",
  "cornflower",
  "navy",
  "lavender",
  "purple",
  "grape",
  "lilac",
  "pink",
  "magenta",
  "plum",
  "beige",
  "mink",
  "platinum",
  "anchor",
];

function getHashCode(value: string): number {
  let hashCode = 0;
  for (let len = value.length - 1; len >= 0; len--) {
    const ch = value.charCodeAt(len);
    const shift = len % 8;
    hashCode ^= (ch << shift) + (ch >> (8 - shift));
  }
  return hashCode;
}

function getInitials(name?: string, firstInitialOnly = false): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  // Fluent v9: at size 16 only the first initial is shown.
  if (firstInitialOnly) return parts[0]!.slice(0, 1).toUpperCase();
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function getBadgeSize(size: AvatarSize): AvatarBadgeSize {
  if (size >= 96) return "extra-large";
  if (size >= 64) return "large";
  if (size >= 56) return "medium";
  if (size >= 40) return "small";
  if (size >= 28) return "extra-small";
  return "tiny";
}

export function Avatar(props: AvatarProps) {
  const [local] = splitProps(props, [
    "name",
    "image",
    "size",
    "color",
    "shape",
    "icon",
    "initials",
    "active",
    "activeAppearance",
    "badge",
    "idForColor",
    "class",
    "aria-label",
  ]);

  const size = () => local.size ?? 32;
  const shape = () => local.shape ?? "circular";
  const active = () => local.active ?? "unset";
  const activeAppearance = () => local.activeAppearance ?? "ring";
  const color = (): AvatarColor => {
    const requested = local.color ?? "neutral";
    if (requested !== "colorful") return requested;
    const hash = getHashCode(local.idForColor ?? local.name ?? "");
    const index = ((hash % avatarColors.length) + avatarColors.length) % avatarColors.length;
    return avatarColors[index]!;
  };
  const text = () => local.initials ?? getInitials(local.name, size() <= 16);
  const ariaLabel = () => {
    const base = local["aria-label"] ?? local.name;
    if (base && (active() === "active" || active() === "inactive")) {
      return `${base} ${active()}`;
    }
    return base;
  };
  const badgeSize = () => getBadgeSize(size());

  return (
    <span
      class={cx(
        "sf-Avatar",
        `sf-Avatar--${size()}`,
        shape() === "square" && "sf-Avatar--square",
        `sf-Avatar--${color()}`,
        active() !== "unset" && `sf-Avatar--${active()}`,
        (active() === "active" || active() === "inactive") &&
          `sf-Avatar--${activeAppearance()}`,
        local.class,
      )}
      role="img"
      aria-label={ariaLabel()}
      data-shape={shape()}
      data-color={color()}
      data-size={size()}
      data-active={active()}
      data-active-appearance={activeAppearance()}
      data-id-for-color={local.idForColor}
      data-badge-size={local.badge ? badgeSize() : undefined}
    >
      <Show
        when={local.image?.src}
        fallback={
          <Show
            when={local.icon}
            fallback={
              <Show when={text()}>
                <span class="sf-Avatar__initials">{text()}</span>
              </Show>
            }
          >
            <span class="sf-Avatar__icon" aria-hidden="true">
              {local.icon}
            </span>
          </Show>
        }
      >
        <img
          class="sf-Avatar__image"
          src={local.image!.src}
          alt={local.image?.alt ?? local.name ?? ""}
          aria-hidden="true"
        />
      </Show>
      <Show when={local.badge}>
        <span class="sf-Avatar__badge" data-size={badgeSize()}>
          {local.badge}
        </span>
      </Show>
    </span>
  );
}
