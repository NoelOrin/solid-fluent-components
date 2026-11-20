import { describe, expect, it } from "vitest";
import {
  applyThemeToElement,
  brandWeb,
  createDarkTheme,
  createLightTheme,
  emeraldDarkTheme,
  emeraldLightTheme,
  getThemePreset,
  removeThemeFromElement,
  resolveThemeFamily,
  themeToCssVars,
  themePresetFamilies,
  tokens,
  violetDarkTheme,
  violetLightTheme,
  webDarkTheme,
  webLightTheme,
} from "./index";
import { brandEmerald, brandViolet } from "./presets/index";
import type { Theme, TokenName } from "./types";

const NEW_TOKENS: TokenName[] = [
  "colorSubtleBackgroundSelected",
  "colorNeutralForeground4",
  "colorNeutralBackgroundStatic",
  "colorNeutralStroke3",
  "colorNeutralStroke4",
  "colorNeutralStrokeAccessibleHover",
  "colorNeutralStrokeAccessiblePressed",
  "colorNeutralStrokeAccessibleSelected",
  "colorNeutralForegroundOnBrandHover",
  "colorNeutralForegroundOnBrandPressed",
  "colorNeutralForegroundOnBrandSelected",
  "colorBrandBackgroundInverted",
  "colorBrandBackgroundInvertedHover",
  "colorBrandBackgroundInvertedPressed",
  "colorBrandForegroundInverted",
  "colorBrandForegroundInvertedHover",
  "colorBrandForegroundInvertedPressed",
  "colorBrandStroke2Hover",
  "colorBrandStroke2Pressed",
  "colorCompoundBrandBackgroundSelected",
  "colorCompoundBrandForeground1Hover",
  "colorCompoundBrandForeground1Pressed",
  "colorCompoundBrandForeground1Selected",
  "colorCompoundBrandStrokeHover",
  "colorCompoundBrandStrokePressed",
  "colorSubtleForeground",
  "colorSubtleForegroundHover",
  "colorSubtleForegroundPressed",
  "colorTransparentStrokeHover",
  "colorTransparentStrokePressed",
  "colorStatusSuccessBackground2",
  "colorStatusSuccessBackground3",
  "colorStatusSuccessForeground2",
  "colorStatusSuccessForeground3",
  "colorStatusWarningBackground2",
  "colorStatusWarningBackground3",
  "colorStatusWarningForeground2",
  "colorStatusWarningForeground3",
  "colorStatusDangerBackground2",
  "colorStatusDangerForeground2",
  "colorStatusInfoBackground1",
  "colorStatusInfoForeground1",
  "colorStatusSevereBackground1",
  "colorStatusSevereForeground1",
  "colorPaletteRedBackground2",
  "colorPaletteGreenForeground2",
  "colorPaletteYellowBorderActive",
  "colorBackgroundOverlay",
  "colorNeutralShadowAmbient",
  "colorBrandShadowKey",
];

function expectComplete(theme: Theme) {
  for (const token of NEW_TOKENS) {
    expect(theme[token], `missing token ${token}`).toEqual(expect.any(String));
    expect(theme[token]).not.toBe("");
  }
  // Referenced by CSS but previously absent from the Theme type.
  expect(theme.colorSubtleBackgroundSelected).toBeTruthy();
}

describe("expanded token family", () => {
  it("adds every new token to light and dark web themes", () => {
    expectComplete(webLightTheme);
    expectComplete(webDarkTheme);
  });

  it("keeps light and dark token sets identical", () => {
    expect(Object.keys(webLightTheme).sort()).toEqual(Object.keys(webDarkTheme).sort());
  });

  it("keeps legacy web theme values intact (backwards compatibility)", () => {
    expect(webLightTheme.colorNeutralForeground1).toBe("#242424");
    expect(webLightTheme.colorNeutralBackground1).toBe("#ffffff");
    expect(webLightTheme.colorBrandBackground).toBe(brandWeb[80]);
    expect(webDarkTheme.colorNeutralForeground1).toBe("#ffffff");
    expect(webDarkTheme.colorNeutralBackground1).toBe("#292929");
    expect(webDarkTheme.colorBrandBackground).toBe(brandWeb[110]);
  });
});

