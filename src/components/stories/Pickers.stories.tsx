import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Dropdown } from "../dropdown/Dropdown";
import { ComboboxField } from "../combobox/ComboboxField";
import { TagPicker } from "../tag-picker/TagPicker";
import { SwatchPicker } from "../swatch-picker/SwatchPicker";
import { Field } from "../field/Field";
import { Body1 } from "../text/Text";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
];

const meta = {
  title: "Inputs/Pickers",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
选择器组件。

| 组件 | 关键 API |
| --- | --- |
| Dropdown | options / value / onOptionSelect / placeholder |
| ComboboxField | options / value / multiselect / selectedOptions / onInput |
| TagPicker | options / selectedOptions / open / defaultOpen / onOpenChange / onOptionSelect |
| SwatchPicker | items / value / onSelectionChange / onChange（旧别名） |

TagPicker 支持方向键 / Home / End / Enter / Esc / Backspace、combobox ARIA 与受控 open；
SwatchPicker 支持方向键 roving tabindex。更完整键盘交互见 Polish/Interactions。
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DropdownStory: Story = {
  name: "Dropdown",
  render: () => {
    const [value, setValue] = createSignal("banana");
    return (
      <Field label="水果">
        <Dropdown
          value={value()}
          placeholder="请选择"
          options={fruits}
          onOptionSelect={(data) => setValue(data.value)}
        />
      </Field>
    );
  },
};

export const ComboboxStory: Story = {
  name: "Combobox",
  render: () => {
    const [value, setValue] = createSignal("");
    const [multi, setMulti] = createSignal(["apple"]);
    return (
      <div style={{ width: "320px", display: "flex", "flex-direction": "column", gap: "16px" }}>
        <Field label="可搜索组合框">
          <ComboboxField
            options={fruits}
            placeholder="输入过滤"
            value={value()}
            onInput={setValue}
            onOptionSelect={(data) => setValue(data.optionText ?? data.value)}
          />
        </Field>
        <Field label="多选 Combobox">
          <ComboboxField
            multiselect
            clearable
            options={fruits}
            selectedOptions={multi()}
            placeholder="选择多个"
            onOptionSelect={(data) => setMulti(data.selectedOptions)}
          />
        </Field>
        <Body1>单选：{value() || "空"} / 多选：{multi().join(", ")}</Body1>
      </div>
    );
  },
};

export const TagPickerStory: Story = {
  name: "TagPicker",
  render: () => {
    const [selected, setSelected] = createSignal(["apple", "grape"]);
    return (
      <Field label="标签选择">
        <TagPicker
          options={fruits}
          selectedOptions={selected()}
          onOptionSelect={setSelected}
          placeholder="添加标签"
        />
      </Field>
    );
  },
};

export const SwatchPickerStory: Story = {
  name: "SwatchPicker",
  render: () => {
    const [color, setColor] = createSignal(["brand"]);
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
        <SwatchPicker
          value={color()[0]}
          onSelectionChange={setColor}
          items={[
            { value: "brand", color: "#0f6cbd", label: "Brand" },
            { value: "success", color: "#0e700e", label: "Success" },
            { value: "warning", color: "#bc4b09", label: "Warning" },
            { value: "danger", color: "#b10e1c", label: "Danger" },
            { value: "neutral", color: "#616161", label: "Neutral" },
          ]}
        />
        <Body1>选中：{color().join(", ")}</Body1>
        <Body1>方向键可在色板间移动焦点。</Body1>
      </div>
    );
  },
};

export const TagPickerControlledOpenStory: Story = {
  name: "TagPicker（受控弹层）",
  render: () => {
    const [selected, setSelected] = createSignal(["apple"]);
    const [open, setOpen] = createSignal(false);
    return (
      <Field label="标签选择（受控 open）">
        <TagPicker
          options={fruits}
          selectedOptions={selected()}
          onOptionSelect={setSelected}
          open={open()}
          onOpenChange={setOpen}
          placeholder="按方向键选择，Esc 关闭"
        />
      </Field>
    );
  },
};
