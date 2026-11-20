import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import {
  Nav,
  NavItem,
  NavSection,
  NavSectionHeader,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
  NavDrawer,
  NavDrawerHeader,
  NavDrawerBody,
  NavDrawerFooter,
} from "../nav/Nav";
import { Button } from "../button/Button";

const meta = {
  title: "Navigation/Nav",
  component: Nav,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
导航组件。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`items\` | \`NavItemData[]\` | - | 数据驱动菜单 |
| \`selectedValue\` | \`NavItemValue\` | - | 受控选中 |
| \`defaultSelectedValue\` | \`NavItemValue\` | - | 非受控初始选中 |
| \`openItems\` / \`defaultOpenItems\` | \`NavItemValue[]\` | - | 展开的父项 |
| \`density\` | \`small \\| medium\` | \`medium\` | 密度 |
| \`appearance\` | \`outline \\| subtle\` | \`subtle\` | 外观 |
| \`onNavItemSelect\` | \`(v)=>void\` | - | 选中回调 |

子件：\`NavItem\` / \`NavCategoryItem\` / \`NavSubItem\` / \`NavSubItemGroup\` / \`SplitNavItem\` / \`NavDrawer\` 系列。
`,
      },
    },
  },
  args: {
    onNavItemSelect: fn(),
  },
  argTypes: {
    density: { control: "inline-radio", options: ["small", "medium"], description: "密度" },
    appearance: { control: "inline-radio", options: ["outline", "subtle"], description: "外观" },
    onNavItemSelect: { action: "navItemSelect", description: "选中回调" },
  },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { value: "home", content: "首页" },
  {
    value: "docs",
    content: "文档",
    children: [
      { value: "guide", content: "指南" },
      { value: "api", content: "API" },
    ],
  },
  { value: "about", content: "关于" },
] as any;

export const Default: Story = {
  render: () => (
    <div style={{ width: "240px" }}>
      <Nav items={items} onNavItemSelect={fn()} />
    </div>
  ),
};

export const DensityAndAppearance: Story = {
  name: "密度与外观",
  render: () => (
    <div style={{ display: "flex", gap: "24px" }}>
      <div style={{ width: "220px" }}>
        <Nav items={items} density="small" appearance="outline" />
      </div>
      <div style={{ width: "220px" }}>
        <Nav items={items} density="medium" appearance="subtle" />
      </div>
    </div>
  ),
};

export const SubItems: Story = {
  name: "子项与分类",
  render: () => (
    <div style={{ width: "240px" }}>
      <Nav>
        <NavCategoryItem>分类</NavCategoryItem>
        <NavItem>一级</NavItem>
        <NavSubItemGroup>
          <NavSubItem>二级 A</NavSubItem>
          <NavSubItem>二级 B</NavSubItem>
        </NavSubItemGroup>
      </Nav>
    </div>
  ),
};

export const V9ItemProps: Story = {
  name: "v9 项属性",
  render: () => (
    <div style={{ width: "240px" }}>
      <NavSection>
        <NavSectionHeader>分组</NavSectionHeader>
        <NavItem value="home" href="#home" icon={<span aria-hidden="true">🏠</span>} selected>
          首页
        </NavItem>
        <NavItem value="settings" disabled>
          设置
        </NavItem>
      </NavSection>
    </div>
  ),
};

export const DrawerVariant: Story = {
  name: "NavDrawer",
  render: () => (
    <div style={{ width: "260px", border: "1px solid #e0e0e0" }}>
      <NavDrawer>
        <NavDrawerHeader>
          <Button size="small" appearance="transparent">关闭</Button>
        </NavDrawerHeader>
        <NavDrawerBody>
          <div style={{ width: "220px" }}>
            <Nav items={items} />
          </div>
        </NavDrawerBody>
        <NavDrawerFooter>底部操作区</NavDrawerFooter>
      </NavDrawer>
    </div>
  ),
};
