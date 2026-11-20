import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Title3, Body1, Subtitle1 } from "../text/Text";
import { Card, CardHeader } from "../card/Card";

/**
 * 导航类（Navigation）分类总览。
 * 仅作分类入口说明，不重复演示组件；各组件演示见各自独立 story。
 */
const meta = {
  title: "Navigation/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
导航类组件（分类总览，仅作入口说明，不重复演示组件）。

| 组件 | 关键 API |
| --- | --- |
| Breadcrumb | items: { children, href?, current? }[] |
| SimpleTabs | items: { value, label, content, disabled? }[] |
| Accordion | multiple / openItems / defaultOpenItems |
| Menu | open / onOpenChange + Trigger/Popover/List/Item |
| Toolbar | ToolbarButton / ToolbarDivider |

更细粒度 API 见各组件独立页：Navigation/Breadcrumb、Navigation/TabList、Navigation/Accordion、Navigation/Menu、Navigation/Toolbar。
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const 分类总览: Story = {
  name: "分类总览",
  render: () => (
    <Card>
      <CardHeader header={<Title3>Navigation 导航类</Title3>} description={<Body1>面包屑、标签页、手风琴、菜单与工具栏。</Body1>} />
      <Subtitle1>包含组件</Subtitle1>
      <Body1>
        Breadcrumb、SimpleTabs、Accordion、Menu、Toolbar、ToolbarToggleButton、
        ToolbarRadioButton、Nav、AppItem、Hamburger、Overflow。
      </Body1>
    </Card>
  ),
};
