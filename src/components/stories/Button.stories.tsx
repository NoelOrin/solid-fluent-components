import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { Button } from "../button/Button";

const meta = {
  title: "Inputs/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
按钮组件，支持多种外观、尺寸与图标。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`appearance\` | \`primary \\| secondary \\| outline \\| subtle \\| transparent\` | \`secondary\` | 外观 |
| \`size\` | \`small \\| medium \\| large\` | \`medium\` | 尺寸 |
| \`shape\` | \`rounded \\| circular \\| square\` | \`rounded\` | 形状 |
| \`icon\` | \`JSX.Element\` | - | 图标 |
| \`iconPosition\` | \`before \\| after\` | \`before\` | 图标位置 |
| \`disabled\` | \`boolean\` | \`false\` | 禁用 |
| \`disabledFocusable\` | \`boolean\` | \`false\` | 禁用但可聚焦 |
| \`children\` | \`JSX.Element\` | - | 文本 |
| \`onClick\` | 事件 | - | 点击回调 |

其余属性透传到原生 \`button\`。
`,
      },
    },
  },
  args: {
    children: "Button",
    onClick: fn(),
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["primary", "secondary", "outline", "subtle", "transparent"],
      description: "视觉样式",
      table: { type: { summary: "ButtonAppearance" }, defaultValue: { summary: "secondary" } },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "尺寸",
      table: { defaultValue: { summary: "medium" } },
    },
    shape: {
      control: "select",
      options: ["rounded", "circular", "square"],
      description: "形状",
      table: { defaultValue: { summary: "rounded" } },
    },
    iconPosition: {
      control: "inline-radio",
      options: ["before", "after"],
      description: "图标位置",
    },
    disabled: { control: "boolean", description: "禁用" },
    disabledFocusable: { control: "boolean", description: "禁用但可聚焦" },
    children: { control: "text", description: "按钮文本" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { appearance: "primary", children: "Primary" },
};

export const Secondary: Story = {
  args: { appearance: "secondary", children: "Secondary" },
};

export const Outline: Story = {
  args: { appearance: "outline", children: "Outline" },
};

export const Subtle: Story = {
  args: { appearance: "subtle", children: "Subtle" },
};

export const Transparent: Story = {
  args: { appearance: "transparent", children: "Transparent" },
};

export const Small: Story = {
  args: { size: "small", appearance: "primary", children: "Small" },
};

export const Large: Story = {
  args: { size: "large", appearance: "primary", children: "Large" },
};

export const Disabled: Story = {
  args: { appearance: "primary", disabled: true, children: "Disabled" },
};

export const DisabledFocusable: Story = {
  args: {
    appearance: "primary",
    disabledFocusable: true,
    children: "Disabled Focusable",
  },
};

export const WithIcon: Story = {
  args: {
    appearance: "primary",
    icon: <span aria-hidden="true">★</span>,
    children: "With Icon",
  },
};

export const IconAfter: Story = {
  args: {
    appearance: "outline",
    icon: <span aria-hidden="true">→</span>,
    iconPosition: "after",
    children: "Next",
  },
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", "flex-wrap": "wrap", "align-items": "center" }}>
      <Button appearance="primary" shape="rounded">
        Rounded
      </Button>
      <Button appearance="primary" shape="square">
        Square
      </Button>
      <Button appearance="primary" shape="circular" icon={<span>★</span>} aria-label="star" />
    </div>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", "flex-wrap": "wrap" }}>
      <Button appearance="primary">Primary</Button>
      <Button appearance="secondary">Secondary</Button>
      <Button appearance="outline">Outline</Button>
      <Button appearance="subtle">Subtle</Button>
      <Button appearance="transparent">Transparent</Button>
    </div>
  ),
};

export const SizeMatrix: Story = {
  name: "Size matrix",
  render: () => (
    <div style={{ display: "grid", gap: "12px" }}>
      {(["small", "medium", "large"] as const).map((size) => (
        <div style={{ display: "flex", gap: "12px", "align-items": "center" }}>
          <Button size={size} appearance="primary">
            {size}
          </Button>
          <Button size={size} appearance="outline" icon={<span>＋</span>}>
            新建
          </Button>
          <Button size={size} disabled>
            禁用
          </Button>
        </div>
      ))}
    </div>
  ),
};
