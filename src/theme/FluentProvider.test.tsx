import { render } from "@solidjs/testing-library";
import { Show, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import {
  FluentProvider,
  useFluent,
  useFluentDir,
  useFluentTheme,
} from "./FluentProvider";
import { brandWeb, createDarkTheme, createLightTheme, webLightTheme } from "./themes";

const BG_VAR = "--sf-colorBrandBackground";

function themeWithBrand(color: string) {
  return createLightTheme({ ...brandWeb, 80: color });
}

describe("FluentProvider", () => {
  it("renders a div by default and honors the as prop", () => {
    const { container } = render(() => (
      <>
        <FluentProvider>
          <span>default</span>
        </FluentProvider>
        <FluentProvider as="section">
          <span>custom</span>
        </FluentProvider>
      </>
    ));
    expect(container.querySelector("div[data-fluent-provider]")).toBeTruthy();
    expect(container.querySelector("section[data-fluent-provider]")).toBeTruthy();
  });

  it("applies the theme to targetDocument when provided", () => {
    const target = document.implementation.createHTMLDocument("target");
    const theme = themeWithBrand("#123456");
    const { unmount } = render(() => (
      <FluentProvider theme={theme} applyToDocument targetDocument={target}>
        <div>content</div>
      </FluentProvider>
    ));
    expect(target.documentElement.style.getPropertyValue(BG_VAR)).toBe("#123456");
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("");
    unmount();
    expect(target.documentElement.style.getPropertyValue(BG_VAR)).toBe("");
  });

  it("hands document ownership to the next provider when the owner unmounts", () => {
    const outer = themeWithBrand("#111111");
    const inner = themeWithBrand("#222222");
    let setShowOuter!: (value: boolean) => void;

    const App = () => {
      const [showOuter, set] = createSignal(true);
      setShowOuter = set;
      return (
        <Show
          when={showOuter()}
          fallback={
            <FluentProvider theme={inner} applyToDocument>
              <div>inner</div>
            </FluentProvider>
          }
        >
          <FluentProvider theme={outer} applyToDocument>
            <div>outer</div>
          </FluentProvider>
        </Show>
      );
    };

    const { unmount } = render(() => <App />);
    const root = document.documentElement;
    expect(root.style.getPropertyValue(BG_VAR)).toBe("#111111");

    setShowOuter(false);
    expect(root.style.getPropertyValue(BG_VAR)).toBe("#222222");

    unmount();
    expect(root.style.getPropertyValue(BG_VAR)).toBe("");
  });

  it("does not let an inner applyToDocument provider steal ownership", () => {
    const outer = themeWithBrand("#333333");
    const inner = createDarkTheme({ ...brandWeb, 80: "#444444" });
    const { unmount } = render(() => (
      <FluentProvider theme={outer} applyToDocument>
        <FluentProvider theme={inner} applyToDocument>
          <div>nested</div>
        </FluentProvider>
      </FluentProvider>
    ));
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("#333333");
    unmount();
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("");
  });

  it("updates the document theme reactively when the owner theme changes", () => {
    let setBrand!: (value: string) => void;
    const App = () => {
      const [brand, set] = createSignal("#555555");
      setBrand = set;
      const theme = () => themeWithBrand(brand());
      return (
        <FluentProvider theme={theme()} applyToDocument>
          <div>dynamic</div>
        </FluentProvider>
      );
    };
    const { unmount } = render(() => <App />);
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("#555555");
    setBrand("#666666");
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("#666666");
    unmount();
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("");
  });

  it("keeps local CSS variables while applyToDocument is false", () => {
    const theme = themeWithBrand("#777777");
    const { container } = render(() => (
      <FluentProvider theme={theme}>
        <div>local</div>
      </FluentProvider>
    ));
    const root = container.querySelector("[data-fluent-provider]") as HTMLElement;
    expect(root.style.getPropertyValue(BG_VAR)).toBe("#777777");
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("");
  });

  it("merges themeOverrides into the theme applied to the local element", () => {
    const { container } = render(() => (
      <FluentProvider
        theme={themeWithBrand("#123456")}
        themeOverrides={{ colorBrandBackground: "#abcdef" }}
      >
        <div>overridden</div>
      </FluentProvider>
    ));
    const root = container.querySelector<HTMLElement>("[data-fluent-provider]")!;
    expect(root.style.getPropertyValue(BG_VAR)).toBe("#abcdef");
    expect(root.style.getPropertyValue("--sf-colorBrandBackgroundHover")).toBe(
      themeWithBrand("#123456").colorBrandBackgroundHover,
    );
  });

  it("sets the dir attribute from the dir prop", () => {
    const { container } = render(() => (
      <FluentProvider dir="rtl">
        <div>rtl</div>
      </FluentProvider>
    ));
    expect(container.querySelector("[data-fluent-provider]")).toHaveAttribute("dir", "rtl");
  });

  it("exposes the active theme and dir through context hooks", () => {
    let brand: string | undefined;
    let dir: string | undefined;
    function Consumer() {
      brand = useFluentTheme().colorBrandBackground;
      dir = useFluentDir();
      return null;
    }
    render(() => (
      <FluentProvider theme={themeWithBrand("#888888")} dir="rtl">
        <Consumer />
      </FluentProvider>
    ));
    expect(brand).toBe("#888888");
    expect(dir).toBe("rtl");
  });

  it("removes the document theme when applyToDocument is toggled off", () => {
    const [apply, setApply] = createSignal(true);
    const theme = themeWithBrand("#999999");
    const { unmount } = render(() => (
      <FluentProvider theme={theme} applyToDocument={apply()}>
        <div>toggle</div>
      </FluentProvider>
    ));
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("#999999");
    setApply(false);
    expect(document.documentElement.style.getPropertyValue(BG_VAR)).toBe("");
    unmount();
  });

  it("forwards class and style props to the provider element", () => {
    const { container } = render(() => (
      <FluentProvider class="my-provider" style={{ display: "flex" }}>
        <div>styled</div>
      </FluentProvider>
    ));
    const root = container.querySelector("[data-fluent-provider]")!;
    expect(root).toHaveClass("sf-provider", "my-provider");
    expect(root).toHaveStyle({ display: "flex" });
  });

  it("useFluent returns web light defaults outside any provider", () => {
    let brand: string | undefined;
    let dir: string | undefined;
    function Consumer() {
      const fluent = useFluent();
      brand = fluent.theme().colorBrandBackground;
      dir = fluent.dir();
      return null;
    }
    render(() => <Consumer />);
    expect(brand).toBe(webLightTheme.colorBrandBackground);
    expect(dir).toBe("ltr");
  });
});
