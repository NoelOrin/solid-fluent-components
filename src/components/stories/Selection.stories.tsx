import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Checkbox } from "../checkbox/Checkbox";
import { Radio } from "../radio-group/Radio";
import { RadioGroup } from "../radio-group/RadioGroup";
import { Switch } from "../switch/Switch";
import { Field } from "../field/Field";
import { Body1 } from "../text/Text";

const meta = {
  title: "Inputs/Selection",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
选择类控件。

### Checkbox
\`label\` / \`checked\` / \`size\` / \`indicator\` / 原生 \`onChange\`

### Radio
\`label\` / \`name\` / \`checked\` / \`disabled\`

### Switch
\`label\` / \`labelPosition\` / \`checked\` / \`disabled\`
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxStory: Story = {
  name: "Checkbox",
  render: () => {
    const [checked, setChecked] = createSignal(true);
    const [custom, setCustom] = createSignal(false);
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
        <Checkbox
          checked={checked()}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label="记住我"
        />
        <Checkbox checked={false} size="large" label="大尺寸" />
        <Checkbox disabled checked label="禁用且选中" />
        <Checkbox
          checked={custom()}
          label="自定义指示器"
          indicator={<span>✓</span>}
          onChange={(event) => setCustom(event.currentTarget.checked)}
        />
        <Body1>当前：{checked() ? "选中" : "未选中"}</Body1>
      </div>
    );
  },
};

export const RadioStory: Story = {
  name: "Radio",
  render: () => {
    const [value, setValue] = createSignal("pro");
    return (
      <div
        role="radiogroup"
        aria-label="套餐"
        style={{ display: "flex", "flex-direction": "column", gap: "8px" }}
      >
        <Radio
          name="plan-demo"
          label="基础版"
          checked={value() === "basic"}
          onChange={() => setValue("basic")}
        />
        <Radio
          name="plan-demo"
          label="专业版"
          checked={value() === "pro"}
          onChange={() => setValue("pro")}
        />
        <Radio
          name="plan-demo"
          label="企业版"
          checked={value() === "enterprise"}
          onChange={() => setValue("enterprise")}
        />
        <Radio name="plan-demo" label="不可用" disabled />
        <Body1>当前套餐：{value()}</Body1>
      </div>
    );
  },
};

export const SwitchStory: Story = {
  name: "Switch",
  render: () => {
    const [on, setOn] = createSignal(true);
    const [notify, setNotify] = createSignal(false);
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
        <Switch
          checked={on()}
          onChange={(event) => setOn(event.currentTarget.checked)}
          label={on() ? "已开启" : "已关闭"}
        />
        <Switch
          checked={notify()}
          labelPosition="before"
          label="标签在前"
          onChange={(event) => setNotify(event.currentTarget.checked)}
        />
        <Switch disabled checked label="禁用" />
        <Field label="状态摘要" hint="Switch 使用 role=switch">
          <Body1>
            主开关 {on() ? "开" : "关"} / 通知 {notify() ? "开" : "关"}
          </Body1>
        </Field>
      </div>
    );
  },
};

export const CompositionalRadioGroup: Story = {
  name: "组合式 RadioGroup",
  render: () => {
    const [value, setValue] = createSignal("a");
    return (
      <RadioGroup
        name="compositional-plan"
        aria-label="套餐（组合式）"
        value={value()}
        onChange={setValue}
      >
        <Radio value="a" label="基础版" />
        <Radio value="b" label="专业版" />
        <Radio value="c" label="企业版" disabled />
      </RadioGroup>
    );
  },
};

export const CheckboxMixed: Story = {
  name: "Checkbox 混合态与 onCheckedChange",
  render: () => {
    const [checked, setChecked] = createSignal(false);
    return (
      <Checkbox
        mixed={!checked()}
        label="全选（部分选中）"
        onCheckedChange={setChecked}
      />
    );
  },
};

export const CombinedForm: Story = {
  name: "Combined form",
  render: () => {
    const [agree, setAgree] = createSignal(false);
    const [channel, setChannel] = createSignal("email");
    const [auto, setAuto] = createSignal(true);
    return (
      <div style={{ width: "320px", display: "flex", "flex-direction": "column", gap: "16px" }}>
        <Field label="通知渠道">
          <div role="radiogroup" aria-label="通知渠道" style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
          
            <Radio
              name="channel"
              label="邮件"
              checked={channel() === "email"}
              onChange={() => setChannel("email")}
            />
            <Radio
              name="channel"
              label="短信"
              checked={channel() === "sms"}
              onChange={() => setChannel("sms")}
            />
          </div>
        </Field>
        <Switch
          checked={auto()}
          onChange={(event) => setAuto(event.currentTarget.checked)}
          label="自动保存"
        />
        <Checkbox
          checked={agree()}
          onChange={(event) => setAgree(event.currentTarget.checked)}
          label="我已阅读协议"
        />
        <Body1>
          {channel()} / 自动保存 {auto() ? "开" : "关"} / 协议 {agree() ? "已勾选" : "未勾选"}
        </Body1>
      </div>
    );
  },
};
