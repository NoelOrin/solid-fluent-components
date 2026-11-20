import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Title3, Body1, Subtitle1 } from "../text/Text";
import { Card, CardHeader } from "../card/Card";

/**
 * 反馈类（Feedback）分类总览。
 * 仅作分类入口说明，不重复演示组件；各组件演示见各自独立 story。
 */
const meta = {
  title: "Feedback/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
反馈类组件分类总览（仅作入口说明，不重复演示组件）。

- MessageBar：见 Feedback/MessageBar parts
- Dialog：见 Overlay/Dialog parts
- Drawer：见 Overlay/Drawer parts
- Toast：见 Feedback/Toast

### Dialog API
| 属性 | 说明 |
| --- | --- |
| \`open\` / \`defaultOpen\` / \`onOpenChange\` | 开关控制 |
| \`modalType\` | \`modal\` / \`non-modal\` / \`alert\`（非模态也支持 Esc 关闭） |
| \`unmountOnClose\` | 关闭时是否卸载内容（默认 \`true\`） |
| \`DialogSurface\` | 支持 \`aria-label\` / \`aria-labelledby\` / \`aria-describedby\`，仅在有标题时自动设置 \`aria-labelledby\` |
| 结构 | \`DialogSurface\` / \`DialogTitle\` / \`DialogBody\` / \`DialogActions\` / \`DialogContent\` / \`DialogTrigger\` |

### Drawer API
| 属性 | 说明 |
| --- | --- |
| \`position\` | \`start\` / \`end\` |
| \`size\` | 宽度 number/string |
| \`modalType\` | \`modal\` / \`non-modal\` |
| \`aria-label\` / \`aria-labelledby\` / \`aria-describedby\` | 抽屉无障碍属性 |
| \`OverlayDrawer\` | 真正的覆盖式抽屉：Portal / 遮罩 / 焦点陷阱 / Esc 与外部点击关闭 |

### Toast API
\`<ToastProvider position>\` + \`useToastController()\` 提供作用域内 \`dispatchToast / dismissToast / clearToasts\`；兼容旧的全局同名方法。
支持 \`politeness\`、\`priority\`（按优先级排序）、悬停/聚焦暂停计时；\`Toaster\` 容器 \`aria-live=polite\`，\`Toast\` 依据 intent 使用 \`role=status\` / \`role=alert\`。
\`position\` 支持 \`top-end\` / \`top-start\` / \`bottom-end\` / \`bottom-start\` / \`top\` / \`bottom\`。
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const 分类总览: Story = {
  name: "分类总览",
  render: () => (
    <Card>
      <CardHeader header={<Title3>Feedback 反馈类</Title3>} description={<Body1>消息条、对话框、抽屉与轻量提示。</Body1>} />
      <Subtitle1>包含组件</Subtitle1>
      <Body1>
        MessageBar、Dialog、Drawer、Toast。详细 API 与示例见上方各独立页。
      </Body1>
    </Card>
  ),
};
