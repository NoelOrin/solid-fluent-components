import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import {
  TeachingPopover,
  TeachingPopoverTrigger,
  TeachingPopoverSurface,
  TeachingPopoverHeader,
  TeachingPopoverTitle,
  TeachingPopoverBody,
  TeachingPopoverFooter,
} from "../teaching-popover/TeachingPopover";
import { Button } from "../button/Button";
import { Body1 } from "../text/Text";

const meta = {
  title: "Overlay/TeachingPopover",
  tags: ["autodocs"],
  component: TeachingPopover,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "TeachingPopover",
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <TeachingPopover
        open={open()}
        onOpenChange={setOpen}
        title="新功能提示"
        body="现在支持 DataGrid、Tree、Dropdown 与更多 Fluent 风格组件。"
        footer={
          <Button appearance="primary" size="small" onClick={() => setOpen(false)}>
            知道了
          </Button>
        }
      >
        <Button appearance="outline" onClick={() => setOpen(true)}>
          显示引导
        </Button>
      </TeachingPopover>
    );
  },
};

export const Composed: Story = {
  name: "Composed sub-components",
  render: () => (
    <TeachingPopoverSurface>
      <TeachingPopoverHeader>
        <TeachingPopoverTitle>自定义结构</TeachingPopoverTitle>
      </TeachingPopoverHeader>
      <TeachingPopoverBody>
        <Body1>使用子组件自由组合引导内容。</Body1>
      </TeachingPopoverBody>
      <TeachingPopoverFooter>
        <Button size="small">下一步</Button>
      </TeachingPopoverFooter>
    </TeachingPopoverSurface>
  ),
};

export const WithTrigger: Story = {
  name: "With trigger",
  render: () => (
    <TeachingPopover title="提示" body="由触发器打开的引导内容。">
      <TeachingPopoverTrigger>
        <Button>点我展示引导</Button>
      </TeachingPopoverTrigger>
    </TeachingPopover>
  ),
};
