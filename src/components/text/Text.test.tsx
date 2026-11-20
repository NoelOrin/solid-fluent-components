import { describe, expect, it } from "vitest";
import {
  Text,
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Subtitle2,
  Body1,
  Body1Strong,
  Body2,
  Caption1,
  Caption2,
  Display,
  LargeTitle,
  Subtitle2Stronger,
} from "./Text";
import { renderWithFluent } from "../../test-utils/index";

describe("Text", () => {
  it("renders a span with default size and weight classes", () => {
    const { container } = renderWithFluent(() => <Text>Body</Text>);
    const text = container.querySelector("span.sf-Text") as HTMLElement;
    expect(text).toHaveClass("sf-Text", "sf-Text--300", "sf-Text--regular");
    expect(text).toHaveTextContent("Body");
  });

  it("renders the requested semantic element and modifiers", () => {
    const { container } = renderWithFluent(() => (
      <Text as="p" size={500} weight="bold" italic>Body</Text>
    ));
    const text = container.querySelector("p") as HTMLElement;
    expect(text).toHaveClass("sf-Text", "sf-Text--500", "sf-Text--bold", "sf-Text--italic");
    expect(text).toHaveTextContent("Body");
  });

  it("applies underline, strikethrough and truncate modifiers", () => {
    const { container } = renderWithFluent(() => (
      <Text underline strikethrough truncate>Body</Text>
    ));
    expect(container.querySelector("span.sf-Text")).toHaveClass(
      "sf-Text--underline",
      "sf-Text--strikethrough",
      "sf-Text--truncate",
    );
  });

  it("maps block, align, font and wrap props to inline styles", () => {
    const { container } = renderWithFluent(() => (
      <Text block align="center" font="monospace" wrap={false}>
        Body
      </Text>
    ));
    const text = container.querySelector("span.sf-Text") as HTMLElement;
    expect(text.style.display).toBe("block");
    expect(text.style.textAlign).toBe("center");
    expect(text.style.fontFamily).toBe("var(--sf-fontFamilyMonospace)");
    expect(text.style.whiteSpace).toBe("nowrap");
  });

  it("lets a custom style object override computed style values", () => {
    const { container } = renderWithFluent(() => (
      <Text block style={{ display: "inline", color: "red" }}>Body</Text>
    ));
    const text = container.querySelector("span.sf-Text") as HTMLElement;
    expect(text.style.display).toBe("inline");
    expect(text.style.color).toBe("red");
  });

  it("keeps a custom class alongside the generated classes", () => {
    const { container } = renderWithFluent(() => (
      <Text size={1000} class="my-text">Body</Text>
    ));
    expect(container.querySelector("span.sf-Text")).toHaveClass(
      "sf-Text",
      "sf-Text--1000",
      "my-text",
    );
  });

  it("forwards native attributes to the rendered element", () => {
    const { getByText } = renderWithFluent(() => (
      <Text id="caption" title="Hint" aria-label="Caption text">
        Body
      </Text>
    ));
    const text = getByText("Body");
    expect(text).toHaveAttribute("id", "caption");
    expect(text).toHaveAttribute("title", "Hint");
    expect(text).toHaveAttribute("aria-label", "Caption text");
  });

  it("renders heading presets with the right semantic level and classes", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Title1>One</Title1>
        <Title2>Two</Title2>
        <Title3>Three</Title3>
        <Display>Display</Display>
        <LargeTitle>Large</LargeTitle>
      </>
    ));
    expect(container.querySelector("h1.sf-Text--800")).toHaveTextContent("One");
    expect(container.querySelector("h2.sf-Text--700")).toHaveTextContent("Two");
    expect(container.querySelector("h3.sf-Text--600")).toHaveTextContent("Three");
    expect(container.querySelector("h1.sf-Text--1000")).toHaveTextContent("Display");
    expect(container.querySelector("h1.sf-Text--900")).toHaveTextContent("Large");
  });

  it("renders body and subtitle presets with their size and weight", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Subtitle1>S1</Subtitle1>
        <Subtitle2>S2</Subtitle2>
        <Subtitle2Stronger>S2S</Subtitle2Stronger>
        <Body1>B1</Body1>
        <Body1Strong>B1S</Body1Strong>
        <Body2>B2</Body2>
        <Caption1>C1</Caption1>
        <Caption2>C2</Caption2>
      </>
    ));
    expect(container.querySelector("h4.sf-Text--500.sf-Text--semibold")).toHaveTextContent("S1");
    expect(container.querySelector("h5.sf-Text--400.sf-Text--semibold")).toBeTruthy();
    expect(container.querySelector("span.sf-Text--300.sf-Text--regular")).toHaveTextContent("B1");
    expect(container.querySelector("span.sf-Text--300.sf-Text--semibold")).toHaveTextContent("B1S");
    expect(container.querySelector("span.sf-Text--200")).toBeTruthy();
    expect(container.querySelector("span.sf-Text--100")).toHaveTextContent("C2");
  });

  it("exposes heading semantics and a focusable link when using semantic as targets", () => {
    const { getByRole } = renderWithFluent(() => (
      <>
        <Title1 as="h2">Heading</Title1>
        <Text as="a" href="#docs">Docs</Text>
      </>
    ));
    const heading = getByRole("heading", { level: 2, name: "Heading" });
    expect(heading).toHaveClass("sf-Text--800");
    const link = getByRole("link", { name: "Docs" }) as HTMLAnchorElement;
    expect(link).toHaveAttribute("href", "#docs");
    link.focus();
    expect(document.activeElement).toBe(link);
  });
});
