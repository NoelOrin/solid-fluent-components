---
"@solid-fluent/components": patch
---

npm 发布适配：移除引用未打包脚本的 postinstall（此前消费者安装会因缺少 `scripts/` 文件而失败），补全 repository / author / homepage / `./package.json` 导出 / publishConfig 等包元数据，发版流程改为 changesets 自动发版。
