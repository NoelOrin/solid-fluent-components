import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { List, ListItem } from "../list/List";

const meta = {
  title: "Data/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "列表：List / ListItem，支持单选、多选与禁用项。",
      },
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div style={{ "min-width": "240px" }}>
      <p style={{ margin: "0 0 8px" }}>声明式 ListItem：点击/方向键 + Enter 选择</p>
      <List selectionMode="single" defaultSelectedItems={[2]}>
        <ListItem value={1}>项目一</ListItem>
        <ListItem value={2}>项目二</ListItem>
        <ListItem value={3}>项目三</ListItem>
      </List>
    </div>
  ),
};

export const CompositeNavigation: Story = {
  name: "Composite navigation",
  render: () => (
    <div style={{ "min-width": "240px" }}>
      <p style={{ margin: "0 0 8px" }}>composite 模式：焦点直接落在当前项</p>
      <List
        selectionMode="multiselect"
        navigationMode="composite"
        defaultSelectedItems={[2]}
      >
        <ListItem value={1}>项目一</ListItem>
        <ListItem value={2}>项目二</ListItem>
        <ListItem value={3}>项目三</ListItem>
      </List>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ "min-width": "240px" }}>
      <List>
        <ListItem value={1}>可用</ListItem>
        <ListItem value={2} disabled>
          禁用
        </ListItem>
      </List>
    </div>
  ),
};
