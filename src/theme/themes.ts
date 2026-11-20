import type { BrandVariants, Theme } from "./types";

export const brandWeb: BrandVariants = {
  10: "#061724",
  20: "#082338",
  30: "#0a2e4a",
  40: "#0c3b5e",
  50: "#0e4775",
  60: "#0f548c",
  70: "#115ea3",
  80: "#0f6cbd",
  90: "#2886de",
  100: "#479ef5",
  110: "#62abf5",
  120: "#77b7f7",
  130: "#96c6fa",
  140: "#b4d6fa",
  150: "#cfe4fa",
  160: "#ebf3fc",
};

const shared: Pick<
  Theme,
  | "fontFamilyBase"
  | "fontFamilyMonospace"
  | "fontFamilyNumeric"
  | "fontSizeBase100"
  | "fontSizeBase200"
  | "fontSizeBase300"
  | "fontSizeBase400"
  | "fontSizeBase500"
  | "fontSizeBase600"
  | "fontSizeHero700"
  | "fontSizeHero800"
  | "fontSizeHero900"
  | "fontSizeHero1000"
  | "fontWeightRegular"
  | "fontWeightMedium"
  | "fontWeightSemibold"
  | "fontWeightBold"
  | "lineHeightBase100"
  | "lineHeightBase200"
  | "lineHeightBase300"
  | "lineHeightBase400"
  | "lineHeightBase500"
  | "lineHeightBase600"
  | "lineHeightHero700"
  | "lineHeightHero800"
  | "lineHeightHero900"
  | "lineHeightHero1000"
  | "borderRadiusNone"
  | "borderRadiusSmall"
  | "borderRadiusMedium"
  | "borderRadiusLarge"
  | "borderRadiusXLarge"
  | "borderRadiusCircular"
  | "strokeWidthThin"
  | "strokeWidthThick"
  | "strokeWidthThicker"
  | "strokeWidthThickest"
  | "spacingHorizontalNone"
  | "spacingHorizontalXXS"
  | "spacingHorizontalXS"
  | "spacingHorizontalSNudge"
  | "spacingHorizontalS"
  | "spacingHorizontalMNudge"
  | "spacingHorizontalM"
  | "spacingHorizontalL"
  | "spacingHorizontalXL"
  | "spacingHorizontalXXL"
  | "spacingHorizontalXXXL"
  | "spacingVerticalNone"
  | "spacingVerticalXXS"
  | "spacingVerticalXS"
  | "spacingVerticalSNudge"
  | "spacingVerticalS"
  | "spacingVerticalMNudge"
  | "spacingVerticalM"
  | "spacingVerticalL"
  | "spacingVerticalXL"
  | "spacingVerticalXXL"
  | "spacingVerticalXXXL"
  | "durationUltraFast"
  | "durationFaster"
  | "durationFast"
  | "durationNormal"
  | "durationGentle"
  | "durationSlow"
  | "durationSlower"
  | "durationUltraSlow"
  | "curveAccelerateMax"
  | "curveAccelerateMid"
  | "curveAccelerateMin"
  | "curveDecelerateMax"
  | "curveDecelerateMid"
  | "curveDecelerateMin"
  | "curveEasyEase"
  | "curveEasyEaseMax"
  | "curveLinear"
  | "shadow2"
  | "shadow4"
  | "shadow8"
  | "shadow16"
  | "shadow28"
  | "shadow64"
