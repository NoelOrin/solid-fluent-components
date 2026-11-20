import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Stack, StackItem } from "../utilities/stack/Stack";
import { Button } from "../button/Button";
import { Text, Body1 } from "../text/Text";
import { Badge } from "../badge/Badge";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
弹性布局容器。

### Stack API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`horizontal\` | \`boolean\` | \`false\` | 横向排列 |
| \`reversed\` | \`boolean\` | \`false\` | 反向 |
| \`wrap\` | \`boolean\` | \`false\` | 换行 |
| \`verticalAlign\` | \`start \\| center \\| end \\| stretch \\| baseline\` | - | 交叉轴对齐 |
| \`horizontalAlign\` | \`start \\| center \\| end \\| space-between \\| space-around \\| space-evenly\` | - | 主轴对齐 |
| \`tokens.childrenGap\` | \`number \\| string\` | - | 子项间距 |
| \`tokens.padding\` | \`number \\| string\` | - | 内边距 |

### StackItem
\`grow\` / \`disableShrink\` / \`align\`
`,
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <Stack tokens={{ childrenGap: 12 }} style={{ width: "280px" }}>
      <Text>垂直堆叠</Text>
      <Button appearance="primary">一</Button>
      <Button>二</Button>
      <Button appearance="outline">三</Button>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
      <Button appearance="primary">保存</Button>
      <Button>取消</Button>
      <StackItem grow>
        <Text size={200}>右侧自适应空间</Text>
      </StackItem>
    </Stack>
  ),
};

export const WrapAndAlign: Story = {
  name: "Wrap and align",
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "20px", width: "420px" }}>
      <Stack horizontal wrap tokens={{ childrenGap: 8 }}>
        {["设计", "研发", "测试", "发布", "运维", "文档", "支持"].map((item) => (
          <Badge appearance="tint">{item}</Badge>
        ))}
      </Stack>
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        tokens={{ childrenGap: 12, padding: 12 }}
        style={{ border: "1px solid var(--sf-colorNeutralStroke1)", "border-radius": "8px" }}
      >
        <Body1>工具栏示例</Body1>
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <Button size="small" appearance="primary">新建</Button>
          <Button size="small" appearance="outline">导入</Button>
        </Stack>
      </Stack>
    </div>
  ),
};

export const Reversed: Story = {
  render: () => (
    <Stack reversed tokens={{ childrenGap: 8 }} style={{ width: "240px" }}>
      <Button appearance="primary">底部（视觉上在上）</Button>
      <Button>中间</Button>
      <Button appearance="outline">顶部（视觉上在下）</Button>
    </Stack>
  ),
};
