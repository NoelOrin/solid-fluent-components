# @solid-fluent/components

## 0.2.0

### Minor Changes

- fa976cd: 大面积补齐 Fluent UI v9 交互与 API 对齐：修复 DataGrid 选中态刷新、OverlayDrawer 空壳、非模态 Esc、TabList/Tree/List/Rating/SpinButton/TagPicker/Calendar 等键盘与焦点问题，补齐 Tooltip/Field/Dialog/Drawer/Toast 的 ARIA 关联，落地 avatar/badge/card/skeleton/divider 等变体样式，并补齐 60+ 主题令牌。新增 web / violet / emerald 三套主题族（各含亮暗模式）与一键导出主题（JSON / CSS / TS）能力。
- fa976cd: 基于 x18n 接入国际化：新增响应式 t()/tp()、setLocale()/getLocale()、registerDictionary()、I18nProvider 与 useI18n()，内置 en / zh-CN 组件文案；Dialog / Drawer / Tooltip / Combobox / DatePicker / Carousel / Tag / Tree 等组件的硬编码 aria-label 改为走 i18n，切换语言后自动更新。
- fa976cd: 补齐 Fluent UI React v9 公开组件面：新增 DataGrid 组合子组件（DataGridHeader、DataGridHeaderCell、DataGridBody、DataGridRow、DataGridCell、DataGridSelectionCell）、Table 行操作单元 TableCellActions、以及 TeachingPopoverCarouselFooterButton。对齐官方 v9 公开组件导出面至 172/172。

### Patch Changes

- f5d2778: npm 发布适配：移除引用未打包脚本的 postinstall（此前消费者安装会因缺少 `scripts/` 文件而失败），补全 repository / author / homepage / `./package.json` 导出 / publishConfig 等包元数据，发版流程改为 changesets 自动发版。
- fa976cd: 美化 Storybook 管理器、画布与 Docs 样式，重做欢迎页；重构 Design Token Playground，支持搜索、分组折叠、只看已修改项、Light/Dark 基底切换与导出 JSON，并修复编辑 token 后预览不实时更新的问题。
