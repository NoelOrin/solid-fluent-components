import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Field } from "../field/Field";
import { Input } from "../input/Input";
import { Textarea } from "../textarea/Textarea";
import { Select, Option } from "../select/Select";
import { Slider } from "../slider/Slider";
import { Label } from "../label/Label";
import { createSignal } from "solid-js";
import { Body1 } from "../text/Text";

const meta = {
  title: "Inputs/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
表单字段容器，负责标签、提示与校验信息。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`label\` | \`JSX.Element\` | - | 标签 |
| \`hint\` | \`JSX.Element\` | - | 帮助文案（\`validationState=none\` 时显示） |
| \`validationMessage\` | \`JSX.Element\` | - | 校验信息 |
| \`validationState\` | \`error \\| warning \\| success \\| none\` | \`none\` | 校验状态 |
| \`required\` | \`boolean\` | \`false\` | 必填 |
| \`orientation\` | \`vertical \\| horizontal\` | \`vertical\` | 布局 |
| \`children\` | \`JSX.Element\` | - | 控件 |
`,
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "320px", display: "flex", "flex-direction": "column", gap: "16px" }}>
      <Field label="邮箱" required hint="用于接收通知">
        <Input type="email" placeholder="name@example.com" />
      </Field>
      <Field label="备注">
        <Textarea placeholder="写点什么..." />
      </Field>
      <Field label="角色">
        <Select>
          <Option value="admin">管理员</Option>
          <Option value="editor">编辑者</Option>
          <Option value="viewer">访客</Option>
        </Select>
      </Field>
      <Field
        label="用户名"
        validationState="error"
        validationMessage="用户名已被占用"
      >
        <Input invalid value="fluent" />
      </Field>
      <div>
        <Label>音量</Label>
        <Slider min={0} max={100} value={42} />
      </div>
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ width: "320px", display: "flex", "flex-direction": "column", gap: "16px" }}>
      <Field label="成功" validationState="success" validationMessage="可以使用">
        <Input value="available-name" />
      </Field>
      <Field label="警告" validationState="warning" validationMessage="建议使用公司邮箱">
        <Input value="user@gmail.com" />
      </Field>
      <Field label="错误" validationState="error" validationMessage="格式不正确">
        <Input invalid value="@@@" />
      </Field>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => {
    const [bio, setBio] = createSignal("Solid Fluent");
    return (
      <div style={{ width: "480px", display: "flex", "flex-direction": "column", gap: "16px" }}>
        <Field label="昵称" orientation="horizontal" required>
          <Input value={bio()} onInput={(event) => setBio(event.currentTarget.value)} />
        </Field>
        <Field label="简介" orientation="horizontal" hint="最多 120 字">
          <Textarea rows={3} placeholder="介绍一下自己" />
        </Field>
        <Body1>横向 Field 适合设置页密集表单。</Body1>
      </div>
    );
  },
};

export const SliderField: Story = {
  render: () => {
    const [volume, setVolume] = createSignal(42);
    return (
      <div style={{ width: "320px" }}>
        <Field label={`音量 ${volume()}`} hint="拖动调整">
          <Slider
            min={0}
            max={100}
            value={volume()}
            onInput={(event) => setVolume(Number(event.currentTarget.value))}
          />
        </Field>
      </div>
    );
  },
};
