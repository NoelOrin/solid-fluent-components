# 手动发版 CI 设计

## 目标

通过 Gitea Actions 手动触发一次完整发版：校验代码、构建 npm 包和 Storybook、使用 Changesets 更新版本与 `CHANGELOG.md`、发布 npm 包、创建 Gitea Release 并上传 `dist` 产物。

## 方案

- 使用 `.gitea/workflows/release.yml`，触发器为 `workflow_dispatch`。
- 使用 Changesets 管理待发布变更。每个功能或修复通过 `.changeset/*.md` 声明版本级别和变更说明。
- 发版任务按 `typecheck -> test -> build -> build-storybook -> changeset version -> npm publish -> Gitea Release` 顺序执行。
- 发布失败时不创建 Release；版本提交和标签由 CI 统一生成，避免本地版本与发布版本不一致。
- 使用 `NPM_TOKEN` 发布 npm，使用 `RELEASE_TOKEN` 调用 Gitea Release API。

## 成功标准

1. 仓库设置页面可以手动运行 `Release` workflow。
2. 没有待发布 changeset 时，workflow 明确失败且不会发布。
3. 有待发布 changeset 时，CI 能生成版本、完整 `CHANGELOG.md`、npm 包、Git 标签和 Gitea Release。
4. 构建产物以 `dist.tar.gz` 附加到 Gitea Release。