> = {
  fontFamilyBase:
    "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
  fontFamilyMonospace: "Consolas, 'Courier New', Courier, monospace",
  fontFamilyNumeric:
    "Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
  fontSizeBase100: "10px",
  fontSizeBase200: "12px",
  fontSizeBase300: "14px",
  fontSizeBase400: "16px",
  fontSizeBase500: "20px",
  fontSizeBase600: "24px",
  fontSizeHero700: "28px",
  fontSizeHero800: "32px",
  fontSizeHero900: "40px",
  fontSizeHero1000: "68px",
  fontWeightRegular: "400",
  fontWeightMedium: "500",
  fontWeightSemibold: "600",
  fontWeightBold: "700",
  lineHeightBase100: "14px",
  lineHeightBase200: "16px",
  lineHeightBase300: "20px",
  lineHeightBase400: "22px",
  lineHeightBase500: "28px",
  lineHeightBase600: "32px",
  lineHeightHero700: "36px",
  lineHeightHero800: "40px",
  lineHeightHero900: "52px",
  lineHeightHero1000: "92px",
  borderRadiusNone: "0",
  borderRadiusSmall: "2px",
  borderRadiusMedium: "4px",
  borderRadiusLarge: "6px",
  borderRadiusXLarge: "8px",
  borderRadiusCircular: "10000px",
  strokeWidthThin: "1px",
  strokeWidthThick: "2px",
  strokeWidthThicker: "3px",
  strokeWidthThickest: "4px",
  spacingHorizontalNone: "0",
  spacingHorizontalXXS: "2px",
  spacingHorizontalXS: "4px",
  spacingHorizontalSNudge: "6px",
  spacingHorizontalS: "8px",
  spacingHorizontalMNudge: "10px",
  spacingHorizontalM: "12px",
  spacingHorizontalL: "16px",
  spacingHorizontalXL: "20px",
  spacingHorizontalXXL: "24px",
  spacingHorizontalXXXL: "32px",
  spacingVerticalNone: "0",
  spacingVerticalXXS: "2px",
  spacingVerticalXS: "4px",
  spacingVerticalSNudge: "6px",
  spacingVerticalS: "8px",
  spacingVerticalMNudge: "10px",
  spacingVerticalM: "12px",
  spacingVerticalL: "16px",
  spacingVerticalXL: "20px",
  spacingVerticalXXL: "24px",
  spacingVerticalXXXL: "32px",
  durationUltraFast: "50ms",
  durationFaster: "100ms",
  durationFast: "150ms",
  durationNormal: "200ms",
  durationGentle: "250ms",
  durationSlow: "300ms",
  durationSlower: "400ms",
  durationUltraSlow: "500ms",
  curveAccelerateMax: "cubic-bezier(0.9, 0.1, 1, 0.2)",
  curveAccelerateMid: "cubic-bezier(1, 0, 1, 1)",
  curveAccelerateMin: "cubic-bezier(0.8, 0, 0.78, 0)",
  curveDecelerateMax: "cubic-bezier(0.1, 0.9, 0.2, 1)",
  curveDecelerateMid: "cubic-bezier(0, 0, 0, 1)",
  curveDecelerateMin: "cubic-bezier(0.33, 0, 0.1, 1)",
  curveEasyEase: "cubic-bezier(0.33, 0, 0.67, 1)",
  curveEasyEaseMax: "cubic-bezier(0.8, 0, 0.2, 1)",
  curveLinear: "cubic-bezier(0, 0, 1, 1)",
  shadow2: "0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
  shadow4: "0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
  shadow8: "0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)",
  shadow16: "0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)",
  shadow28: "0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.14)",
  shadow64: "0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.14)",
};

