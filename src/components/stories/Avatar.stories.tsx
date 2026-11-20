import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Avatar } from "../avatar/Avatar";
import { Persona } from "../persona/Persona";
import { PresenceBadge } from "../badge/PresenceBadge";

const meta = {
  title: "Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
头像组件，支持姓名缩写、图片与图标。

### Avatar API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`name\` | \`string\` | - | 用于生成缩写与无障碍标签 |
| \`image\` | \`{ src: string; alt?: string }\` | - | 图片头像 |
| \`size\` | \`16 \\| 20 \\| 24 \\| 28 \\| 32 \\| 36 \\| 40 \\| 48 \\| 56 \\| 64 \\| 72 \\| 96 \\| 120 \\| 128\` | \`32\` | 尺寸 |
| \`color\` | \`brand \\| neutral \\| colorful\` | \`brand\` | 背景色策略 |
| \`shape\` | \`circular \\| square\` | \`circular\` | 形状 |
| \`initials\` | \`string\` | 自动 | 自定义缩写 |
| \`icon\` | \`JSX.Element\` | - | 无姓名/图片时的图标 |
| \`active\` | \`active \\| inactive \\| unset\` | \`unset\` | 活动状态 |
| \`activeAppearance\` | \`ring \\| shadow \\| ring-shadow\` | \`ring\` | 活动态装饰 |
| \`badge\` | \`JSX.Element\` | - | 右下角状态徽标（通常放 PresenceBadge） |
| \`idForColor\` | \`string\` | - | \`color="colorful"\` 时决定确定性配色 |

### Persona 关联
\`Persona\` 组合 Avatar + 文本：\`name\` / \`secondaryText\` / \`tertiaryText\` / \`size\` / \`avatar\`。
`,
      },
    },
  },
  args: {
    name: "Ada Lovelace",
    size: 48,
    color: "brand",
    shape: "circular",
  },
  argTypes: {
    size: {
      control: "select",
      options: [16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128],
    },
    color: {
      control: "select",
      options: ["brand", "neutral", "colorful"],
    },
    shape: {
      control: "select",
      options: ["circular", "square"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap" }}>
      {[24, 32, 40, 48, 64, 96].map((size) => (
        <Avatar name="Grace Hopper" size={size as 24 | 32 | 40 | 48 | 64 | 96} />
      ))}
    </div>
  ),
};

export const ShapesAndColors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap" }}>
      <Avatar name="Alan Turing" color="brand" />
      <Avatar name="Katherine Johnson" color="neutral" />
      <Avatar name="Tim Berners-Lee" color="colorful" />
      <Avatar name="Square User" shape="square" size={48} />
      <Avatar initials="SF" size={48} />
      <Avatar icon={<span>★</span>} size={48} aria-label="icon avatar" />
    </div>
  ),
};

export const WithPresence: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", "align-items": "center", "flex-wrap": "wrap" }}>
      {(
        [
          "available",
          "away",
          "busy",
          "do-not-disturb",
          "offline",
        ] as const
      ).map((status) => (
        <div style={{ position: "relative", display: "inline-flex" }}>
          <Avatar name={status} size={48} />
          <span style={{ position: "absolute", right: 0, bottom: 0 }}>
            <PresenceBadge status={status} size="large" />
          </span>
        </div>
      ))}
    </div>
  ),
};

export const ActiveAndBadges: Story = {
  name: "Active & badge",
  render: () => (
    <div style={{ display: "flex", gap: "16px", "align-items": "center", "flex-wrap": "wrap" }}>
      <Avatar name="Ada Lovelace" active="active" activeAppearance="ring" size={48} />
      <Avatar name="Grace Hopper" active="active" activeAppearance="ring-shadow" color="neutral" size={48} />
      <Avatar name="Alan Turing" active="inactive" size={48} />
      <Avatar
        name="Katherine Johnson"
        size={56}
        badge={<PresenceBadge status="available" size="small" />}
      />
      <Avatar name="Colorful A" color="colorful" idForColor="user-a" size={48} />
      <Avatar name="Colorful B" color="colorful" idForColor="user-b" size={48} />
      <Avatar name="Size 16" size={16} />
    </div>
  ),
};

export const PersonaStory: Story = {
  name: "Persona",
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
      <Persona name="Ada Lovelace" secondaryText="Mathematician" size="medium" />
      <Persona
        name="Grace Hopper"
        secondaryText="Rear Admiral"
        tertiaryText="Compiler pioneer"
        size="large"
      />
      <Persona name="Alan Turing" secondaryText="Scientist" size="extra-large" />
    </div>
  ),
};
