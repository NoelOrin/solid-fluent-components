# Remaining 工作清单

更新时间：2026-09-17

## 已完成

- 为核心组件补齐基础行为测试，覆盖渲染、关键属性、可访问性状态和代表性交互。
- 覆盖输入、选择、反馈、导航、布局、数据和展示组件。
- 为 `Announcer`、`Avatar`、`Skeleton`、`Text`、`Tooltip` 补齐最后一批测试。
- 修正测试对 Portal、受控属性、原生表单控件和组件实际 DOM 结构的错误假设。
- `pnpm typecheck` 通过。
- `pnpm test` 通过：72 个测试文件，133 个用例。

## 明确边界

## 公开组件对齐（2026-09-17）

- 依据 `@fluentui/react-components@9.74.5` 各子包 `ForwardRefComponent` 声明，提取官方公开组件面共 172 个。
- 补齐最后缺失的 8 个公开组件：DataGridHeader、DataGridHeaderCell、DataGridBody、DataGridRow、DataGridCell、DataGridSelectionCell、TableCellActions、TeachingPopoverCarouselFooterButton。
- 公共组件导出对齐达成 172/172，0 缺失；`typecheck`、`test`(72 文件 / 136 用例)、`vite build` 与 `tsc` 声明发射均通过。
- 说明：`audit-fluent-parity` 报告的 1600+ “缺失” 项为内部类型/Slott/State/Context/hooks，属 React 实现细节，不纳入 Solid 组件库范围。

`scripts/audit-fluent-parity.mjs` 对比的是 `@fluentui/react-components@9.74.5` 的完整导出面。当前报告中的大量缺失项属于 Fluent 内部实现符号，例如：

- `_unstable` hooks
- `*Slots`、`*State` 和上下文类型
- 内部 class names、tokens 和渲染辅助函数

本项目定位是 SolidJS 的高频 Fluent 风格组件库，而不是 React Fluent UI 的完整 1:1 兼容层，因此这些内部导出不纳入本轮 Remaining 实现范围。

## 后续候选

- 对高复杂度组件增加键盘导航、焦点管理和受控/非受控状态的边界测试。
- 为组件 API 增加与 Fluent 官方示例的快照或契约测试。
- 若未来改为完整兼容层，再按 parity 报告分组件族迁移内部类型和 hooks。

## 严格对齐复核（2026-09-17）

- 以 `@fluentui/react-components@9.74.5` 主包 `index.d.ts` 的 `import { X } from '@fluentui/*'` 导出为准，统计其大写导出共约 730 个，其中除 172 个公开组件外，其余均为 `*Props`/`*Slots`/`*State`/上下文/枚举/`*Handler`/`*Data`/hooks 等类型与内部符号。
- 对“非类型类”缺失项复核后，剩余 5 个（AccordionHeaderExpandIconPosition、AccordionIndex、AccordionToggleEventHandler、AvatarNamedColor、AvatarSizes）均为枚举/联合类型，而非组件。
- 结论：公开组件导出对齐 **172/172，0 缺失**；`typecheck`、全量 `test`（72 文件 / 136 用例）、`vite build` 与 `tsc` 声明发射均通过。
