import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { SpinButton } from "../spin-button/SpinButton";

const meta = {
  title: "Inputs/SpinButton",
  component: SpinButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
数字步进输入。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`value\` | \`number\` | - | 受控值 |
| \`defaultValue\` | \`number\` | \`0\` | 非受控初始值 |
| \`min\` / \`max\` | \`number\` | - | 上下限 |
| \`step\` | \`number\` | \`1\` | 步长 |
| \`precision\` | \`number\` | - | 小数位 |
| \`size\` | \`small \\| medium\` | \`medium\` | 尺寸 |
| \`appearance\` | \`outline \\| underline \\| filled-darker \\| filled-lighter\` | \`outline\` | 外观 |
| \`onChange\` | \`(v:number\\|null, display:string)=>void\` | - | 变化回调 |
`,
      },
    },
  },
  args: {
    defaultValue: 0,
    onChange: fn(),
  },
  argTypes: {
    defaultValue: { control: "number", description: "初始值" },
    min: { control: "number", description: "最小值" },
    max: { control: "number", description: "最大值" },
    step: { control: "number", description: "步长" },
    precision: { control: "number", description: "小数位" },
    size: { control: "inline-radio", options: ["small", "medium"], description: "尺寸" },
    appearance: {
      control: "select",
      options: ["outline", "underline", "filled-darker", "filled-lighter"],
      description: "外观",
    },
    onChange: { action: "change", description: "变化回调" },
  },
} satisfies Meta<typeof SpinButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 0, min: 0, max: 100, step: 1 },
};

export const StepAndPrecision: Story = {
  name: "步长与精度",
  args: { defaultValue: 0.5, step: 0.1, precision: 2, min: 0, max: 1 },
};

export const Disabled: Story = {
  args: { defaultValue: 10, disabled: true },
};
