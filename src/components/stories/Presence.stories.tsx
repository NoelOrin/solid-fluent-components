import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { PresenceBadge, type PresenceBadgeStatus } from "../badge/PresenceBadge";
import { Persona } from "../persona/Persona";
import { Avatar } from "../avatar/Avatar";
import { Body1, Title3 } from "../text/Text";

const meta = {
  title: "Display/Presence",
  component: PresenceBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
在线状态徽标与 Persona 中的 presence 组合。

- \`status\`：available / away / busy / do-not-disturb / offline / out-of-office / unknown / blocked
- \`outOfOffice\`：与任意 status 组合，aria-label 会追加 “out of office”
- 图标为内联 SVG，颜色由 \`currentColor\` 驱动
`,
      },
    },
  },
} satisfies Meta<typeof PresenceBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

const statuses: PresenceBadgeStatus[] = [
  "available",
  "away",
  "busy",
  "do-not-disturb",
  "offline",
  "out-of-office",
  "unknown",
  "blocked",
];

export const Statuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", "align-items": "center", "flex-wrap": "wrap" }}>
      {statuses.map((status) => (
        <div style={{ display: "flex", gap: "4px", "align-items": "center" }}>
          <PresenceBadge status={status} size="large" />
          <Body1>{status}</Body1>
        </div>
      ))}
    </div>
  ),
};

export const OutOfOfficeCombinations: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", "align-items": "center", "flex-wrap": "wrap" }}>
      {statuses.slice(0, 5).map((status) => (
        <div style={{ display: "flex", gap: "4px", "align-items": "center" }}>
          <PresenceBadge status={status} outOfOffice size="large" />
          <Body1>{status} + OOF</Body1>
        </div>
      ))}
    </div>
  ),
};

export const InAvatar: Story = {
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
      <Title3>Avatar badge slot</Title3>
      <div style={{ display: "flex", gap: "16px" }}>
        <Avatar
          name="Ada Lovelace"
          size={56}
          badge={<PresenceBadge status="available" size="small" />}
        />
        <Avatar
          name="Grace Hopper"
          size={56}
          badge={<PresenceBadge status="away" outOfOffice size="small" />}
        />
      </div>
      <Title3>Persona presence</Title3>
      <Persona name="Ada Lovelace" secondaryText="available" presence="available" size="large" />
      <Persona name="Busy User" secondaryText="busy" presence="busy" size="large" />
      <Persona presence="offline" presenceOnly size="large" />
    </div>
  ),
};
