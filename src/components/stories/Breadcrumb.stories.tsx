import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, partitionBreadcrumbItems } from "../breadcrumb/Breadcrumb";
import { Button } from "../button/Button";

const meta = {
  title: "Navigation/Breadcrumb",
  tags: ["autodocs"],
  component: Breadcrumb,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Breadcrumb",
  render: () => (
    <Breadcrumb
      items={[
        { key: "home", children: "首页", href: "#" },
        { key: "docs", children: "文档", href: "#" },
        { key: "current", children: "当前页", current: true },
      ]}
    />
  ),
};

export const Overflow: Story = {
  name: "Partition helper",
  render: () => {
    const partitioned = partitionBreadcrumbItems({
      items: [
        { children: "首页" },
        { children: "分类" },
        { children: "子分类" },
        { children: "当前页", current: true },
      ],
      maxDisplayedItems: 3,
    });
    return (
      <div>
        <Breadcrumb items={partitioned.inlineItems} />
        <p style={{ "font-size": "12px" }}>
          overflow: {partitioned.overflowItems.length} 项，end: {partitioned.endDisplayedItems.length} 项
        </p>
      </div>
    );
  },
};

export const Custom: Story = {
  name: "BreadcrumbButton / Divider",
  render: () => (
    <nav aria-label="Breadcrumb">
      <ol class="sf-Breadcrumb">
        <BreadcrumbItem>
          <BreadcrumbButton href="#home">首页</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem current>
          <span>当前</span>
        </BreadcrumbItem>
      </ol>
    </nav>
  ),
};
