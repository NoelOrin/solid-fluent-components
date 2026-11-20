# Changesets

每个影响发布内容的改动都需要新增一个 changeset 文件：

```md
---
"@solid-fluent/components": patch
---

修复 Button 在键盘操作下的焦点行为。
```

版本级别可使用 `patch`、`minor` 或 `major`。合并 changeset 到 `main` 后，Release workflow 会自动开/更新 "Version Packages" PR；该 PR 合并后自动发版到 npm，无需手动触发。
