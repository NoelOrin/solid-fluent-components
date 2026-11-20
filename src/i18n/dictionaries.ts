/** Built-in strings used by the component library itself. */
export const en = {
  common: {
    close: "Close",
    open: "Open",
    clear: "Clear",
    remove: "Remove",
    select: "Select",
    search: "Search",
    cancel: "Cancel",
    menu: "Menu",
    loading: "Loading",
    next: "Next",
    previous: "Previous",
    expand: "Expand",
    collapse: "Collapse",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    goToToday: "Go to today",
  },
} as const;

export const zhCN = {
  common: {
    close: "关闭",
    open: "展开",
    clear: "清除",
    remove: "移除",
    select: "请选择",
    search: "搜索",
    cancel: "取消",
    menu: "菜单",
    loading: "加载中",
    next: "下一步",
    previous: "上一步",
    expand: "展开",
    collapse: "折叠",
    previousMonth: "上个月",
    nextMonth: "下个月",
    goToToday: "回到今天",
  },
} as const;

/** Locale id -> dictionary. Apps may extend these via registerDictionary(). */
export const builtinDictionaries: Record<string, Record<string, unknown>> = {
  en,
  "zh-CN": zhCN,
};

export type BuiltinLocale = keyof typeof builtinDictionaries;
