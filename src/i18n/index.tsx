import { createEffect, createSignal, onCleanup, type JSX } from "solid-js";
import x18n from "x18n";
import { builtinDictionaries } from "./dictionaries";

export { builtinDictionaries, en, zhCN } from "./dictionaries";

/**
 * x18n 2.0.3 calls navigator.userLanguage/navigator.language directly while
 * sorting locales. jsdom provides it, but SSR / plain Node does not.
 */
if (typeof globalThis.navigator === "undefined") {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { language: "en" },
  });
}

const [version, setVersion] = createSignal(0);
const bump = () => setVersion((v) => v + 1);

let registered = false;
function registerBuiltins() {
  if (registered) return;
  registered = true;
  for (const [locale, dict] of Object.entries(builtinDictionaries)) {
    x18n.register(locale, dict);
  }
  x18n.setDefault("en");
  x18n.on(["lang:change", "dict:change"], bump);
}
registerBuiltins();

/** Translate a key. Subscribing to a signal makes this reactive in JSX. */
export function t(key: string, ...args: unknown[]): string {
  version();
  return x18n.t(key, ...args) as string;
}

/** x18n pluralisation: t(key).plural(n) — exposed as a plain helper. */
export function tp(key: string, n: number): string {
  version();
  const value = x18n.t(key) as { plural(n: number): string };
  return value.plural(n);
}

/** Change the global locale. Every t()/tp() consumer re-renders. */
export function setLocale(locale: string): void {
  if (!x18n.availableLocales.includes(locale)) {
    x18n.register(locale, {});
  }
  x18n.set(locale);
  bump();
}

export function getLocale(): string {
  version();
  return x18n.locales[0] ?? "en";
}

export function availableLocales(): string[] {
  version();
  return [...x18n.availableLocales];
}

export function registerDictionary(locale: string, dict: Record<string, unknown>): void {
  x18n.register(locale, dict);
  bump();
}

export interface I18nContextValue {
  t: typeof t;
  tp: typeof tp;
  locale: typeof getLocale;
  setLocale: typeof setLocale;
  availableLocales: typeof availableLocales;
}

/**
 * Convenience provider: sets the global x18n locale for its subtree and
 * restores it on cleanup. Locale is global by design — components use t()
 * directly, so no context plumbing is required.
 */
export function I18nProvider(props: {
  locale?: string;
  dictionaries?: Record<string, Record<string, unknown>>;
  children?: JSX.Element;
}) {
  const previous = getLocale();
  if (props.dictionaries) {
    for (const [locale, dict] of Object.entries(props.dictionaries)) {
      registerDictionary(locale, dict);
    }
  }
  createEffect(() => {
    if (props.locale) setLocale(props.locale);
  });
  onCleanup(() => setLocale(previous));
  return <>{props.children}</>;
}

export function useI18n(): I18nContextValue {
  return { t, tp, locale: getLocale, setLocale, availableLocales };
}
