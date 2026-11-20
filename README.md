# Solid Fluent Components

[![CI](https://github.com/NoelOrin/solid-fluent-components/actions/workflows/ci.yml/badge.svg)](https://github.com/NoelOrin/solid-fluent-components/actions/workflows/ci.yml)
[![Pages](https://github.com/NoelOrin/solid-fluent-components/actions/workflows/pages.yml/badge.svg)](https://noelorin.github.io/solid-fluent-components/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**中文** · [English](#english)

在线 Storybook（GitHub Pages）：https://noelorin.github.io/solid-fluent-components/ —— 默认中文，可在工具栏切换 English。

## 技术栈

- SolidJS 1.9
- Vite 8
- TypeScript 7
- `@floating-ui/dom`（Menu / Tooltip / Popover 定位）

## 快速开始

```bash
pnpm install

# 类型检查
pnpm typecheck

# 构建库产物
pnpm build

# Storybook 组件文档
pnpm storybook
pnpm build-storybook
```

Storybook 本地预览：`http://localhost:6006`

## 使用示例

```tsx
import {
  Button,
  FluentProvider,
  webLightTheme,
} from "@solid-fluent/components";
import "@solid-fluent/components/styles.css";

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">Hello Fluent</Button>
    </FluentProvider>
  );
}
```

## 已实现

- 主题：`FluentProvider`、`webLightTheme`、`webDarkTheme`、`tokens`
- 输入：`Button`、`CompoundButton`、`ToggleButton`、`SplitButton`、`MenuButton`、`Input`、`SearchBox`、`Textarea`、`Checkbox`、`Radio`、`RadioGroup`、`Switch`、`SpinButton`、`Select`、`Dropdown`、`ComboboxField`、`Slider`、`Rating`、`Field`、`Label`、`InfoLabel`
- 展示：`Text`/`Title*`、`Avatar`、`AvatarGroup`、`PresenceBadge`、`Badge`、`Spinner`、`Card`、`Skeleton`、`ProgressBar`、`Persona`、`Tag`、`TagPicker`、`InteractionTag`、`Image`、`Divider`、`Link`、`SwatchPicker`、`EmptyState`
- 反馈：`Dialog`、`Drawer`、`InlineDrawer`、`MessageBar`、`Toast`/`Toaster`、`TeachingPopover`
- 导航：`TabList`/`Tab`、`Accordion`、`Breadcrumb`、`Toolbar`、`Menu`、`Nav`、`AppItem`、`Pagination`、`Stepper`
- 浮层：`Tooltip`、`Popover`/`PopoverTrigger`/`PopoverSurface`、`SimplePopover`、`Portal`、`Carousel`
- 选择器：`ColorPicker`/`ColorArea`/`ColorSlider`/`AlphaSlider`、`DatePicker`/`Calendar`、`TimePicker`
- 数据：`Table`、`DataGrid`、`Tree`、`List`、`Virtualizer`、`Overflow`
- 布局：`Stack`

## 目录

```text
src/
  theme/          # 主题令牌与 Provider
  components/     # 按 Fluent UI Storybook Components 分类组织
    button/       # Button / CompoundButton / MenuButton / SplitButton / ToggleButton
    card/         # Card / CardHeader / CardPreview / CardFooter
    badge/        # Badge / CounterBadge / PresenceBadge
    tag/          # Tag / TagGroup / InteractionTag
    drawer/       # Drawer / InlineDrawer / OverlayDrawer
    tree/         # Tree / FlatTree
    motion/       # PresenceGroup
    utilities/    # ARIA live / Overlay / Pagination / Stack / Virtualizer
    stories/      # Storybook stories
  styles/         # Fluent 风格样式
  utils/          # 工具函数
playground/       # 本地演示
```

## Storybook

- 在线文档（GitHub Pages）：https://noelorin.github.io/solid-fluent-components/ ，每次 push 到 `main` 由 `.github/workflows/pages.yml` 自动构建并发布；PR 上 `.github/workflows/ci.yml` 也会构建一次做门禁。
- 默认语言为 **中文**，工具栏「语言 / Locale」可切换 `中文（默认）` / `English`；切换后所有走 `t()` 的组件文案即时更新。
- 框架：`storybook-solidjs-vite` + Storybook 10
- 主题切换：工具栏 Light / Dark，另有 Web / Violet / Emerald 三套主题族
- API 说明：`Introduction/API`（MDX 总表）+ 各组件 Story 的 Docs 描述 / Controls
- 兼容说明：项目编译使用 TypeScript 7；`storybook-solidjs-vite` 的 docgen 依赖 TypeScript 5 API，因此通过 `scripts/pin-storybook-typescript.mjs` 为其固定 TS 5.9，并关闭 docgen。
- Pages 构建会设置 `GITHUB_PAGES=1`，由 `.storybook/main.ts` 把 Vite `base` 改为 `/<repo>/`，保证子路径部署时静态资源可寻址；本地 `pnpm storybook` 仍走根路径。

## 国际化（i18n）

基于 [`x18n`](https://github.com/florian/x18n) 提供全局响应式的翻译函数，内置 `en` / `zh-CN`
两套组件文案（关闭、清除、移除、上一张/下一张、月份切换等）。默认语言为 `en`；Storybook 中默认 `zh-CN`。

```tsx
import { I18nProvider, setLocale, t } from "@solid-fluent/components";
import "@solid-fluent/components/styles.css";

// 全局切换：所有 t() 消费者自动更新
setLocale("zh-CN");

// 子树作用域（进入时设置，卸载时恢复）
<I18nProvider locale="zh-CN">
  <App />
</I18nProvider>;

// 自定义 / 覆盖词条
t("common.close"); // "关闭"（随当前语言变化）
```

API：`t(key, ...args)`、`tp(key, n)`（复数）、`setLocale()`、`getLocale()`、
`availableLocales()`、`registerDictionary(locale, dict)`、`I18nProvider`、`useI18n()`。
`x18n` 支持 `%1` 位置插值、`%{name}` 命名插值和 `plural(n)`；组件自身文案走 `t()`，
业务文案可直接 `registerDictionary` 扩展。`t()` 读取一个 signal，因此在 Solid JSX 中随语言切换自动重渲染。

## 深度打磨（当前）

- Combobox：多选标签、过滤、方向键 / Home / End / Enter / Esc / Backspace
- Dropdown：键盘打开、高亮、首字母跳转
- List / Menu / Dialog：键盘导航、焦点陷阱、Esc 关闭
- DatePicker：日历键盘漫游、`DateRangePicker` / `CalendarDateRange`
- DataGrid：`virtualized` 虚拟滚动、行键盘导航、排序与多选
- 共享 a11y 工具：`createFocusTrap`、`moveActiveIndex`、`getFocusableElements`

## 说明

当前是可用的 Solid 重写骨架与高频组件集合，API 尽量贴近 Fluent UI v9，但并非完整 1:1 兼容层。后续可继续补齐 `DataGrid`、`Tree`、`Combobox` 完整交互、`DatePicker` 等。

## 发版

发版使用 Changesets。每个需要进入下个版本的改动，先在 `.changeset/` 添加一个变更文件：

```md
---
"@solid-fluent/components": patch
---

修复组件行为。
```

发布所需的 Actions secret：

- `NPM_TOKEN`：npm 发布令牌（需在仓库 Settings -> Secrets 中配置）。
- `GITHUB_TOKEN`：GitHub Actions 内置令牌，workflow 已声明 `contents: write`，无需手动配置。

changeset 合并到 `main` 后流程全自动，无需手动触发：Release workflow 会自动创建（或更新）一个 **Version Packages** PR，包含版本号提升与生成的 `CHANGELOG.md`；该 PR 合并回 `main` 后自动执行类型检查、测试、npm 构建并发布 npm 包，随后打 `@solid-fluent/components@x.y.z` 标签并创建 GitHub Release。没有待发布 changeset 时 workflow 空跑，不会发布。

---

## English

A SolidJS rewrite of Fluent UI style components, targeting the theming and common APIs of `@fluentui/react-components`.

[中文](#solid-fluent-components) · **English**

Live Storybook (GitHub Pages): https://noelorin.github.io/solid-fluent-components/ — Chinese by default; switch to English from the toolbar.

### Tech stack

- SolidJS 1.9
- Vite 8
- TypeScript 7
- `@floating-ui/dom` (Menu / Tooltip / Popover positioning)

### Getting started

```bash
pnpm install

# typecheck
pnpm typecheck

# build the library
pnpm build

# Storybook component docs
pnpm storybook
pnpm build-storybook
```

Storybook locally: `http://localhost:6006`

### Usage

```tsx
import {
  Button,
  FluentProvider,
  webLightTheme,
} from "@solid-fluent/components";
import "@solid-fluent/components/styles.css";

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">Hello Fluent</Button>
    </FluentProvider>
  );
}
```

### Implemented

- Theming: `FluentProvider`, `webLightTheme`, `webDarkTheme`, `tokens`
- Inputs: `Button`, `CompoundButton`, `ToggleButton`, `SplitButton`, `MenuButton`, `Input`, `SearchBox`, `Textarea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `SpinButton`, `Select`, `Dropdown`, `ComboboxField`, `Slider`, `Rating`, `Field`, `Label`, `InfoLabel`
- Display: `Text`/`Title*`, `Avatar`, `AvatarGroup`, `PresenceBadge`, `Badge`, `Spinner`, `Card`, `Skeleton`, `ProgressBar`, `Persona`, `Tag`, `TagPicker`, `InteractionTag`, `Image`, `Divider`, `Link`, `SwatchPicker`, `EmptyState`
- Feedback: `Dialog`, `Drawer`, `InlineDrawer`, `MessageBar`, `Toast`/`Toaster`, `TeachingPopover`
- Navigation: `TabList`/`Tab`, `Accordion`, `Breadcrumb`, `Toolbar`, `Menu`, `Nav`, `AppItem`, `Pagination`, `Stepper`
- Overlay: `Tooltip`, `Popover`/`PopoverTrigger`/`PopoverSurface`, `SimplePopover`, `Portal`, `Carousel`
- Pickers: `ColorPicker`/`ColorArea`/`ColorSlider`/`AlphaSlider`, `DatePicker`/`Calendar`, `TimePicker`
- Data: `Table`, `DataGrid`, `Tree`, `List`, `Virtualizer`, `Overflow`
- Layout: `Stack`

### Structure

```text
src/
  theme/          # theme tokens and Provider
  components/     # organized by Fluent UI Storybook Components
    button/       # Button / CompoundButton / MenuButton / SplitButton / ToggleButton
    card/         # Card / CardHeader / CardPreview / CardFooter
    badge/        # Badge / CounterBadge / PresenceBadge
    tag/          # Tag / TagGroup / InteractionTag
    drawer/       # Drawer / InlineDrawer / OverlayDrawer
    tree/         # Tree / FlatTree
    motion/       # PresenceGroup
    utilities/    # ARIA live / Overlay / Pagination / Stack / Virtualizer
    stories/      # Storybook stories
  styles/         # Fluent-style CSS
  utils/          # utilities
playground/       # local demo
```

### Storybook

- Online docs (GitHub Pages): https://noelorin.github.io/solid-fluent-components/ — built and deployed on every push to `main` by `.github/workflows/pages.yml`; PRs are also gated by a Storybook build in `.github/workflows/ci.yml`.
- The default locale is **Chinese**; use the "语言 / Locale" toolbar to switch between `中文（默认）` and `English`. All `t()`-backed strings update immediately.
- Framework: `storybook-solidjs-vite` + Storybook 10
- Theming: Light / Dark toolbar plus the Web / Violet / Emerald theme families
- API docs: `Introduction/API` (MDX index) plus Docs descriptions / Controls on each story
- Compatibility note: the project compiles with TypeScript 7, while `storybook-solidjs-vite` docgen needs the TypeScript 5 API, so `scripts/pin-storybook-typescript.mjs` pins TS 5.9 for it and disables docgen.
- Pages builds set `GITHUB_PAGES=1`, which makes `.storybook/main.ts` use `/<repo>/` as Vite `base` so assets resolve under the project subpath; local `pnpm storybook` still uses the root path.

### Internationalization (i18n)

Built on [`x18n`](https://github.com/florian/x18n), providing a globally reactive translation function with built-in `en` / `zh-CN` component strings (close, clear, remove, next/previous, month navigation, etc.). The library default is `en`; Storybook defaults to `zh-CN`.

```tsx
import { I18nProvider, setLocale, t } from "@solid-fluent/components";
import "@solid-fluent/components/styles.css";

// Global switch: every t() consumer updates automatically
setLocale("zh-CN");

// Scoped subtree (set on enter, restore on unmount)
<I18nProvider locale="zh-CN">
  <App />
</I18nProvider>;

// Custom / overridden entries
t("common.close"); // "关闭" (follows the current locale)
```

API: `t(key, ...args)`, `tp(key, n)` (plural), `setLocale()`, `getLocale()`,
`availableLocales()`, `registerDictionary(locale, dict)`, `I18nProvider`, `useI18n()`.
`x18n` supports `%1` positional interpolation, `%{name}` named interpolation and `plural(n)`; component strings go through `t()`, and app strings can be added with `registerDictionary`. `t()` reads a signal, so Solid JSX re-renders automatically when the locale changes.

### Polished interactions

- Combobox: multi-select tags, filtering, Arrow / Home / End / Enter / Esc / Backspace
- Dropdown: keyboard open, highlight, type-ahead
- List / Menu / Dialog: keyboard navigation, focus trap, Esc to close
- DatePicker: calendar keyboard roaming, `DateRangePicker` / `CalendarDateRange`
- DataGrid: `virtualized` scrolling, row keyboard navigation, sorting and multi-select
- Shared a11y helpers: `createFocusTrap`, `moveActiveIndex`, `getFocusableElements`

### Notes

This is a working Solid rewrite skeleton with high-frequency components. The API stays close to Fluent UI v9 but is not a complete 1:1 compatibility layer. Future work can complete `DataGrid`, `Tree`, `Combobox` interactions and `DatePicker`.

### Releasing

Releases use Changesets. Add a changeset for every change that should ship:

```md
---
"@solid-fluent/components": patch
---

Fix component behavior.
```

Required Actions secrets:

- `NPM_TOKEN`: npm publish token (configure in repo Settings -> Secrets).
- `GITHUB_TOKEN`: built into GitHub Actions; the workflow already declares `contents: write`, no manual setup needed.

Once the changeset is merged into `main`, everything runs automatically — no manual trigger: the Release workflow opens (or updates) a **Version Packages** PR carrying the version bump and generated `CHANGELOG.md`. When that PR is merged back into `main`, CI runs typecheck, tests and the npm build, publishes to npm, then tags `@solid-fluent/components@x.y.z` and creates a GitHub Release. With no pending changesets the workflow is a no-op and never publishes.
