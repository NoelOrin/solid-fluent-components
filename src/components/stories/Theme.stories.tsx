import { For, createMemo, createSignal, type Accessor, type JSX } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  FluentProvider,
  copyTextToClipboard,
  getThemePreset,
  serializeTheme,
  themePresetFamilies,
  tokens,
  webDarkTheme,
  webLightTheme,
  type ColorMode,
  type Theme,
  type ThemeFamily,
  type TokenName,
} from "../../theme/index";
import { Button } from "../button/Button";
import { Body1, Body2, Caption1, Title2, Title3 } from "../text/Text";
import { Input } from "../input/Input";
import { Badge } from "../badge/Badge";
import { Card, CardHeader } from "../card/Card";

const meta = {
  title: "Theme/Provider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
主题系统与 design token 使用方法。

本库的主题基于一组 **design token**（设计令牌）。\`FluentProvider\` 会把主题对象转换成 CSS 变量注入到容器上（变量前缀为 \`--sf-\`），所有组件样式都读取这些变量，因此切换主题只需换 \`theme\` 即可。

### 三种使用方式

**1) 在 CSS / 内联样式里用 \`var(--sf-*)\`**
token 名由 \`Theme\` 的键做 kebab-case 转换而来：\`colorBrandBackground\` → \`--sf-colorBrandBackground\`。

\`\`\`css
.my-card {
  background: var(--sf-colorNeutralBackground1);
  color: var(--sf-colorNeutralForeground1);
  border-radius: var(--sf-borderRadiusMedium);
}
\`\`\`

**2) 在 TSX 里直接用 \`tokens\` 对象（inline style）**
\`tokens\` 就是当前主题对象，字段与 \`Theme\` 类型一致，可直接用于 \`style\`：

\`\`\`tsx
import { tokens } from "@solid-fluent/components";

<Body1 style={{ color: tokens.colorNeutralForeground2 }}>
  次要文字
</Body1>
\`\`\`

**3) 自定义主题（换品牌色）**
用工厂函数基于 \`brandWeb\` 生成浅色 / 深色主题，覆盖任意品牌档位：

\`\`\`tsx
import { createLightTheme, createDarkTheme, brandWeb } from "@solid-fluent/components";

const brand = { ...brandWeb, 100: "#479ef5", 80: "#0f6cbd" };
const light = createLightTheme(brand);
const dark = createDarkTheme(brand);
\`\`\`

### 常用 token

| 类别 | 示例字段 |
| --- | --- |
| 品牌色 | \`colorBrandBackground\`、\`colorBrandBackgroundHover\`、\`colorBrandForeground1\` |
| 中性前景 | \`colorNeutralForeground1/2/3\`、\`colorNeutralForegroundDisabled\` |
| 中性背景 | \`colorNeutralBackground1..6\`、\`colorNeutralBackgroundInverted\` |
| 描边 | \`colorNeutralStroke1/2\`、\`colorNeutralStrokeAccessible\` |
| 状态色 | \`colorStatusSuccessForeground1\`、\`colorStatusDangerForeground1\` |
| 字体族 | \`fontFamilyBase\`、\`fontFamilyMonospace\`、\`fontFamilyNumeric\` |
| 字号 | \`fontSizeBase100\`(10px) … \`fontSizeBase600\`(24px)，\`fontSizeHero700\`(28px) … \`fontSizeHero1000\`(68px) |
| 字重 | \`fontWeightRegular\`(400) / \`Medium\`(500) / \`Semibold\`(600) / \`Bold\`(700) |
| 圆角 | \`borderRadiusNone/Small/Medium/XLarge/Circular\` |

### 局部主题与嵌套

\`FluentProvider\` 可任意嵌套：内层 provider 只影响它自己的子树。多个 \`applyToDocument\` 的 provider 会相互覆盖 \`documentElement\`，库内部已保证最外层生效；局部主题区建议保持 \`applyToDocument\` 为默认 \`false\`。

Storybook 顶部工具栏也可全局切换 Light / Dark。
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightAndDark: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "16px", "grid-template-columns": "1fr 1fr", width: "760px" }}>
      <FluentProvider theme={webLightTheme} style={{ padding: "20px", "border-radius": "12px" }}>
        <Title3>Light Theme</Title3>
        <Body1 style={{ color: tokens.colorNeutralForeground2, margin: "8px 0 16px" }}>
          webLightTheme + CSS variables
        </Body1>
        <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap", "align-items": "center" }}>
          <Button appearance="primary">Primary</Button>
          <Badge color="brand">Light</Badge>
          <div style={{ width: "140px" }}>
            <Input placeholder="输入" />
          </div>
        </div>
      </FluentProvider>
      <FluentProvider theme={webDarkTheme} style={{ padding: "20px", "border-radius": "12px" }}>
        <Title3>Dark Theme</Title3>
        <Body1 style={{ color: tokens.colorNeutralForeground2, margin: "8px 0 16px" }}>
          webDarkTheme + CSS variables
        </Body1>
        <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap", "align-items": "center" }}>
          <Button appearance="primary">Primary</Button>
          <Badge color="success">Dark</Badge>
          <div style={{ width: "140px" }}>
            <Input placeholder="输入" />
          </div>
        </div>
      </FluentProvider>
    </div>
  ),
};

export const ThemeFamilies: Story = {
  name: "三套主题族 + 亮暗切换",
  parameters: {
    docs: {
      description: {
        story:
          "用 `getThemePreset(family, mode)` 在 web / violet / emerald 三套主题族与 light / dark 模式间切换；`createSignal` 同时驱动族选择与模式切换，所有组件读取同一套 CSS 变量。",
      },
    },
  },
  render: () => {
    const [family, setFamily] = createSignal<ThemeFamily>("web");
    const [mode, setMode] = createSignal<ColorMode>("light");
    const [copied, setCopied] = createSignal("");
    const theme = createMemo(() => getThemePreset(family(), mode()));

    const copy = async (format: "json" | "css" | "ts") => {
      const text = serializeTheme(theme(), format, { name: `${family()}Theme` });
      const ok = await copyTextToClipboard(text);
      setCopied(ok ? `${format.toUpperCase()} 已复制到剪贴板` : "复制失败，请手动复制");
    };

    const chip = (id: ThemeFamily, label: string) => (
      <Button
        appearance={family() === id ? "primary" : "secondary"}
        size="small"
        onClick={() => setFamily(id)}
      >
        {label}
      </Button>
    );

    return (
      <FluentProvider theme={theme()} style={{ padding: "20px", "border-radius": "12px" }}>
        <Title3>三套主题族</Title3>
        <Body1 style={{ color: tokens.colorNeutralForeground2, margin: "6px 0 14px" }}>
          当前：{themePresetFamilies.find((f) => f.id === family())?.label} / {mode() === "light" ? "亮色" : "暗色"}
        </Body1>
        <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap", "align-items": "center" }}>
          <For each={themePresetFamilies}>
            {(preset) => chip(preset.id, preset.label)}
          </For>
          <div style={{ width: "1px", height: "24px", background: tokens.colorNeutralStroke2 }} />
          <Button
            appearance={mode() === "light" ? "primary" : "secondary"}
            size="small"
            onClick={() => setMode("light")}
          >
            亮色
          </Button>
          <Button
            appearance={mode() === "dark" ? "primary" : "secondary"}
            size="small"
            onClick={() => setMode("dark")}
          >
            暗色
          </Button>
        </div>
        <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap", "align-items": "center", "margin-top": "18px" }}>
          <Caption1>一键导出：</Caption1>
          <Button size="small" onClick={() => copy("json")}>复制 JSON</Button>
          <Button size="small" onClick={() => copy("css")}>复制 CSS</Button>
          <Button size="small" onClick={() => copy("ts")}>复制 TS</Button>
          <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>{copied()}</Caption1>
        </div>
        <div style={{ display: "flex", gap: "12px", "flex-wrap": "wrap", "margin-top": "18px" }}>
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
            <div
              style={{
                width: "120px",
                height: "48px",
                "border-radius": "8px",
                background: theme().colorBrandBackground,
              }}
            />
            <Caption1>colorBrandBackground</Caption1>
          </div>
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
            <div
              style={{
                width: "120px",
                height: "48px",
                "border-radius": "8px",
                background: theme().colorNeutralBackground1,
                border: `1px solid ${theme().colorNeutralStroke1}`,
              }}
            />
            <Caption1>colorNeutralBackground1</Caption1>
          </div>
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
            <div
              style={{
                width: "120px",
                height: "48px",
                "border-radius": "8px",
                background: theme().colorSubtleBackgroundSelected,
              }}
            />
            <Caption1>colorSubtleBackgroundSelected</Caption1>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap", "margin-top": "18px" }}>
          <Button appearance="primary">Primary</Button>
          <Badge color="brand">Brand</Badge>
          <div style={{ width: "160px" }}>
            <Input placeholder="输入" />
          </div>
        </div>
      </FluentProvider>
    );
  },
};

export const TokenSwatches: Story = {
  render: () => {
    const colors = [
      ["Brand", tokens.colorBrandBackground],
      ["Foreground", tokens.colorNeutralForeground1],
      ["Background", tokens.colorNeutralBackground1],
      ["Stroke", tokens.colorNeutralStroke1],
      ["Success", tokens.colorStatusSuccessForeground1],
      ["Danger", tokens.colorStatusDangerForeground1],
    ] as const;

    return (
      <div style={{ display: "grid", gap: "12px", "grid-template-columns": "repeat(3, 140px)" }}>
        {colors.map(([name, color]) => (
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
            <div
              style={{
                height: "64px",
                "border-radius": "8px",
                background: color,
                border: `1px solid ${tokens.colorNeutralStroke1}`,
              }}
            />
            <Body1>{name}</Body1>
            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{color}</Caption1>
          </div>
        ))}
      </div>
    );
  },
};

export const NestedProviders: Story = {
  name: "Nested providers",
  render: () => (
    <FluentProvider theme={webLightTheme} style={{ padding: "16px", "border-radius": "12px", width: "520px" }}>
      <Card>
        <CardHeader header={<Title3>外层 Light</Title3>} description={<Body1>内部可再嵌套 Dark 区域</Body1>} />
        <FluentProvider
          theme={webDarkTheme}
          style={{ padding: "16px", "border-radius": "8px", margin: "8px 0" }}
        >
          <Body1 style={{ "margin-bottom": "8px" }}>内层 Dark 局部主题</Body1>
          <Button appearance="primary">局部 Primary</Button>
        </FluentProvider>
        <Button appearance="outline">外层 Outline</Button>
      </Card>
    </FluentProvider>
  ),
};


export const TokenCatalog: Story = {
  name: "Token catalog（全部 token + 颜色预览）",
  parameters: {
    docs: {
      description: {
        story:
          `遍历 \`webLightTheme\` 的全部 ${Object.keys(webLightTheme).length} 个 design token。颜色类 token 在「预览」列渲染真实色块；字体、字号、间距、圆角、阴影等非颜色 token 列出实际取值，可在组件 style 中直接引用。`,
      },
    },
  },
  render: () => {
    const all = Object.entries(webLightTheme) as Array<[string, string]>;
    const pick = (prefix: string) => all.filter(([k]) => k.startsWith(prefix));
    const isColor = (k: string) => k.startsWith("color");
    const groups: Array<[string, Array<[string, string]>]> = [
      ["颜色 Colors", pick("color")],
      ["字体族 Font families", pick("fontFamily")],
      ["字号 Font sizes", pick("fontSize")],
      ["字重 Font weights", pick("fontWeight")],
      ["行高 Line heights", pick("lineHeight")],
      ["圆角 Border radius", pick("borderRadius")],
      ["描边宽度 Stroke widths", pick("strokeWidth")],
      ["间距 Spacing", pick("spacing")],
      ["动画时长 / 曲线 Duration & curve", [...pick("duration"), ...pick("curve")]],
      ["阴影 Shadows", pick("shadow")],
    ];
    const tableStyle: JSX.CSSProperties = {
      "border-collapse": "collapse",
      width: "100%",
      "max-width": "820px",
      "font-size": tokens.fontSizeBase200,
    };
    const cellStyle: JSX.CSSProperties = {
      "text-align": "start",
      padding: "6px 10px",
      "border-bottom": `1px solid ${tokens.colorNeutralStroke2}`,
    };
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "28px" }}>
        <For each={groups}>
          {([title, entries]) => (
            <section>
              <Title3 style={{ "margin-bottom": "8px" }}>{title}</Title3>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ color: tokens.colorNeutralForeground2 }}>
                    <th style={cellStyle}>Token</th>
                    <th style={cellStyle}>值</th>
                    <th style={cellStyle}>预览</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={entries}>
                    {([name, value]) => (
                      <tr>
                        <td style={cellStyle}>
                          <code>{name}</code>
                        </td>
                        <td style={{ ...cellStyle, "font-family": tokens.fontFamilyMonospace }}>
                          {value}
                        </td>
                        <td style={cellStyle}>
                          {isColor(name) ? (
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                "border-radius": "4px",
                                background: value,
                                border: `1px solid ${tokens.colorNeutralStroke1}`,
                              }}
                            />
                          ) : (
                            <span style={{ color: tokens.colorNeutralForeground3 }}>—</span>
                          )}
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </section>
          )}
        </For>
      </div>
    );
  },
};
