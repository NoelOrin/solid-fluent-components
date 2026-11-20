import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  MessageBar,
  MessageBarGroup,
  MessageBarBody,
  MessageBarTitle,
} from "../message-bar/MessageBar";

const meta = {
  title: "Feedback/MessageBar parts",
  component: MessageBarGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "通知栏分组容器：MessageBarGroup。warning / error 自动使用 role=alert；layout 支持 text / multiline。",
      },
    },
  },
} satisfies Meta<typeof MessageBarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grouped: Story = {
  render: () => (
    <MessageBarGroup>
      <MessageBar intent="success">操作成功</MessageBar>
      <MessageBar intent="warning">请注意</MessageBar>
      <MessageBar intent="error">发生错误</MessageBar>
    </MessageBarGroup>
  ),
};

export const Multiline: Story = {
  render: () => (
    <MessageBar intent="info" layout="multiline">
      <MessageBarBody>
        <MessageBarTitle>多行消息条</MessageBarTitle>
        较长的说明文字会在 multiline 布局下换行显示，适合包含标题与正文的通知场景。
      </MessageBarBody>
    </MessageBar>
  ),
};
