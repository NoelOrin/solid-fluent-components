import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarRadio,
  ToolbarRadioGroup,
} from "./Toolbar";
import { renderWithFluent } from "../../test-utils/index";

describe("Toolbar sub-components", () => {
  it("renders radiogroup and exposes value via data attribute", async () => {
    const onChange = (vi as any).fn();
    const { container } = renderWithFluent(() => (
      <ToolbarRadioGroup defaultValue="a" onChange={onChange}>
        <span data-toolbar-radio="a">A</span>
        <span data-toolbar-radio="b">B</span>
      </ToolbarRadioGroup>
    ));
    const group = container.querySelector(".sf-ToolbarRadioGroup") as HTMLElement;
    expect(group.getAttribute("role")).toBe("radiogroup");
    expect(group.dataset.value).toBe("a");

    await waitFor(() => {
      expect(container.querySelectorAll('[role="radio"]').length).toBe(2);
    });
    const [a, b] = Array.from(
      container.querySelectorAll<HTMLElement>('[role="radio"]'),
    ) as [HTMLElement, HTMLElement];
    expect(a).toHaveAttribute("aria-checked", "true");
    expect(b).toHaveAttribute("aria-checked", "false");
    expect(a.tabIndex).toBe(0);
    expect(b.tabIndex).toBe(-1);

    fireEvent.click(b!);
    expect(onChange).toHaveBeenCalledWith("b");
    expect(group.dataset.value).toBe("b");
  });

  it("moves radio selection with arrow keys and stops propagation", async () => {
    const onChange = (vi as any).fn();
    const { getAllByRole } = renderWithFluent(() => (
      <ToolbarRadioGroup defaultValue="a" onChange={onChange}>
        <ToolbarRadio value="a">A</ToolbarRadio>
        <ToolbarRadio value="b">B</ToolbarRadio>
        <ToolbarRadio value="c" disabled>
          C
        </ToolbarRadio>
      </ToolbarRadioGroup>
    ));
    await waitFor(() => expect(getAllByRole("radio").length).toBe(3));
    const radios = getAllByRole("radio") as HTMLElement[];
    expect(radios[2]).toHaveAttribute("aria-disabled", "true");

    fireEvent.keyDown(radios[0]!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("b");
    expect(document.activeElement).toBe(radios[1]);

    fireEvent.keyDown(radios[1]!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("a"); // disabled "c" is skipped (wraps)
  });

  it("ToolbarButton renders a button with subtle appearance", () => {
    const { getByRole } = renderWithFluent(() => <ToolbarButton>Go</ToolbarButton>);
    const button = getByRole("button", { name: "Go" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("sf-Button--subtle");
  });

  it("exposes orientation and roves focus across toolbar buttons", async () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Toolbar vertical>
        <ToolbarButton>A</ToolbarButton>
        <ToolbarButton>B</ToolbarButton>
        <ToolbarDivider vertical />
      </Toolbar>
    ));
    const toolbar = getByRole("toolbar");
    expect(toolbar).toHaveAttribute("aria-orientation", "vertical");

    const buttons = Array.from(container.querySelectorAll("button")) as HTMLElement[];
    await waitFor(() => expect(buttons[0]!.tabIndex).toBe(0));
    expect(buttons[1]!.tabIndex).toBe(-1);

    fireEvent.keyDown(buttons[0]!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(buttons[1]);
    expect(buttons[1]!.tabIndex).toBe(0);
    expect(buttons[0]!.tabIndex).toBe(-1);

    const divider = container.querySelector(".sf-Toolbar__divider")!;
    expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    expect(divider.hasAttribute("data-vertical")).toBe(true);
  });


  it("uses horizontal orientation by default", () => {
    const { getByRole } = renderWithFluent(() => <Toolbar />);
    expect(getByRole("toolbar")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("clicking a ToolbarButton fires its onClick handler", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToolbarButton onClick={onClick}>Go</ToolbarButton>
    ));
    fireEvent.click(getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("Home and End move focus across toolbar controls", async () => {
    const { container } = renderWithFluent(() => (
      <Toolbar>
        <ToolbarButton>A</ToolbarButton>
        <ToolbarButton>B</ToolbarButton>
        <ToolbarButton>C</ToolbarButton>
      </Toolbar>
    ));
    const buttons = Array.from(container.querySelectorAll<HTMLElement>("button"));
    await waitFor(() => expect(buttons[0]!.tabIndex).toBe(0));

    fireEvent.keyDown(buttons[0]!, { key: "End" });
    expect(document.activeElement).toBe(buttons[2]);
    expect(buttons[2]!.tabIndex).toBe(0);
    expect(buttons[0]!.tabIndex).toBe(-1);

    fireEvent.keyDown(buttons[2]!, { key: "Home" });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("excludes disabled buttons from toolbar roving focus", async () => {
    const { container } = renderWithFluent(() => (
      <Toolbar>
        <ToolbarButton>A</ToolbarButton>
        <ToolbarButton disabled>B</ToolbarButton>
        <ToolbarButton>C</ToolbarButton>
      </Toolbar>
    ));
    const buttons = Array.from(container.querySelectorAll<HTMLElement>("button"));
    await waitFor(() => expect(buttons[0]!.tabIndex).toBe(0));
    expect(buttons[1]).toHaveAttribute("aria-disabled", "true");
    expect(buttons[2]!.tabIndex).toBe(-1);

    fireEvent.keyDown(buttons[0]!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[2]);
    expect(document.activeElement).not.toBe(buttons[1]);
    expect(buttons[2]!.tabIndex).toBe(0);
    expect(buttons[0]!.tabIndex).toBe(-1);
  });

  it("keeps a controlled radio value while reporting the clicked value", async () => {
    const onChange = vi.fn();
    const { container, getAllByRole } = renderWithFluent(() => (
      <ToolbarRadioGroup value="a" onChange={onChange}>
        <ToolbarRadio value="a">A</ToolbarRadio>
        <ToolbarRadio value="b">B</ToolbarRadio>
      </ToolbarRadioGroup>
    ));
    await waitFor(() => expect(getAllByRole("radio").length).toBe(2));
    const radios = getAllByRole("radio") as HTMLElement[];
    const group = container.querySelector(".sf-ToolbarRadioGroup")!;

    fireEvent.click(radios[1]!);
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(radios[1]).toHaveAttribute("aria-checked", "false");
    expect(group).toHaveAttribute("data-value", "a");
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("selects a radio with Space and Enter without moving focus", async () => {
    const onChange = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <ToolbarRadioGroup defaultValue="a" onChange={onChange}>
        <ToolbarRadio value="a">A</ToolbarRadio>
        <ToolbarRadio value="b">B</ToolbarRadio>
        <ToolbarRadio value="c">C</ToolbarRadio>
      </ToolbarRadioGroup>
    ));
    await waitFor(() => expect(getAllByRole("radio").length).toBe(3));
    const radios = getAllByRole("radio") as HTMLElement[];

    fireEvent.keyDown(radios[1]!, { key: " " });
    await waitFor(() => expect(radios[1]).toHaveAttribute("aria-checked", "true"));
    expect(onChange).toHaveBeenCalledWith("b");
    expect(document.activeElement).not.toBe(radios[1]);

    fireEvent.keyDown(radios[2]!, { key: "Enter" });
    await waitFor(() => expect(radios[2]).toHaveAttribute("aria-checked", "true"));
    expect(onChange).toHaveBeenLastCalledWith("c");
  });

  it("Home and End select the first and last radio", async () => {
    const onChange = vi.fn();
    const { getAllByRole } = renderWithFluent(() => (
      <ToolbarRadioGroup defaultValue="b" onChange={onChange}>
        <ToolbarRadio value="a">A</ToolbarRadio>
        <ToolbarRadio value="b">B</ToolbarRadio>
        <ToolbarRadio value="c">C</ToolbarRadio>
      </ToolbarRadioGroup>
    ));
    await waitFor(() => expect(getAllByRole("radio").length).toBe(3));
    const radios = getAllByRole("radio") as HTMLElement[];

    fireEvent.keyDown(radios[1]!, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("c");
    fireEvent.keyDown(radios[2]!, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("a");
  });

  it("applies the size attribute to the toolbar", () => {
    const { getByRole } = renderWithFluent(() => <Toolbar size="large" />);
    expect(getByRole("toolbar")).toHaveAttribute("data-size", "large");
  });

  it("tolerates arrow keys when the toolbar has no controls", () => {
    const { getByRole } = renderWithFluent(() => <Toolbar />);
    const toolbar = getByRole("toolbar");
    fireEvent.keyDown(toolbar, { key: "ArrowRight" });
    expect(toolbar).toBeInTheDocument();
  });
});

