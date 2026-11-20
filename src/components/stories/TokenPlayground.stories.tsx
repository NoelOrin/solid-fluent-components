import { For, Show, createMemo, createSignal, type Accessor, type JSX } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  FluentProvider,
  copyTextToClipboard,
  serializeTheme,
  webDarkTheme,
  webLightTheme,
  type Theme,
  type ThemeExportFormat,
  type TokenName,
} from "../../theme/index";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { Badge } from "../badge/Badge";
import { Body1, Caption1, Title2 } from "../text/Text";
import "../../token-playground.css";

const meta = {
  title: "Design Token Playground",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "交互式 design token 检查器：左侧搜索 / 分组 / 编辑任意令牌，右侧页面实时预览。支持 Light / Dark 基底、只看已修改项与导出 JSON。",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type TokenGroup = {
  id: string;
  title: string;
  keys: TokenName[];
};

function buildGroup(id: string, title: string, prefixes: string[]): TokenGroup {
  const keys = (Object.keys(webLightTheme) as TokenName[]).filter((key) =>
    prefixes.some((prefix) => key.startsWith(prefix)),
  );
  return { id, title, keys };
}

const GROUPS: TokenGroup[] = [
  buildGroup("brand", "品牌色 Brand", ["colorBrand"]),
  buildGroup("foreground", "前景色 Foreground", ["colorNeutralForeground"]),
  buildGroup("background", "背景色 Background", ["colorNeutralBackground"]),
  buildGroup("stroke", "描边 Stroke", ["colorNeutralStroke"]),
  buildGroup("status", "状态 / 语义色 Status", ["colorStatus", "colorPalette"]),
  buildGroup("font", "字体 Font", ["fontFamily", "fontSize", "fontWeight"]),
  buildGroup("line", "行高 Line height", ["lineHeight"]),
  buildGroup("shape", "圆角 / 描边宽度 Shape", ["borderRadius", "strokeWidth"]),
  buildGroup("space", "间距 Spacing", ["spacingHorizontal", "spacingVertical"]),
  buildGroup("motion", "动效 Motion", ["duration", "curve"]),
  buildGroup("shadow", "阴影 Shadow", ["shadow"]),
];

const SAMPLE_KEYS: TokenName[] = [
  "colorBrandBackground",
  "colorBrandForeground1",
  "colorNeutralBackground1",
  "colorNeutralForeground1",
  "colorNeutralStroke1",
  "borderRadiusMedium",
  "spacingHorizontalM",
  "fontSizeBase300",
];

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function isHexColor(value: string): boolean {
  return HEX.test(value.trim());
}

function toColorInputValue(value: string): string {
  const v = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    return `#${v
      .slice(1)
      .split("")
      .map((c) => c + c)
      .join("")}`;
  }
  return "#0f6cbd";
}

function sampleStyle(props: { name: string; value: string }): JSX.CSSProperties {
  const n = props.name;
  const v = props.value;
  if (n.startsWith("fontSize")) return { "font-size": `min(${v}, 20px)` };
  if (n.startsWith("fontWeight")) return { "font-weight": v };
  if (n.startsWith("fontFamily")) return { "font-family": v, "font-size": "13px" };
  if (n.startsWith("lineHeight")) return { "line-height": v, "font-size": "12px" };
  if (n.startsWith("borderRadius")) {
    return { width: "22px", height: "22px", border: "1px solid currentColor", "border-radius": v };
  }
  if (n.startsWith("strokeWidth")) {
    return { width: "24px", height: v, background: "currentColor" };
  }
  if (n.startsWith("spacingHorizontal")) {
    return { width: `min(${v}, 26px)`, height: "6px", background: "currentColor" };
  }
  if (n.startsWith("spacingVertical")) {
    return { width: "6px", height: `min(${v}, 26px)`, background: "currentColor" };
  }
  if (n.startsWith("shadow")) {
    return {
      width: "22px",
      height: "22px",
      border: "1px solid currentColor",
      "box-shadow": v,
    };
  }
  return { "font-size": "11px" };
}