export function createLightTheme(brand: BrandVariants = brandWeb): Theme {
  return {
    ...shared,
    colorNeutralForeground1: "#242424",
    colorNeutralForeground1Hover: "#242424",
    colorNeutralForeground1Pressed: "#242424",
    colorNeutralForeground1Selected: "#242424",
    colorNeutralForeground2: "#424242",
    colorNeutralForeground2Hover: "#242424",
    colorNeutralForeground2Pressed: "#242424",
    colorNeutralForeground2Selected: "#242424",
    colorNeutralForeground3: "#616161",
    colorNeutralForeground4: "#8a8a8a",
    colorNeutralForegroundDisabled: "#bdbdbd",
    colorNeutralForegroundInverted: "#ffffff",
    colorNeutralForegroundOnBrand: "#ffffff",
    colorNeutralForegroundOnBrandHover: "#ffffff",
    colorNeutralForegroundOnBrandPressed: "#ffffff",
    colorNeutralForegroundOnBrandSelected: "#ffffff",
    colorNeutralBackground1: "#ffffff",
    colorNeutralBackground1Hover: "#f5f5f5",
    colorNeutralBackground1Pressed: "#e0e0e0",
    colorNeutralBackground1Selected: "#ebebeb",
    colorNeutralBackground2: "#fafafa",
    colorNeutralBackground3: "#f5f5f5",
    colorNeutralBackground4: "#f0f0f0",
    colorNeutralBackground5: "#ebebeb",
    colorNeutralBackground6: "#e6e6e6",
    colorNeutralBackgroundStatic: "#ffffff",
    colorNeutralBackgroundDisabled: "#f0f0f0",
    colorNeutralBackgroundInverted: "#292929",
    colorNeutralStroke1: "#d1d1d1",
    colorNeutralStroke1Hover: "#c7c7c7",
    colorNeutralStroke1Pressed: "#b3b3b3",
    colorNeutralStroke2: "#e0e0e0",
    colorNeutralStroke3: "#e0e0e0",
    colorNeutralStroke4: "#f0f0f0",
    colorNeutralStrokeAccessible: "#616161",
    colorNeutralStrokeAccessibleHover: "#424242",
    colorNeutralStrokeAccessiblePressed: "#242424",
    colorNeutralStrokeAccessibleSelected: brand[80],
    colorNeutralStrokeDisabled: "#e0e0e0",
    colorBrandBackground: brand[80],
    colorBrandBackgroundHover: brand[70],
    colorBrandBackgroundPressed: brand[40],
    colorBrandBackgroundSelected: brand[60],
    colorBrandBackground2: brand[160],
    colorBrandBackgroundInverted: brand[160],
    colorBrandBackgroundInvertedHover: brand[150],
    colorBrandBackgroundInvertedPressed: brand[140],
    colorBrandForeground1: brand[80],
    colorBrandForeground2: brand[70],
    colorBrandForegroundInverted: brand[80],
    colorBrandForegroundInvertedHover: brand[70],
    colorBrandForegroundInvertedPressed: brand[60],
    colorBrandStroke1: brand[80],
    colorBrandStroke2: brand[140],
    colorBrandStroke2Hover: brand[110],
    colorBrandStroke2Pressed: brand[90],
    colorCompoundBrandBackground: brand[80],
    colorCompoundBrandBackgroundHover: brand[70],
    colorCompoundBrandBackgroundPressed: brand[60],
    colorCompoundBrandBackgroundSelected: brand[60],
    colorCompoundBrandForeground1: brand[80],
    colorCompoundBrandForeground1Hover: brand[70],
    colorCompoundBrandForeground1Pressed: brand[60],
    colorCompoundBrandForeground1Selected: brand[60],
    colorCompoundBrandStroke: brand[80],
    colorCompoundBrandStrokeHover: brand[70],
    colorCompoundBrandStrokePressed: brand[60],
    colorSubtleBackground: "transparent",
    colorSubtleBackgroundHover: "#f5f5f5",
    colorSubtleBackgroundPressed: "#e0e0e0",
    colorSubtleBackgroundSelected: "#ebebeb",
    colorSubtleForeground: "#242424",
    colorSubtleForegroundHover: "#242424",
    colorSubtleForegroundPressed: "#242424",
    colorTransparentBackground: "transparent",
    colorTransparentStroke: "transparent",
    colorTransparentStrokeHover: "#d1d1d1",
    colorTransparentStrokePressed: "#b3b3b3",
    colorBackgroundOverlay: "rgba(0,0,0,0.4)",
    colorStrokeFocus1: "#ffffff",
    colorStrokeFocus2: "#000000",
    colorStatusSuccessBackground1: "#f1faf1",
    colorStatusSuccessBackground2: "#dff6dd",
    colorStatusSuccessBackground3: "#0e700e",
    colorStatusSuccessForeground1: "#0e700e",
    colorStatusSuccessForeground2: "#0e700e",
    colorStatusSuccessForeground3: "#ffffff",
    colorStatusWarningBackground1: "#fff9f5",
    colorStatusWarningBackground2: "#fff4ce",
    colorStatusWarningBackground3: "#bc4b09",
    colorStatusWarningForeground1: "#bc4b09",
    colorStatusWarningForeground2: "#8a4600",
    colorStatusWarningForeground3: "#ffffff",
    colorStatusDangerBackground1: "#fdf3f4",
    colorStatusDangerBackground2: "#fde7e9",
    colorStatusDangerBackground3: "#c50f1f",
    colorStatusDangerForeground1: "#b10e1c",
    colorStatusDangerForeground2: "#b10e1c",
    colorStatusDangerForeground3: "#ffffff",
    colorStatusInfoBackground1: "#eff6fc",
    colorStatusInfoBackground2: "#deecf9",
    colorStatusInfoBackground3: brand[80],
    colorStatusInfoForeground1: brand[80],
    colorStatusInfoForeground2: brand[70],
    colorStatusInfoForeground3: "#ffffff",
    colorStatusSevereBackground1: "#fff4f0",
    colorStatusSevereBackground2: "#fbd8cc",
    colorStatusSevereBackground3: "#c43103",
    colorStatusSevereForeground1: "#c43103",
    colorStatusSevereForeground2: "#a32602",
    colorStatusSevereForeground3: "#ffffff",
    colorPaletteRedBackground1: "#fdf6f6",
    colorPaletteRedBackground2: "#f4cece",
    colorPaletteRedBackground3: "#bc2f32",
    colorPaletteRedForeground1: "#bc2f32",
    colorPaletteRedForeground2: "#a4262c",
    colorPaletteRedForeground3: "#ffffff",
    colorPaletteRedBorderActive: "#bc2f32",
    colorPaletteGreenBackground1: "#f1faf1",
    colorPaletteGreenBackground2: "#cfeacf",
    colorPaletteGreenBackground3: "#0e700e",
    colorPaletteGreenForeground1: "#0e700e",
    colorPaletteGreenForeground2: "#0b6a0b",
    colorPaletteGreenForeground3: "#ffffff",
    colorPaletteGreenBorderActive: "#0e700e",
    colorPaletteYellowBackground1: "#fffef5",
    colorPaletteYellowBackground2: "#fff3c4",
    colorPaletteYellowBackground3: "#817400",
    colorPaletteYellowForeground1: "#817400",
    colorPaletteYellowForeground2: "#6e6200",
    colorPaletteYellowForeground3: "#ffffff",
    colorPaletteYellowBorderActive: "#817400",
    colorScrollbarOverlay: "rgba(0,0,0,0.5)",
    colorNeutralShadowAmbient: "rgba(0,0,0,0.12)",
    colorNeutralShadowKey: "rgba(0,0,0,0.14)",
    colorBrandShadowAmbient: "rgba(0,0,0,0.12)",
    colorBrandShadowKey: "rgba(0,0,0,0.14)",
  };
}

