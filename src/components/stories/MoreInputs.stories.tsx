import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { CompoundButton } from "../button/CompoundButton";
import { ToggleButton } from "../button/ToggleButton";
import { MenuButton, SplitButton } from "../button/SplitButton";
import { MenuItem } from "../menu/Menu";
import { SearchBox } from "../search-box/SearchBox";
import { SpinButton } from "../spin-button/SpinButton";
import { Rating, RatingDisplay } from "../rating/Rating";
import { InfoLabel } from "../info-label/InfoLabel";
import { RadioGroup } from "../radio-group/RadioGroup";
import { Field } from "../field/Field";
import { Body1 } from "../text/Text";

const meta = {
  title: "Inputs/More",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
更多输入组件演示。

| 组件 | 关键 API |
| --- | --- |
| CompoundButton | appearance / icon / secondaryContent |
| ToggleButton | checked / onCheckedChange |
| SplitButton / MenuButton | menu / appearance / onClick |
| SearchBox | value / onInput / onDismiss |
| SpinButton | value / min / max / onChange |
| Rating | value / onChange / max / step |
| RadioGroup | value / onChange / options |
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonVariants: Story = {
  render: () => {
    const [pressed, setPressed] = createSignal(true);
    return (
      <div style={{ display: "flex", gap: "12px", "flex-wrap": "wrap", "align-items": "flex-start" }}>
        <CompoundButton
          appearance="primary"
          icon={<span>★</span>}
          secondaryContent="次要说明"
        >
          Compound
        </CompoundButton>
        <ToggleButton
          checked={pressed()}
          onCheckedChange={setPressed}
          appearance="outline"
        >
          {pressed() ? "已选中" : "切换"}
        </ToggleButton>
        <SplitButton
          appearance="secondary"
          menu={
            <>
              <MenuItem>另存为</MenuItem>
              <MenuItem>导出</MenuItem>
            </>
          }
        >
          保存
        </SplitButton>
        <MenuButton
          appearance="outline"
          menu={
            <>
              <MenuItem>复制</MenuItem>
              <MenuItem>粘贴</MenuItem>
            </>
          }
        >
          更多
        </MenuButton>
      </div>
    );
  },
};

export const SearchAndSpin: Story = {
  render: () => {
    const [query, setQuery] = createSignal("fluent");
    const [count, setCount] = createSignal(3);
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "16px", width: "320px" }}>
        <Field label="搜索">
          <SearchBox
            value={query()}
            placeholder="搜索组件"
            onInput={(event) => setQuery(event.currentTarget.value)}
            onDismiss={() => setQuery("")}
          />
        </Field>
        <Field label="数量">
          <SpinButton
            value={count()}
            min={0}
            max={10}
            onChange={(value) => {
              if (value !== null) setCount(value);
            }}
          />
        </Field>
      </div>
    );
  },
};

export const RatingAndRadio: Story = {
  render: () => {
    const [score, setScore] = createSignal(4);
    const [plan, setPlan] = createSignal("pro");
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "16px", width: "360px" }}>
        <div>
          <InfoLabel info="支持点击评分">产品评分</InfoLabel>
          <div style={{ "margin-top": "8px" }}>
            <Rating value={score()} onChange={setScore} />
          </div>
          <RatingDisplay value={score()}>
            <Body1>{score()} / 5</Body1>
          </RatingDisplay>
        </div>
        <Field label="套餐">
          <RadioGroup
            value={plan()}
            onChange={setPlan}
            options={[
              { value: "basic", label: "基础版" },
              { value: "pro", label: "专业版" },
              { value: "enterprise", label: "企业版" },
            ]}
          />
        </Field>
      </div>
    );
  },
};

export const UncontrolledSearchBox: Story = {
  name: "非受控 SearchBox 清除按钮",
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px", width: "320px" }}>
      <SearchBox placeholder="输入后出现清除按钮" />
      <Body1>SearchBox 会跟踪实际输入值，非受控输入也能显示清除按钮。</Body1>
    </div>
  ),
};
