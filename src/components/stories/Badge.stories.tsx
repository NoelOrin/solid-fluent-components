import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Badge, CounterBadge } from "../badge/Badge";

const meta = {
  title: "Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
徽章组件，用于状态、计数与轻量标签。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`appearance\` | \`filled \\| ghost \\| outline \\| tint\` | \`filled\` | 外观 |
| \`color\` | \`brand \\| danger \\| important \\| informative \\| severe \\| subtle \\| success \\| warning\` | \`brand\` | 颜色语义 |
| \`size\` | \`tiny \\| extra-small \\| small \\| medium \\| large \\| extra-large\` | \`medium\` | 尺寸 |
| \`shape\` | \`circular \\| rounded \\| square\` | \`circular\` | 形状 |
| \`icon\` | \`JSX.Element\` | - | 前置图标 |
| \`children\` | \`JSX.Element\` | - | 文本 |
| \`iconPosition\` | \`before \\| after\` | \`before\` | 图标位置 |
| \`severe\` / \`subtle\` | \`boolean\` | - | 语义色快捷方式（等价于 color） |

### CounterBadge 额外属性
| 属性 | 说明 |
| --- | --- |
| \`count\` | 计数值 |
| \`overflowCount\` | 溢出阈值，默认 99 |
| \`dot\` | 仅显示圆点 |
| \`showZero\` | 为 0 时是否显示 |
`,
      },
    },
  },
  args: {
    children: "Badge",
    appearance: "filled",
    color: "brand",
    size: "medium",
    shape: "circular",
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["filled", "ghost", "outline", "tint"],
      description: "视觉外观",
    },
    color: {
      control: "select",
      options: [
        "brand",
        "danger",
        "important",
        "informative",
        "severe",
        "subtle",
        "success",
        "warning",
      ],
      description: "语义颜色",
    },
    size: {
      control: "select",
      options: ["tiny", "extra-small", "small", "medium", "large", "extra-large"],
    },
    shape: {
      control: "select",
      options: ["circular", "rounded", "square"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
      <Badge color="brand">Brand</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="danger">Danger</Badge>
      <Badge color="important">Important</Badge>
      <Badge color="informative">Info</Badge>
      <Badge color="severe">Severe</Badge>
      <Badge color="subtle">Subtle</Badge>
    </div>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
      <Badge appearance="filled">Filled</Badge>
      <Badge appearance="tint">Tint</Badge>
      <Badge appearance="outline">Outline</Badge>
      <Badge appearance="ghost">Ghost</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", "align-items": "center", "flex-wrap": "wrap" }}>
      <Badge size="tiny">T</Badge>
      <Badge size="extra-small">XS</Badge>
      <Badge size="small">S</Badge>
      <Badge size="medium">M</Badge>
      <Badge size="large">L</Badge>
      <Badge size="extra-large">XL</Badge>
    </div>
  ),
};

export const IconPosition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", "align-items": "center" }}>
      <Badge icon={<span>★</span>} iconPosition="before">Before</Badge>
      <Badge icon={<span>★</span>} iconPosition="after">After</Badge>
      <Badge severe>Severe</Badge>
      <Badge subtle>Subtle</Badge>
    </div>
  ),
};

export const ReactiveCounter: Story = {
  name: "CounterBadge (reactive)",
  render: () => {
    const [count, setCount] = createSignal(0);
    return (
      <div style={{ display: "flex", gap: "12px", "align-items": "center" }}>
        <CounterBadge count={count()} />
        <button type="button" onClick={() => setCount((c) => c + 1)}>+1</button>
        <button type="button" onClick={() => setCount(0)}>Reset</button>
      </div>
    );
  },
};

export const Counters: Story = {
  name: "CounterBadge",
  render: () => (
    <div style={{ display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap" }}>
      <CounterBadge count={3} />
      <CounterBadge count={12} color="danger" />
      <CounterBadge count={128} overflowCount={99} />
      <CounterBadge count={0} showZero />
      <CounterBadge dot color="success" />
    </div>
  ),
};
