import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor, within } from "@solidjs/testing-library";
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuItem,
  MenuItemLink,
  MenuItemSwitch,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuItemSubmenu,
} from "./Menu";
import { renderWithFluent } from "../../test-utils/index";

const { computePositionMock } = vi.hoisted(() => ({
  computePositionMock: vi.fn(async (..._args: unknown[]) => ({ x: 0, y: 0 })),
}));
vi.mock("@floating-ui/dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@floating-ui/dom")>();
  return {
    ...actual,
    computePosition: (...args: unknown[]) => computePositionMock(...args),
    autoUpdate: () => () => {},
  };
});

describe("Menu sub-components", () => {
  it("MenuItemLink renders an anchor with menuitem role", () => {
    const { getByRole } = renderWithFluent(() => (
      <Menu>
        <MenuItemLink href="#home">Home</MenuItemLink>
      </Menu>
    ));
    const link = getByRole("menuitem");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "#home");
  });

  it("MenuItemSwitch renders a checkbox", () => {
    const onChange = (vi as any).fn();
    const { container } = renderWithFluent(() => (
      <Menu>
        <MenuItemSwitch checked={false} onChange={onChange}>
          Bold
        </MenuItemSwitch>
      </Menu>
    ));
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input).toBeTruthy();
    input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("MenuItem still works", () => {
    const { getByRole } = renderWithFluent(() => (
      <Menu>
        <MenuItem>Item</MenuItem>
      </Menu>
    ));
    expect(getByRole("menuitem").textContent).toContain("Item");
  });

  it("MenuItemSwitch exposes a focusable menuitemcheckbox reachable by arrow keys", async () => {
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>First</MenuItem>
          <MenuItemSwitch checked={false}>Bold</MenuItemSwitch>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const first = body.getByRole("menuitem", { name: "First" });
    const switchInput = body.getByRole("menuitemcheckbox") as HTMLInputElement;
    await waitFor(() => expect(document.activeElement).toBe(first));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(switchInput);
  });

  it("MenuItemCheckbox and MenuItemRadio expose role and aria-checked", () => {
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuPopover>
          <MenuItemCheckbox name="a" checked>
            Check
          </MenuItemCheckbox>
          <MenuItemRadio name="r" checked>
            Radio
          </MenuItemRadio>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const checkbox = body.getByRole("menuitemcheckbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    const radio = body.getByRole("menuitemradio");
    expect(radio).toHaveAttribute("aria-checked", "true");
  });

  it("Menu root-level positioning is applied to the popover", () => {
    computePositionMock.mockClear();
    renderWithFluent(() => (
      <Menu defaultOpen positioning={{ position: "above", align: "end" }}>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>Item</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const options = computePositionMock.mock.calls[0]?.[2] as { placement: string };
    expect(options.placement).toBe("top-end");
  });

  it("typeahead focuses an item matching typed characters", async () => {
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>Apple</MenuItem>
          <MenuItem>Banana</MenuItem>
          <MenuItem>Cherry</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    await waitFor(() =>
      expect(document.activeElement).toBe(body.getByRole("menuitem", { name: "Apple" })),
    );
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "b", bubbles: true }));
    expect(document.activeElement).toBe(body.getByRole("menuitem", { name: "Banana" }));
  });

  it("MenuItemSubmenu opens a nested menu without breaking parent items", () => {
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuPopover>
          <MenuItem>Outside</MenuItem>
          <MenuItemSubmenu label="More">
            <MenuItem>Nested</MenuItem>
          </MenuItemSubmenu>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const trigger = body.getByRole("menuitem", { name: /More/ });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(body.getByRole("menuitem", { name: "Outside" })).toBeTruthy();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(body.getByText("Nested")).toBeTruthy();
  });

  it("clicking the trigger opens and closes the popover and updates aria-expanded", async () => {
    const { getByRole } = renderWithFluent(() => (
      <Menu>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>Item</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const trigger = getByRole("button", { name: "Menu" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(body.queryByRole("menu")).toBeNull();

    fireEvent.click(trigger);
    await waitFor(() => expect(body.getByRole("menu")).toBeTruthy());
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("Escape closes the menu and returns focus to the trigger", async () => {
    const { getByRole } = renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>First</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const trigger = getByRole("button", { name: "Menu" });
    await waitFor(() => expect(document.activeElement).toBe(body.getByRole("menuitem")));

    fireEvent.keyDown(window, { key: "Escape" });
    expect(body.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("Home and End move focus to the first and last menu items", async () => {
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>Apple</MenuItem>
          <MenuItem>Banana</MenuItem>
          <MenuItem>Cherry</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    await waitFor(() =>
      expect(document.activeElement).toBe(body.getByRole("menuitem", { name: "Apple" })),
    );

    fireEvent.keyDown(window, { key: "End" });
    expect(document.activeElement).toBe(body.getByRole("menuitem", { name: "Cherry" }));
    fireEvent.keyDown(window, { key: "Home" });
    expect(document.activeElement).toBe(body.getByRole("menuitem", { name: "Apple" }));
  });

  it("clicking a menu item fires its handler and closes the menu", async () => {
    const onClick = vi.fn();
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuPopover>
          <MenuItem onClick={onClick}>Save</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const item = body.getByRole("menuitem", { name: "Save" });
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(body.queryByRole("menu")).toBeNull();
  });

  it("clicking outside the popover closes the menu", async () => {
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>Item</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole("menu")).toBeTruthy());

    fireEvent.mouseDown(document.body);
    expect(body.queryByRole("menu")).toBeNull();
  });

  it("keeps a controlled open menu mounted while reporting the close request", async () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <Menu open={true} onOpenChange={onOpenChange}>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem>Item</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const trigger = body.getByRole("button", { name: "Menu" });
    fireEvent.click(trigger);
    expect(body.getByRole("menu")).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("skips disabled items during arrow-key navigation", async () => {
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger>
          <button>Menu</button>
        </MenuTrigger>
        <MenuPopover>
          <MenuItem disabled>Disabled</MenuItem>
          <MenuItem>Enabled</MenuItem>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const disabled = body.getByRole("menuitem", { name: "Disabled" }) as HTMLButtonElement;
    const enabled = body.getByRole("menuitem", { name: "Enabled" });
    expect(disabled.disabled).toBe(true);
    await waitFor(() => expect(document.activeElement).toBe(enabled));

    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(document.activeElement).toBe(enabled);
  });

  it("reports the toggled value through MenuItemCheckbox onChange", async () => {
    const onChange = vi.fn();
    renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuPopover>
          <MenuItemCheckbox name="a" checked onChange={onChange}>
            Check
          </MenuItemCheckbox>
        </MenuPopover>
      </Menu>
    ));
    const body = within(document.body);
    const checkbox = body.getByRole("menuitemcheckbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});

