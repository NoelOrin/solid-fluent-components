import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import {
  Carousel,
  CarouselViewport,
  CarouselSlider,
  CarouselCard,
} from "../carousel/Carousel";
import { Title3, Body1 } from "../text/Text";

const slides = [
  { title: "Slide 1", body: "轮播支持左右切换与导航点。" },
  { title: "Slide 2", body: "可组合 Viewport / Slider / Card。" },
  { title: "Slide 3", body: "自动播放由 CarouselAutoplayButton 提供。" },
  { title: "Slide 4", body: "导航点使用 CarouselNav + CarouselNavButton。" },
];

const meta = {
  title: "Overlay/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
轮播组件。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`items\` | \`JSX.Element[]\` | - | 幻灯片内容 |
| \`activeIndex\` | \`number\` | - | 受控当前页 |
| \`defaultActiveIndex\` | \`number\` | \`0\` | 非受控初始页 |
| \`onActiveIndexChange\` | \`(i:number)=>void\` | - | 翻页回调 |
| \`groupSize\` | \`number\` | \`1\` | 每页卡片数，track 按 \`-index*100%/groupSize\` 位移 |
| \`circular\` | \`boolean\` | \`true\` | 首尾循环 |
| \`align\` | \`start \\| center \\| end\` | \`start\` | 幻灯片对齐 |
| \`autoplay\` | \`boolean\` | \`true\` | 自动播放开关；paused 时暂停并清理计时器 |
| \`autoplayInterval\` | \`number\` | \`5000\` | 自动播放间隔 |
| \`class\` | \`string\` | - | 容器类名 |

支持在 viewport 上横向滑动手势翻页；导航点提供 \`aria-controls\` 与方向键导航。

子件：\`CarouselViewport\` / \`CarouselSlider\` / \`CarouselCard\` / \`CarouselButton\` / \`CarouselNav\` / \`CarouselNavButton\` / \`CarouselAutoplayButton\`。
`,
      },
    },
  },
  args: {
    onActiveIndexChange: fn(),
  },
  argTypes: {
    defaultActiveIndex: { control: "number", description: "初始页索引" },
    onActiveIndexChange: { action: "activeIndexChange", description: "翻页回调" },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderItems = () =>
  slides.map((s) => (
    <div>
      <Title3>{s.title}</Title3>
      <Body1>{s.body}</Body1>
    </div>
  ));

export const Default: Story = {
  args: { items: renderItems() },
};

export const StartAtSecond: Story = {
  name: "从第二页开始",
  args: { items: renderItems(), defaultActiveIndex: 1 },
};

export const ComposedParts: Story = {
  name: "组合子件",
  render: () => (
    <CarouselViewport>
      <CarouselSlider index={0} groupSize={1}>
        <CarouselCard>
          <Body1>自定义组合：Viewport + Slider + Card</Body1>
        </CarouselCard>
      </CarouselSlider>
    </CarouselViewport>
  ),
};

export const GroupOfTwo: Story = {
  name: "每页两张 + 循环",
  args: { items: renderItems(), groupSize: 2, circular: true, align: "center" },
};

export const NoAutoplay: Story = {
  name: "关闭自动播放",
  args: { items: renderItems(), autoplay: false },
};
