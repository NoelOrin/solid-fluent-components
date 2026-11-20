import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
import { SimplePopover, Tooltip } from "../tooltip/Tooltip";

const meta = {
  title: "Overlay/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
浮层组件。

| 组件 | 关键 API |
| --- | --- |
| Tooltip | content / positioning（position + align 对象）/ withArrow / delay / relationship / onVisibleChange / visible |
| SimplePopover | content 快捷用法 |
| Popover | PopoverTrigger + PopoverSurface（见 Complete/Remaining） |
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TooltipStory: Story = {
  name: "Tooltip",
  render: () => (
    <Tooltip content="这是一个 Tooltip">
      <Button appearance="outline">悬停或聚焦</Button>
    </Tooltip>
  ),
};

export const PopoverStory: Story = {
  name: "Popover",
  render: () => (
    <SimplePopover content={<Text>Popover 内容区域，可放表单或快捷操作。</Text>}>
      <Button appearance="subtle">打开 Popover</Button>
    </SimplePopover>
  ),
};