export function createDarkTheme(brand: BrandVariants = brandWeb): Theme {
  return {
    ...shared,
    colorNeutralForeground1: "#ffffff",
    colorNeutralForeground1Hover: "#ffffff",
    colorNeutralForeground1Pressed: "#ffffff",
    colorNeutralForeground1Selected: "#ffffff",
    colorNeutralForeground2: "#d6d6d6",
    colorNeutralForeground2Hover: "#ffffff",
    colorNeutralForeground2Pressed: "#ffffff",
    colorNeutralForeground2Selected: "#ffffff",
    colorNeutralForeground3: "#adadad",
    colorNeutralForeground4: "#7a7a7a",
    colorNeutralForegroundDisabled: "#5c5c5c",
    colorNeutralForegroundInverted: "#242424",
    colorNeutralForegroundOnBrand: "#ffffff",
    colorNeutralForegroundOnBrandHover: "#ffffff",
    colorNeutralForegroundOnBrandPressed: "#ffffff",
    colorNeutralForegroundOnBrandSelected: "#ffffff",
    colorNeutralBackground1: "#292929",
    colorNeutralBackground1Hover: "#3d3d3d",
    colorNeutralBackground1Pressed: "#1f1f1f",
    colorNeutralBackground1Selected: "#383838",
    colorNeutralBackground2: "#1f1f1f",
    colorNeutralBackground3: "#141414",
    colorNeutralBackground4: "#0a0a0a",
    colorNeutralBackground5: "#000000",
    colorNeutralBackground6: "#333333",
    colorNeutralBackgroundStatic: "#141414",
    colorNeutralBackgroundDisabled: "#141414",
    colorNeutralBackgroundInverted: "#ffffff",
    colorNeutralStroke1: "#666666",
    colorNeutralStroke1Hover: "#757575",
    colorNeutralStroke1Pressed: "#6b6b6b",
    colorNeutralStroke2: "#525252",
    colorNeutralStroke3: "#525252",
    colorNeutralStroke4: "#3d3d3d",
    colorNeutralStrokeAccessible: "#adadad",
    colorNeutralStrokeAccessibleHover: "#c2c2c2",
    colorNeutralStrokeAccessiblePressed: "#ffffff",
    colorNeutralStrokeAccessibleSelected: brand[110],
    colorNeutralStrokeDisabled: "#424242",
    colorBrandBackground: brand[110],
    colorBrandBackgroundHover: brand[120],
    colorBrandBackgroundPressed: brand[80],
    colorBrandBackgroundSelected: brand[100],
    colorBrandBackground2: brand[20],
    colorBrandBackgroundInverted: brand[10],
    colorBrandBackgroundInvertedHover: brand[20],
    colorBrandBackgroundInvertedPressed: brand[30],
    colorBrandForeground1: brand[110],
    colorBrandForeground2: brand[120],
    colorBrandForegroundInverted: brand[110],
    colorBrandForegroundInvertedHover: brand[120],
    colorBrandForegroundInvertedPressed: brand[100],
    colorBrandStroke1: brand[110],
    colorBrandStroke2: brand[70],
    colorBrandStroke2Hover: brand[90],
    colorBrandStroke2Pressed: brand[80],
    colorCompoundBrandBackground: brand[110],
    colorCompoundBrandBackgroundHover: brand[120],
    colorCompoundBrandBackgroundPressed: brand[100],
    colorCompoundBrandBackgroundSelected: brand[100],
    colorCompoundBrandForeground1: brand[110],
    colorCompoundBrandForeground1Hover: brand[120],
    colorCompoundBrandForeground1Pressed: brand[100],
    colorCompoundBrandForeground1Selected: brand[100],
    colorCompoundBrandStroke: brand[110],
    colorCompoundBrandStrokeHover: brand[120],
    colorCompoundBrandStrokePressed: brand[100],
    colorSubtleBackground: "transparent",
    colorSubtleBackgroundHover: "#383838",
    colorSubtleBackgroundPressed: "#2e2e2e",
    colorSubtleBackgroundSelected: "#383838",
    colorSubtleForeground: "#ffffff",
    colorSubtleForegroundHover: "#ffffff",
    colorSubtleForegroundPressed: "#ffffff",
    colorTransparentBackground: "transparent",
    colorTransparentStroke: "transparent",
    colorTransparentStrokeHover: "#666666",
    colorTransparentStrokePressed: "#757575",
    colorBackgroundOverlay: "rgba(0,0,0,0.6)",
    colorStrokeFocus1: "#000000",
    colorStrokeFocus2: "#ffffff",
    colorStatusSuccessBackground1: "#052505",
    colorStatusSuccessBackground2: "#123d12",
    colorStatusSuccessBackground3: "#54b054",
    colorStatusSuccessForeground1: "#54b054",
    colorStatusSuccessForeground2: "#6cbb6c",
    colorStatusSuccessForeground3: "#000000",
    colorStatusWarningBackground1: "#4a1e04",
    colorStatusWarningBackground2: "#5a2606",
    colorStatusWarningBackground3: "#f98845",
    colorStatusWarningForeground1: "#f98845",
    colorStatusWarningForeground2: "#fba76b",
    colorStatusWarningForeground3: "#000000",
    colorStatusDangerBackground1: "#3b0509",
    colorStatusDangerBackground2: "#5c141b",
    colorStatusDangerBackground3: "#dc626d",
    colorStatusDangerForeground1: "#eeacb2",
    colorStatusDangerForeground2: "#eeacb2",
    colorStatusDangerForeground3: "#000000",
    colorStatusInfoBackground1: "#082b46",
    colorStatusInfoBackground2: "#144d75",
    colorStatusInfoBackground3: brand[110],
    colorStatusInfoForeground1: brand[110],
    colorStatusInfoForeground2: "#8bbcf7",
    colorStatusInfoForeground3: "#000000",
    colorStatusSevereBackground1: "#3b1005",
    colorStatusSevereBackground2: "#6e2409",
    colorStatusSevereBackground3: "#f98845",
    colorStatusSevereForeground1: "#f98845",
    colorStatusSevereForeground2: "#fba76b",
    colorStatusSevereForeground3: "#000000",
    colorPaletteRedBackground1: "#3f1011",
    colorPaletteRedBackground2: "#5a1d1f",
    colorPaletteRedBackground3: "#eeacb2",
    colorPaletteRedForeground1: "#eeacb2",
    colorPaletteRedForeground2: "#eeacb2",
    colorPaletteRedForeground3: "#000000",
    colorPaletteRedBorderActive: "#eeacb2",
    colorPaletteGreenBackground1: "#052505",
    colorPaletteGreenBackground2: "#123d12",
    colorPaletteGreenBackground3: "#9fd89f",
    colorPaletteGreenForeground1: "#9fd89f",
    colorPaletteGreenForeground2: "#9fd89f",
    colorPaletteGreenForeground3: "#000000",
    colorPaletteGreenBorderActive: "#9fd89f",
    colorPaletteYellowBackground1: "#4c4400",
    colorPaletteYellowBackground2: "#4c4400",
    colorPaletteYellowBackground3: "#feee66",
    colorPaletteYellowForeground1: "#feee66",
    colorPaletteYellowForeground2: "#feee66",
    colorPaletteYellowForeground3: "#000000",
    colorPaletteYellowBorderActive: "#feee66",
    colorScrollbarOverlay: "rgba(255,255,255,0.5)",
    colorNeutralShadowAmbient: "rgba(0,0,0,0.4)",
    colorNeutralShadowKey: "rgba(0,0,0,0.5)",
    colorBrandShadowAmbient: "rgba(0,0,0,0.4)",
    colorBrandShadowKey: "rgba(0,0,0,0.5)",
  };
}

export const webLightTheme = createLightTheme(brandWeb);
export const webDarkTheme = createDarkTheme(brandWeb);

/** CSS custom property map, mirrors Fluent token object usage. */
export const tokens = Object.fromEntries(
  (Object.keys(webLightTheme) as Array<keyof Theme>).map((key) => [
    key,
    `var(--sf-${key})`,
  ]),
) as { [K in keyof Theme]: string };

export function themeToCssVars(theme: Theme, selector = ":root"): string {
  const body = (Object.entries(theme) as Array<[keyof Theme, string]>)
    .map(([key, value]) => `  --sf-${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
}

export function applyThemeToElement(element: HTMLElement, theme: Theme): void {
  for (const [key, value] of Object.entries(theme) as Array<[keyof Theme, string]>) {
    element.style.setProperty(`--sf-${key}`, value);
  }
}

/** Remove all theme variables previously written by `applyThemeToElement`. */
export function removeThemeFromElement(element: HTMLElement): void {
  for (const key of Object.keys(webLightTheme) as Array<keyof Theme>) {
    element.style.removeProperty(`--sf-${key}`);
  }
}
