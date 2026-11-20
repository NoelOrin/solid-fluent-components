import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Toast, ToastTitle, ToastBody, ToastFooter } from "../toast/Toast";
import { Button } from "../button/Button";

const meta = {
  title: "Feedback/Toast parts",
  component: ToastTitle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toast 复合子组件：ToastTitle / ToastBody / ToastFooter。Toast 默认 role=status，warning/error 或 politeness=assertive 时为 role=alert。",
      },
    },
  },
} satisfies Meta<typeof ToastTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Parts: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <Toast intent="info">
        <ToastTitle>标题</ToastTitle>
        <ToastBody>这是一条通知内容。</ToastBody>
        <ToastFooter>
          <Button appearance="subtle" size="small">
            查看
          </Button>
        </ToastFooter>
      </Toast>
    </div>
  ),
};
