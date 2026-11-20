import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import {
  I18nProvider,
  availableLocales,
  getLocale,
  registerDictionary,
  setLocale,
  t,
  tp,
  useI18n,
} from "./index";

describe("i18n (x18n)", () => {
  it("registers built-in en / zh-CN dictionaries", () => {
    expect(availableLocales()).toContain("en");
    expect(availableLocales()).toContain("zh-CN");
  });

  it("translates keys from the active locale", () => {
    setLocale("en");
    expect(t("common.close")).toBe("Close");
    expect(t("common.loading")).toBe("Loading");
    setLocale("zh-CN");
    expect(t("common.close")).toBe("关闭");
    expect(t("common.loading")).toBe("加载中");
    setLocale("en");
  });

  it("interpolates positional and named values via x18n", () => {
    registerDictionary("en", {
      test: { greeting: "Hello %1", browser: "Using %{browser}" },
    });
    expect(t("test.greeting", "Ada")).toBe("Hello Ada");
    expect(t("test.browser", { browser: "Chromium" })).toBe("Using Chromium");
  });

  it("supports x18n pluralisation through tp()", () => {
    registerDictionary("en", {
      test: { online: { 1: "One user online", n: "%1 users online" } },
    });
    expect(tp("test.online", 1)).toBe("One user online");
    expect(tp("test.online", 3)).toBe("3 users online");
  });

  it("switches locale through useI18n()", () => {
    const { locale, setLocale: change } = useI18n();
    change("zh-CN");
    expect(locale()).toBe("zh-CN");
    expect(t("common.menu")).toBe("菜单");
    change("en");
    expect(locale()).toBe("en");
  });

  it("I18nProvider sets the locale and restores it on cleanup", () => {
    setLocale("en");
    let dispose!: () => void;
    createRoot((disposeRoot) => {
      dispose = disposeRoot;
      return I18nProvider({ locale: "zh-CN", children: <></> });
    });
    expect(getLocale()).toBe("zh-CN");
    dispose();
    expect(getLocale()).toBe("en");
  });
});
