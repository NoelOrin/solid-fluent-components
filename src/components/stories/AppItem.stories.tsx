import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { AppItem, AppItemStatic } from "../utilities/virtualizer/Virtualizer";

const meta = {
  title: "Navigation/AppItem",
  component: AppItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "应用栏项：AppItem（可点击）/ AppItemStatic（静态）。",
      },
    },
  },
} satisfies Meta<typeof AppItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <AppItem icon={<span aria-hidden="true">📧</span>}>邮件</AppItem>
      <AppItem selected icon={<span aria-hidden="true">⚙️</span>}>
        设置
      </AppItem>
      <AppItemStatic icon={<span aria-hidden="true">🔒</span>}>锁定</AppItemStatic>
    </div>
  ),
};
