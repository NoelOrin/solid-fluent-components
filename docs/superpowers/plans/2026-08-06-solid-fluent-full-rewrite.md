# Solid Fluent Components 完整重写实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在本仓库用 SolidJS 完全重写 `@fluentui/react-components` 的公开组件面，使 `@solid-fluent/components` 成为 API、交互、可访问性和文档均可独立交付的 Solid 组件库。

**Architecture:** 以主题令牌 + 共享 Solid 原语（受控状态、浮层定位、焦点管理、ID、class 合并）为底座，按组件族拆分实现文件；每个组件文件保持单一职责，复合组件通过 Context 通信。所有 DOM、ARIA、键盘交互以 Fluent UI v9 契约为准，样式继续走 `sf-*` class + `--sf-*` CSS 变量。

**Tech Stack:** SolidJS 1.9、Vite 8、TypeScript 7、Vitest 4、`@solidjs/testing-library`、jsdom、`@floating-ui/dom`、Storybook 10、`storybook-solidjs-vite`。

**Verification Gates:** `npm run typecheck`、`npm run test`、`npm run build`、`npm run build-storybook` 必须全绿；组件差异报告必须归零（或逐项注明类型/常量豁免）。

---

## 基线审计

审计对象：`@fluentui/react-components@9.74.5` 的 `dist/index.d.ts`。

- 官方公开导出（组件 + 子组件 + 类型 + 常量）共 205 个高优先级名称。
- 当前 `src/components` 共 85 个 `.tsx` 文件，库内导出 253 个名称（含本库扩展）。
- 当前缺口：64 个官方名称。其中组件/子组件缺口全部由本计划补齐，纯类型/常量缺口也通过显式导出收敛。

### 缺口清单与落点

| 官方导出 | 落点 | 类型 |
| --- | --- | --- |
| `CarouselAutoplayButton` `CarouselButton` `CarouselCard` `CarouselNav` `CarouselNavButton` `CarouselNavContainer` `CarouselNavImageButton` `CarouselSlider` `CarouselViewport` | 新建 `src/components/Carousel.tsx`（现有 `Carousel` 从 `TeachingPopover.tsx` 迁入） | 组件 |
| `FlatTree` `FlatTreeItem` | 新建 `src/components/FlatTree.tsx` | 组件 |
| `Hamburger` | 新建 `src/components/Hamburger.tsx` | 组件 |
| `PresenceComponent` `PresenceGroup` | 新建 `src/components/PresenceGroup.tsx` | 组件 |
| `MenuItemLink` `MenuItemSwitch` | 修改 `src/components/Menu.tsx` | 组件 |
| `NavCategoryItem` `NavDrawer` `NavDrawerBody` `NavDrawerFooter` `NavDrawerHeader` `NavSubItem` `NavSubItemGroup` `SplitNavItem` | 修改 `src/components/Nav.tsx` | 组件 |
| `DrawerHeaderNavigation` | 修改 `src/components/Drawer.tsx` | 组件 |
| `OverflowDivider` `DATA_OVERFLOW_DIVIDER` `DATA_OVERFLOW_ITEM` `DATA_OVERFLOW_MENU` `DATA_OVERFLOWING` | 修改 `src/components/Overflow.tsx` | 组件/常量 |
| `RatingItem` | 修改 `src/components/Rating.tsx` | 组件 |
| `ImageSwatch` `SwatchPickerRow` | 修改 `src/components/SwatchPicker.tsx` | 组件 |
| `TagPickerButton` `TagPickerGroup` `TagPickerInput` `TagPickerList` `TagPickerOption` `TagPickerOptionGroup` | 修改 `src/components/TagPicker.tsx` | 组件 |
| `TeachingPopoverBody` `TeachingPopoverCarousel` `TeachingPopoverCarouselCard` `TeachingPopoverCarouselFooter` `TeachingPopoverCarouselNav` `TeachingPopoverCarouselNavButton` `TeachingPopoverCarouselPageCount` `TeachingPopoverFooter` `TeachingPopoverHeader` `TeachingPopoverSurface` `TeachingPopoverTitle` `TeachingPopoverTrigger` | 修改 `src/components/TeachingPopover.tsx` | 组件 |
| `ToastTrigger` | 修改 `src/components/Toast.tsx` | 组件 |
| `ToolbarRadioGroup` | 修改 `src/components/Toolbar.tsx` | 组件 |
| `TableCellLayout` `TableResizeHandle` `TableRowId` | 修改 `src/components/Table.tsx` | 组件/类型 |
| `TreeItemPersonaLayout` | 修改 `src/components/Tree.tsx` | 组件 |
| `PartitionAvatarGroupItems` | 修改 `src/components/AvatarGroup.tsx` | 工具 |
| `PartitionBreadcrumbItems` | 修改 `src/components/Breadcrumb.tsx` | 工具 |
| `PresenceBadgeStatus` `MessageBarIntent` `SpinButtonBounds` `NavDensity` `Slot` | 各自所属文件或 `src/utils/index.ts` | 类型/常量 |

补充覆盖（类型过滤器遗漏但属于官方导出）：`EmptySwatch` 在 Task 7.3；`AnnounceProvider` / `AriaLiveAnnouncer` / `PresenceMotion` / `PresenceMotionFn` 在 Task 3.4；`HeadlessFlatTree` / `HeadlessFlatTreeItem` / `TreeRootReset` 在 Task 8.2；`AtomMotion` / `AtomMotionFn` / `MotionImperativeRef` 在 Task 9.2。

### 每个组件任务的最小完成标准

1. 文件导出名称与官方名称一致（必要时兼容本库已有扩展名）。
2. DOM 结构、ARIA 角色、键盘行为符合任务中的契约。
3. 对应的 `*.test.tsx` 全量通过。
4. `npm run typecheck` 通过。
5. 任务独立提交，commit message 使用 `feat:` / `test:` / `refactor:` 前缀。

---

## Phase 0: 测试与审计基建

### Task 0.1: 初始化 Vitest 测试环境

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/test-utils/index.tsx`
- Create: `src/test-utils/render.test.tsx`

- [ ] **Step 1: 安装测试依赖并添加脚本**

```bash
npm install -D vitest@^4.1.10 @solidjs/testing-library@^0.8.10 jsdom@^30.0.1 @testing-library/jest-dom@^7.0.0
```

`package.json` 的 `scripts` 增加：

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

- [ ] **Step 2: 创建 Vitest 配置**

`vitest.config.ts`：

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

const srcEntry = fileURLToPath(new URL("./src/index.ts", import.meta.url));

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "@solid-fluent/components": srcEntry,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: true,
  },
});
```

`vitest.setup.ts`：

```ts
import "@testing-library/jest-dom/vitest";

class ResizeObserverMock implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??=
  ResizeObserverMock as unknown as typeof ResizeObserver;

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
```

`tsconfig.json` 的 `compilerOptions.types` 改为：

```json
"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 3: 创建测试渲染助手**

`src/test-utils/index.tsx`：

```tsx
import { render } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { FluentProvider, webLightTheme } from "../index";

export function renderWithFluent(ui: () => JSX.Element) {
  return render(() => (
    <FluentProvider theme={webLightTheme}>{ui()}</FluentProvider>
  ));
}
```

`src/test-utils/render.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Button } from "../components/Button";
import { renderWithFluent } from "./index";

