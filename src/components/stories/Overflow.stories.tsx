import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import {
  Overflow,
  OverflowItem,
  OverflowMenu,
  OverflowDivider,
  DATA_OVERFLOW_ITEM,
  DATA_OVERFLOW_MENU,
  DATA_OVERFLOW_DIVIDER,
  DATA_OVERFLOWING,
} from "../overflow/Overflow";
import { Button } from "../button/Button";

const meta = {
  title: "Navigation/Overflow",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const items = Array.from({ length: 12 }, (_, i) => ({
  id: `item-${i}`,
  content: <Button size="small" appearance="subtle">{`按钮 ${i + 1}`}</Button>,
})) as any;

export const Default: Story = {
  name: "Overflow",
  render: () => (
    <div style={{ width: "420px", border: "1px solid #e0e0e0", padding: "8px" }}>
      <Overflow items={items} minimumVisible={3} />
    </div>
  ),
};

export const ComposedChildren: Story = {
  name: "children 组合",
  render: () => (
    <div style={{ width: "320px", border: "1px solid #e0e0e0", padding: "8px" }}>
      <Overflow minimumVisible={2}>
        <OverflowItem id="one"><Button size="small">项 1</Button></OverflowItem>
        <OverflowItem id="two"><Button size="small">项 2</Button></OverflowItem>
        <OverflowItem id="three"><Button size="small">项 3</Button></OverflowItem>
      </Overflow>
    </div>
  ),
};

export const Constants: Story = {
  name: "Data attributes",
  render: () => (
    <div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
      <OverflowItem id="a">
        <Button size="small">项 A</Button>
      </OverflowItem>
      <OverflowDivider>分隔</OverflowDivider>
      <OverflowMenu>溢出菜单</OverflowMenu>
      <code style={{ "font-size": "12px" }}>
        {DATA_OVERFLOW_ITEM} / {DATA_OVERFLOW_MENU} / {DATA_OVERFLOW_DIVIDER} / {DATA_OVERFLOWING}
      </code>
    </div>
  ),
};