describe("brand ramps", () => {
  it("provides full 10-160 shade ramps with the requested primaries", () => {
    for (const brand of [brandViolet, brandEmerald]) {
      for (let shade = 10; shade <= 160; shade += 10) {
        expect(brand[shade as keyof typeof brand]).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
    expect(brandViolet[80]).toBe("#6264a7");
    expect(brandEmerald[80]).toBe("#0b6a4f");
  });
});

describe("theme presets", () => {
  const all = [violetLightTheme, violetDarkTheme, emeraldLightTheme, emeraldDarkTheme];

  it("exposes three families with complete light/dark themes", () => {
    expect(themePresetFamilies.map((f) => f.id)).toEqual(["web", "violet", "emerald"]);
    for (const family of themePresetFamilies) {
      expect(family.label).toBeTruthy();
      expectComplete(family.light);
      expectComplete(family.dark);
      expect(Object.keys(family.light).sort()).toEqual(Object.keys(family.dark).sort());
    }
    for (const theme of all) expectComplete(theme);
  });

  it("makes key tokens distinct across the three families", () => {
    const backgrounds = themePresetFamilies.map((f) => ({
      light: f.light.colorBrandBackground,
      dark: f.dark.colorBrandBackground,
    }));
    const lightValues = backgrounds.map((b) => b.light);
    const darkValues = backgrounds.map((b) => b.dark);
    expect(new Set(lightValues).size).toBe(3);
    expect(new Set(darkValues).size).toBe(3);
    expect(lightValues).not.toEqual(darkValues);
  });

  it("generates presets through the existing factories", () => {
    expect(violetLightTheme).toEqual(createLightTheme(brandViolet));
    expect(violetDarkTheme).toEqual(createDarkTheme(brandViolet));
    expect(emeraldLightTheme).toEqual(createLightTheme(brandEmerald));
    expect(emeraldDarkTheme).toEqual(createDarkTheme(brandEmerald));
  });

  it("getThemePreset returns the requested family + mode", () => {
    expect(getThemePreset("web", "light")).toBe(webLightTheme);
    expect(getThemePreset("web", "dark")).toBe(webDarkTheme);
    expect(getThemePreset("violet", "light")).toBe(violetLightTheme);
    expect(getThemePreset("violet", "dark")).toBe(violetDarkTheme);
    expect(getThemePreset("emerald", "light")).toBe(emeraldLightTheme);
    expect(getThemePreset("emerald", "dark")).toBe(emeraldDarkTheme);
  });

  it("resolveThemeFamily falls back to web for unknown strings", () => {
    expect(resolveThemeFamily("web")).toBe("web");
    expect(resolveThemeFamily("violet")).toBe("violet");
    expect(resolveThemeFamily("emerald")).toBe("emerald");
    expect(resolveThemeFamily("nonexistent")).toBe("web");
    expect(resolveThemeFamily("")).toBe("web");
  });
});

describe("theme application helpers", () => {
  it("applyThemeToElement writes --sf variables and removeThemeFromElement clears them", () => {
    const element = document.createElement("div");
    applyThemeToElement(element, webLightTheme);
    expect(element.style.getPropertyValue("--sf-colorBrandBackground")).toBe(
      webLightTheme.colorBrandBackground,
    );
    expect(element.style.length).toBeGreaterThan(0);
    removeThemeFromElement(element);
    expect(element.style.getPropertyValue("--sf-colorBrandBackground")).toBe("");
  });

  it("themeToCssVars emits every token with the --sf prefix", () => {
    const css = themeToCssVars(webLightTheme);
    expect(css.startsWith(":root {")).toBe(true);
    for (const token of Object.keys(webLightTheme)) {
      expect(css).toContain("--sf-" + token + ":");
    }
  });

  it("tokens maps every theme key to its CSS var reference", () => {
    for (const token of Object.keys(webLightTheme) as TokenName[]) {
      expect(tokens[token]).toBe("var(--sf-" + token + ")");
    }
  });

  it("a custom brand flows into brand-derived tokens of both factories", () => {
    const brand = { ...brandWeb, 80: "#123456", 110: "#abcdef" };
    const light = createLightTheme(brand);
    const dark = createDarkTheme(brand);
    expect(light.colorBrandBackground).toBe("#123456");
    expect(dark.colorBrandBackground).toBe("#abcdef");
    expect(light.colorNeutralStrokeAccessibleSelected).toBe("#123456");
  });
});
