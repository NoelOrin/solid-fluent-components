import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor, within } from "@solidjs/testing-library";
import { SplitButton, MenuButton } from "./SplitButton";
import { MenuItem } from "../menu/Menu";
import { renderWithFluent } from "../../test-utils/index";

vi.mock("@floating-ui/dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@floating-ui/dom")>();
  return {
    ...actual,
    computePosition: async () => ({ x: 0, y: 0 }),
    autoUpdate: () => () => {},
  };
});

describe("SplitButton", () => {
  it("renders a primary action button and a labelled menu button", () => {
    const { container, getAllByRole } = renderWithFluent(() => (
      <SplitButton>Action</SplitButton>
    ));
    expect(container.querySelector(".sf-SplitButton")).toBeInTheDocument();
    const [primary, menu] = getAllByRole("button") as [HTMLElement, HTMLElement];
    expect(primary).toHaveClass("sf-SplitButton__primary");
    expect(primary).toHaveTextContent("Action");
    expect(menu).toHaveClass("sf-SplitButton__menu");
    expect(menu).toHaveAttribute("aria-label", "More options");
  });

  it("merges a custom wrapper class and forwards menuButton overrides", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <SplitButton
        class="my-split"
        menuButton={{ "aria-label": "More" }}
        menu={<MenuItem>Delete</MenuItem>}
      >
        Save
      </SplitButton>
    ));
    expect(container.querySelector(".sf-SplitButton")).toHaveClass(
      "sf-SplitButton",
      "my-split",
    );
    expect(getByRole("button", { name: "More" })).toBeInTheDocument();
  });

  it("calls only the primary click handler for the action button", () => {
    const onClick = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton onClick={onClick}>Action</SplitButton>
    ));
    const [primary, menu] = getAllByRole("button") as [HTMLElement, HTMLElement];
    fireEvent.click(primary);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
    fireEvent.click(menu);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("opens the default menu with two items and exposes menu ARIA state", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton>Action</SplitButton>
    ));
    const menuButton = getAllByRole("button")[1] as HTMLElement;
    expect(menuButton).toHaveAttribute("aria-haspopup", "menu");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(menuButton);
    const body = within(document.body);
    expect(body.getByRole("menu")).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(body.getAllByRole("menuitem")).toHaveLength(2);
    expect(body.getByRole("menuitem", { name: "Option A" })).toBeInTheDocument();
  });

  it("closes the menu when the menu button is clicked a second time", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton>Action</SplitButton>
    ));
    const menuButton = getAllByRole("button")[1] as HTMLElement;
    fireEvent.click(menuButton);
    expect(within(document.body).getByRole("menu")).toBeInTheDocument();
    fireEvent.click(menuButton);
    expect(within(document.body).queryByRole("menu")).toBeNull();
  });

  it("moves focus with arrow, Home and End keys inside the open menu", async () => {
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton>Action</SplitButton>
    ));
    const menuButton = getAllByRole("button")[1] as HTMLElement;
    fireEvent.click(menuButton);
    const items = within(document.body).getAllByRole("menuitem") as HTMLElement[];
    await waitFor(() => expect(document.activeElement).toBe(items[0]));

    fireEvent.keyDown(items[0]!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[1]!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(items[0]!, { key: "End" });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[1]!, { key: "Home" });
    expect(document.activeElement).toBe(items[0]);
  });

  it("closes the menu on Escape and restores focus to the menu button", async () => {
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton>Action</SplitButton>
    ));
    const menuButton = getAllByRole("button")[1] as HTMLElement;
    fireEvent.click(menuButton);
    const body = within(document.body);
    const items = body.getAllByRole("menuitem") as HTMLElement[];
    await waitFor(() => expect(document.activeElement).toBe(items[0]));

    fireEvent.keyDown(items[0]!, { key: "Escape" });
    expect(body.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(menuButton);
  });

  it("runs a custom menu item handler and closes the menu", () => {
    const onSelect = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton menu={<MenuItem onClick={onSelect}>Delete</MenuItem>}>
        Action
      </SplitButton>
    ));
    const menuButton = getAllByRole("button")[1] as HTMLElement;
    fireEvent.click(menuButton);
    const item = within(document.body).getByRole("menuitem", { name: "Delete" });
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(within(document.body).queryByRole("menu")).toBeNull();
  });

  it("disables both buttons and prevents both actions", () => {
    const onClick = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton disabled onClick={onClick}>
        Action
      </SplitButton>
    ));
    const [primary, menu] = getAllByRole("button") as [HTMLElement, HTMLElement];
    expect(primary).toHaveAttribute("aria-disabled", "true");
    expect(menu).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(primary);
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(menu);
    expect(within(document.body).queryByRole("menu")).toBeNull();
  });

  it("keeps both buttons keyboard focusable when enabled", () => {
    const { getAllByRole } = renderWithFluent(() => (
      <SplitButton>Action</SplitButton>
    ));
    const [primary, menu] = getAllByRole("button") as [HTMLElement, HTMLElement];
    expect(primary.tabIndex).toBe(0);
    expect(menu.tabIndex).toBe(0);
    menu.focus();
    expect(document.activeElement).toBe(menu);
  });
});

describe("MenuButton", () => {
  it("renders a labelled button with a trailing dropdown icon", () => {
    const { getByRole } = renderWithFluent(() => (
      <MenuButton aria-label="Open menu">Menu</MenuButton>
    ));
    const btn = getByRole("button", { name: "Open menu" });
    expect(btn).toHaveTextContent("Menu");
    expect(btn.lastElementChild).toHaveClass("sf-Button__icon");
    expect(btn.lastElementChild?.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("opens its menu on click and closes it on Escape", async () => {
    const { getByRole } = renderWithFluent(() => (
      <MenuButton aria-label="Open menu" menu={<MenuItem>Delete</MenuItem>}>
        Menu
      </MenuButton>
    ));
    const btn = getByRole("button", { name: "Open menu" });
    fireEvent.click(btn);
    const body = within(document.body);
    expect(body.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
    await waitFor(() =>
      expect(document.activeElement).toBe(body.getByRole("menuitem")),
    );
    fireEvent.keyDown(body.getByRole("menuitem"), { key: "Escape" });
    expect(body.queryByRole("menu")).toBeNull();
  });

  it("forwards click handlers while still opening the menu", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <MenuButton aria-label="Open menu" onClick={onClick}>
        Menu
      </MenuButton>
    ));
    fireEvent.click(getByRole("button", { name: "Open menu" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(within(document.body).getByRole("menu")).toBeInTheDocument();
  });

});
