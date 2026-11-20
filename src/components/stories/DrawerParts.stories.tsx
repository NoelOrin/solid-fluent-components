import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Button } from "../button/Button";
import { DrawerHeaderTitle } from "../drawer/Drawer";
import { OverlayDrawer } from "../drawer/InlineDrawer";

const meta = {
  title: "Overlay/Drawer parts",
  component: DrawerHeaderTitle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Drawer 头部标题组件，可附带操作按钮（如关闭）。OverlayDrawer 为真正的覆盖式抽屉（Portal / 遮罩 / 焦点陷阱 / Esc 关闭）。",
      },
    },
  },
} satisfies Meta<typeof DrawerHeaderTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div style={{ width: "320px", border: "1px solid var(--sf-colorNeutralStroke2)" }}>
      <DrawerHeaderTitle
        action={
          <Button appearance="subtle" shape="circular" aria-label="关闭">
            ✕
          </Button>
        }
      >
        抽屉标题
      </DrawerHeaderTitle>
    </div>
  ),
};

export const OverlayDrawerStory: Story = {
  name: "OverlayDrawer",
  render: () => {
    const [open, setOpen] = createSignal(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>打开抽屉</Button>
        <OverlayDrawer
          open={open()}
          onOpenChange={setOpen}
          position="end"
          aria-label="覆盖式抽屉"
        >
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                shape="circular"
                aria-label="关闭"
                onClick={() => setOpen(false)}
              >
                ✕
              </Button>
            }
          >
            覆盖式抽屉
          </DrawerHeaderTitle>
          <div style={{ padding: "16px" }}>抽屉内容</div>
        </OverlayDrawer>
      </>
    );
  },
};