function TokenRow(props: {
  name: TokenName;
  value: Accessor<string>;
  modified: Accessor<boolean>;
  onInput: (value: string) => void;
  onReset: () => void;
}) {
  const color = () => isHexColor(props.value());

  return (
    <div class="tp-row" data-modified={props.modified() ? "true" : "false"}>
      <div class={`tp-row__sample${color() ? " tp-row__sample--color" : ""}`}>
        <Show
          when={color()}
          fallback={<span style={sampleStyle({ name: props.name, value: props.value() })}>Aa</span>}
        >
          <span style={{ background: props.value() }} />
        </Show>
      </div>
      <div style={{ "min-width": "0" }}>
        <code class="tp-row__name" title={props.name}>
          {props.name}
        </code>
        <div class="tp-row__value">
          <input
            class="tp-row__input"
            value={props.value()}
            onInput={(event) => props.onInput(event.currentTarget.value)}
            aria-label={`${props.name} 的值`}
            spellcheck={false}
          />
          <Show when={color()}>
            <input
              type="color"
              class="tp-row__picker"
              value={toColorInputValue(props.value())}
              onInput={(event) => props.onInput(event.currentTarget.value)}
              aria-label={`${props.name} 取色器`}
            />
          </Show>
          <button
            type="button"
            class="tp-row__reset"
            disabled={!props.modified()}
            onClick={props.onReset}
            title="恢复默认"
            aria-label={`重置 ${props.name}`}
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  );
}

function SwatchGroup(props: { theme: Accessor<Theme>; names: TokenName[] }) {
  return (
    <div class="tp-swatches">
      <For each={props.names}>
        {(name) => (
          <div class="tp-swatch">
            <div class="tp-swatch__chip" style={{ background: props.theme()[name] }} />
            <span class="tp-swatch__name" title={name}>
              {name}
            </span>
          </div>
        )}
      </For>
    </div>
  );
}

function PlaygroundPage(props: { theme: Accessor<Theme> }) {
  const t = () => props.theme();
  const brandSwatches: TokenName[] = [
    "colorBrandBackground",
    "colorBrandBackgroundHover",
    "colorBrandBackgroundPressed",
    "colorBrandForeground1",
    "colorBrandStroke1",
  ];
  const neutralSwatches: TokenName[] = [
    "colorNeutralBackground1",
    "colorNeutralBackground2",
    "colorNeutralBackground3",
    "colorNeutralForeground1",
    "colorNeutralForeground2",
    "colorNeutralStroke1",
  ];
  const statusSwatches: TokenName[] = [
    "colorStatusSuccessForeground1",
    "colorStatusWarningForeground1",
    "colorStatusDangerForeground1",
    "colorStatusDangerBackground1",
    "colorStatusSuccessBackground1",
  ];
  const typeScale: Array<{ token: TokenName; label: string }> = [
    { token: "fontSizeBase100", label: "Caption" },
    { token: "fontSizeBase200", label: "Small" },
    { token: "fontSizeBase300", label: "Body" },
    { token: "fontSizeBase400", label: "Subtitle" },
    { token: "fontSizeBase500", label: "Title 3" },
    { token: "fontSizeHero700", label: "Title 1" },
  ];
  const radii: TokenName[] = [
    "borderRadiusSmall",
    "borderRadiusMedium",
    "borderRadiusLarge",
    "borderRadiusXLarge",
    "borderRadiusCircular",
  ];
  const shadows: TokenName[] = ["shadow2", "shadow4", "shadow8", "shadow16"];

  return (
    <FluentProvider theme={props.theme()} style={{ "min-height": "100%" }}>
      <div class="tp-page">
        <header class="tp-topbar">
        <div class="tp-brand">
          <span class="tp-brand__mark">SF</span>
          <span>Solid Fluent · Token Preview</span>
        </div>
        <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
          <Badge appearance="tint" color="success">
            Live
          </Badge>
          <Button appearance="outline" size="small">
            操作
          </Button>
        </div>
      </header>

      <section class="tp-hero">
        <h1>Design tokens in action</h1>
        <p>
          这个页面完全由 design token 驱动。修改左侧任意令牌，观察背景、前景、圆角、间距、
          排版与阴影如何同步变化——无需刷新，也无需改一行组件代码。
        </p>
        <div class="tp-hero__actions">
          <Button appearance="primary">Primary action</Button>
          <Button appearance="outline">Secondary</Button>
          <Button appearance="subtle">Subtle</Button>
        </div>
      </section>

      <div class="tp-grid">
        <section class="tp-panel">
          <h3 class="tp-panel__title">组件样本</h3>
          <p class="tp-panel__desc">按钮、输入与徽章直接读取主题令牌。</p>
          <div class="tp-form">
            <Input placeholder="搜索内容" />
            <Input value="示例文本" />
          </div>
          <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap", "margin-top": "14px" }}>
            <Badge color="brand">Brand</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="warning">Warning</Badge>
            <Badge color="danger">Danger</Badge>
            <Badge appearance="outline">Outline</Badge>
          </div>
        </section>

        <section class="tp-panel">
          <h3 class="tp-panel__title">颜色令牌</h3>
          <p class="tp-panel__desc">品牌色、中性色与语义状态色。</p>
          <SwatchGroup theme={props.theme} names={brandSwatches} />
          <div style={{ height: "10px" }} />
          <SwatchGroup theme={props.theme} names={neutralSwatches} />
          <div style={{ height: "10px" }} />
          <SwatchGroup theme={props.theme} names={statusSwatches} />
        </section>

        <section class="tp-panel">
          <h3 class="tp-panel__title">排版阶梯</h3>
          <p class="tp-panel__desc">字号令牌与行高令牌共同决定阅读节奏。</p>
          <div class="tp-scale">
            <For each={typeScale}>
              {(item) => (
                <div class="tp-scale__row">
                  <span style={{ "font-size": t()[item.token] }}>{item.label}</span>
                  <span class="tp-scale__note">{item.token}</span>
                </div>
              )}
            </For>
          </div>
        </section>

        <section class="tp-panel">
          <h3 class="tp-panel__title">形状与阴影</h3>
          <p class="tp-panel__desc">圆角梯度及阴影层级。</p>
          <div class="tp-radius-row">
            <For each={radii}>
              {(name) => (
                <div class="tp-radius-box" style={{ "border-radius": t()[name] }}>
                  {name.replace("borderRadius", "")}
                </div>
              )}
            </For>
          </div>
          <div style={{ height: "16px" }} />
          <div class="tp-shadow-row">
            <For each={shadows}>
              {(name) => (
                <div class="tp-shadow-box" style={{ "box-shadow": t()[name] }}>
                  {name}
                </div>
              )}
            </For>
          </div>
        </section>
      </div>

        <footer class="tp-footer">
          <Caption1>Solid Fluent Components · Design Token Playground</Caption1>
          <Body1 style={{ "font-size": "12px" }}>所有样式均由 --sf-* CSS 变量驱动</Body1>
        </footer>
      </div>
    </FluentProvider>
  );
}

