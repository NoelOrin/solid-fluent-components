declare module "x18n" {
  export type PluralTranslation = Record<string, string> & {
    plural(n: number): string;
  };
  export type TranslationValue = string | PluralTranslation;

  export interface X18n {
    register(locale: string, dict: Record<string, unknown>): void;
    set(locale: string): void;
    setDefault(locale: string): void;
    detectLocal(): string;
    t(key: string, ...interpolation: unknown[]): TranslationValue;
    on(events: string | string[], handler: (...args: unknown[]) => void): void;
    off(events: string | string[], handler?: (...args: unknown[]) => void): void;
    locales: string[];
    availableLocales: string[];
    missingTranslations: Record<string, string[]>;
  }

  const x18n: X18n;
  export default x18n;
}
