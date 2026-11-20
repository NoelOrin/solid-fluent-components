import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
  Title3,
  Body1,
  Subtitle1,
  Display,
  LargeTitle,
  Subtitle2Stronger,
} from "../text/Text";
import { Card, CardHeader } from "../card/Card";

/**
 * 展示类（Display）分类总览。
 * 仅作分类入口说明，不重复演示组件；各组件演示见各自独立 story。
 */
const meta = {
  title: "Display/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
展示类组件合集（分类总览，仅作入口说明，不重复演示组件）。

- Avatar / Persona / AvatarGroup：身份展示
- Badge / Tag / CounterBadge：状态与标签
- Card：容器卡片
- Spinner / ProgressBar / Skeleton：加载态
- Text / Divider / Link：排版与链接
- Swatch / Presence：色板与在线状态

更细粒度 API 见 Introduction/API，以及上方各组件独立页。

Text 另提供 \`Display\` / \`LargeTitle\` / \`Subtitle2Stronger\` 预设，且 \`as\` 支持 strong / code / label 等语义标签。
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  name: "Text 预设总览",
  render: () => (
    <Card>
      <Display>Display</Display>
      <LargeTitle>LargeTitle</LargeTitle>
      <Title3>Title3</Title3>
      <Subtitle1>Subtitle1</Subtitle1>
      <Subtitle2Stronger>Subtitle2Stronger</Subtitle2Stronger>
      <Body1 as="strong">as 可切换语义标签</Body1>
    </Card>
  ),
};

export const 分类总览: Story = {
  name: "分类总览",
  render: () => (
    <Card>
      <CardHeader header={<Title3>Display 展示类</Title3>} description={<Body1>身份、状态、卡片、加载态与排版。</Body1>} />
      <Subtitle1>包含组件</Subtitle1>
      <Body1>
        Avatar、Persona、AvatarGroup、Badge、Tag、CounterBadge、Card、Spinner、
        ProgressBar、Skeleton、Text、Divider、Link、Swatch、Presence。
      </Body1>
    </Card>
  ),
};
