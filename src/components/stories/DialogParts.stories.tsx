import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "../button/Button";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "../dialog/Dialog";

const meta = {
  title: "Overlay/Dialog parts",
  component: DialogSurface,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dialog 复合子组件：Surface / Body / Title / Actions / Content。DialogContent 自身已包含一层 Surface，使用时不要再嵌套 DialogSurface。",
      },
    },
  },
} satisfies Meta<typeof DialogSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {
  render: () => (
    <Dialog open>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>对话框标题</DialogTitle>
          <p>对话框正文内容。</p>
          <DialogActions>
            <Button appearance="secondary">取消</Button>
            <Button appearance="primary">确定</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  ),
};

export const Content: Story = {
  render: () => (
    <Dialog open>
      <DialogContent
        title="对话框标题"
        actions={
          <>
            <Button appearance="secondary">取消</Button>
            <Button appearance="primary">确定</Button>
          </>
        }
      >
        对话框正文内容。
      </DialogContent>
    </Dialog>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Dialog open>
      <DialogSurface aria-label="无障碍标题">
        <DialogTitle>仅标题</DialogTitle>
      </DialogSurface>
    </Dialog>
  ),
};
