import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarRadio,
  ToolbarRadioGroup,
} from "../toolbar/Toolbar";
import { Button } from "../button/Button";

const meta = {
  title: "Navigation/Toolbar",
  tags: ["autodocs"],
  component: Toolbar,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Toolbar",
  render: () => (
    <Toolbar>
      <ToolbarButton>✏️ 编辑</ToolbarButton>
      <ToolbarButton>🗑️ 删除</ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton>设置</ToolbarButton>
    </Toolbar>
  ),
};

export const RadioGroup: Story = {
  name: "ToolbarRadioGroup",
  render: () => {
    const [value, setValue] = createSignal<string | number>("list");
    return (
      <Toolbar>
        <ToolbarRadioGroup value={value()} onChange={setValue}>
          <ToolbarGroup>
            <ToolbarRadio value="list">列表</ToolbarRadio>
            <ToolbarRadio value="grid">网格</ToolbarRadio>
            <ToolbarRadio value="compact">紧凑</ToolbarRadio>
          </ToolbarGroup>
        </ToolbarRadioGroup>
      </Toolbar>
    );
  },
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <Toolbar vertical>
      <ToolbarButton>上</ToolbarButton>
      <ToolbarButton>中</ToolbarButton>
      <ToolbarButton>下</ToolbarButton>
    </Toolbar>
  ),
};
