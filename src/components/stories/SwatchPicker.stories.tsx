import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import {
  SwatchPicker,
  ImageSwatch,
  SwatchPickerRow,
  EmptySwatch,
} from "../swatch-picker/SwatchPicker";

const colors = [
  { value: "red", color: "#e1263b", label: "红" },
  { value: "orange", color: "#ec8800", label: "橙" },
  { value: "green", color: "#0e700e", label: "绿" },
  { value: "blue", color: "#0f6cbd", label: "蓝" },
  { value: "purple", color: "#5c2e91", label: "紫" },
];

const meta = {
  title: "Inputs/SwatchPicker",
  component: SwatchPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
色板选择器。

### API
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| \`items\` | \`SwatchPickerColor[]\` | - | 色板项 |
| \`value\` | \`string\` | - | 受控选中值 |
| \`defaultValue\` | \`string\` | - | 非受控初始值 |
| \`selectedItems\` | \`string[]\` | - | 多选受控值 |
| \`selectionMode\` | \`single \\| multiple\` | \`single\` | 选择模式 |
| \`size\` | \`extra-small \\| small \\| medium \\| large\` | \`medium\` | 尺寸 |
| \`shape\` | \`square \\| circular\` | \`square\` | 形状 |
| \`onSelectionChange\` | \`(s:string[])=>void\` | - | 选择回调 |
| \`onChange\` | \`(s:string[])=>void\` | - | 旧版回调别名，与新回调同时触发 |

方向键 / Home / End 通过 roving tabindex 在色板间移动焦点。
子件：\`ColorSwatch\` / \`ImageSwatch\` / \`SwatchPickerRow\` / \`EmptySwatch\`。
`,
      },
    },
  },
  args: {
    items: colors,
    onSelectionChange: fn(),
  },
  argTypes: {
    selectionMode: { control: "inline-radio", options: ["single", "multiple"], description: "选择模式" },
    size: { control: "select", options: ["extra-small", "small", "medium", "large"], description: "尺寸" },
    shape: { control: "inline-radio", options: ["square", "circular"], description: "形状" },
    spacing: { control: "inline-radio", options: ["small", "medium"], description: "间距" },
    value: { control: "text", description: "受控选中值" },
    onSelectionChange: { action: "selectionChange", description: "选择回调" },
  },
} satisfies Meta<typeof SwatchPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: colors, defaultValue: "blue" },
};

export const Multiple: Story = {
  name: "多选",
  args: { items: colors, selectionMode: "multiple", defaultSelectedItems: ["red", "green"] },
};

export const ImageAndEmpty: Story = {
  name: "ImageSwatch / EmptySwatch",
  render: () => (
    <SwatchPickerRow>
      <ImageSwatch src="https://via.placeholder.com/32" value="img" label="图片色板" />
      <EmptySwatch label="无" />
    </SwatchPickerRow>
  ),
};
