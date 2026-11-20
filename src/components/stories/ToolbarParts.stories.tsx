import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ToolbarRadioButton, ToolbarToggleButton } from "../utilities/extras/Extras";

const meta = {
  title: "Navigation/Toolbar parts",
  component: ToolbarToggleButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "工具栏按钮：ToolbarRadioButton / ToolbarToggleButton。",
      },
    },
  },
} satisfies Meta<typeof ToolbarToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <ToolbarToggleButton checked onChange={() => {}}>
        加粗
      </ToolbarToggleButton>
      <ToolbarToggleButton onChange={() => {}}>斜体</ToolbarToggleButton>
    </div>
  ),
};

export const Radio: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <ToolbarRadioButton name="align" value="left" checked onChange={() => {}}>
        左对齐
      </ToolbarRadioButton>
      <ToolbarRadioButton name="align" value="center" onChange={() => {}}>
        居中
      </ToolbarRadioButton>
    </div>
  ),
};