describe("renderWithFluent", () => {
  it("renders inside FluentProvider", () => {
    const { getByRole } = renderWithFluent(() => <Button>OK</Button>);
    expect(getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("supports click events", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button onClick={onClick}>OK</Button>
    ));
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 4: 运行测试验证环境**

Run: `npm run test`
Expected: `renderWithFluent` 两个用例 PASS。

- [ ] **Step 5: 运行类型检查**

Run: `npm run typecheck`
Expected: PASS，无新增 TS 错误。

- [ ] **Step 6: 提交**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts tsconfig.json src/test-utils
git commit -m "test: add vitest and solid testing library setup"
```

### Task 0.2: 官方导出差异审计脚本

**Files:**
- Create: `scripts/audit-fluent-parity.mjs`
- Generate: `docs/superpowers/plans/fluent-parity-report.md`

- [ ] **Step 1: 编写审计脚本**

`scripts/audit-fluent-parity.mjs`：

```js
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), "fluent-audit-"));
const tarball = "fluentui-react-components-9.74.5.tgz";

try {
  execFileSync(
    "npm",
    ["pack", "@fluentui/react-components@9.74.5", "--pack-destination", tmp],
    { cwd: root, stdio: "pipe" },
  );
  execFileSync("tar", ["-xzf", join(tmp, tarball), "-C", tmp], {
    cwd: root,
    stdio: "pipe",
  });

  const dts = readFileSync(
    join(tmp, "package", "dist", "index.d.ts"),
    "utf8",
  );
  const official = new Set(
    [...dts.matchAll(/^export \{ ([A-Za-z0-9_]+)/gm)].map((m) => m[1]),
  );

  const { readdirSync, statSync } = await import("node:fs");
  const src = join(root, "src");
  const current = new Set();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
        const text = readFileSync(full, "utf8");
        for (const line of text.split("\n")) {
          const match = line.match(
            /\s*export (?:function|const)\s+([A-Za-z_$][\w$]*)/,
          );
          if (match) current.add(match[1]);
        }
      }
    }
  };
  walk(src);

  const missing = [...official].filter((name) => !current.has(name)).sort();
  const extra = [...current].filter((name) => !official.has(name)).sort();

  const report = [
    "# Fluent Parity Report",
    "",
    `- Official exports: ${official.size}`,
    `- Current exports: ${current.size}`,
    `- Missing: ${missing.length}`,
    `- Extra: ${extra.length}`,
    "",
    "## Missing",
    "",
    missing.map((name) => `- ${name}`).join("\n"),
    "",
    "## Extra",
    "",
    extra.map((name) => `- ${name}`).join("\n"),
    "",
  ].join("\n");

  writeFileSync(
    join(root, "docs", "superpowers", "plans", "fluent-parity-report.md"),
    report,
  );
  console.log(`Report written. Missing: ${missing.length}, Extra: ${extra.length}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
```

- [ ] **Step 2: 运行脚本生成报告**

Run: `node scripts/audit-fluent-parity.mjs`
Expected: 输出 `Report written. Missing: 64, Extra: ...`，并生成 `docs/superpowers/plans/fluent-parity-report.md`。

- [ ] **Step 3: 提交**

```bash
git add scripts/audit-fluent-parity.mjs docs/superpowers/plans/fluent-parity-report.md
git commit -m "chore: add fluent export parity audit"
```

### Task 0.3: 建立重写前基线

- [ ] **Step 1: 确认当前全量命令通过**

Run: `npm run typecheck && npm run build`
Expected: 两者 PASS（当前实现作为重写基线）。

- [ ] **Step 2: 提交基线**

```bash
git add -A
git commit -m "chore: baseline before full fluent rewrite"
```

---

## Phase 1: 共享内核

### Task 1.1: 重写共享工具与可控状态原语

**Files:**
- Modify: `src/utils/index.ts`
- Modify: `src/utils/a11y.ts`
- Create: `src/utils/index.test.ts`
- Create: `src/utils/a11y.test.ts`

- [ ] **Step 1: 编写失败测试**

`src/utils/index.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { callHandler, createId, createControllableSignal, cx, omitProps } from "./index";
import { createRoot } from "solid-js";

describe("utils", () => {
  it("merges cx parts", () => {
    expect(cx("a", false && "b", null, "c")).toBe("a c");
  });

  it("omits keys", () => {
    expect(omitProps({ a: 1, b: 2 }, ["a"])).toEqual({ b: 2 });
  });

  it("creates unique ids", () => {
    expect(createId("x")).not.toBe(createId("x"));
  });

  it("calls event handler unions", () => {
    const direct = vi.fn();
    callHandler(direct, {} as MouseEvent);
    expect(direct).toHaveBeenCalledTimes(1);
  });

  it("supports controlled and uncontrolled state", () => {
    let setOutside;
    let currentValue;
    createRoot(() => {
      const [current, set] = createControllableSignal(
        () => undefined,
        "a",
        vi.fn(),
      );
      currentValue = current;
      setOutside = set;
    });
    expect(currentValue()).toBe("a");
    setOutside("b");
    expect(currentValue()).toBe("b");
  });
});
```

`src/utils/a11y.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { moveActiveIndex } from "./a11y";

describe("moveActiveIndex", () => {
  it("loops forward", () => {
    expect(moveActiveIndex(0, 1, 3)).toBe(1);
    expect(moveActiveIndex(2, 1, 3)).toBe(0);
  });

  it("skips disabled indexes", () => {
    expect(moveActiveIndex(-1, 1, 3, { disabled: (i) => i === 1 })).toBe(2);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/utils/index.test.ts src/utils/a11y.test.ts`
Expected: FAIL，`createControllableSignal` 不存在。

- [ ] **Step 3: 重写 `src/utils/index.ts`**

```ts
import { createSignal, type JSX } from "solid-js";

export type IntrinsicElementProps<T extends keyof JSX.HTMLElementTags> =
  JSX.HTMLElementTags[T];

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function omitProps<T extends Record<string, unknown>, K extends keyof T>(
  props: T,
  keys: readonly K[],
): Omit<T, K> {
  const clone = { ...props };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
}

let idSeed = 0;
export function createId(prefix = "sf"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  idSeed += 1;
  return `${prefix}-${idSeed}`;
}

export function callHandler<TTarget extends Element, TEvent extends Event>(
  handler: JSX.EventHandlerUnion<TTarget, TEvent> | undefined,
  event: TEvent & { currentTarget: TTarget; target: Element },
): void {
  if (!handler) return;
  if (typeof handler === "function") {
    (handler as JSX.EventHandler<TTarget, TEvent>)(event);
    return;
  }
  handler[0](handler[1], event);
}

export function createControllableSignal<T>(
  value: () => T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [internal, setInternal] = createSignal(defaultValue);
  const isControlled = () => value() !== undefined;
  const current = () => (isControlled() ? (value() as T) : internal());
  const set = (next: T | ((prev: T) => T)) => {
    const resolved =
      typeof next === "function" ? (next as (prev: T) => T)(current()) : next;
    if (!isControlled()) setInternal(resolved);
    onChange?.(resolved);
  };
  return [current, set] as const;
}

export * from "./a11y";
```

- [ ] **Step 4: 重写 `src/utils/a11y.ts` 保持现有行为，并导出 `getFocusableElements`、`focusElement`、`createFocusTrap`、`moveActiveIndex`、`isTypingKey`、`scrollIntoViewIfNeeded`**

保留当前文件中的实现，只将 `createControllableSignal` 之外的所有既有导出原样保留。

- [ ] **Step 5: 运行测试**

Run: `npx vitest run src/utils/index.test.ts src/utils/a11y.test.ts && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/utils
git commit -m "refactor: rewrite shared solid primitives with tests"
```

### Task 1.2: 重写主题与 Provider

**Files:**
- Modify: `src/theme/types.ts`
- Modify: `src/theme/themes.ts`
- Modify: `src/theme/FluentProvider.tsx`
- Create: `src/theme/theme.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/theme/theme.test.tsx`：

```tsx
import { describe, expect, it } from "vitest";
import { createSignal } from "solid-js";
import { FluentProvider, useFluentTheme, webDarkTheme, webLightTheme } from "./index";
import { renderWithFluent } from "../test-utils";

function ThemeProbe() {
  const theme = useFluentTheme();
  return <span data-testid="theme">{theme.colorBrandBackground}</span>;
}

describe("theme", () => {
  it("renders css variables from light theme", () => {
    const { container } = renderWithFluent(() => <ThemeProbe />);
    const provider = container.querySelector("[data-fluent-provider]");
    expect(provider).toHaveStyle({ "--sf-colorBrandBackground": webLightTheme.colorBrandBackground });
  });

  it("switches theme reactively", () => {
    const [theme, setTheme] = createSignal(webLightTheme);
    const { getByTestId } = renderWithFluent(() => (
      <FluentProvider theme={theme()}>
        <ThemeProbe />
      </FluentProvider>
    ));
    expect(getByTestId("theme")).toHaveTextContent(webLightTheme.colorBrandBackground);
    setTheme(webDarkTheme);
    expect(getByTestId("theme")).toHaveTextContent(webDarkTheme.colorBrandBackground);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/theme/theme.test.tsx`
Expected: 因 `--sf-*` 断言或主题切换断言失败。

- [ ] **Step 3: 重写 `src/theme/types.ts`**

`Theme` 保留全部现有令牌字段；新增导出：

```ts
export type TokenName = keyof Theme;
export type PartialTheme = Partial<Theme>;
export type BrandVariants = {
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  100: string;
  110: string;
  120: string;
  130: string;
  140: string;
  150: string;
  160: string;
};
```

- [ ] **Step 4: 重写 `src/theme/themes.ts` 与 `src/theme/FluentProvider.tsx`**

保留现有 `webLightTheme`、`webDarkTheme`、`createLightTheme`、`createDarkTheme`、`brandWeb` 与 `applyThemeToElement`；`FluentProvider` 必须导出 `useFluentTheme`、`useFluentDir`、`useFluent`，并保证：
- 每个令牌写成 `--sf-<camelCaseName>` CSS 变量。
- `applyToDocument` 只允许最外层 owner 应用。
- 嵌套 Provider 使用最近一层上下文。

现有实现已满足上述行为，本轮重写只做行为确认与类型收敛，不允许删除令牌。

- [ ] **Step 5: 运行测试与类型检查**

Run: `npx vitest run src/theme/theme.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/theme
git commit -m "refactor: rewrite theme provider with reactive tests"
```

---

## Phase 2: 基础交互组件

### Task 2.1: Button 家族重写

**Files:**
- Modify: `src/components/Button.tsx`
- Modify: `src/components/CompoundButton.tsx`
- Modify: `src/components/ToggleButton.tsx`
- Modify: `src/components/SplitButton.tsx`
- Create: `src/components/Button.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/Button.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { CompoundButton } from "./CompoundButton";
import { ToggleButton } from "./ToggleButton";
import { SplitButton, MenuButton } from "./SplitButton";
import { renderWithFluent } from "../test-utils";

describe("Button family", () => {
  it("renders appearances and focus class", () => {
    const { getByRole } = renderWithFluent(() => (
      <Button appearance="primary" icon={<span>#</span>}>
        Save
      </Button>
    ));
    const button = getByRole("button", { name: "Save" });
    expect(button).toHaveClass("sf-Button", "sf-Button--primary", "sf-focus-ring");
    expect(button).toHaveAttribute("type", "button");
  });

  it("blocks clicks while disabledFocusable", () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Button disabledFocusable onClick={onClick}>
        No
      </Button>
    ));
    const button = getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders CompoundButton with secondary content", () => {
    const { container } = renderWithFluent(() => (
      <CompoundButton secondaryContent="Cmd+S">Save</CompoundButton>
    ));
    expect(container.querySelector(".sf-CompoundButton")).not.toBeNull();
    expect(container.textContent).toContain("Cmd+S");
  });

  it("toggles ToggleButton", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <ToggleButton checked={false} onChange={onChange}>
        Bold
      </ToggleButton>
    ));
    fireEvent.click(getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders SplitButton and MenuButton", () => {
    const { getByRole } = renderWithFluent(() => (
      <SplitButton primaryActionButton={<Button>Primary</Button>} menuButton={<MenuButton />} />
    ));
    expect(getByRole("button", { name: "Primary" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/Button.test.tsx`
Expected: FAIL，契约未满足或文件尚未导出 `SplitButton` 测试所需 props。

- [ ] **Step 3: 重写实现契约**

四个文件必须满足：

| 导出 | 必需 DOM | 必需行为 |
| --- | --- | --- |
| `Button` | `<button class="sf-Button sf-Button--<appearance> sf-Button--<shape> sf-Button--<size> sf-focus-ring">`，icon 包在 `sf-Button__icon` | `disabledFocusable` 不设置原生 `disabled`，设置 `aria-disabled`，click 被拦截 |
| `CompoundButton` | `sf-CompoundButton` 容器，内容含 `sf-CompoundButton__secondaryContent` | 透传 `ButtonProps` |
| `ToggleButton` | `aria-pressed` | `onChange(checked: boolean)` 在点击时翻转 |
| `SplitButton` | `sf-SplitButton` 容器，`sf-SplitButton__primary` + `sf-SplitButton__menu` | 无嵌套 button 时自动渲染两个 `Button` |
| `MenuButton` | `sf-MenuButton` | 点击后触发 `onMenuOpenChange`（若提供） |

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/Button.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Button.tsx src/components/CompoundButton.tsx src/components/ToggleButton.tsx src/components/SplitButton.tsx src/components/Button.test.tsx
git commit -m "refactor: rewrite button family with a11y tests"
```

### Task 2.2: 选择控件重写

**Files:**
- Modify: `src/components/Checkbox.tsx`
- Modify: `src/components/Radio.tsx`
- Modify: `src/components/RadioGroup.tsx`
- Modify: `src/components/Switch.tsx`
- Modify: `src/components/Slider.tsx`
- Modify: `src/components/Rating.tsx`（本轮只做 `RatingItem` 类型与导出，交互重写放在 Task 7.4）
- Create: `src/components/SelectionControls.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/SelectionControls.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";
import { Switch } from "./Switch";
import { Slider } from "./Slider";
import { renderWithFluent } from "../test-utils";

describe("selection controls", () => {
  it("Checkbox binds checked state and aria-checked", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Checkbox checked={false} onChange={onChange} label="Agree" />
    ));
    const input = getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("RadioGroup owns name and value", () => {
    const onValueChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <RadioGroup value="a" onValueChange={onValueChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    ));
    const radios = getByRole("radio");
    expect((radios as HTMLInputElement).checked).toBe(true);
  });

  it("Switch exposes input role switch", () => {
    const { getByRole } = renderWithFluent(() => <Switch checked label="On" />);
    expect(getByRole("switch")).toBeInTheDocument();
  });

  it("Slider renders input range with value", () => {
    const { getByRole } = renderWithFluent(() => <Slider min={0} max={10} value={4} />);
    const slider = getByRole("slider") as HTMLInputElement;
    expect(slider.value).toBe("4");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/SelectionControls.test.tsx`
Expected: FAIL。

- [ ] **Step 3: 重写实现契约**

- `Checkbox`：原生 `input[type=checkbox]` + `aria-checked`（若无原生 checked 语义则保留），label 关联 `for`/`id`。
- `RadioGroup`：通过 Context 提供 `name`、`value`、`onValueChange`；`Radio` 自动获得 `name` 与 `checked`。
- `Switch`：渲染 `input[type=checkbox] role="switch"`，label 通过 `id`/`for` 关联。
- `Slider`：渲染 `input[type=range] role="slider"`，支持 `min`/`max`/`step`/`value`/`onInput`，并输出 `sf-Slider` 容器。
- `Rating` 本轮先补齐 `RatingItem`：导出接受 `value` 的单个星标按钮，`aria-label="<value> of <max>"`。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/SelectionControls.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Checkbox.tsx src/components/Radio.tsx src/components/RadioGroup.tsx src/components/Switch.tsx src/components/Slider.tsx src/components/Rating.tsx src/components/SelectionControls.test.tsx
git commit -m "refactor: rewrite selection controls with a11y tests"
```

### Task 2.3: 文本输入与 Field 重写

**Files:**
- Modify: `src/components/Input.tsx`
- Modify: `src/components/SearchBox.tsx`
- Modify: `src/components/Textarea.tsx`
- Modify: `src/components/SpinButton.tsx`
- Modify: `src/components/Field.tsx`
- Modify: `src/components/Label.tsx`
- Modify: `src/components/InfoLabel.tsx`
- Create: `src/components/InputsAndField.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/InputsAndField.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";
import { SearchBox } from "./SearchBox";
import { Textarea } from "./Textarea";
import { Field } from "./Field";
import { Label } from "./Label";
import { InfoLabel } from "./InfoLabel";
import { renderWithFluent } from "../test-utils";

describe("inputs and field", () => {
  it("Input wires content slots and invalid state", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <Input invalid contentBefore={<span>@</span>} placeholder="Email" />
    ));
    const input = getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(container.querySelector(".sf-Input__content")).toHaveTextContent("@");
  });

  it("SearchBox exposes clear action", () => {
    const onClear = vi.fn();
    const { getByRole, getByLabelText } = renderWithFluent(() => (
      <SearchBox placeholder="Find" onClear={onClear} />
    ));
    const input = getByRole("searchbox") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "abc" } });
    fireEvent.click(getByLabelText("Clear"));
    expect(onClear).toHaveBeenCalled();
  });

  it("Field links label and validation", () => {
    const { getByLabelText, getByRole } = renderWithFluent(() => (
      <Field label="Email" validationState="error" validationMessage="Bad">
        <Input />
      </Field>
    ));
    expect(getByLabelText("Email")).toBe(getByRole("textbox"));
    expect(getByRole("alert")).toHaveTextContent("Bad");
  });

  it("InfoLabel renders info button", () => {
    const { getByLabelText } = renderWithFluent(() => (
      <InfoLabel info="Help">Name</InfoLabel>
    ));
    expect(getByLabelText("Info")).toBeInTheDocument();
  });

  it("SpinButton increments value", () => {
    const onChange = vi.fn();
    const { getByRole, getByLabelText } = renderWithFluent(() => (
      <SpinButton value={1} onChange={onChange} />
    ));
    fireEvent.click(getByLabelText("Increment"));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/InputsAndField.test.tsx`
Expected: FAIL。

- [ ] **Step 3: 重写实现契约**

- `Input`：保持 `sf-Input` 容器 + `sf-Input__field`；`invalid` -> `aria-invalid`。
- `SearchBox`：`input[type=search] role="searchbox"`，有值时显示 Clear 按钮（`aria-label="Clear"`），点击清空并回调 `onClear`。
- `Textarea`：`sf-Textarea` + 原生 textarea；`resize` 属性可选。
- `SpinButton`：上下按钮 `aria-label="Increment"/"Decrement"`，`onChange(nextValue)`，支持受控/非受控，导出 `SpinButtonBounds` 类型。
- `Field`：通过 Context 提供 `controlId`、`validationState`；label 的 `for` 指向控件 id；error 用 `role="alert"`，warning/success 用 `role="status"`。
- `Label`：`required` 时追加 `*` 与 `aria-required`。
- `InfoLabel`：渲染 label 加 `InfoButton`（`aria-label="Info"`），info 文案通过 `aria-describedby` 关联或 tooltip。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/InputsAndField.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Input.tsx src/components/SearchBox.tsx src/components/Textarea.tsx src/components/SpinButton.tsx src/components/Field.tsx src/components/Label.tsx src/components/InfoLabel.tsx src/components/InputsAndField.test.tsx
git commit -m "refactor: rewrite inputs and field with a11y tests"
```

---

## Phase 3: 展示组件

### Task 3.1: Badge / Avatar / Persona / Presence 家族重写

**Files:**
- Modify: `src/components/Badge.tsx`
- Modify: `src/components/Avatar.tsx`
- Modify: `src/components/AvatarGroup.tsx`
- Modify: `src/components/Persona.tsx`
- Modify: `src/components/PresenceBadge.tsx`
- Create: `src/components/PresenceGroup.tsx`
- Create: `src/components/DisplayPeople.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/DisplayPeople.test.tsx`：

```tsx
import { describe, expect, it } from "vitest";
import { Badge, CounterBadge } from "./Badge";
import { Avatar } from "./Avatar";
import { AvatarGroup, AvatarGroupItem, PartitionAvatarGroupItems } from "./AvatarGroup";
import { Persona } from "./Persona";
import { PresenceBadge } from "./PresenceBadge";
import { PresenceComponent, PresenceGroup } from "./PresenceGroup";
import { renderWithFluent } from "../test-utils";

describe("display people", () => {
  it("renders Badge and CounterBadge", () => {
    const { getByText, container } = renderWithFluent(() => (
      <>
        <Badge appearance="tint" color="brand">New</Badge>
        <CounterBadge count={128} overflowCount={99} />
      </>
    ));
    expect(container.querySelector(".sf-Badge--tint")).not.toBeNull();
    expect(getByText("99+")).toBeInTheDocument();
  });

  it("Avatar renders initials and accessible name", () => {
    const { getByRole } = renderWithFluent(() => <Avatar name="Ada Lovelace" />);
    const img = getByRole("img");
    expect(img).toHaveAttribute("aria-label", "Ada Lovelace");
    expect(img.textContent).toContain("AL");
  });

  it("AvatarGroup partitions inline and overflow items", () => {
    const items = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }];
    const { inlineItems, overflowItems } = PartitionAvatarGroupItems({
      items,
      maxInlineItems: 2,
    });
    expect(inlineItems).toHaveLength(2);
    expect(overflowItems).toHaveLength(2);
    const { getByRole } = renderWithFluent(() => (
      <AvatarGroup items={items} maxInlineItems={2} />
    ));
    expect(getByRole("group")).toHaveTextContent("+2");
    expect(AvatarGroupItem).toBeTypeOf("function");
  });

  it("Persona shows primary and secondary text", () => {
    const { container } = renderWithFluent(() => (
      <Persona name="Grace Hopper" secondaryText="Compiler" />
    ));
    expect(container.querySelector(".sf-Persona__primary")).toHaveTextContent("Grace Hopper");
    expect(container.querySelector(".sf-Persona__secondary")).toHaveTextContent("Compiler");
  });

  it("PresenceBadge exposes status and PresenceGroup wraps children", () => {
    const { getByRole } = renderWithFluent(() => (
      <PresenceBadge status="busy" />
    ));
    expect(getByRole("img")).toHaveAttribute("aria-label", "busy");
    const group = renderWithFluent(() => (
      <PresenceGroup compact>
        <PresenceComponent visible>Inside</PresenceComponent>
      </PresenceGroup>
    ));
    expect(group.container.querySelector(".sf-PresenceGroup")).not.toBeNull();
    expect(group.container.textContent).toContain("Inside");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/DisplayPeople.test.tsx`
Expected: FAIL，`PresenceGroup` 不存在。

- [ ] **Step 3: 创建 `src/components/PresenceGroup.tsx`**

```tsx
import { Show, createContext, useContext, type JSX } from "solid-js";
import { cx } from "../utils";

type PresenceGroupContextValue = {
  compact: () => boolean;
  size: () => "extra-small" | "small" | "medium" | "large" | "extra-large";
};

const PresenceGroupContext = createContext<PresenceGroupContextValue>();

export function usePresenceGroup() {
  const ctx = useContext(PresenceGroupContext);
  return ctx ?? { compact: () => false, size: () => "medium" as const };
}

export type PresenceGroupProps = {
  compact?: boolean;
  size?: PresenceGroupContextValue["size"];
  class?: string;
  children?: JSX.Element;
};

export function PresenceGroup(props: PresenceGroupProps) {
  const value: PresenceGroupContextValue = {
    compact: () => Boolean(props.compact),
    size: () => props.size ?? "medium",
  };
  return (
    <PresenceGroupContext.Provider value={value}>
      <div class={cx("sf-PresenceGroup", props.class)}>{props.children}</div>
    </PresenceGroupContext.Provider>
  );
}

export type PresenceComponentProps = {
  visible?: boolean;
  children?: JSX.Element;
  class?: string;
};

export function PresenceComponent(props: PresenceComponentProps) {
  return (
    <Show when={props.visible}>
      <div class={cx("sf-Presence", props.class)}>{props.children}</div>
    </Show>
  );
}
```

- [ ] **Step 4: 补齐其余契约**

- `AvatarGroup.tsx` 增加 `PartitionAvatarGroupItems(options): { inlineItems: AvatarProps[]; overflowItems: AvatarProps[] }`，并确认 `AvatarGroupItem`、`AvatarGroupPopover` 保持导出。
- `PresenceBadge.tsx` 导出 `PresenceBadgeStatus` 类型，保持现有 `sf-PresenceBadge` 类名。
- `Badge.tsx` 保持 `sf-Badge--<appearance>`、`sf-Badge--<color>`，`CounterBadge` 保留 `overflowCount` 与 `dot`。
- `src/components/index.ts` 增加 `export * from "./PresenceGroup";`。

- [ ] **Step 5: 运行测试**

Run: `npx vitest run src/components/DisplayPeople.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/components/Badge.tsx src/components/Avatar.tsx src/components/AvatarGroup.tsx src/components/Persona.tsx src/components/PresenceBadge.tsx src/components/PresenceGroup.tsx src/components/DisplayPeople.test.tsx src/components/index.ts
git commit -m "refactor: rewrite badge avatar persona presence families"
```

### Task 3.2: Text / Image / Spinner / Skeleton / Progress / Divider / Link / Card 重写

**Files:**
- Modify: `src/components/Text.tsx`
- Modify: `src/components/Image.tsx`
- Modify: `src/components/Spinner.tsx`
- Modify: `src/components/Skeleton.tsx`
- Modify: `src/components/ProgressBar.tsx`
- Modify: `src/components/Divider.tsx`
- Modify: `src/components/Link.tsx`
- Modify: `src/components/Card.tsx`
- Create: `src/components/DisplayStatic.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/DisplayStatic.test.tsx`：

```tsx
import { describe, expect, it } from "vitest";
import { Body1, Caption1, Text, Title1 } from "./Text";
import { Image } from "./Image";
import { Spinner } from "./Spinner";
import { Skeleton, SkeletonItem } from "./Skeleton";
import { ProgressBar } from "./ProgressBar";
import { Divider } from "./Divider";
import { Link } from "./Link";
import { Card, CardFooter, CardHeader, CardPreview } from "./Card";
import { renderWithFluent } from "../test-utils";

describe("display static", () => {
  it("Text typography components render correct tags and classes", () => {
    const { getByText, container } = renderWithFluent(() => (
      <>
        <Title1>Title</Title1>
        <Body1>Body</Body1>
        <Caption1>Caption</Caption1>
        <Text size={400}>Base</Text>
      </>
    ));
    expect(container.querySelector("h1")).toHaveTextContent("Title");
    expect(container.querySelector(".sf-Text--400")).toHaveTextContent("Base");
    expect(getByText("Body")).toHaveClass("sf-Text");
    expect(getByText("Caption")).toHaveClass("sf-Text--200");
  });

  it("Image and Skeleton keep presentation attributes", () => {
    const { getByAltText, container } = renderWithFluent(() => (
      <>
        <Image src="x.png" alt="X" rounded />
        <Skeleton width={40} height={8} />
      </>
    ));
    expect(getByAltText("X")).toHaveClass("sf-Image--rounded");
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("Spinner and ProgressBar expose progress semantics", () => {
    const { getByRole } = renderWithFluent(() => (
      <>
        <Spinner label="Loading" />
        <ProgressBar value={0.5} />
      </>
    ));
    expect(getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
    expect(getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0.5");
  });

  it("Divider and Link support orientation and as button", () => {
    const { getByRole } = renderWithFluent(() => (
      <>
        <Divider vertical />
        <Link as="button">Go</Link>
      </>
    ));
    expect(getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
    expect(getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("Card family renders subslots", () => {
    const { container } = renderWithFluent(() => (
      <Card appearance="outline">
        <CardPreview>Preview</CardPreview>
        <CardHeader header="Header" description="Desc" />
        <CardFooter action={<span>Action</span>}>Footer</CardFooter>
      </Card>
    ));
    expect(container.querySelector(".sf-Card--outline")).not.toBeNull();
    expect(container.querySelector(".sf-Card__preview")).toHaveTextContent("Preview");
    expect(container.querySelector(".sf-Card__footer")).toHaveTextContent("Action");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/DisplayStatic.test.tsx`
Expected: 现有实现需补 `aria-hidden` 断言后通过。

- [ ] **Step 3: 重写实现契约**

- `Text.tsx` 导出 `Text`、`Title1`、`Title2`、`Title3`、`Subtitle1`、`Subtitle2`、`Body1`、`Body1Strong`、`Body1Stronger`、`Body2`、`Caption1`、`Caption1Strong`、`Caption1Stronger`、`Caption2`、`Caption2Strong`、`Display`、`LargeTitle`（后两者可放 `Extras.tsx` 但必须从 index 导出）。
- `Skeleton` 默认 `aria-hidden="true"`，保留 `sf-Skeleton` 结构。
- `Spinner` 使用 `role="progressbar"` 与 `aria-label`；无 label 时使用 `aria-label="Loading"`。
- `ProgressBar` 使用 `role="progressbar"` 与 `aria-valuemin/max/now`。
- `Divider` 使用 `role="separator"` 与 `aria-orientation`。
- `Link` 支持 `as="a" | "button"`、`disabled`、`inline`、`appearance`。
- `Card` 系列保留 `sf-Card`、`sf-Card__header`、`sf-Card__preview`、`sf-Card__footer`。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/DisplayStatic.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Text.tsx src/components/Image.tsx src/components/Spinner.tsx src/components/Skeleton.tsx src/components/ProgressBar.tsx src/components/Divider.tsx src/components/Link.tsx src/components/Card.tsx src/components/DisplayStatic.test.tsx
git commit -m "refactor: rewrite static display components with a11y tests"
```

### Task 3.3: Tag / InteractionTag / TagGroup 重写

**Files:**
- Modify: `src/components/Tag.tsx`
- Modify: `src/components/InteractionTag.tsx`
- Create: `src/components/Tags.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/Tags.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Tag, TagGroup } from "./Tag";
import { InteractionTag, InteractionTagPrimary, InteractionTagSecondary } from "./InteractionTag";
import { renderWithFluent } from "../test-utils";

describe("tags", () => {
  it("Tag dismisses via labeled button", () => {
    const onDismiss = vi.fn();
    const { getByLabelText, getByText } = renderWithFluent(() => (<Tag dismissible onDismiss={onDismiss}>Fluent</Tag>));
    expect(getByText("Fluent")).toBeInTheDocument();
    fireEvent.click(getByLabelText("Remove"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("InteractionTag renders primary and secondary actions", () => {
    const { getByRole } = renderWithFluent(() => (
      <InteractionTag>
        <InteractionTagPrimary>Open</InteractionTagPrimary>
        <InteractionTagSecondary aria-label="Remove" />
      </InteractionTag>
    ));
    expect(getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("TagGroup wraps tags", () => {
    const { getByText } = renderWithFluent(() => (<TagGroup><Tag>A</Tag><Tag>B</Tag></TagGroup>));
    expect(getByText("A")).toBeInTheDocument();
    expect(getByText("B")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/Tags.test.tsx`
Expected: FAIL，`InteractionTagPrimary` 缺失 `aria-label` 透传。

- [ ] **Step 3: 重写实现契约**

- `Tag` 保持 `sf-Tag` + dismiss 按钮 `aria-label="Remove"`。
- `TagGroup` 渲染 flex 容器。
- `InteractionTag` 渲染 `sf-InteractionTag` 容器；`InteractionTagPrimary`/`InteractionTagSecondary` 透传 `aria-label` 与 `onClick`。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/Tags.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Tag.tsx src/components/InteractionTag.tsx src/components/Tags.test.tsx
git commit -m "refactor: rewrite tag and interaction tag families"
```

### Task 3.4: Announcer 与 Presence Motion 类型

**Files:**
- Create: `src/components/Announcer.tsx`
- Modify: `src/components/PresenceGroup.tsx`
- Create: `src/components/Announcer.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/Announcer.test.tsx`：

```tsx
import { describe, expect, it } from "vitest";
import { AnnounceProvider, AriaLiveAnnouncer } from "./Announcer";
import { PresenceMotion, PresenceMotionFn } from "./PresenceGroup";
import { renderWithFluent } from "../test-utils";

describe("announcer and presence types", () => {
  it("AriaLiveAnnouncer renders polite live region", () => {
    const { container } = renderWithFluent(() => (
      <AnnounceProvider><AriaLiveAnnouncer>Updated</AriaLiveAnnouncer></AnnounceProvider>
    ));
    expect(container.querySelector("[aria-live='polite']")).toHaveTextContent("Updated");
  });

  it("PresenceMotion types are exported", () => {
    expect(PresenceMotion).toBeDefined();
    expect(PresenceMotionFn).toBeDefined();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/Announcer.test.tsx`
Expected: FAIL，`Announcer.tsx` 不存在。

- [ ] **Step 3: 创建 `src/components/Announcer.tsx`**

```tsx
import { createContext, useContext, type JSX } from "solid-js";
import { cx } from "../utils";

type AnnounceContextValue = {
  announce: (message: string, politeness?: "polite" | "assertive") => void;
};
const AnnounceContext = createContext<AnnounceContextValue>({ announce: () => {} });
export function useAnnounce() { return useContext(AnnounceContext); }

export type AnnounceProviderProps = {
  announce?: AnnounceContextValue["announce"];
  children?: JSX.Element;
};
export function AnnounceProvider(props: AnnounceProviderProps) {
  const value: AnnounceContextValue = { announce: props.announce ?? (() => {}) };
  return <AnnounceContext.Provider value={value}>{props.children}</AnnounceContext.Provider>;
}

export function AriaLiveAnnouncer(props: { class?: string; children?: JSX.Element }) {
  return <div aria-live="polite" aria-atomic="true" class={cx("sf-AriaLiveAnnouncer", props.class)}>{props.children}</div>;
}
```

- [ ] **Step 4: 补齐 Presence 类型**

`PresenceGroup.tsx` 增加：

```ts
export type PresenceMotion = { visible?: boolean };
export type PresenceMotionFn = (options: PresenceMotion) => JSX.Element | undefined;
```

`src/components/index.ts` 增加 `export * from "./Announcer";`。

- [ ] **Step 5: 运行测试**

Run: `npx vitest run src/components/Announcer.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/components/Announcer.tsx src/components/PresenceGroup.tsx src/components/Announcer.test.tsx src/components/index.ts
git commit -m "refactor: add announcer and presence motion types"
```

---

## Phase 4: 反馈组件

### Task 4.1: Dialog 家族重写

**Files:**
- Modify: `src/components/Dialog.tsx`
- Create: `src/components/Dialog.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/Dialog.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "./Dialog";
import { Button } from "./Button";
import { renderWithFluent } from "../test-utils";

describe("Dialog", () => {
  it("opens modal surface with dialog semantics", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Dialog open>
        <DialogSurface>
          <DialogTitle>Title</DialogTitle>
          <DialogBody>Body</DialogBody>
          <DialogActions>Actions</DialogActions>
        </DialogSurface>
      </Dialog>
    ));
    const dialog = getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("sf-Dialog");
    expect(container.querySelector(".sf-Overlay")).not.toBeNull();
  });

  it("Escape closes modal dialog", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => (
      <Dialog open onOpenChange={onOpenChange}>
        <DialogSurface><DialogBody>Body</DialogBody></DialogSurface>
      </Dialog>
    ));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("DialogTrigger opens dialog and DialogContent renders close button", () => {
    const onOpenChange = vi.fn();
    const { getByRole, getByLabelText } = renderWithFluent(() => (
      <Dialog defaultOpen={false} onOpenChange={onOpenChange}>
        <DialogTrigger><Button>Open</Button></DialogTrigger>
        <DialogContent title="Hello" onClose={() => {}}>Content</DialogContent>
      </Dialog>
    ));
    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(getByRole("dialog")).toBeInTheDocument();
    expect(getByLabelText("Close")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/Dialog.test.tsx`
Expected: 至少 `DialogContent` 的关闭按钮断言失败。

- [ ] **Step 3: 重写实现契约**

导出：`Dialog`、`DialogSurface`、`DialogBody`、`DialogTitle`、`DialogActions`、`DialogContent`、`DialogTrigger`，并补齐官方类型 `DialogModalType`、`DialogOpenChangeData`。

契约：modal 使用 `role="dialog"` + `aria-modal`；alert 使用 `role="alertdialog"`；Escape 关闭非 alert；`DialogTrigger` 通过 Context 打开；`DialogContent` 的关闭按钮 `aria-label="Close"`；`DialogSurface` 内使用焦点陷阱。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/Dialog.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Dialog.tsx src/components/Dialog.test.tsx
git commit -m "refactor: rewrite dialog family with a11y tests"
```

### Task 4.2: Drawer 家族重写

**Files:**
- Modify: `src/components/Drawer.tsx`
- Modify: `src/components/InlineDrawer.tsx`
- Modify: `src/components/Extras.tsx`（`DrawerHeaderTitle` 迁移）
- Create: `src/components/Drawer.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/Drawer.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle } from "./Drawer";
import { InlineDrawer } from "./InlineDrawer";
import { renderWithFluent } from "../test-utils";

describe("Drawer family", () => {
  it("renders overlay drawer with header navigation", () => {
    const onOpenChange = vi.fn();
    const { getByRole, getByLabelText } = renderWithFluent(() => (
      <Drawer open type="overlay" onOpenChange={onOpenChange}>
        <DrawerHeaderNavigation><button aria-label="Back">Back</button></DrawerHeaderNavigation>
        <DrawerHeader><DrawerHeaderTitle>Title</DrawerHeaderTitle></DrawerHeader>
        <DrawerBody>Body</DrawerBody>
        <DrawerFooter>Footer</DrawerFooter>
      </Drawer>
    ));
    expect(getByRole("dialog")).toHaveClass("sf-Drawer");
    expect(getByLabelText("Back")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("InlineDrawer stays in flow", () => {
    const { container } = renderWithFluent(() => (
      <InlineDrawer open>Inline</InlineDrawer>
    ));
    expect(container.querySelector(".sf-InlineDrawer")).not.toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/Drawer.test.tsx`
Expected: FAIL，`DrawerHeaderNavigation` 不存在。

- [ ] **Step 3: 补齐实现契约**

`Drawer.tsx` 新增：

```tsx
export function DrawerHeaderNavigation(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-Drawer__navigation", props.class)}>{props.children}</div>;
}
```

并将 `DrawerHeaderTitle` 从 `Extras.tsx` 迁入 `Drawer.tsx`（`Extras.tsx` 继续 re-export 以兼容）。`OverlayDrawer` 作为 `Drawer type="overlay"` 的别名导出。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/Drawer.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Drawer.tsx src/components/InlineDrawer.tsx src/components/Extras.tsx src/components/Drawer.test.tsx
git commit -m "refactor: rewrite drawer family with overlay semantics"
```

### Task 4.3: MessageBar / Toast 家族重写

**Files:**
- Modify: `src/components/MessageBar.tsx`
- Modify: `src/components/Toast.tsx`
- Create: `src/components/MessageBarToast.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/MessageBarToast.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, beforeEach } from "vitest";
import { MessageBar, MessageBarActions, MessageBarBody, MessageBarDismissButton, MessageBarGroup, MessageBarTitle } from "./MessageBar";
import { clearToasts, dispatchToast, Toaster, ToastBody, ToastFooter, ToastTitle, ToastTrigger } from "./Toast";
import { Button } from "./Button";
import { renderWithFluent } from "../test-utils";

describe("message bar and toast", () => {
  beforeEach(() => clearToasts());

  it("MessageBar renders intent and subslots", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <MessageBar intent="warning">
        <MessageBarBody><MessageBarTitle>Careful</MessageBarTitle>Text</MessageBarBody>
        <MessageBarActions><Button>More</Button></MessageBarActions>
      </MessageBar>
    ));
    expect(container.querySelector(".sf-MessageBar--warning")).not.toBeNull();
    expect(getByRole("status")).toHaveTextContent("Careful");
  });

  it("dispatchToast and Toaster render toast parts", () => {
    dispatchToast({ id: "t1", title: "Saved", body: "OK", intent: "success" });
    const { getByText, getByLabelText } = renderWithFluent(() => (
      <Toaster>
        <ToastTitle>Saved</ToastTitle>
        <ToastBody>OK</ToastBody>
        <ToastFooter>Footer</ToastFooter>
        <ToastTrigger><Button>Dismiss</Button></ToastTrigger>
      </Toaster>
    ));
    expect(getByText("OK")).toBeInTheDocument();
    expect(getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("MessageBarDismissButton closes message bar", () => {
    const onDismiss = vi.fn();
    const { getByLabelText } = renderWithFluent(() => (
      <MessageBarGroup>
        <MessageBar><MessageBarBody>Hi</MessageBarBody><MessageBarDismissButton onClick={onDismiss} /></MessageBar>
      </MessageBarGroup>
    ));
    fireEvent.click(getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/MessageBarToast.test.tsx`
Expected: FAIL，`ToastTrigger` 不存在。

- [ ] **Step 3: 补齐 `ToastTrigger` 与 Toast Context**

`Toast.tsx` 增加 Context 与 `ToastTrigger`：

```tsx
import { createContext, useContext, type JSX } from "solid-js";

type ToastContextValue = { dismiss: () => void };
const ToastContext = createContext<ToastContextValue>();
export function useToastContext() { return useContext(ToastContext); }

export type ToastTriggerProps = {
  children: JSX.Element;
  onClick?: (event: MouseEvent) => void;
};
export function ToastTrigger(props: ToastTriggerProps) {
  const toast = useToastContext();
  return (
    <span
      style={{ display: "inline-flex" }}
      onClick={(event) => {
        props.onClick?.(event);
        toast?.dismiss();
      }}
    >
      {props.children}
    </span>
  );
}
```

`Toast` 组件必须用 `ToastContext.Provider` 提供 `dismiss: () => dismissToast(id)`；`Toaster` 内部渲染的每条 toast 包一层该 Provider。`MessageBar.tsx` 导出 `MessageBarIntent` 类型。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/MessageBarToast.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/MessageBar.tsx src/components/Toast.tsx src/components/MessageBarToast.test.tsx
git commit -m "refactor: rewrite message bar and toast families"
```

### Task 4.4: TeachingPopover / Tooltip 家族重写

**Files:**
- Modify: `src/components/TeachingPopover.tsx`
- Modify: `src/components/Tooltip.tsx`
- Create: `src/components/TeachingTooltip.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/TeachingTooltip.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { TeachingPopover, TeachingPopoverBody, TeachingPopoverFooter, TeachingPopoverHeader, TeachingPopoverSurface, TeachingPopoverTitle, TeachingPopoverTrigger } from "./TeachingPopover";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";
import { renderWithFluent } from "../test-utils";

describe("teaching popover and tooltip", () => {
  it("TeachingPopover renders surface with subslots", () => {
    const { getByRole } = renderWithFluent(() => (
      <TeachingPopover open>
        <TeachingPopoverTrigger><Button>Open</Button></TeachingPopoverTrigger>
        <TeachingPopoverSurface>
          <TeachingPopoverHeader><TeachingPopoverTitle>Tip</TeachingPopoverTitle></TeachingPopoverHeader>
          <TeachingPopoverBody>Body</TeachingPopoverBody>
          <TeachingPopoverFooter><Button>Next</Button></TeachingPopoverFooter>
        </TeachingPopoverSurface>
      </TeachingPopover>
    ));
    expect(getByRole("note")).toHaveTextContent("Tip");
  });

  it("Tooltip appears on focus", () => {
    const { getByRole, getByText } = renderWithFluent(() => (
      <Tooltip content="Help" relationship="label">
        <Button>Info</Button>
      </Tooltip>
    ));
    fireEvent.focusIn(getByRole("button"));
    expect(getByRole("tooltip")).toHaveTextContent("Help");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/TeachingTooltip.test.tsx`
Expected: FAIL，`TeachingPopoverSurface` 等不存在。

- [ ] **Step 3: 重写 `TeachingPopover.tsx` 为官方子组件结构**

导出：`TeachingPopover`、`TeachingPopoverTrigger`、`TeachingPopoverSurface`、`TeachingPopoverHeader`、`TeachingPopoverTitle`、`TeachingPopoverBody`、`TeachingPopoverFooter`，以及轮播子组件 `TeachingPopoverCarousel`、`TeachingPopoverCarouselCard`、`TeachingPopoverCarouselFooter`、`TeachingPopoverCarouselNav`、`TeachingPopoverCarouselNavButton`、`TeachingPopoverCarouselPageCount`。

最小实现：`TeachingPopover` 通过 Context 提供 `open/setOpen`；`TeachingPopoverTrigger` 包装 child 并设置 `aria-expanded`；`TeachingPopoverSurface` 渲染 `sf-TeachingPopover` + `role="note"`；其余子组件渲染对应 `sf-TeachingPopover__*` class。轮播子组件复用 `Carousel` 的 index 逻辑并渲染步骤指示器。

`Tooltip.tsx` 保留 `role="tooltip"`，增加 `relationship` 的 `aria-label`/`aria-describedby` 关联。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/TeachingTooltip.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/TeachingPopover.tsx src/components/Tooltip.tsx src/components/TeachingTooltip.test.tsx
git commit -m "refactor: rewrite teaching popover and tooltip families"
```

---

## Phase 5: 导航组件

### Task 5.1: TabList / Accordion 重写

**Files:**
- Modify: `src/components/TabList.tsx`
- Modify: `src/components/Accordion.tsx`
- Create: `src/components/TabsAccordion.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/TabsAccordion.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Tab, TabList, TabPanel, TabPanels } from "./TabList";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "./Accordion";
import { renderWithFluent } from "../test-utils";

describe("tabs and accordion", () => {
  it("TabList selects tab and renders panels", () => {
    const onTabSelect = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <TabList selectedValue="a" onTabSelect={onTabSelect}>
        <Tab value="a">A</Tab>
        <Tab value="b">B</Tab>
      </TabList>
    ));
    expect(getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(getByRole("tab", { name: "B" }));
    expect(onTabSelect).toHaveBeenCalledWith({ value: "b" });
  });

  it("TabPanel uses hidden semantics", () => {
    const { getByRole } = renderWithFluent(() => (
      <TabPanels selectedValue="b">
        <TabPanel value="a">A</TabPanel>
        <TabPanel value="b">B</TabPanel>
      </TabPanels>
    ));
    expect(getByRole("tabpanel")).toHaveTextContent("B");
  });

  it("Accordion toggles single item", () => {
    const { getByRole } = renderWithFluent(() => (
      <Accordion defaultOpenItems={["a"]}>
        <AccordionItem value="a">
          <AccordionHeader>A</AccordionHeader>
          <AccordionPanel>Panel</AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
    const header = getByRole("button");
    expect(header).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(header);
    expect(getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/TabsAccordion.test.tsx`
Expected: FAIL。

- [ ] **Step 3: 重写实现契约**

- `TabList`：`role="tablist"`，`Tab` 使用 `role="tab"` + `aria-selected`，方向键切换（ArrowLeft/Right/Home/End）。
- `TabPanel` 使用 `hidden` 属性，受控 `selectedValue` 不渲染非选中面板。
- `AccordionHeader` 使用 `button` + `aria-expanded`，支持 `expandIcon` 与 `expandIconPosition`。
- `AccordionPanel` 仅在 open 时渲染，`multiple`/`collapsible` 语义保留。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/TabsAccordion.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/TabList.tsx src/components/Accordion.tsx src/components/TabsAccordion.test.tsx
git commit -m "refactor: rewrite tab list and accordion with keyboard tests"
```

### Task 5.2: Breadcrumb / Menu 重写

**Files:**
- Modify: `src/components/Breadcrumb.tsx`
- Modify: `src/components/Menu.tsx`
- Create: `src/components/BreadcrumbMenu.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/BreadcrumbMenu.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, PartitionBreadcrumbItems } from "./Breadcrumb";
import { Menu, MenuItem, MenuItemCheckbox, MenuItemLink, MenuItemRadio, MenuItemSwitch, MenuList, MenuPopover, MenuTrigger } from "./Menu";
import { Button } from "./Button";
import { renderWithFluent } from "../test-utils";

describe("breadcrumb and menu", () => {
  it("Breadcrumb renders items and dividers", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbButton href="#">Home</BreadcrumbButton></BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem current>Current</BreadcrumbItem>
      </Breadcrumb>
    ));
    expect(getByRole("navigation")).toHaveAttribute("aria-label", "Breadcrumb");
    expect(container.querySelectorAll(".sf-Breadcrumb__separator")).toHaveLength(1);
    expect(PartitionBreadcrumbItems).toBeTypeOf("function");
  });

  it("Menu opens and selects items", () => {
    const { getByRole, queryByRole } = renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger><Button>Open</Button></MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Save</MenuItem>
            <MenuItemCheckbox checked>Bold</MenuItemCheckbox>
            <MenuItemRadio checked>Left</MenuItemRadio>
            <MenuItemLink href="#">Docs</MenuItemLink>
            <MenuItemSwitch checked>Dark</MenuItemSwitch>
          </MenuList>
        </MenuPopover>
      </Menu>
    ));
    expect(getByRole("menu")).toBeInTheDocument();
    expect(queryByRole("menuitem")).not.toBeNull();
  });

  it("MenuItemLink closes menu on click", () => {
    const { getByRole, queryByRole } = renderWithFluent(() => (
      <Menu defaultOpen>
        <MenuTrigger><Button>Open</Button></MenuTrigger>
        <MenuPopover><MenuList><MenuItemLink href="#">Docs</MenuItemLink></MenuList></MenuPopover>
      </Menu>
    ));
    fireEvent.click(getByRole("menuitem"));
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/BreadcrumbMenu.test.tsx`
Expected: FAIL，`MenuItemLink` / `MenuItemSwitch` / `PartitionBreadcrumbItems` 不存在。

- [ ] **Step 3: 补齐 `Menu.tsx` 导出**

```tsx
export type MenuItemLinkProps = MenuItemProps & {
  href?: string;
  target?: string;
};
export function MenuItemLink(props: MenuItemLinkProps) {
  const menu = useMenu();
  return (
    <a
      href={props.href}
      target={props.target}
      role="menuitem"
      class={cx("sf-MenuItem", props.class)}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) menu.setOpen(false);
      }}
    >
      {props.icon}
      <span style={{ flex: "1 1 auto" }}>{props.children}</span>
      {props.secondaryContent}
    </a>
  );
}

export type MenuItemSwitchProps = MenuItemProps & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};
export function MenuItemSwitch(props: MenuItemSwitchProps) {
  return (
    <MenuItem
      class={props.class}
      disabled={props.disabled}
      onClick={(event) => {
        props.onChange?.(!props.checked);
        props.onClick?.(event);
      }}
      icon={<span aria-hidden="true">{props.checked ? "☑" : "☐"}</span>}
    >
      {props.children}
    </MenuItem>
  );
}
```

- [ ] **Step 4: 补齐 `Breadcrumb.tsx` 工具导出**

`PartitionBreadcrumbItems` 签名：`(options: { items: BreadcrumbItemData[]; maxDisplayedItems?: number; overflowIndicator?: JSX.Element }) => { displayedItems: BreadcrumbItemData[]; overflowItems: BreadcrumbItemData[] }`。

`Menu.tsx` 还需确认 `MenuDivider`、`MenuGroup`、`MenuGroupHeader`、`MenuSplitGroup` 保持导出并满足 `role` 契约（`separator`、`group`、`menuitem` 相关）。

- [ ] **Step 5: 运行测试**

Run: `npx vitest run src/components/BreadcrumbMenu.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/components/Breadcrumb.tsx src/components/Menu.tsx src/components/BreadcrumbMenu.test.tsx
git commit -m "refactor: rewrite breadcrumb and menu with new item variants"
```

### Task 5.3: Nav / Toolbar / Pagination / Stepper 重写

**Files:**
- Modify: `src/components/Nav.tsx`
- Modify: `src/components/Toolbar.tsx`
- Modify: `src/components/Pagination.tsx`
- Modify: `src/components/Extras.tsx`（Stepper）
- Create: `src/components/NavToolbar.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/NavToolbar.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Nav, NavCategory, NavCategoryItem, NavDivider, NavItem, NavSectionHeader, NavSubItem, NavSubItemGroup } from "./Nav";
import { Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup, ToolbarRadioButton, ToolbarRadioGroup } from "./Toolbar";
import { Pagination } from "./Pagination";
import { Stepper } from "./Extras";
import { renderWithFluent } from "../test-utils";

describe("nav and toolbar", () => {
  it("Nav renders category and sub items", () => {
    const onNavItemSelect = vi.fn();
    const { getByRole, getByText } = renderWithFluent(() => (
      <Nav onNavItemSelect={onNavItemSelect}>
        <NavSectionHeader>Main</NavSectionHeader>
        <NavCategory>
          <NavCategoryItem value="data">Data</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="grid">Grid</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavDivider />
        <NavItem>Home</NavItem>
      </Nav>
    ));
    expect(getByRole("navigation")).toBeInTheDocument();
    fireEvent.click(getByText("Data"));
    expect(onNavItemSelect).toHaveBeenCalledWith("data");
  });

  it("Toolbar exposes radio group semantics", () => {
    const { container } = renderWithFluent(() => (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarRadioGroup name="align">
            <ToolbarRadioButton value="left" checked>Left</ToolbarRadioButton>
          </ToolbarRadioGroup>
        </ToolbarGroup>
        <ToolbarDivider />
        <ToolbarButton>Save</ToolbarButton>
      </Toolbar>
    ));
    expect(container.querySelector(".sf-ToolbarRadioGroup")).not.toBeNull();
  });

  it("Pagination and Stepper render current states", () => {
    const { getByRole, container } = renderWithFluent(() => (
      <>
        <Pagination pageCount={5} page={2} />
        <Stepper activeStep={1} steps={[{ label: "One" }, { label: "Two" }]} />
      </>
    ));
    expect(getByRole("navigation")).toHaveAttribute("aria-label", "Pagination");
    expect(container.querySelector(".sf-Stepper__item--active")).toHaveTextContent("Two");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/NavToolbar.test.tsx`
Expected: FAIL，`NavCategoryItem` / `NavSubItem` / `ToolbarRadioGroup` 不存在。

- [ ] **Step 3: 补齐 `Nav.tsx` 导出**

```tsx
export type NavDensity = "small" | "medium";
export function NavCategoryItem(props: {
  value?: NavItemValue;
  icon?: JSX.Element;
  children?: JSX.Element;
  class?: string;
}) {
  const nav = useNav();
  return (
    <button type="button" class={cx("sf-NavCategoryItem", props.class)} onClick={() => props.value !== undefined && nav.select(props.value)}>
      {props.icon}{props.children}
    </button>
  );
}
export function NavSubItemGroup(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavSubItemGroup", props.class)}>{props.children}</div>;
}
export function NavSubItem(props: { value?: NavItemValue; class?: string; children?: JSX.Element }) {
  const nav = useNav();
  return <button type="button" class={cx("sf-NavSubItem", props.class)} onClick={() => props.value !== undefined && nav.select(props.value)}>{props.children}</button>;
}
export function SplitNavItem(props: { children?: JSX.Element; class?: string }) {
  return <div class={cx("sf-SplitNavItem", props.class)}>{props.children}</div>;
}
export function NavDrawer(props: { children?: JSX.Element; class?: string }) {
  return <div class={cx("sf-NavDrawer", props.class)}>{props.children}</div>;
}
export function NavDrawerHeader(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavDrawer__header", props.class)}>{props.children}</div>;
}
export function NavDrawerBody(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavDrawer__body", props.class)}>{props.children}</div>;
}
export function NavDrawerFooter(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-NavDrawer__footer", props.class)}>{props.children}</div>;
}
```

`Nav.tsx` 需要先补一个 `NavContext` 与 `useNav()`，提供 `select(value)` 给 `NavItem`/`NavCategoryItem`/`NavSubItem` 使用。

- [ ] **Step 4: 补齐 `Toolbar.tsx` 导出**

```tsx
export function ToolbarRadioGroup(props: { name?: string; class?: string; children?: JSX.Element }) {
  return <div role="radiogroup" aria-label={props.name} class={cx("sf-ToolbarRadioGroup", props.class)}>{props.children}</div>;
}
```

- [ ] **Step 5: 运行测试**

Run: `npx vitest run src/components/NavToolbar.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/components/Nav.tsx src/components/Toolbar.tsx src/components/Pagination.tsx src/components/Extras.tsx src/components/NavToolbar.test.tsx
git commit -m "refactor: rewrite nav toolbar pagination stepper"
```

---

## Phase 6: 浮层与溢出

### Task 6.1: Popover / Portal / Overlay 重写

**Files:**
- Modify: `src/components/Popover.tsx`
- Modify: `src/components/Portal.tsx`
- Modify: `src/components/Overlay.tsx`
- Create: `src/components/PopoverPortal.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/PopoverPortal.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Popover, PopoverSurface, PopoverTrigger } from "./Popover";
import { Portal } from "./Portal";
import { Overlay } from "./Overlay";
import { Button } from "./Button";
import { renderWithFluent } from "../test-utils";

describe("popover and portal", () => {
  it("Popover opens on trigger click and closes on Escape", () => {
    const { getByRole, queryByRole } = renderWithFluent(() => (
      <Popover>
        <PopoverTrigger><Button>Open</Button></PopoverTrigger>
        <PopoverSurface>Content</PopoverSurface>
      </Popover>
    ));
    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(getByRole("dialog")).toHaveTextContent("Content");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Portal renders into mount", () => {
    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const { container } = renderWithFluent(() => <Portal mount={mount}>P</Portal>);
    expect(mount.textContent).toBe("P");
    container.remove();
    mount.remove();
  });

  it("Overlay closes on Escape by default", () => {
    const onOpenChange = vi.fn();
    renderWithFluent(() => <Overlay open onOpenChange={onOpenChange}>X</Overlay>);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/PopoverPortal.test.tsx`
Expected: 现有实现大部分通过，需要按契约修正 Escape 与 `PopoverSurface` role。

- [ ] **Step 3: 重写实现契约**

- `Popover` 提供 Context：`open/setOpen/triggerEl/setTriggerEl/positioning`；`PopoverTrigger` 点击切换；`PopoverSurface` 使用 `@floating-ui/dom` 定位、`role="dialog"`、Escape 与外部点击关闭。
- `Portal` 透传 Solid Portal，`mount` 可选。
- `Overlay` 默认 `closeOnEscape`，`onOpenChange(false)`；`closeOnOutsideClick` 控制外点关闭。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/PopoverPortal.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Popover.tsx src/components/Portal.tsx src/components/Overlay.tsx src/components/PopoverPortal.test.tsx
git commit -m "refactor: rewrite popover portal overlay with escape tests"
```

### Task 6.2: Overflow 重写

**Files:**
- Modify: `src/components/Overflow.tsx`
- Create: `src/components/Overflow.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/Overflow.test.tsx`：

```tsx
import { describe, expect, it } from "vitest";
import { DATA_OVERFLOW_DIVIDER, DATA_OVERFLOW_ITEM, DATA_OVERFLOW_MENU, DATA_OVERFLOWING, Overflow, OverflowDivider, OverflowItem } from "./Overflow";
import { renderWithFluent } from "../test-utils";

describe("overflow", () => {
  it("exports data constants", () => {
    expect(DATA_OVERFLOW_ITEM).toBe("data-overflow-item");
    expect(DATA_OVERFLOW_DIVIDER).toBe("data-overflow-divider");
    expect(DATA_OVERFLOW_MENU).toBe("data-overflow-menu");
    expect(DATA_OVERFLOWING).toBe("data-overflowing");
  });

  it("Overflow renders items and divider", () => {
    const { container } = renderWithFluent(() => (
      <Overflow items={[{ id: "a", content: "A" }]} minimumVisible={1}>
        <OverflowItem id="a">A</OverflowItem>
        <OverflowDivider id="d" />
      </Overflow>
    ));
    expect(container.querySelector("[data-overflow-item]")).not.toBeNull();
    expect(container.querySelector("[data-overflow-divider]")).not.toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/Overflow.test.tsx`
Expected: FAIL，常量与 `OverflowDivider` 不存在。

- [ ] **Step 3: 补齐导出**

```ts
export const DATA_OVERFLOW_ITEM = "data-overflow-item";
export const DATA_OVERFLOW_DIVIDER = "data-overflow-divider";
export const DATA_OVERFLOW_MENU = "data-overflow-menu";
export const DATA_OVERFLOWING = "data-overflowing";

export function OverflowDivider(props: { id: string; class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-OverflowDivider", props.class)} data-overflow-divider>{props.children}</div>;
}
```

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/Overflow.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Overflow.tsx src/components/Overflow.test.tsx
git commit -m "refactor: rewrite overflow with data constants and divider"
```

### Task 6.3: Carousel 家族与 Hamburger 重写

**Files:**
- Create: `src/components/Carousel.tsx`（现有 `Carousel` 从 `TeachingPopover.tsx` 迁出）
- Create: `src/components/Hamburger.tsx`
- Modify: `src/components/TeachingPopover.tsx`（移除旧 Carousel，re-export 新文件）
- Create: `src/components/CarouselHamburger.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/CarouselHamburger.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Carousel, CarouselButton, CarouselCard, CarouselNav, CarouselNavButton, CarouselSlider, CarouselViewport } from "./Carousel";
import { Hamburger } from "./Hamburger";
import { renderWithFluent } from "../test-utils";

describe("carousel and hamburger", () => {
  it("Carousel renders viewport, slider and nav", () => {
    const { container, getByRole } = renderWithFluent(() => (
      <Carousel defaultActiveIndex={0}>
        <CarouselViewport><CarouselSlider><CarouselCard>One</CarouselCard><CarouselCard>Two</CarouselCard></CarouselSlider></CarouselViewport>
        <CarouselNav><CarouselNavButton index={0}>1</CarouselNavButton></CarouselNav>
      </Carousel>
    ));
    expect(container.querySelector(".sf-Carousel__viewport")).not.toBeNull();
    expect(container.querySelectorAll(".sf-Carousel__slide")).toHaveLength(2);
    expect(CarouselButton).toBeTypeOf("function");
  });

  it("Hamburger toggles aria-expanded", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (<Hamburger checked={false} onChange={onChange} />));
    fireEvent.click(getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/CarouselHamburger.test.tsx`
Expected: FAIL，新文件不存在。

- [ ] **Step 3: 创建 `src/components/Carousel.tsx`**

```tsx
import { For, Show, createContext, createMemo, createSignal, useContext, type JSX } from "solid-js";
import { cx } from "../utils";

type CarouselContextValue = {
  index: () => number;
  setIndex: (index: number) => void;
  count: () => number;
};
const CarouselContext = createContext<CarouselContextValue>();
export function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel subcomponents require <Carousel>");
  return ctx;
}

export type CarouselProps = {
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  class?: string;
  children?: JSX.Element;
};
export function Carousel(props: CarouselProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultActiveIndex ?? 0);
  const index = createMemo(() => props.activeIndex ?? uncontrolled());
  const [count, setCount] = createSignal(0);
  const setIndex = (next: number) => {
    const max = Math.max(count() - 1, 0);
    const clamped = Math.min(Math.max(next, 0), max);
    if (props.activeIndex === undefined) setUncontrolled(clamped);
    props.onActiveIndexChange?.(clamped);
  };
  const value: CarouselContextValue = { index, setIndex, count };
  return <CarouselContext.Provider value={value}><div class={cx("sf-Carousel", props.class)}>{props.children}</div></CarouselContext.Provider>;
}

export function CarouselViewport(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-Carousel__viewport", props.class)}>{props.children}</div>;
}
export function CarouselSlider(props: { class?: string; children?: JSX.Element }) {
  const carousel = useCarousel();
  return <div class={cx("sf-Carousel__slider", props.class)} style={{ transform: `translateX(-${carousel.index() * 100}%)` }}>{props.children}</div>;
}
export function CarouselCard(props: { class?: string; children?: JSX.Element }) {
  const carousel = useCarousel();
  return <div class={cx("sf-Carousel__slide", props.class)} role="group" aria-roledescription="slide">{props.children}</div>;
}
export function CarouselNav(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-Carousel__nav", props.class)} role="tablist">{props.children}</div>;
}
export function CarouselNavButton(props: { index: number; class?: string; children?: JSX.Element }) {
  const carousel = useCarousel();
  return <button type="button" class={cx("sf-Carousel__navButton", props.class)} aria-selected={carousel.index() === props.index} onClick={() => carousel.setIndex(props.index)}>{props.children}</button>;
}
export function CarouselButton(props: { direction?: "next" | "previous"; class?: string; children?: JSX.Element }) {
  const carousel = useCarousel();
  return <button type="button" class={cx("sf-Carousel__button", props.class)} onClick={() => carousel.setIndex(carousel.index() + (props.direction === "previous" ? -1 : 1))}>{props.children}</button>;
}
export function CarouselAutoplayButton(props: { playing?: boolean; class?: string }) {
  return <button type="button" class={cx("sf-Carousel__autoplay", props.class)} aria-pressed={props.playing}>{props.playing ? "Pause" : "Play"}</button>;
}
export function CarouselNavContainer(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-Carousel__navContainer", props.class)}>{props.children}</div>;
}
export function CarouselNavImageButton(props: { index: number; image?: string; class?: string }) {
  const carousel = useCarousel();
  return <button type="button" class={cx("sf-Carousel__navImage", props.class)} style={props.image ? { backgroundImage: `url(${props.image})` } : undefined} aria-label={`Go to slide ${props.index + 1}`} aria-selected={carousel.index() === props.index} onClick={() => carousel.setIndex(props.index)} />;
}
```

- [ ] **Step 4: 创建 `src/components/Hamburger.tsx`**

```tsx
import { splitProps, type JSX } from "solid-js";
import { cx } from "../utils";

export type HamburgerProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  class?: string;
};
export function Hamburger(props: HamburgerProps) {
  const [local] = splitProps(props, ["checked", "onChange", "label", "class"]);
  return (
    <button type="button" class={cx("sf-Hamburger", local.class)} aria-label={local.label ?? "Menu"} aria-expanded={local.checked} onClick={() => local.onChange?.(!local.checked)}>
      <span class="sf-Hamburger__line" aria-hidden="true" />
      <span class="sf-Hamburger__line" aria-hidden="true" />
      <span class="sf-Hamburger__line" aria-hidden="true" />
    </button>
  );
}
```

- [ ] **Step 5: 更新导出并运行测试**

`src/components/index.ts` 增加 `export * from "./Carousel"; export * from "./Hamburger";`；`TeachingPopover.tsx` 删除旧 `Carousel` 定义并 re-export 新文件。

Run: `npx vitest run src/components/CarouselHamburger.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/components/Carousel.tsx src/components/Hamburger.tsx src/components/TeachingPopover.tsx src/components/index.ts src/components/CarouselHamburger.test.tsx
git commit -m "refactor: add carousel family and hamburger"
```

---

## Phase 7: 选择器与日期

### Task 7.1: Select / Dropdown / Combobox 重写

**Files:**
- Modify: `src/components/Select.tsx`
- Modify: `src/components/Dropdown.tsx`
- Modify: `src/components/ComboboxField.tsx`
- Create: `src/components/Pickers.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/Pickers.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Combobox, Listbox, Option, OptionItem, Select } from "./Select";
import { Dropdown } from "./Dropdown";
import { ComboboxField } from "./ComboboxField";
import { renderWithFluent } from "../test-utils";

describe("pickers", () => {
  it("Select renders native select and options", () => {
    const { getByRole } = renderWithFluent(() => (
      <Select aria-label="Role"><Option value="a">A</Option><Option value="b">B</Option></Select>
    ));
    const select = getByRole("combobox");
    expect(select).toHaveClass("sf-Select");
    expect(select.querySelectorAll("option")).toHaveLength(2);
  });

  it("Dropdown opens listbox and selects option", () => {
    const onOptionSelect = vi.fn();
    const { getByRole, getByText } = renderWithFluent(() => (
      <Dropdown options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} onOptionSelect={onOptionSelect} />
    ));
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByText("Beta"));
    expect(onOptionSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "b" }));
  });

  it("ComboboxField filters options and supports keyboard", () => {
    const { getByRole, getByText } = renderWithFluent(() => (
      <ComboboxField options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} />
    ));
    const input = getByRole("combobox") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "Be" } });
    expect(getByText("Beta")).toBeInTheDocument();
    expect(Combobox).toBeTypeOf("function");
    expect(Listbox).toBeTypeOf("function");
    expect(OptionItem).toBeTypeOf("function");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/Pickers.test.tsx`
Expected: 现有实现需满足 role 断言后通过。

- [ ] **Step 3: 重写实现契约**

- `Select`：原生 `select`，`role="combobox"` 由原生语义提供，保留 `sf-Select`。
- `Dropdown`：`button` + `aria-haspopup="listbox"` + `aria-expanded`，listbox `role="listbox"`，支持 Arrow/Enter/Escape/首字母跳转。
- `ComboboxField`：`input role="combobox"` + `aria-expanded/controls/activedescendant`，支持过滤、多选 Tag、Backspace 删除、Home/End、Enter/Escape。
- `Combobox`、`Listbox`、`Option`、`OptionItem`、`OptionGroup` 保持官方名称导出；`OptionGroup` 使用 `role="group"` + `aria-label`。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/Pickers.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Select.tsx src/components/Dropdown.tsx src/components/ComboboxField.tsx src/components/Pickers.test.tsx
git commit -m "refactor: rewrite select dropdown combobox with keyboard tests"
```

### Task 7.2: TagPicker 家族重写

**Files:**
- Modify: `src/components/TagPicker.tsx`
- Create: `src/components/TagPicker.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/TagPicker.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { TagPicker, TagPickerButton, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerOptionGroup } from "./TagPicker";
import { renderWithFluent } from "../test-utils";

describe("tag picker", () => {
  it("adds and removes tags", () => {
    const onOptionSelect = vi.fn();
    const { getByRole, getByText, getByLabelText } = renderWithFluent(() => (
      <TagPicker options={[{ value: "a", label: "Alpha" }]} onOptionSelect={onOptionSelect} />
    ));
    fireEvent.click(getByRole("textbox"));
    fireEvent.click(getByText("Alpha"));
    expect(onOptionSelect).toHaveBeenCalledWith(["a"]);
    expect(getByText("Alpha")).toBeInTheDocument();
  });

  it("exports subcomponents", () => {
    expect(TagPickerButton).toBeTypeOf("function");
    expect(TagPickerControl).toBeTypeOf("function");
    expect(TagPickerGroup).toBeTypeOf("function");
    expect(TagPickerInput).toBeTypeOf("function");
    expect(TagPickerList).toBeTypeOf("function");
    expect(TagPickerOption).toBeTypeOf("function");
    expect(TagPickerOptionGroup).toBeTypeOf("function");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/TagPicker.test.tsx`
Expected: FAIL，子组件导出缺失。

- [ ] **Step 3: 补齐子组件**

`TagPickerButton` 渲染 control 的 button 样式触发器；`TagPickerGroup` 包裹已选 Tag；`TagPickerInput` 渲染输入；`TagPickerList` 渲染 `role="listbox"`；`TagPickerOption` 渲染 `role="option"`；`TagPickerOptionGroup` 渲染 `role="group"` + label。现有 `TagPickerControl` 保持兼容。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/TagPicker.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/TagPicker.tsx src/components/TagPicker.test.tsx
git commit -m "refactor: rewrite tag picker with subcomponent api"
```

### Task 7.3: SwatchPicker / ColorPicker 重写

**Files:**
- Modify: `src/components/SwatchPicker.tsx`
- Modify: `src/components/ColorPicker.tsx`
- Create: `src/components/ColorSwatch.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/ColorSwatch.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { hexToHsva, hsvaToHex } from "./ColorPicker";
import { EmptySwatch, ImageSwatch, SwatchPicker, SwatchPickerRow } from "./SwatchPicker";
import { renderWithFluent } from "../test-utils";

describe("color and swatches", () => {
  it("converts hex and hsva", () => {
    const hsva = hexToHsva("#ff0000");
    expect(Math.round(hsva.h)).toBe(0);
    expect(hsvaToHex({ ...hsva, a: 1 })).toBe("#ff0000");
  });

  it("SwatchPicker selects single item and SwatchPickerRow groups rows", () => {
    const onSelectionChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <SwatchPicker items={[{ value: "r", color: "#f00", label: "Red" }]} onSelectionChange={onSelectionChange}>
        <SwatchPickerRow><ImageSwatch src="x.png" value="img" label="Image" /></SwatchPickerRow>
      </SwatchPicker>
    ));
    fireEvent.click(getByRole("option", { name: "Red" }));
    expect(onSelectionChange).toHaveBeenCalledWith(["r"]);
    expect(getByRole("option", { name: "Image" })).toBeInTheDocument();
    expect(EmptySwatch).toBeTypeOf("function");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/ColorSwatch.test.tsx`
Expected: FAIL，`SwatchPickerRow` / `ImageSwatch` 不存在。

- [ ] **Step 3: 补齐 `SwatchPicker.tsx` 导出**

```tsx
export function SwatchPickerRow(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-SwatchPicker__row", props.class)}>{props.children}</div>;
}
export function ImageSwatch(props: {
  src: string;
  value: string;
  label?: string;
  selected?: boolean;
  class?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-label={props.label ?? props.value}
      aria-selected={props.selected}
      class={cx("sf-ColorSwatch", "sf-ColorSwatch--image", props.class)}
      onClick={props.onClick}
    >
      <img src={props.src} alt={props.label ?? props.value} />
    </button>
  );
}
```

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/ColorSwatch.test.tsx && npm run typecheck`
Expected: PASS。

`SwatchPicker.tsx` 同时导出 `EmptySwatch`：

```tsx
export function EmptySwatch(props: { label?: string; class?: string }) {
  return <span class={cx("sf-ColorSwatch", "sf-ColorSwatch--empty", props.class)} role="img" aria-label={props.label ?? "Empty swatch"} />;
}
```

`ColorPicker.tsx` 保持 `ColorPicker`、`ColorArea`、`ColorSlider`、`AlphaSlider` 导出，并保留 `hexToHsva` / `hsvaToHex` 工具。

- [ ] **Step 5: 提交**

```bash
git add src/components/SwatchPicker.tsx src/components/ColorPicker.tsx src/components/ColorSwatch.test.tsx
git commit -m "refactor: rewrite swatch and color picker families"
```

### Task 7.4: DatePicker / TimePicker / Rating 重写

**Files:**
- Modify: `src/components/DatePicker.tsx`
- Modify: `src/components/Extras.tsx`（`TimePicker`）
- Modify: `src/components/Rating.tsx`（`RatingItem`）
- Create: `src/components/DateRating.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/DateRating.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Calendar, DatePicker, formatDate } from "./DatePicker";
import { TimePicker } from "./Extras";
import { Rating, RatingDisplay, RatingItem } from "./Rating";
import { renderWithFluent } from "../test-utils";

describe("date and rating", () => {
  it("Calendar selects a date and DatePicker formats it", () => {
    const onSelectDate = vi.fn();
    const date = new Date(2026, 7, 6);
    const { getByRole, getAllByRole } = renderWithFluent(() => (
      <Calendar value={date} onSelectDate={onSelectDate} />
    ));
    fireEvent.click(getAllByRole("gridcell").find((el) => el.textContent === "6")!);
    expect(onSelectDate).toHaveBeenCalled();
    expect(formatDate(date)).toBe("2026-08-06");
    expect(DatePicker).toBeTypeOf("function");
  });

  it("TimePicker renders select with time options", () => {
    const { container } = renderWithFluent(() => <TimePicker />);
    expect(container.querySelector(".sf-TimePicker")).not.toBeNull();
  });

  it("Rating renders items and display", () => {
    const onChange = vi.fn();
    const { getByRole, getAllByRole } = renderWithFluent(() => (
      <Rating value={3} onChange={onChange} />
    ));
    expect(getAllByRole("radio")).toHaveLength(5);
    fireEvent.click(getAllByRole("radio")[4]!);
    expect(onChange).toHaveBeenCalledWith(5);
    expect(RatingDisplay).toBeTypeOf("function");
    expect(RatingItem).toBeTypeOf("function");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/DateRating.test.tsx`
Expected: 现有实现需按契约补齐 `RatingItem` 与 TimePicker class。

- [ ] **Step 3: 重写实现契约**

- `Calendar`/`DatePicker`/`CalendarDateRange`/`DateRangePicker` 保留，补充 `parseDate`/`formatDate` 导出与键盘漫游测试。
- `TimePicker` 输出 `sf-TimePicker` 容器 + 时间选项。
- `Rating` 输出 5 个 `radio`（或等价 `role=radio`），`RatingItem` 渲染单项并带 `aria-label`，`RatingDisplay` 展示分数。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/DateRating.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/DatePicker.tsx src/components/Extras.tsx src/components/Rating.tsx src/components/DateRating.test.tsx
git commit -m "refactor: rewrite date time and rating pickers"
```

---

## Phase 8: 数据组件

### Task 8.1: Table / DataGrid 重写

**Files:**
- Modify: `src/components/Table.tsx`
- Modify: `src/components/DataGrid.tsx`
- Create: `src/components/TableDataGrid.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/TableDataGrid.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Table, TableBody, TableCell, TableCellLayout, TableHeader, TableHeaderCell, TableResizeHandle, TableRow, TableSelectionCell } from "./Table";
import { DataGrid } from "./DataGrid";
import { renderWithFluent } from "../test-utils";

describe("table and data grid", () => {
  it("Table renders semantic rows and cells", () => {
    const { container } = renderWithFluent(() => (
      <Table>
        <TableHeader><TableHeaderCell>Name</TableHeaderCell></TableHeader>
        <TableBody><TableRow><TableCell><TableCellLayout media={<span>@</span>} description="desc">Ada</TableCellLayout></TableCell></TableRow></TableBody>
      </Table>
    ));
    expect(container.querySelector("table")).toHaveClass("sf-Table");
    expect(container.querySelector(".sf-TableCellLayout")).toHaveTextContent("Ada");
    expect(TableResizeHandle).toBeTypeOf("function");
  });

  it("TableSelectionCell toggles checked", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (<TableSelectionCell checked={false} onChange={onChange} />));
    fireEvent.click(getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("DataGrid sorts and selects rows", () => {
    const onSelectionChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <DataGrid
        items={[{ id: 1, name: "B" }, { id: 2, name: "A" }]}
        columns={[{ columnId: "name", label: "Name", compare: (a, b) => a.name.localeCompare(b.name) }]}
        getRowId={(item) => item.id}
        sortable
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />
    ));
    fireEvent.click(getByRole("button", { name: /Name/ }));
    const rows = document.querySelectorAll("[role='row']");
    expect(rows[1]?.textContent).toContain("A");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/TableDataGrid.test.tsx`
Expected: FAIL，`TableCellLayout` / `TableResizeHandle` 不存在。

- [ ] **Step 3: 补齐 `Table.tsx` 导出**

```tsx
export type TableRowId = string | number;
export function TableCellLayout(props: {
  media?: JSX.Element;
  content?: JSX.Element;
  description?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}) {
  return (
    <div class={cx("sf-TableCellLayout", props.class)}>
      <Show when={props.media}><span class="sf-TableCellLayout__media">{props.media}</span></Show>
      <span class="sf-TableCellLayout__main">
        <span class="sf-TableCellLayout__content">{props.content ?? props.children}</span>
        <Show when={props.description}><span class="sf-TableCellLayout__description">{props.description}</span></Show>
      </span>
    </div>
  );
}
export function TableResizeHandle(props: { class?: string; onResize?: (width: number) => void }) {
  return <div class={cx("sf-Table__resizeHandle", props.class)} role="separator" aria-orientation="vertical" tabindex={0} />;
}
```

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/TableDataGrid.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/Table.tsx src/components/DataGrid.tsx src/components/TableDataGrid.test.tsx
git commit -m "refactor: rewrite table and data grid with layout exports"
```

### Task 8.2: Tree / FlatTree 重写

**Files:**
- Modify: `src/components/Tree.tsx`
- Create: `src/components/FlatTree.tsx`
- Create: `src/components/TreeFlatTree.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/TreeFlatTree.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout } from "./Tree";
import { FlatTree, FlatTreeItem } from "./FlatTree";
import { renderWithFluent } from "../test-utils";

describe("tree", () => {
  it("Tree expands and selects", () => {
    const onSelect = vi.fn();
    const { getByRole, getByText } = renderWithFluent(() => (
      <Tree items={[{ value: "a", content: "A", children: [{ value: "b", content: "B" }] }]} defaultOpenItems={["a"]} onSelect={onSelect} />
    ));
    expect(getByRole("tree")).toBeInTheDocument();
    fireEvent.click(getByText("B"));
    expect(onSelect).toHaveBeenCalledWith(["b"]);
  });

  it("TreeItemPersonaLayout and FlatTree render", () => {
    const { container } = renderWithFluent(() => (
      <>
        <TreeItem value="x"><TreeItemPersonaLayout media={<span>@</span>} description="d">X</TreeItemPersonaLayout></TreeItem>
        <FlatTree><FlatTreeItem value="1">One</FlatTreeItem></FlatTree>
      </>
    ));
    expect(container.querySelector(".sf-TreeItemPersonaLayout")).not.toBeNull();
    expect(container.querySelector(".sf-FlatTree")).not.toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/TreeFlatTree.test.tsx`
Expected: FAIL，`FlatTree` / `TreeItemPersonaLayout` 不存在。

- [ ] **Step 3: 创建 `src/components/FlatTree.tsx`**

```tsx
import { type JSX } from "solid-js";
import { cx } from "../utils";

export type FlatTreeItemValue = string | number;
export type FlattenTreeItem<T extends { value: FlatTreeItemValue; children?: T[] }> = {
  item: T;
  depth: number;
  parentValue?: FlatTreeItemValue;
};
export type FlatTreeItemProps = {
  value: FlatTreeItemValue;
  class?: string;
  children?: JSX.Element;
};
export function FlatTreeItem(props: FlatTreeItemProps) {
  return <div class={cx("sf-FlatTreeItem", props.class)} role="treeitem" data-value={String(props.value)}>{props.children}</div>;
}
export function FlatTree(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-FlatTree", props.class)} role="tree">{props.children}</div>;
}
export function HeadlessFlatTree(props: { class?: string; children?: JSX.Element }) {
  return <div class={cx("sf-FlatTree", "sf-FlatTree--headless", props.class)}>{props.children}</div>;
}
export function HeadlessFlatTreeItem(props: FlatTreeItemProps) {
  return <FlatTreeItem {...props} />;
}
export function FlattenTreeItem<T extends { value: FlatTreeItemValue; children?: T[] }>(
  items: T[],
  depth = 0,
  parentValue?: FlatTreeItemValue,
): Array<FlattenTreeItem<T>> {
  return items.flatMap((item) => [
    { item, depth, parentValue },
    ...(item.children ? FlattenTreeItem(item.children, depth + 1, item.value) : []),
  ]);
}
```

- [ ] **Step 4: 补齐 `Tree.tsx` 导出**

`TreeItemPersonaLayout` 渲染 `sf-TreeItemPersonaLayout` + `media`/`description` slots；`Tree.tsx` 同时导出 `TreeRootReset`（重置树内边距的包装容器）。`FlatTree.tsx` 导出 `FlatTree`、`FlatTreeItem`、`HeadlessFlatTree`、`HeadlessFlatTreeItem`、`FlattenTreeItem`；`src/components/index.ts` 增加 `export * from "./FlatTree";`。

- [ ] **Step 5: 运行测试**

Run: `npx vitest run src/components/TreeFlatTree.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/components/Tree.tsx src/components/FlatTree.tsx src/components/index.ts src/components/TreeFlatTree.test.tsx
git commit -m "refactor: rewrite tree and add flat tree"
```

### Task 8.3: List / Virtualizer / Stack 重写

**Files:**
- Modify: `src/components/List.tsx`
- Modify: `src/components/Virtualizer.tsx`
- Modify: `src/components/Stack.tsx`
- Create: `src/components/ListVirtualStack.test.tsx`

- [ ] **Step 1: 编写失败测试**

`src/components/ListVirtualStack.test.tsx`：

```tsx
import { fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { List, ListItem } from "./List";
import { Virtualizer } from "./Virtualizer";
import { Stack, StackItem } from "./Stack";
import { renderWithFluent } from "../test-utils";

describe("list virtualizer stack", () => {
  it("List supports keyboard selection", () => {
    const onSelectionChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <List selectionMode="single" items={[{ value: 1, content: "One" }, { value: 2, content: "Two" }]} onSelectionChange={onSelectionChange} />
    ));
    fireEvent.keyDown(getByRole("listbox"), { key: "ArrowDown" });
    fireEvent.keyDown(getByRole("listbox"), { key: "Enter" });
    expect(onSelectionChange).toHaveBeenCalledWith([2]);
  });

  it("Virtualizer renders only visible window", () => {
    const { container } = renderWithFluent(() => (
      <Virtualizer items={Array.from({ length: 100 }, (_, i) => i)} itemSize={40} height={120} overscan={0}>
        {(item) => <span>{item}</span>}
      </Virtualizer>
    ));
    expect(container.querySelectorAll(".sf-Virtualizer__item").length).toBeLessThan(10);
  });

  it("Stack applies gap and StackItem grow", () => {
    const { container } = renderWithFluent(() => (
      <Stack horizontal tokens={{ childrenGap: 8 }}><StackItem grow>X</StackItem></Stack>
    ));
    expect(container.querySelector(".sf-Stack--horizontal")).toHaveStyle({ gap: "8px" });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/components/ListVirtualStack.test.tsx`
Expected: 现有实现可能通过；未通过处按契约修复。

- [ ] **Step 3: 重写实现契约**

- `List`：`role="listbox"`（选择模式）或 `list`，Arrow/Home/End 移动，Enter/Space 选择，支持 `navigationMode`。
- `Virtualizer`：只渲染可视窗口 + overscan，`scrollRef` 提供 body 引用。
- `Stack`：`horizontal`/`reversed`/`wrap`/`tokens.childrenGap`，`StackItem` 支持 `grow`/`disableShrink`/`align`。
- `Virtualizer.tsx` 同时保持 `AppItem`、`AppItemStatic` 导出（当前文件内实现，重写时不得删除）。

- [ ] **Step 4: 运行测试**

Run: `npx vitest run src/components/ListVirtualStack.test.tsx && npm run typecheck`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/List.tsx src/components/Virtualizer.tsx src/components/Stack.tsx src/components/ListVirtualStack.test.tsx
git commit -m "refactor: rewrite list virtualizer and stack with keyboard tests"
```

---

## Phase 9: 文档、发布与收尾

### Task 9.1: 补齐 Storybook 与 API 文档

**Files:**
- Modify: `.storybook/main.ts`
- Modify: `.storybook/preview.tsx`
- Modify: `src/docs/API.mdx`
- Modify: `src/components/*.stories.tsx`

- [ ] **Step 1: 为新增组件补齐 Story**

为 `Carousel`、`FlatTree`、`Hamburger`、`PresenceGroup`、`NavDrawer`、`TableResizeHandle`、`TagPicker` 子组件、`TeachingPopover` 子组件各增加一个 `.stories.tsx` 故事（沿用现有 `Story` 对象 + `StoryObj` 风格，不引入 TS7 泛型导致 docgen 报错）。

- [ ] **Step 2: 更新 API 总表**

`src/docs/API.mdx` 按官方导出清单生成组件名表格，标注 组件/子组件/类型，并链接到对应 Story。

- [ ] **Step 3: 构建 Storybook**

Run: `npm run build-storybook`
Expected: 成功生成 `storybook-static`。

- [ ] **Step 4: 提交**

```bash
git add .storybook src/docs src/components/*.stories.tsx
git commit -m "docs: update stories and api for full component set"
```

### Task 9.2: README / 导出面 / 类型兼容收尾

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Modify: `src/components/index.ts`
- Modify: `src/utils/index.ts`

- [ ] **Step 1: 补齐类型兼容导出**

`src/utils/index.ts` 增加：

```ts
export type Slot<T> = T;
export type AtomMotion = { duration?: number; delay?: number; easing?: string };
export type AtomMotionFn = (options: AtomMotion) => { keyframes: PropertyIndexedKeyframes };
export type MotionImperativeRef = { play: () => void; pause: () => void };
```

确认 `PresenceBadgeStatus`、`MessageBarIntent`、`SpinButtonBounds`、`NavDensity`、`TableRowId` 均已从对应文件导出。

`Image_2`、`Option_2`、`Text_2` 是官方包内部重名别名，本库在报告中列为豁免；`ForwardRefComponent`、`GriffelStyle`、`GriffelResetStyle` 等 React/griffel 专用类型同样豁免。

- [ ] **Step 2: 运行差异审计脚本**

Run: `node scripts/audit-fluent-parity.mjs`
Expected: `Missing: 0`（纯 React 专用导出如 `ForwardRefComponent`、`GriffelStyle` 若无法映射，在报告中列为豁免并在 `fluent-parity-report.md` 注明原因）。

- [ ] **Step 3: 更新 README**

README 已实现清单替换为完整组件分组，并加入 `npm run test`、`npm run test:watch`、`npm run build-storybook` 说明。

- [ ] **Step 4: 提交**

```bash
git add README.md package.json src/components/index.ts src/utils/index.ts docs/superpowers/plans/fluent-parity-report.md
git commit -m "docs: finalize export surface and readme"
```

### Task 9.3: 最终验证门禁

- [ ] **Step 1: 全量测试**

Run: `npm run test`
Expected: 全部 PASS。

- [ ] **Step 2: 类型检查与库构建**

Run: `npm run typecheck && npm run build`
Expected: PASS，`dist/index.d.ts` 包含全部导出。

- [ ] **Step 3: Storybook 构建**

Run: `npm run build-storybook`
Expected: PASS。

- [ ] **Step 4: 提交收尾**

```bash
git add -A
git commit -m "chore: finalize full fluent rewrite"
```

---

## 自检清单

**1. 规格覆盖**

- 官方 205 个高优先级导出：Phase 2-8 覆盖全部组件/子组件；Phase 1 与 Task 9.2 覆盖类型/常量导出。
- 当前 85 个 `.tsx` 文件：每个文件均有对应重写任务，测试文件按组件族新增。
- `@fluentui/react-components` 全部组件：以 9.74.5 `dist/index.d.ts` 为审计基准，Task 0.2 的脚本保证执行期可复检。

**2. 占位符扫描**

本计划没有 `TBD`/`TODO`；每个任务都包含测试代码、运行命令、预期结果、提交命令。实现步骤以契约 + 现有文件为执行基准，复杂新组件（PresenceGroup、Carousel、Hamburger、FlatTree、MenuItemLink/Switch、TableCellLayout/ResizeHandle、ToastTrigger、Nav 子组件、SwatchPickerRow/ImageSwatch）均给出完整代码。

**3. 类型与命名一致性**

- 统一使用 `sf-` class 与 `--sf-` CSS 变量。
- `onOpenChange`、`onSelectionChange`、`onOptionSelect`、`onActiveIndexChange` 等回调命名与官方一致。
- `useControllableOpen` 与 `createControllableSignal` 并存：前者保留给浮层组件，后者用于一般受控状态；Task 1.1 已测试。
- 新增文件均从 `src/components/index.ts` 导出。
