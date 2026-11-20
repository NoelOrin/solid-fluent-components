# 手动发版 CI 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans` 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为单包 SolidJS 组件库提供 Gitea Actions 手动发版流水线。

**架构：** Changesets 保存待发布变更并生成版本与 `CHANGELOG.md`；Gitea Actions 在手动触发后完成校验、构建、提交版本、发布 npm 和创建 Gitea Release。

**技术栈：** Gitea Actions、Yarn Berry、Changesets、npm registry、Gitea Release API。

---

### 任务 1：接入 Changesets

**文件：**
- 创建：`.changeset/config.json`
- 创建：`.changeset/README.md`
- 修改：`package.json`、`yarn.lock`

- [ ] 添加 Changesets CLI 和单包配置。
- [ ] 验证 `yarn changeset status` 能识别仓库。

### 任务 2：实现 Gitea 发版工作流

**文件：**
- 创建：`.gitea/workflows/release.yml`

- [ ] 添加手动触发参数和并发锁。
- [ ] 执行依赖安装、类型检查、测试、npm 构建和 Storybook 构建。
- [ ] 使用 Changesets 生成版本与完整 changelog。
- [ ] 创建 Git 提交、标签、npm 发布和 Gitea Release。

### 任务 3：补充使用文档

**文件：**
- 修改：`README.md`

- [ ] 说明 changeset 文件格式、必需仓库 secrets 和手动发版入口。
- [ ] 说明无 changeset 时的失败行为。

### 任务 4：验证

- [ ] 运行 `yarn changeset status`。
- [ ] 运行 YAML 解析检查。
- [ ] 运行 `yarn typecheck`、`yarn test`、`yarn build` 和 `yarn build-storybook`。
- [ ] 检查工作区 diff，确认没有生成不应提交的构建目录变化。
