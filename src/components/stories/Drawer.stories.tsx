import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerHeaderNavigation,
} from "../drawer/Drawer";
import { Button } from "../button/Button";

const meta = {
  title: "Overlay/Drawer",
  tags: ["autodocs"],
  component: Drawer,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Drawer",
  render: () => {
    const [open, setOpen] = createSignal(true);
    return (
      <Drawer open={open()} onOpenChange={setOpen} position="end" size={320}>
        <DrawerHeader onClose={() => setOpen(false)}>标题</DrawerHeader>
        <DrawerBody>
          <p>抽屉内容区域，支持 position / size / modalType。</p>
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="primary" size="small" onClick={() => setOpen(false)}>
            确定
          </Button>
        </DrawerFooter>
      </Drawer>
    );
  },
};

export const HeaderNavigation: Story = {
  name: "DrawerHeaderNavigation",
  render: () => (
    <Drawer open onOpenChange={() => {}} size={320}>
      <DrawerHeader>
        <DrawerHeaderNavigation>
          <Button size="small" appearance="subtle">返回</Button>
          <Button size="small" appearance="subtle">更多</Button>
        </DrawerHeaderNavigation>
      </DrawerHeader>
      <DrawerBody>带导航条的抽屉头部。</DrawerBody>
    </Drawer>
  ),
};

export const NonModal: Story = {
  name: "Non-modal",
  render: () => (
    <Drawer open onOpenChange={() => {}} modalType="non-modal" position="start">
      <DrawerHeader>非模态抽屉</DrawerHeader>
      <DrawerBody>点击遮罩外不会强制关闭。</DrawerBody>
    </Drawer>
  ),
};
