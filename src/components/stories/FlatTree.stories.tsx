import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { For } from "solid-js";
import {
  FlatTree,
  FlatTreeItem,
  HeadlessFlatTree,
  HeadlessFlatTreeItem,
  FlattenTreeItem,
} from "../tree/FlatTree";

const meta = {
  title: "Data/FlatTree",
  component: FlatTree,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
扁平树组件（适合虚拟化/大数据量）。

### API
| 属性 | 类型 | 说明 |
| --- | --- | --- |
| \`class\` | \`string\` | 容器类名 |

子件：\`FlatTreeItem\`（\`value\` / \`selected\` / \`onClick\`）/ \`HeadlessFlatTree\` + \`HeadlessFlatTreeItem\`（无 role/aria-selected）/ \`FlattenTreeItem\`（工具函数，把嵌套数据拍平）。
`,
      },
    },
  },
} satisfies Meta<typeof FlatTree>;

export default meta;
type Story = StoryObj<typeof meta>;

const nested = [
  {
    value: "root",
    children: [
      { value: "a", children: [{ value: "a1" }, { value: "a2" }] },
      { value: "b", children: [{ value: "b1" }] },
    ],
  },
] as any;

export const Default: Story = {
  render: () => (
    <FlatTree>
      <FlatTreeItem value="1">Item 1</FlatTreeItem>
      <FlatTreeItem value="2">Item 2</FlatTreeItem>
      <FlatTreeItem value="3">Item 3</FlatTreeItem>
    </FlatTree>
  ),
};

export const FromData: Story = {
  name: "从嵌套数据生成",
  render: () => {
    const flat = FlattenTreeItem(nested);
    return (
      <FlatTree>
        <For each={flat}>
          {(entry) => (
            <FlatTreeItem value={String(entry.item.value)}>
              {"  ".repeat(entry.depth)}
              {String(entry.item.value)}
            </FlatTreeItem>
          )}
        </For>
      </FlatTree>
    );
  },
};

export const Headless: Story = {
  name: "HeadlessFlatTree",
  render: () => (
    <HeadlessFlatTree>
      <HeadlessFlatTreeItem value="x" selected>
        无树语义的扁平项
      </HeadlessFlatTreeItem>
    </HeadlessFlatTree>
  ),
};
