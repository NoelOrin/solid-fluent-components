import { describe, expect, it, vi } from "vitest";
import {
  copyTextToClipboard,
  serializeTheme,
  themeToJson,
  themeToTypescript,
} from "./export";
import { webLightTheme } from "./themes";

describe("serializeTheme", () => {
  it("serializes a complete theme to parseable JSON", () => {
    const json = serializeTheme(webLightTheme, "json");
    const parsed = JSON.parse(json);
    expect(parsed.colorBrandBackground).toBe(webLightTheme.colorBrandBackground);
    expect(parsed.colorNeutralForeground1).toBe(webLightTheme.colorNeutralForeground1);
    expect(Object.keys(parsed).length).toBe(Object.keys(webLightTheme).length);
  });

  it("emits a CSS variable block using the existing --sf- prefix", () => {
    const css = serializeTheme(webLightTheme, "css");
    expect(css).toContain(":root {");
    expect(css).toContain("--sf-colorBrandBackground");
    expect(css).toContain("--sf-colorSubtleBackgroundSelected");
    const custom = serializeTheme(webLightTheme, "css", { selector: "[data-theme=x]" });
    expect(custom).toContain("[data-theme=x] {");
  });

  it("emits TS code containing the requested name and Theme import", () => {
    const ts = serializeTheme(webLightTheme, "ts", { name: "violetTheme" });
    expect(ts).toContain("export const violetTheme = {");
    expect(ts).toContain("satisfies Theme;");
    expect(ts).toContain('import type { Theme }');
    expect(ts).toContain("colorBrandBackground:");
    expect(serializeTheme(webLightTheme, "ts")).toContain("export const myTheme = {");
  });

  it("exposes convenience wrappers", () => {
    expect(themeToJson(webLightTheme)).toBe(serializeTheme(webLightTheme, "json"));
    expect(themeToTypescript(webLightTheme, "x")).toBe(
      serializeTheme(webLightTheme, "ts", { name: "x" }),
    );
  });
});

describe("copyTextToClipboard", () => {
  it("returns false without throwing when clipboard is unavailable", async () => {
    const original = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    try {
      await expect(copyTextToClipboard("hello")).resolves.toBe(false);
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: original,
      });
    }
  });

  it("returns true on successful write", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const original = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    try {
      await expect(copyTextToClipboard("hello")).resolves.toBe(true);
      expect(writeText).toHaveBeenCalledWith("hello");
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: original,
      });
    }
  });

  it("returns false when the write is rejected", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    const original = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    try {
      await expect(copyTextToClipboard("hello")).resolves.toBe(false);
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: original,
      });
    }
  });

  it("falls back to myTheme when the requested name is not an identifier", () => {
    const ts = serializeTheme(webLightTheme, "ts", { name: "not-valid-name" });
    expect(ts).toContain("export const myTheme = {");
    expect(ts).not.toContain("not-valid-name");
  });

  it("CSS export uses a custom selector and emits every token", () => {
    const css = serializeTheme(webLightTheme, "css", { selector: "[data-theme=dark]" });
    expect(css.startsWith("[data-theme=dark] {")).toBe(true);
    for (const token of Object.keys(webLightTheme)) {
      expect(css).toContain("--sf-" + token + ":");
    }
  });

  it("JSON export is pretty-printed and round-trips the whole theme", () => {
    const json = themeToJson(webLightTheme);
    expect(json).toContain('\n  "colorBrandBackground":');
    expect(JSON.parse(json)).toEqual(webLightTheme);
  });

  it("returns false when clipboard.writeText throws synchronously", async () => {
    const original = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText() {
          throw new Error("boom");
        },
      },
    });
    try {
      await expect(copyTextToClipboard("hello")).resolves.toBe(false);
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: original,
      });
    }
  });
});
