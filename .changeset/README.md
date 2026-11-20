# Changesets

每个影响发布内容的改动都需要新增一个 changeset 文件：

```md
---
"@solid-fluent/components": patch
---

修复 Button 在键盘操作下的焦点行为。
```

版本级别可使用 `patch`、`minor` 或 `major`。合并 changeset 后，在 GitHub Actions 的 `Release` workflow 中输入 `confirm: release` 手动运行发版。
