import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "../button/Button";
import {
  Toaster,
  Toast,
  ToastTrigger,
  ToastProvider,
  dispatchToast,
  useToastController,
} from "../toast/Toast";
import { createSignal } from "solid-js";

const meta = {
  title: "Feedback/Toast",
  tags: ["autodocs"],
  component: Toast,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Toaster + dispatch",
  render: () => {
    const [n, setN] = createSignal(0);
    return (
      <>
        <Button
          onClick={() => {
            setN(n() + 1);
            dispatchToast({
              intent: "success",
              title: "已保存",
              body: `第 ${n() + 1} 次保存成功`,
            });
          }}
        >
          触发 Toast
        </Button>
        <Toaster position="top-end" />
      </>
    );
  },
};

export const Provider: Story = {
  name: "ToastProvider + useToastController",
  render: () => {
    // The controller is scoped to the provider; global dispatchToast is not needed.
    function Demo() {
      const { dispatchToast: push } = useToastController();
      return (
        <>
          <Button
            onClick={() =>
              push({
                intent: "success",
                title: "已完成",
                body: "来自 Provider 的 Toast",
                politeness: "polite",
                priority: 1,
              })
            }
          >
            触发作用域内 Toast
          </Button>
          <Toaster />
        </>
      );
    }
    return (
      <ToastProvider position="bottom">
        <Demo />
      </ToastProvider>
    );
  },
};

export const BottomPosition: Story = {
  name: "Position top / bottom",
  render: () => (
    <>
      <Button onClick={() => dispatchToast({ intent: "info", title: "底部提示" })}>
        底部 Toast
      </Button>
      <Toaster position="bottom" />
    </>
  ),
};

export const Intents: Story = {
  name: "Intents",
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px", width: "320px" }}>
      <Toast intent="info">信息提示</Toast>
      <Toast intent="success">成功提示</Toast>
      <Toast intent="warning">警告提示（role=alert）</Toast>
      <Toast intent="error">错误提示（role=alert）</Toast>
    </div>
  ),
};

export const Trigger: Story = {
  name: "ToastTrigger",
  render: () => (
    <>
      <ToastTrigger toast={{ intent: "info", title: "来自触发器", body: "点击按钮即派发" }}>
        通知
      </ToastTrigger>
      <Toaster />
    </>
  ),
};
