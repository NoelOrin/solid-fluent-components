import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Input } from "../input/Input";
import { Field } from "../field/Field";
import { Body1 } from "../text/Text";

const meta = {
  title: "Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
文本输入框。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`size\` | \`small \\| medium \\| large\` | \`medium\` | 尺寸 |
| \`contentBefore\` | \`JSX.Element\` | - | 前缀 |
| \`contentAfter\` | \`JSX.Element\` | - | 后缀 |
| \`invalid\` | \`boolean\` | \`false\` | 错误态 |
| \`disabled\` | \`boolean\` | \`false\` | 禁用 |
| 其余 | 原生 input | - | \`value\` / \`placeholder\` / \`type\` / \`onInput\` 等 |
`,
      },
    },
  },
  args: {
    placeholder: "请输入内容",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "尺寸",
    },
    disabled: { control: "boolean", description: "禁用" },
    invalid: { control: "boolean", description: "校验失败" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "number"],
      description: "输入类型",
    },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  args: {
    contentBefore: "@",
    contentAfter: ".com",
    placeholder: "username",
  },
};

export const Small: Story = {
  args: { size: "small", placeholder: "Small input" },
};

export const Large: Story = {
  args: { size: "large", placeholder: "Large input" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "不可编辑" },
};

export const Invalid: Story = {
  args: { invalid: true, value: "错误状态" },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "请输入密码",
    contentBefore: "🔒",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = createSignal("solid-fluent");
    return (
      <div style={{ width: "320px", display: "flex", "flex-direction": "column", gap: "12px" }}>
        <Field label="项目标识" hint="支持受控输入">
          <Input
            value={value()}
            contentBefore="#"
            onInput={(event) => setValue(event.currentTarget.value)}
          />
        </Field>
        <Body1>当前值：{value() || "空"}</Body1>
      </div>
    );
  },
};

export const SizeCompare: Story = {
  name: "Size compare",
  render: () => (
    <div style={{ width: "320px", display: "flex", "flex-direction": "column", gap: "12px" }}>
      <Input size="small" placeholder="small" />
      <Input size="medium" placeholder="medium" />
      <Input size="large" placeholder="large" />
    </div>
  ),
};
