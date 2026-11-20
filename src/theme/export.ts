import { themeToCssVars } from "./themes";
import type { Theme } from "./types";

export type ThemeExportFormat = "json" | "css" | "ts";

/** Full theme object as pretty JSON (never a partial override). */
export function themeToJson(theme: Theme): string {
  return JSON.stringify(theme, null, 2);
}

function isValidIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
}

/** Ready-to-paste TypeScript module defining the full theme. */
export function themeToTypescript(theme: Theme, name = "myTheme"): string {
  const identifier = isValidIdentifier(name) ? name : "myTheme";
  const body = (Object.entries(theme) as Array<[string, string]>)
    .map(([key, value]) => `  ${key}: ${JSON.stringify(value)},`)
    .join("\n");
  return [
    '// 复制后将 "@solid-fluent/components" 替换为你的包路径',
    'import type { Theme } from "@solid-fluent/components";',
    "",
    `export const ${identifier} = {`,
    body,
    "} satisfies Theme;",
    "",
  ].join("\n");
}

/**
 * Serialize a complete theme into a directly usable format.
 *
 * - `json`: pretty JSON of every token
 * - `css`: `--sf-*` variable block, reusing `themeToCssVars`
 * - `ts`: `export const <name> = { ... } satisfies Theme;`
 */
export function serializeTheme(
  theme: Theme,
  format: ThemeExportFormat,
  options?: { selector?: string; name?: string },
): string {
  switch (format) {
    case "json":
      return themeToJson(theme);
    case "css":
      return themeToCssVars(theme, options?.selector ?? ":root");
    case "ts":
      return themeToTypescript(theme, options?.name ?? "myTheme");
  }
}

/** Copy text to the clipboard; returns `false` on SSR / unsupported / denied. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return false;
    }
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
