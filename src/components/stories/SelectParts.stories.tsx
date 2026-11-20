import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Combobox, Listbox, OptionItem, Option } from "../select/Select";
import { OptionGroup } from "../combobox/ComboboxField";

const meta = {
  title: "Inputs/Select parts",
  component: Listbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Select / Combobox 复合子组件：Listbox / OptionItem / OptionGroup / Option。",
      },
    },
  },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListboxBasic: Story = {
  render: () => (
    <div style={{ "min-width": "200px" }}>
      <Listbox>
        <OptionItem value="1">苹果</OptionItem>
        <OptionItem value="2" selected>
          香蕉
        </OptionItem>
        <OptionItem value="3">橙子</OptionItem>
      </Listbox>
    </div>
  ),
};

export const WithOptionGroup: Story = {
  render: () => (
    <div style={{ "min-width": "220px" }}>
      <Listbox>
        <OptionGroup label="水果">
          <OptionItem value="a1">苹果</OptionItem>
          <OptionItem value="a2">香蕉</OptionItem>
        </OptionGroup>
        <OptionGroup label="蔬菜">
          <OptionItem value="b1">胡萝卜</OptionItem>
        </OptionGroup>
      </Listbox>
    </div>
  ),
};

export const ComboboxBasic: Story = {
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px", "min-width": "240px" }}>
      <Combobox placeholder="请输入或选择" />
      <Combobox value="已选值" />
      <Combobox disabled placeholder="禁用" />
    </div>
  ),
};

export const NativeOption: Story = {
  name: "Option (native)",
  render: () => (
    <select style={{ "min-width": "200px" }}>
      <Option value="1">选项一</Option>
      <Option value="2">选项二</Option>
    </select>
  ),
};
