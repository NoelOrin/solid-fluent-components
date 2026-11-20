import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { Menu, MenuPopover, MenuList, MenuItem, MenuItemCheckbox, MenuItemRadio, MenuSplitGroup } from "../menu/Menu";

const meta = {
  title: "Overlay/Menu parts",
  component: MenuItemCheckbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Menu 复合子组件：MenuItemCheckbox / MenuItemRadio / MenuSplitGroup。",
      },
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof MenuItemCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ItemCheckbox: Story = {
  render: () => (
    <Menu open>
      <MenuPopover>
        <MenuList>
          <MenuItemCheckbox name="opt" checked>
            选项 A
          </MenuItemCheckbox>
          <MenuItemCheckbox name="opt">选项 B</MenuItemCheckbox>
        </MenuList>
      </MenuPopover>
    </Menu>
  ),
};

export const ItemRadio: Story = {
  render: () => (
    <Menu open>
      <MenuPopover>
        <MenuList>
          <MenuItemRadio name="radio" checked>
            单选 1
          </MenuItemRadio>
          <MenuItemRadio name="radio">单选 2</MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>
  ),
};

export const SplitGroup: Story = {
  render: () => (
    <Menu open>
      <MenuPopover>
        <MenuList>
          <MenuSplitGroup>
            <MenuItem>主操作</MenuItem>
            <MenuItem>次操作</MenuItem>
          </MenuSplitGroup>
        </MenuList>
      </MenuPopover>
    </Menu>
  ),
};