export const DynamicTokenPage: Story = {
  name: "Token 检查器",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "左侧检查器支持搜索、分组折叠、仅看已修改项、Light / Dark 基底切换与导出 JSON；右侧为实时预览页面。",
      },
    },
  },
  render: () => {
    const [base, setBase] = createSignal<"light" | "dark">("light");
    const [overrides, setOverrides] = createSignal<Partial<Theme>>({});
    const [query, setQuery] = createSignal("");
    const [onlyModified, setOnlyModified] = createSignal(false);
    const [openGroups, setOpenGroups] = createSignal<Set<string>>(
      new Set(GROUPS.slice(0, 2).map((group) => group.id)),
    );
    const [copiedFormat, setCopiedFormat] = createSignal<ThemeExportFormat | null>(null);

    const baseTheme = createMemo(() => (base() === "dark" ? webDarkTheme : webLightTheme));
    const theme = createMemo<Theme>(() => ({ ...baseTheme(), ...overrides() }));
    const modifiedKeys = createMemo(() => Object.keys(overrides()) as TokenName[]);

    const setValue = (name: TokenName, value: string) =>
      setOverrides((prev) => ({ ...prev, [name]: value }));

    const resetOne = (name: TokenName) =>
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });

    const resetAll = () => setOverrides({});

    const toggleGroup = (id: string) =>
      setOpenGroups((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

    const isOpen = (id: string) => query().trim().length > 0 || openGroups().has(id);

    const filteredGroups = createMemo(() => {
      const q = query().trim().toLowerCase();
      const modified = new Set(modifiedKeys());
      return GROUPS.map((group) => {
        let keys = group.keys;
        if (onlyModified()) keys = keys.filter((key) => modified.has(key));
        if (q) keys = keys.filter((key) => key.toLowerCase().includes(q));
        return { ...group, keys };
      }).filter((group) => group.keys.length > 0);
    });

    const copyTheme = async (format: ThemeExportFormat) => {
      const text = serializeTheme(theme(), format, { name: `${base()}Theme` });
      const ok = await copyTextToClipboard(text);
      setCopiedFormat(ok ? format : null);
      window.setTimeout(() => setCopiedFormat(null), 1600);
    };

    return (
      <div class="tp-workspace">
        <aside class="tp-sidebar">
          <div class="tp-sidebar__head">
            <h3 class="tp-sidebar__title">
              <span>Token 检查器</span>
              <Badge appearance="tint" color="brand">
                {modifiedKeys().length} 项已改
              </Badge>
            </h3>
            <p class="tp-sidebar__subtitle">
              搜索或折叠分组，编辑任意令牌；右侧页面会实时反映修改。
            </p>
            <div class="tp-search">
              <span aria-hidden="true" style={{ color: "var(--sf-colorNeutralForeground3)" }}>
                ⌕
              </span>
              <input
                value={query()}
                onInput={(event) => setQuery(event.currentTarget.value)}
                placeholder="搜索 token，如 colorBrand、spacing"
                aria-label="搜索 token"
              />
              <Show when={query().length > 0}>
                <button
                  type="button"
                  class="tp-clear"
                  onClick={() => setQuery("")}
                  aria-label="清空搜索"
                >
                  ×
                </button>
              </Show>
            </div>
            <div class="tp-toolbar">
              <button
                type="button"
                class="tp-chip"
                data-active={base() === "light" ? "true" : "false"}
                onClick={() => setBase("light")}
              >
                Light
              </button>
              <button
                type="button"
                class="tp-chip"
                data-active={base() === "dark" ? "true" : "false"}
                onClick={() => setBase("dark")}
              >
                Dark
              </button>
              <button
                type="button"
                class="tp-chip"
                data-active={onlyModified() ? "true" : "false"}
                onClick={() => setOnlyModified(!onlyModified())}
              >
                仅已修改
              </button>
              <button type="button" class="tp-chip" onClick={resetAll}>
                重置全部
              </button>
              <button
                type="button"
                class="tp-chip tp-chip--accent"
                onClick={() => copyTheme("json")}
              >
                {copiedFormat() === "json" ? "JSON ✓" : "导出 JSON"}
              </button>
              <button
                type="button"
                class="tp-chip tp-chip--accent"
                onClick={() => copyTheme("css")}
              >
                {copiedFormat() === "css" ? "CSS ✓" : "导出 CSS"}
              </button>
              <button
                type="button"
                class="tp-chip tp-chip--accent"
                onClick={() => copyTheme("ts")}
              >
                {copiedFormat() === "ts" ? "TS ✓" : "导出 TS"}
              </button>
            </div>
            <div class="tp-status">
              <span class="tp-status__dot" />
              实时预览 · 共 {Object.keys(webLightTheme).length} 个 token
            </div>
          </div>

          <div class="tp-scroll">
            <Show
              when={filteredGroups().length > 0}
              fallback={<div class="tp-empty">没有匹配的 token，试试别的关键词。</div>}
            >
              <For each={filteredGroups()}>
                {(group) => (
                  <section class="tp-group" data-open={isOpen(group.id) ? "true" : "false"}>
                    <button type="button" class="tp-group__head" onClick={() => toggleGroup(group.id)}>
                      <span class="tp-chevron" aria-hidden="true">
                        ▶
                      </span>
                      <span class="tp-group__label">{group.title}</span>
                      <span class="tp-group__count">{group.keys.length}</span>
                    </button>
                    <Show when={isOpen(group.id)}>
                      <div class="tp-group__body">
                        <For each={group.keys}>
                          {(name) => (
                            <TokenRow
                              name={name}
                              value={() => theme()[name]}
                              modified={() => name in overrides()}
                              onInput={(value) => setValue(name, value)}
                              onReset={() => resetOne(name)}
                            />
                          )}
                        </For>
                      </div>
                    </Show>
                  </section>
                )}
              </For>
            </Show>
          </div>
        </aside>

        <div class="tp-preview">
          <PlaygroundPage theme={theme} />
        </div>
      </div>
    );
  },
};

