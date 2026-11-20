import {
  createDarkTheme,
  createLightTheme,
  webDarkTheme,
  webLightTheme,
} from "../themes";
import type { Theme } from "../types";
import { brandEmerald, brandViolet } from "./brands";

export type ThemeFamily = "web" | "violet" | "emerald";
export type ColorMode = "light" | "dark";

/** Named light/dark themes for the violet family. */
export const violetLightTheme = createLightTheme(brandViolet);
export const violetDarkTheme = createDarkTheme(brandViolet);

/** Named light/dark themes for the emerald family. */
export const emeraldLightTheme = createLightTheme(brandEmerald);
export const emeraldDarkTheme = createDarkTheme(brandEmerald);

export type ThemePresetFamily = {
  id: ThemeFamily;
  label: string;
  light: Theme;
  dark: Theme;
};

/** Runtime metadata consumed by Storybook toolbar / theme switchers. */
export const themePresetFamilies: ThemePresetFamily[] = [
  { id: "web", label: "网页蓝", light: webLightTheme, dark: webDarkTheme },
  { id: "violet", label: "紫罗兰", light: violetLightTheme, dark: violetDarkTheme },
  { id: "emerald", label: "祖母绿", light: emeraldLightTheme, dark: emeraldDarkTheme },
];

/** Read the full theme for a family + mode, falling back to web light. */
export function getThemePreset(family: ThemeFamily, mode: ColorMode): Theme {
  return (
    themePresetFamilies.find((preset) => preset.id === family)?.[mode] ??
    webLightTheme
  );
}

/** Safely convert an arbitrary toolbar string into a ThemeFamily. */
export function resolveThemeFamily(id: string): ThemeFamily {
  return themePresetFamilies.some((preset) => preset.id === id)
    ? (id as ThemeFamily)
    : "web";
}
