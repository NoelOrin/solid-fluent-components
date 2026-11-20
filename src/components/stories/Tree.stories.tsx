import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import {
  Tree,
  TreeItem,
  TreeItemLayout,
  TreeItemPersonaLayout,
  TreeRootReset,
} from "../tree/Tree";
import { Avatar } from "../avatar/Avatar";

const meta = {
  title: "Data/Tree",
  component: Tree,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
树组件。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`items\` | \`TreeItemData[]\` | - | 树数据 |
| \`openItems\` / \`defaultOpenItems\` | \`TreeItemValue[]\` | - | 展开的节点 |
| \`selectedItems\` / \`defaultSelectedItems\` | \`TreeItemValue[]\` | - | 选中节点 |
| \`selectionMode\` | \`single \\| multiselect \\| none\` | \`single\` | 选择模式 |
| \`appearance\` | \`subtle \\| subtle-alpha \\| transparent\` | \`subtle\` | 外观 |
| \`size\` | \`small \\| medium\` | \`medium\` | 尺寸 |
| \`onOpenChange\` / \`onSelect\` | 回调 | - | 事件 |

子件：\`TreeItem\` / \`TreeItemLayout\` / \`TreeItemPersonaLayout\` / \`TreeRootReset\`。

 键盘：↑/↓ 移动，→ 展开/进入子节点，← 折叠/回到父节点，Home/End 首尾，Enter/Space 选择，* 展开同级。
 \`TreeItemProvider\` 可为自定义 \`TreeItem\` 注入上下文状态。
`,
      },
    },
  },
  args: {
    onSelect: fn(),
  },
  argTypes: {
    selectionMode: { control: "select", options: ["single", "multiselect", "none"], description: "选择模式" },
    appearance: { control: "select", options: ["subtle", "subtle-alpha", "transparent"], description: "外观" },
    size: { control: "inline-radio", options: ["small", "medium"], description: "尺寸" },
    onSelect: { action: "select", description: "选中回调" },
    onOpenChange: { action: "openChange", description: "展开回调" },
  },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: "files",
    content: "文件",
    children: [
      { value: "doc", content: "文档.docx" },
      { value: "img", content: "图片.png" },
    ],
  },
  { value: "settings", content: "设置" },
] as any;

export const Default: Story = {
  render: () => (
    <div style={{ width: "260px" }}>
      <Tree items={items} defaultOpenItems={["files"]} onSelect={fn()} />
    </div>
  ),
};

export const Selection: Story = {
  name: "多选",
  render: () => (
    <div style={{ width: "260px" }}>
      <Tree items={items} selectionMode="multiselect" defaultOpenItems={["files"]} />
    </div>
  ),
};

export const PersonaLayout: Story = {
  name: "TreeItemPersonaLayout",
  render: () => (
    <div style={{ width: "260px" }}><TreeRootReset>
      <TreeItem value="x">
        <TreeItemPersonaLayout
          media={<Avatar name="Ada" size={32} />}
          description="描述信息"
        >
          带头像的树项
        </TreeItemPersonaLayout>
      </TreeItem>
    </TreeRootReset>
    </div>
  ),
};
