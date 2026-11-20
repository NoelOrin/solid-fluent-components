import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselNavImageButton,
  CarouselAutoplayButton,
  CarouselButton,
} from "../carousel/Carousel";
import { Button } from "../button/Button";

const meta = {
  title: "Overlay/Carousel parts",
  component: CarouselNavButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "轮播子组件：CarouselNav / CarouselNavButton / CarouselNavContainer / CarouselNavImageButton / CarouselAutoplayButton。",
      },
    },
  },
} satisfies Meta<typeof CarouselNavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NavDots: Story = {
  render: () => (
    <CarouselNav>
      <CarouselNavButton index={0} active controls="sf-carousel-slide-0" label="1" onClick={() => {}} />
      <CarouselNavButton index={1} controls="sf-carousel-slide-1" label="2" onClick={() => {}} />
      <CarouselNavButton index={2} controls="sf-carousel-slide-2" label="3" onClick={() => {}} />
    </CarouselNav>
  ),
};

export const ContainerAndImage: Story = {
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
      <CarouselNavContainer>
        <CarouselNavImageButton index={0} active label="A" onClick={() => {}} />
        <CarouselNavImageButton index={1} label="B" onClick={() => {}} />
      </CarouselNavContainer>
      <CarouselAutoplayButton toggleable>暂停 / 播放</CarouselAutoplayButton>
    </div>
  ),
};

export const Buttons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
      <Button appearance="subtle" shape="circular" aria-label="上一张">
        ‹
      </Button>
      <CarouselAutoplayButton toggleable>播放</CarouselAutoplayButton>
      <Button appearance="subtle" shape="circular" aria-label="下一张">
        ›
      </Button>
    </div>
  ),
};

export const CarouselButtonOnly: Story = {
  name: "CarouselButton",
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <CarouselButton direction="prev" onClick={() => {}} />
      <CarouselButton direction="next" onClick={() => {}} />
    </div>
  ),
};
