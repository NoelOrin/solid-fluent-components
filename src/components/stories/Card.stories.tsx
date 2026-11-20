import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
} from "../card/Card";
import { Button } from "../button/Button";
import { Badge } from "../badge/Badge";
import { Text, Title3, Body1 } from "../text/Text";
import { createSignal } from "solid-js";
import { Avatar } from "../avatar/Avatar";

const meta = {
  title: "Display/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
卡片容器。

### Card API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`appearance\` | \`filled \\| filled-alternative \\| outline \\| subtle\` | \`filled\` | 外观 |
| \`size\` | \`small \\| medium \\| large\` | \`medium\` | 尺寸 |
| \`orientation\` | \`vertical \\| horizontal\` | \`vertical\` | 方向 |
| \`selected\` / \`defaultSelected\` | \`boolean\` | - | 受控 / 非受控选中态 |
| \`onSelectionChange\` | \`(event, data) => void\` | - | 选中态变化回调 |
| \`disabled\` | \`boolean\` | \`false\` | 禁用选择 |
| \`focusMode\` | \`off \\| no-tab \\| tab-exit \\| tab-only\` | \`off\` | 焦点行为 |
| \`floatingAction\` | \`JSX.Element\` | - | 右上角悬浮操作 |

### 子组件
- \`CardHeader\`: \`image\` / \`header\` / \`description\` / \`action\`
- \`CardPreview\`: 预览区
- \`CardFooter\`: 底部操作
`,
      },
    },
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["filled", "filled-alternative", "outline", "subtle"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ width: "360px" }}>
      <CardHeader
        header={<Title3>项目卡片</Title3>}
        description={<Text size={200}>Solid Fluent 组件库示例</Text>}
        action={<Badge appearance="tint">Core</Badge>}
      />
      <Text>
        主题令牌、基础输入、反馈与导航组件已经可用，可在 Storybook 中逐个调试。
      </Text>
      <CardFooter>
        <Button appearance="primary">打开</Button>
        <Button appearance="subtle">稍后</Button>
      </CardFooter>
    </Card>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "16px", width: "360px" }}>
      <Card appearance="filled">
        <Title3>Filled</Title3>
        <Text size={200}>默认卡片样式</Text>
      </Card>
      <Card appearance="filled-alternative">
        <Title3>Filled Alternative</Title3>
        <Text size={200}>次级背景</Text>
      </Card>
      <Card appearance="outline">
        <Title3>Outline</Title3>
        <Text size={200}>仅描边</Text>
      </Card>
      <Card appearance="subtle">
        <Title3>Subtle</Title3>
        <Text size={200}>轻量背景</Text>
      </Card>
    </div>
  ),
};

export const WithPreview: Story = {
  render: () => {
    const [liked, setLiked] = createSignal(false);
    return (
      <Card style={{ width: "360px" }}>
        <CardPreview>
          <div
            style={{
              height: "140px",
              background:
                "linear-gradient(135deg, var(--sf-colorBrandBackground2), var(--sf-colorBrandBackground))",
            }}
          />
        </CardPreview>
        <CardHeader
          header={<Title3>带预览卡片</Title3>}
          description={<Text size={200}>适合内容流场景</Text>}
        />
        <CardFooter>
          <Button
            appearance={liked() ? "primary" : "outline"}
            onClick={() => setLiked(!liked())}
          >
            {liked() ? "已喜欢" : "喜欢"}
          </Button>
        </CardFooter>
      </Card>
    );
  },
};

export const HorizontalCard: Story = {
  name: "Horizontal",
  render: () => (
    <Card orientation="horizontal" style={{ width: "480px" }} appearance="outline">
      <CardHeader
        image={<Avatar name="Solid Fluent" size={48} />}
        header={<Title3>横向卡片</Title3>}
        description={<Body1>适合列表摘要、联系人与设置入口。</Body1>}
        action={<Button appearance="primary" size="small">查看</Button>}
      />
    </Card>
  ),
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = createSignal(false);
    return (
      <Card
        style={{ width: "360px" }}
        selected={selected()}
        onSelectionChange={(_, data) => setSelected(data.selected)}
        focusMode="no-tab"
        floatingAction={<Badge appearance="tint">New</Badge>}
      >
        <CardHeader header={<Title3>可选卡片</Title3>} description={<Body1>点击卡片切换选中态。</Body1>} />
        <Text>选中：{selected() ? "是" : "否"}</Text>
      </Card>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "12px", width: "360px" }}>
      {(["small", "medium", "large"] as const).map((size) => (
        <Card size={size} appearance="outline">
          <Title3>{size}</Title3>
          <Text size={200}>Card size = {size}</Text>
        </Card>
      ))}
    </div>
  ),
};
