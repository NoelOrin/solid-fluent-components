import type { Preview } from "storybook-solidjs-vite";
import { createJSXDecorator } from "storybook-solidjs-vite";
import { createEffect } from "solid-js";
import {
  FluentProvider,
  getThemePreset,
  resolveThemeFamily,
  setLocale,
  type ColorMode,
} from "../src";
import "../src/styles/fluent.css";
import "./preview.css";

const withFluentProvider = createJSXDecorator((Story, context) => {
  const family = resolveThemeFamily((context.globals.themeFamily as string) ?? "web");
  const mode: ColorMode = (context.globals.theme as string) === "dark" ? "dark" : "light";
  const theme = getThemePreset(family, mode);
  const fullscreen = context.parameters?.layout === "fullscreen";
  const locale = () => (context.globals.locale as string) || "zh-CN";
  createEffect(() => setLocale(locale()));

  return (
    <FluentProvider
      theme={theme}
      applyToDocument
      class={fullscreen ? undefined : "sf-sb-surface"}
      style={fullscreen ? { "min-height": "100%" } : { "min-height": "100%", padding: "28px" }}
    >
      <Story />
    </FluentProvider>
  );
});

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          ["Introduction", "Welcome", "安装", "主题", "无障碍", "API"],
          "Theme",
          ["Theme", "Provider"],
          "Design Token Playground",
          "Polish",
          "Inputs",
          "Display",
          ["Display", "Overview"],
          "Feedback",
          ["Feedback", "Overview"],
          "Navigation",
          ["Navigation", "Overview"],
          "Overlay",
          ["Overlay", "Overview"],
          "Data",
          "Layout",
          "Complete",
        ],
      },
    },
  },
  globalTypes: {
    locale: {
      name: "语言 / Locale",
      description: "Component language (i18n)",
      defaultValue: "zh-CN",
      toolbar: {
        icon: "globe",
        items: [
          { value: "zh-CN", title: "中文（默认）" },
          { value: "en", title: "English" },
        ],
        dynamicTitle: true,
      },
    },
    themeFamily: {
      name: "主题族",
      description: "Theme preset family",
      defaultValue: "web",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "web", title: "Web · 蓝", icon: "circlehollow" },
          { value: "violet", title: "Violet · 紫", icon: "circlehollow" },
          { value: "emerald", title: "Emerald · 绿", icon: "circlehollow" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      name: "明暗",
      description: "Light / Dark mode",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "circlehollow" },
          { value: "dark", title: "Dark", icon: "circle" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withFluentProvider],
  tags: ["autodocs"],
};

export default preview;