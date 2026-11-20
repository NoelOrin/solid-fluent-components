import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Skeleton, SkeletonItem } from "../skeleton/Skeleton";

const meta = {
  title: "Display/Skeleton parts",
  component: SkeletonItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "骨架屏子项：SkeletonItem（与 Skeleton 相同属性）。",
      },
    },
  },
} satisfies Meta<typeof SkeletonItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Items: Story = {
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px", width: "280px" }}>
      <SkeletonItem shape="circle" width="48px" height="48px" />
      <SkeletonItem width="80%" height="16px" />
      <SkeletonItem width="60%" height="16px" />
      <Skeleton animation="pulse" width="100%" height="24px" />
    </div>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px", width: "280px" }}>
      <Skeleton appearance="opaque" animation="wave" height="16px" />
      <Skeleton appearance="translucent" animation="wave" height="16px" />
      <Skeleton animation="pulse" height="16px" />
      <Skeleton animation="none" height="16px" />
      <Skeleton shape="square" width="48px" height="48px" />
    </div>
  ),
};