export const QuickEdit: Story = {
  name: "常用 token 速改",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "只暴露最常用的 8 个 token，适合快速演示单个令牌对整页的影响。",
      },
    },
  },
  render: () => {
    const initial = webLightTheme;
    const [overrides, setOverrides] = createSignal<Partial<Theme>>({});
    const theme = createMemo<Theme>(() => ({ ...initial, ...overrides() }));
    const setValue = (name: TokenName, value: string) =>
      setOverrides((prev) => ({ ...prev, [name]: value }));

    return (
      <div class="tp-workspace">
        <aside class="tp-sidebar">
          <div class="tp-sidebar__head">
            <h3 class="tp-sidebar__title">速改常用 token</h3>
            <p class="tp-sidebar__subtitle">只展示最影响观感的 8 个令牌。</p>
            <div class="tp-toolbar">
              <button type="button" class="tp-chip" onClick={() => setOverrides({})}>
                重置全部
              </button>
            </div>
          </div>
          <div class="tp-scroll">
            <div class="tp-group" data-open="true">
              <div class="tp-group__body">
                <For each={SAMPLE_KEYS}>
                  {(name) => (
                    <TokenRow
                      name={name}
                      value={() => theme()[name]}
                      modified={() => name in overrides()}
                      onInput={(value) => setValue(name, value)}
                      onReset={() => setValue(name, initial[name])}
                    />
                  )}
                </For>
              </div>
            </div>
          </div>
        </aside>
        <div class="tp-preview">
          <PlaygroundPage theme={theme} />
        </div>
      </div>
    );
  },
};
