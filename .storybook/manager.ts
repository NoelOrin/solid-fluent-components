import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

/**
 * Fluent 风格的 Storybook 管理器主题：品牌色取自 webLightTheme 的 brand 阶梯，
 * 圆角与字体沿用组件库的设计令牌，让工具界面与组件视觉保持一致。
 */
const brandMark =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>" +
  "<rect width='32' height='32' rx='9' fill='%230f6cbd'/>" +
  "<path d='M9 10.5h14M9 16h10M9 21.5h14' stroke='white' stroke-width='2.6' stroke-linecap='round'/>" +
  "</svg>";

addons.setConfig({
  theme: create({
    base: "light",

    brandTitle: "Solid Fluent Components",
    brandUrl: "/",
    brandImage: brandMark,
    brandTarget: "_self",

    colorPrimary: "#0f6cbd",
    colorSecondary: "#2886de",

    appBg: "#f4f7fb",
    appContentBg: "#ffffff",
    appPreviewBg: "#eef2f7",
    appHoverBg: "#e8f0f9",
    appBorderColor: "#dde5ee",
    appBorderRadius: 10,

    fontBase:
      '"Segoe UI Variable", "Segoe UI", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
    fontCode:
      '"SFMono-Regular", "Cascadia Code", Consolas, "Liberation Mono", monospace',

    textColor: "#1b2430",
    textInverseColor: "#ffffff",
    textMutedColor: "#5f6b7a",

    barTextColor: "#5a6675",
    barHoverColor: "#0e4775",
    barSelectedColor: "#0f6cbd",
    barBg: "#ffffff",

    buttonBg: "#0f6cbd",
    buttonBorder: "#0f6cbd",

    inputBg: "#ffffff",
    inputBorder: "#c4cedb",
    inputTextColor: "#1b2430",
    inputBorderRadius: 6,
  }),
});
