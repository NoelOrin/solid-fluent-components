import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  NavItem,
  NavCategory,
  NavSection,
  NavCategoryItem,
  NavSectionHeader,
  NavDivider,
  NavSubItem,
  NavSubItemGroup,
  SplitNavItem,
} from "../nav/Nav";

const meta = {
  title: "Navigation/Nav parts",
  component: NavItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Nav 复合子组件：NavItem / NavCategory / NavCategoryItem / NavSectionHeader / NavDivider / NavSubItem / NavSubItemGroup / SplitNavItem。",
      },
    },
  },
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Items: Story = {
  render: () => (
    <div style={{ width: "240px", "border-right": "1px solid var(--sf-colorNeutralStroke2)", padding: "8px" }}>
      <NavItem>首页</NavItem>
      <NavItem>文档</NavItem>
      <NavDivider />
      <NavSectionHeader>分组</NavSectionHeader>
      <NavSubItem>子项一</NavSubItem>
      <NavSubItemGroup>
        <NavSubItem>子项二</NavSubItem>
      </NavSubItemGroup>
    </div>
  ),
};

export const Section: Story = {
  render: () => (
    <div style={{ width: "240px", padding: "8px" }}>
      <NavSection>
        <NavSectionHeader>分区</NavSectionHeader>
        <NavItem selected>当前项</NavItem>
        <NavItem>普通项</NavItem>
      </NavSection>
    </div>
  ),
};

export const Category: Story = {
  render: () => (
    <div style={{ width: "240px", padding: "8px" }}>
      <NavCategory>
        <NavCategoryItem>分类项</NavCategoryItem>
        <NavItem>普通项</NavItem>
      </NavCategory>
      <SplitNavItem>
        <NavItem>拆分 A</NavItem>
        <NavItem>拆分 B</NavItem>
      </SplitNavItem>
    </div>
  ),
};
