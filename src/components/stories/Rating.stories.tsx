import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { Rating, RatingItem, RatingDisplay } from "../rating/Rating";
import { Body1 } from "../text/Text";

const meta = {
  title: "Inputs/Rating",
  component: Rating,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
评分组件。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`value\` | \`number\` | - | 受控值 |
| \`defaultValue\` | \`number\` | \`0\` | 非受控初始值 |
| \`max\` | \`number\` | \`5\` | 最大星数 |
| \`step\` | \`0.5 \\| 1\` | \`1\` | 步长 |
| \`size\` | \`small \\| medium \\| large\` | \`medium\` | 尺寸 |
| \`color\` | \`brand \\| marigold \\| neutral\` | \`marigold\` | 颜色 |
| \`readOnly\` | \`boolean\` | \`false\` | 只读 |
| \`disabled\` | \`boolean\` | \`false\` | 禁用 |
| \`onChange\` | \`(v:number)=>void\` | - | 变化回调 |

子件：\`RatingItem\` / \`RatingDisplay\`。
`,
      },
    },
  },
  args: {
    defaultValue: 3,
    onChange: fn(),
  },
  argTypes: {
    value: { control: "number", description: "受控评分值" },
    defaultValue: { control: "number", description: "初始评分" },
    max: { control: "number", description: "最大星数" },
    step: { control: "inline-radio", options: [0.5, 1], description: "步长" },
    size: { control: "select", options: ["small", "medium", "large"], description: "尺寸" },
    color: { control: "select", options: ["brand", "marigold", "neutral"], description: "颜色" },
    readOnly: { control: "boolean", description: "只读" },
    disabled: { control: "boolean", description: "禁用" },
    onChange: { action: "change", description: "变化回调" },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 3 },
};

export const SizesAndColors: Story = {
  name: "尺寸与颜色",
  render: () => (
    <div style={{ display: "flex", gap: "24px", "align-items": "center" }}>
      <Rating defaultValue={4} size="small" color="brand" />
      <Rating defaultValue={3} size="large" color="marigold" />
      <Rating defaultValue={2} size="medium" color="neutral" />
    </div>
  ),
};

export const ReadOnly: Story = {
  name: "只读展示",
  render: () => (
    <div style={{ display: "flex", gap: "16px", "align-items": "center" }}>
      <RatingDisplay value={4.5} />
      <RatingDisplay value={3} size="large" />
    </div>
  ),
};

export const HalfSteps: Story = {
  name: "半星与键盘操作",
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
      <Rating defaultValue={2.5} step={0.5} aria-label="半星评分" />
      <Body1>
        点击星星左半区得到半星；容器可聚焦，支持 ←/→（±0.5）、Home/End。
      </Body1>
    </div>
  ),
};

export const Items: Story = {
  name: "RatingItem",
  render: () => {
    let value = 2;
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((v) => (
          <RatingItem value={v} selected={value >= v} onSelect={(n) => (value = n)} />
        ))}
        <Body1>当前：{value}</Body1>
      </div>
    );
  },
};
