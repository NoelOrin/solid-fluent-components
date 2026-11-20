import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItemLink,
  MenuItemSwitch,
} from "../menu/Menu";
import { Button } from "../button/Button";

const meta = {
  title: "Overlay/Menu",
  tags: ["autodocs"],
  component: Menu,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Menu",
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>打开菜单</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>新建</MenuItem>
          <MenuItem>打开</MenuItem>
          <MenuDivider />
          <MenuItem>删除</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  ),
};

export const GroupsAndLink: Story = {
  name: "Groups, link & switch",
  render: () => {
    const [on, setOn] = createSignal(false);
    return (
      <Menu>
        <MenuTrigger>
          <Button>更多</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>视图</MenuGroupHeader>
              <MenuItemLink href="#grid">网格视图</MenuItemLink>
              <MenuItemLink href="#list">列表视图</MenuItemLink>
            </MenuGroup>
            <MenuDivider />
            <MenuItemSwitch checked={on()} onChange={setOn}>
              显示隐藏文件
            </MenuItemSwitch>
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  },
};
