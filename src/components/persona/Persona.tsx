import { Show, type JSX } from "solid-js";
import { cx } from "../../utils/index";
import { Avatar, type AvatarProps, type AvatarSize } from "../avatar/Avatar";
import {
  PresenceBadge,
  type PresenceBadgeSize,
  type PresenceBadgeStatus,
} from "../badge/PresenceBadge";

export type PersonaSize =
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large"
  | "huge";

export type PersonaAvatarConfig = {
  image?: { src: string; alt?: string };
  initials?: string;
  icon?: JSX.Element;
  size?: AvatarSize;
  name?: string;
  color?: AvatarProps["color"];
  shape?: AvatarProps["shape"];
};

export type PersonaProps = {
  name?: string;
  /** Overrides `name` for the first line of text. */
  primaryText?: string;
  secondaryText?: string;
  tertiaryText?: string;
  quaternaryText?: string;
  presence?: PresenceBadgeStatus;
  /** Render only the presence badge (no avatar or text). */
  presenceOnly?: boolean;
  /** Avatar configuration or a custom avatar node (slot). */
  avatar?: PersonaAvatarConfig | JSX.Element;
  size?: PersonaSize;
  textAlignment?: "start" | "center";
  /** @default "after" */
  textPosition?: "after" | "below";
  class?: string;
  children?: JSX.Element;
};

const sizeToAvatar: Record<PersonaSize, AvatarSize> = {
  "extra-small": 20,
  small: 24,
  medium: 32,
  large: 40,
  "extra-large": 48,
  huge: 56,
};

function getPresenceSize(avatarSize: AvatarSize): PresenceBadgeSize {
  if (avatarSize >= 96) return "extra-large";
  if (avatarSize >= 64) return "large";
  if (avatarSize >= 56) return "medium";
  if (avatarSize >= 40) return "small";
  if (avatarSize >= 28) return "extra-small";
  return "tiny";
}

function isAvatarNode(value: PersonaProps["avatar"]): value is JSX.Element {
  if (typeof value === "string" || typeof value === "number" || typeof value === "function") {
    return true;
  }
  return !!value && typeof value === "object" && "nodeType" in (value as object);
}

export function Persona(props: PersonaProps) {
  const size = () => props.size ?? "medium";
  const avatarSize = () => {
    const config = !isAvatarNode(props.avatar) ? (props.avatar as PersonaAvatarConfig | undefined) : undefined;
    return config?.size ?? sizeToAvatar[size()];
  };
  const primary = () => props.primaryText ?? props.name;
  const textPosition = () => props.textPosition ?? "after";

  const presence = () => (
    <Show when={props.presence}>
      {(status) => (
        <span class="sf-Persona__presence">
          <PresenceBadge status={status()} size={getPresenceSize(avatarSize())} />
        </span>
      )}
    </Show>
  );

  const avatar = () => {
    if (isAvatarNode(props.avatar)) {
      return <>{props.avatar as JSX.Element}</>;
    }
    const config = (props.avatar ?? {}) as PersonaAvatarConfig;
    return (
      <Avatar
        name={config.name ?? props.name}
        image={config.image}
        initials={config.initials}
        icon={config.icon}
        color={config.color}
        shape={config.shape}
        size={avatarSize()}
      />
    );
  };

  return (
    <div
      class={cx(
        "sf-Persona",
        textPosition() === "below" && "sf-Persona--below",
        props.presenceOnly && "sf-Persona--presence-only",
        props.class,
      )}
      data-size={size()}
      data-presence={props.presence}
      data-text-position={textPosition()}
    >
      <div class="sf-Persona__avatar">
        <Show when={!props.presenceOnly} fallback={presence()}>
          {avatar()}
          {presence()}
        </Show>
      </div>
      <Show when={!props.presenceOnly}>
        <div
          class="sf-Persona__text"
          style={{ "text-align": props.textAlignment ?? "start" }}
        >
          <Show when={primary()}>
            <span class="sf-Persona__primary">{primary()}</span>
          </Show>
          <Show when={props.secondaryText}>
            <span class="sf-Persona__secondary">{props.secondaryText}</span>
          </Show>
          <Show when={props.tertiaryText}>
            <span class="sf-Persona__tertiary">{props.tertiaryText}</span>
          </Show>
          <Show when={props.quaternaryText}>
            <span class="sf-Persona__quaternary">{props.quaternaryText}</span>
          </Show>
          {props.children}
        </div>
      </Show>
    </div>
  );
}
