import { splitProps, type JSX } from "solid-js";
import { callHandler, cx, type IntrinsicElementProps } from "../../utils/index";
import { Button, type ButtonProps } from "./Button";
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "../menu/Menu";

export type SplitButtonProps = {
  appearance?: ButtonProps["appearance"];
  size?: ButtonProps["size"];
  shape?: ButtonProps["shape"];
  disabled?: boolean;
  primaryActionButton?: ButtonProps;
  menuButton?: ButtonProps;
  menu?: JSX.Element;
  children?: JSX.Element;
  class?: string;
  onClick?: IntrinsicElementProps<"button">["onClick"];
};

export function SplitButton(props: SplitButtonProps) {
  const [local] = splitProps(props, [
    "appearance",
    "size",
    "shape",
    "disabled",
    "primaryActionButton",
    "menuButton",
    "menu",
    "children",
    "class",
    "onClick",
  ]);

  return (
    <div class={cx("sf-SplitButton", local.class)}>
      <Button
        appearance={local.appearance ?? "secondary"}
        size={local.size}
        shape={local.shape}
        disabled={local.disabled}
        onClick={local.onClick}
        {...local.primaryActionButton}
        class={cx("sf-SplitButton__primary", local.primaryActionButton?.class)}
      >
        {local.children}
      </Button>
      <Menu>
        <MenuTrigger>
          <Button
            appearance={local.appearance ?? "secondary"}
            size={local.size}
            shape={local.shape}
            disabled={local.disabled}
            aria-label="More options"
            {...local.menuButton}
            class={cx("sf-SplitButton__menu", local.menuButton?.class)}
          >
            ▾
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {local.menu ?? (
              <>
                <MenuItem>Option A</MenuItem>
                <MenuItem>Option B</MenuItem>
              </>
            )}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}

export type MenuButtonProps = ButtonProps & {
  menu?: JSX.Element;
};

export function MenuButton(props: MenuButtonProps) {
  const [local, rest] = splitProps(props, ["menu", "children", "onClick"]);
  return (
    <Menu>
      <MenuTrigger>
        <Button
          {...rest}
          onClick={(event) => callHandler(local.onClick, event)}
          iconPosition="after"
          icon={<span aria-hidden="true">▾</span>}
        >
          {local.children}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>{local.menu}</MenuList>
      </MenuPopover>
    </Menu>
  );
}
