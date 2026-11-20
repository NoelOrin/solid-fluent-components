import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { AvatarGroup } from "../avatar-group/AvatarGroup";
import { PresenceBadge } from "../badge/PresenceBadge";
import { Image } from "../image/Image";
import { Persona } from "../persona/Persona";
import { Avatar } from "../avatar/Avatar";
import { Body1, Title3 } from "../text/Text";

const meta = {
  title: "Display/More",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AvatarGroups: Story = {
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
      <AvatarGroup
        layout="stack"
        size={40}
        items={[
          { name: "Ada Lovelace" },
          { name: "Grace Hopper" },
          { name: "Alan Turing" },
          { name: "Katherine Johnson" },
          { name: "Tim Berners-Lee" },
        ]}
      />
      <div style={{ display: "flex", gap: "12px", "align-items": "center" }}>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <Avatar name="Online User" size={48} />
          <span style={{ position: "absolute", right: 0, bottom: 0 }}>
            <PresenceBadge status="available" size="large" />
          </span>
        </div>
        <PresenceBadge status="away" size="large" />
        <PresenceBadge status="busy" size="large" />
        <PresenceBadge status="do-not-disturb" size="large" />
        <PresenceBadge status="offline" size="large" />
      </div>
      <Persona name="Presence Demo" presence="available" secondaryText="available" size="large" />
    </div>
  ),
};

export const Personas: Story = {
  name: "Persona presence & slots",
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
      <Persona
        name="Ada Lovelace"
        primaryText="Ada Lovelace"
        secondaryText="Mathematician"
        tertiaryText="Royal Society"
        quaternaryText="London"
        presence="available"
        size="large"
      />
      <Persona name="Away User" presence="away" textPosition="below" size="medium" />
      <Persona name="OOF User" presence="busy" textPosition="after" size="medium" />
      <Persona presence="do-not-disturb" presenceOnly size="large" />
      <Persona name="Custom Avatar" avatar={<Avatar name="CA" size={48} color="colorful" idForColor="ca" />} />
    </div>
  ),
};

export const Images: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", "align-items": "flex-start", "flex-wrap": "wrap" }}>
      <div>
        <Title3>Rounded</Title3>
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=80"
          alt="landscape"
          width={160}
          height={100}
          shape="rounded"
          bordered
        />
      </div>
      <div>
        <Title3>Circular</Title3>
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=80"
          alt="landscape circular"
          width={96}
          height={96}
          shape="circular"
          fit="cover"
          shadow
        />
      </div>
      <div>
        <Title3>Fit: none</Title3>
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=80"
          alt="landscape none"
          width={160}
          height={100}
          fit="none"
        />
      </div>
      <Body1>支持 shape / fit（none / default / center / contain / cover）/ bordered / shadow。</Body1>
    </div>
  ),
};
