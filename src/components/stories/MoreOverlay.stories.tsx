import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { TeachingPopover } from "../teaching-popover/TeachingPopover";
import { Carousel } from "../carousel/Carousel";
import { Button } from "../button/Button";
import { Body1, Title3 } from "../text/Text";

const meta = {
  title: "Overlay/More",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TeachingPopoverStory: Story = {
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

export const CarouselStory: Story = {
  name: "Carousel",
  render: () => (
    <Carousel
      items={[
        <div>
          <Title3>Slide 1</Title3>
          <Body1>主题系统</Body1>
        </div>,
        <div>
          <Title3>Slide 2</Title3>
          <Body1>输入与选择</Body1>
        </div>,
        <div>
          <Title3>Slide 3</Title3>
          <Body1>数据与导航</Body1>
        </div>,
      ]}
    />
  ),
};
