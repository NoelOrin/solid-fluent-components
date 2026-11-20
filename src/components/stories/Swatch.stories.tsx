import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ColorSwatch, EmptySwatch, ImageSwatch } from "../swatch-picker/SwatchPicker";

const meta = {
  title: "Display/Swatch",
  component: ColorSwatch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "色板项：ColorSwatch / EmptySwatch / ImageSwatch。",
      },
    },
  },
  args: { color: "#FDE7E9", value: "red" },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Swatches: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
      <ColorSwatch color="#FDE7E9" value="red" aria-label="红" selected onClick={() => {}} />
      <ColorSwatch color="#EAF3FF" value="blue" aria-label="蓝" onClick={() => {}} />
      <ColorSwatch color="#D5F1D0" value="green" aria-label="绿" disabled onClick={() => {}} />
      <EmptySwatch label="无" />
    </div>
  ),
};

export const Image: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <ImageSwatch
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/Mark.jpg"
        value="mark"
        label="Mark"
        onClick={() => {}}
      />
      <ImageSwatch
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/Sunny.jpg"
        value="sunny"
        label="Sunny"
        selected
        onClick={() => {}}
      />
    </div>
  ),
};
