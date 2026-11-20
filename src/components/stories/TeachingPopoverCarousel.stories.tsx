import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  TeachingPopoverCarousel,
  TeachingPopoverCarouselCard,
  TeachingPopoverCarouselFooter,
  TeachingPopoverCarouselFooterButton,
  TeachingPopoverCarouselNav,
  TeachingPopoverCarouselNavButton,
  TeachingPopoverCarouselPageCount,
} from "../teaching-popover/TeachingPopover";

const meta = {
  title: "Overlay/TeachingPopover carousel",
  component: TeachingPopoverCarousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "教学气泡轮播子组件：Carousel / CarouselCard / CarouselFooter / CarouselFooterButton / CarouselNav / CarouselNavButton / CarouselPageCount。",
      },
    },
  },
} satisfies Meta<typeof TeachingPopoverCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Carousel: Story = {
  render: () => (
    <div style={{ width: "320px", border: "1px solid var(--sf-colorNeutralStroke2)", "border-radius": "8px" }}>
      <TeachingPopoverCarousel
        items={[
          <TeachingPopoverCarouselCard>第一页</TeachingPopoverCarouselCard>,
          <TeachingPopoverCarouselCard>第二页</TeachingPopoverCarouselCard>,
        ]}
      >
        <TeachingPopoverCarouselFooter>
          <TeachingPopoverCarouselFooterButton navType="previous" altText="上一张" />
          <TeachingPopoverCarouselFooterButton navType="next" altText="下一张" />
        </TeachingPopoverCarouselFooter>
        <TeachingPopoverCarouselNav>
          <TeachingPopoverCarouselNavButton index={0} label="1" />
          <TeachingPopoverCarouselNavButton index={1} label="2" />
        </TeachingPopoverCarouselNav>
        <TeachingPopoverCarouselPageCount />
      </TeachingPopoverCarousel>
    </div>
  ),
};
