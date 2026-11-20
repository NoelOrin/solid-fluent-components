import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Body1, Caption1, Title2, Title3 } from "./components/text/Text";
import { Badge } from "./components/badge/Badge";
import { tokens } from "./theme/index";
import "./welcome.css";

const meta = {
  title: "Introduction/Welcome",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Solid Fluent Components 的 Storybook 入口。建议先看 Introduction/API，再按分类浏览组件演示。",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const features = [
  {
    icon: "🎨",
    title: "Fluent 主题",
    desc: "完整的 Light / Dark 设计令牌，顶部工具栏可实时切换，组件同步换肤。",
  },
  {
    icon: "⌨️",
    title: "深度交互",
    desc: "键盘漫游、焦点陷阱、受控与非受控状态，覆盖复杂组件的真实使用场景。",
  },
  {
    icon: "🧩",
    title: "60+ 组件",
    desc: "输入、展示、反馈、导航、数据等分类齐全，API 尽量贴近 Fluent UI v9。",
  },
  {
    icon: "📐",
    title: "类型优先",
    desc: "TypeScript 7 + SolidJS 1.9，完整的 Props 类型与可组合的子组件结构。",
  },
];

const categories = [
  "Inputs · 按钮 / 输入 / 选择 / 下拉",
  "Display · 头像 / 徽章 / 卡片 / 排版",
  "Feedback · 对话框 / 抽屉 / Toast",
  "Navigation · Tab / 菜单 / 面包屑",
  "Overlay · Popover / Tooltip / 轮播",
  "Data · Table / DataGrid / Tree / List",
];

export const Welcome: Story = {
  render: () => (
    <div class="sf-welcome">
      <header class="sf-welcome-hero">
        <span class="sf-welcome-eyebrow">SolidJS · Fluent UI v9</span>
        <h1>Solid Fluent Components</h1>
        <p>
          用 SolidJS 重写的 Fluent UI 风格组件库。左侧按分类浏览组件 Stories，
          顶部工具栏切换 Light / Dark 主题，Controls 面板可实时调参。
        </p>
        <div class="sf-welcome-chips">
          <span class="sf-welcome-chip">SolidJS 1.9</span>
          <span class="sf-welcome-chip">Vite 8</span>
          <span class="sf-welcome-chip">TypeScript 7</span>
          <span class="sf-welcome-chip">Storybook 10</span>
        </div>
      </header>

      <div class="sf-welcome-grid">
        {features.map((feature) => (
          <div class="sf-welcome-feature">
            <span class="sf-welcome-feature-icon">{feature.icon}</span>
            <span class="sf-welcome-feature-title">{feature.title}</span>
            <Caption1 class="sf-welcome-feature-desc">{feature.desc}</Caption1>
          </div>
        ))}
      </div>

      <section>
        <Title3 class="sf-welcome-section-title">快速开始</Title3>
        <pre class="sf-welcome-code">{`import { Button, FluentProvider, webLightTheme } from "@solid-fluent/components";
import "@solid-fluent/components/styles.css";

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">Hello Fluent</Button>
    </FluentProvider>
  );
}`}</pre>
        <div style={{ display: "flex", gap: "8px", "margin-top": "12px", "flex-wrap": "wrap" }}>
          <Badge appearance="tint" color="brand">npm install @solid-fluent/components</Badge>
          <Badge appearance="outline">v0.1.0</Badge>
        </div>
      </section>

      <section>
        <Title2 class="sf-welcome-section-title">组件分类</Title2>
        <div
          style={{
            display: "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "8px",
            "margin-top": "8px",
          }}
        >
          {categories.map((category) => (
            <div
              style={{
                padding: "10px 14px",
                "border-radius": "10px",
                "border": `1px solid ${tokens.colorNeutralStroke2}`,
                "background": tokens.colorNeutralBackground1,
                "color": tokens.colorNeutralForeground2,
                "font-size": "13px",
              }}
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      <Body1 style={{ color: tokens.colorNeutralForeground3, "font-size": "12px" }}>
        由于 Solid + TS7 下关闭了自动 docgen，组件 API 通过 Introduction / API 的 MDX 总表与各 Story
        的 Docs 描述提供。运行 <code>npm run storybook</code> 启动本面板。
      </Body1>
    </div>
  ),
};
