import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import {
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  partitionAvatarGroupItems,
} from "../avatar-group/AvatarGroup";
import { type AvatarProps } from "../avatar/Avatar";

const meta = {
  title: "Display/AvatarGroup",
  tags: ["autodocs"],
  component: AvatarGroup,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const people: AvatarProps[] = [
  { name: "Ada Lovelace", color: "brand" },
  { name: "Alan Turing", color: "neutral" },
  { name: "Grace Hopper", color: "colorful" },
  { name: "Linus Torvalds", color: "brand" },
  { name: "Margaret Hamilton", color: "neutral" },
];

export const Default: Story = {
  name: "AvatarGroup",
  render: () => (
    <div style={{ width: "240px" }}>
      <AvatarGroup items={people} maxInlineItems={3} />
    </div>
  ),
};

export const Spread: Story = {
  name: "Layouts",
  render: () => (
    <div style={{ display: "flex", gap: "32px" }}>
      <AvatarGroup items={people} layout="stack" maxInlineItems={3} />
      <AvatarGroup items={people} layout="pie" maxInlineItems={3} />
      <AvatarGroup items={people} layout="spread" maxInlineItems={3} />
    </div>
  ),
};

export const OverflowPopover: Story = {
  name: "Overflow popover",
  render: () => (
    <div style={{ width: "240px" }}>
      <AvatarGroup
        items={people}
        maxInlineItems={3}
        layout="spread"
        overflowContent={
          <div style={{ display: "flex", "flex-direction": "column", gap: "4px", padding: "8px" }}>
            {people.slice(3).map((person) => (
              <div>{person.name}</div>
            ))}
          </div>
        }
      />
    </div>
  ),
};

export const Partition: Story = {
  name: "partitionAvatarGroupItems",
  render: () => {
    const p = partitionAvatarGroupItems({ items: people, maxInlineItems: 3 });
    return (
      <div style={{ "font-size": "12px" }}>
        inline: {p.inlineItems.length} / overflow: {p.overflowItems.length}
      </div>
    );
  },
};

export const Manual: Story = {
  name: "Manual items",
  render: () => (
    <AvatarGroup>
      <AvatarGroupItem name="A" color="brand" />
      <AvatarGroupItem name="B" color="neutral" />
      <AvatarGroupPopover>+3</AvatarGroupPopover>
    </AvatarGroup>
  ),
};
