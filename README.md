# Solid Fluent Components

用 **SolidJS** 重写的 Fluent UI 风格组件库，对标 `@fluentui/react-components` 的主题与常用 API。

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

- 框架：`storybook-solidjs-vite` + Storybook 10
- 主题切换：工具栏 Light / Dark
- API 说明：`Introduction/API`（MDX 总表）+ 各组件 Story 的 Docs 描述 / Controls
- 兼容说明：项目编译使用 TypeScript 7；`storybook-solidjs-vite` 的 docgen 依赖 TypeScript 5 API，因此通过 `scripts/pin-storybook-typescript.mjs` 为其固定 TS 5.9，并关闭 docgen。

## 国际化（i18n）

基于 [`x18n`](https://github.com/florian/x18n) 提供全局响应式的翻译函数，内置 `en` / `zh-CN`
两套组件文案（关闭、清除、移除、上一张/下一张、月份切换等）。默认语言为 `en`。

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

changeset 合并到 `main` 后，在 GitHub 的 **Actions -> Release -> Run workflow** 中输入 `confirm: release` 并运行。CI 会依次执行类型检查、测试、npm 构建、Storybook 构建，随后生成版本和完整 `CHANGELOG.md`、发布 npm 包、创建 `v*` 标签及 GitHub Release，并上传 `dist.tar.gz`。没有待发布 changeset 时，流程会主动失败且不会发布。
