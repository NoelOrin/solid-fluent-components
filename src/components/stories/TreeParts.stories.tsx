import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { TreeItem, TreeItemLayout, TreeItemPersonaLayout } from "../tree/Tree";

const meta = {
  title: "Data/Tree parts",
  component: TreeItemLayout,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Tree 行布局：TreeItemLayout / TreeItemPersonaLayout。",
      },
    },
  },
} satisfies Meta<typeof TreeItemLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Layout: Story = {
  render: () => (
    <div style={{ "min-width": "260px" }}>
      <TreeItem value="plain">
        <TreeItemLayout>普通树项</TreeItemLayout>
      </TreeItem>
      <TreeItem value="persona">
        <TreeItemPersonaLayout media={<span aria-hidden="true">👤</span>} description="副标题">
          带头像的树项
        </TreeItemPersonaLayout>
      </TreeItem>
    </div>
  ),
};
