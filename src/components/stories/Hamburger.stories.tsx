import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { Hamburger } from "../button/Hamburger";

const meta = {
  title: "Navigation/Hamburger",
  component: Hamburger,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
汉堡菜单按钮，展开时三根横杠动画变为叉号（X）。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`open\` | \`boolean\` | \`false\` | 是否展开（横杠变 X） |
| \`disabled\` | \`boolean\` | \`false\` | 禁用 |
| \`aria-label\` | \`string\` | \`Menu\` | 无障碍标签 |
| \`onClick\` | \`(e:MouseEvent)=>void\` | - | 点击回调 |
`,
      },
    },
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    open: { control: "boolean", description: "是否展开（横杠变 X）" },
    disabled: { control: "boolean", description: "禁用" },
    "aria-label": { control: "text", description: "无障碍标签" },
    onClick: { action: "click", description: "点击回调" },
  },
} satisfies Meta<typeof Hamburger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "切换导航" },
};

export const Open: Story = {
  args: { open: true, "aria-label": "切换导航" },
};

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "切换导航" },
};
