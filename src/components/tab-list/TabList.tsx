import {
  For,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { createId, cx, moveActiveIndex } from "../../utils/index";

export type TabActivationMode = "automatic" | "manual" | "auto";

type TabRegistration = {
  value: string;
  disabled: Accessor<boolean>;
  focus: () => void;
};

type TabsState = {
  value: Accessor<string>;
  setValue: (value: string) => void;
  focusValue: Accessor<string>;
  setFocusValue: (value: string) => void;
  vertical: Accessor<boolean>;
  activationMode: Accessor<TabActivationMode>;
  baseId: string;
  register: (tab: TabRegistration) => () => void;
  moveFocus: (from: string, key: string) => void;
  selectFocused: () => void;
  configure: (options: Pick<TabsStateOptions, "vertical" | "activationMode">) => void;
};

const TabsContext = createContext<TabsState>();

type TabsStateOptions = {
  selectedValue?: string;
  defaultSelectedValue?: string;
  onTabSelect?: (event: { value: string }) => void;
  vertical?: boolean;
  activationMode?: TabActivationMode;
};

function isAutomatic(mode: TabActivationMode | undefined) {
  return mode === undefined || mode === "automatic" || mode === "auto";
}

function createTabsState(options: TabsStateOptions): TabsState {
  const [uncontrolled, setUncontrolled] = createSignal(options.defaultSelectedValue ?? "");
  const value = createMemo(() => options.selectedValue ?? uncontrolled());
  const [focusValue, setFocusValue] = createSignal(value());
  const [vertical, setVertical] = createSignal(Boolean(options.vertical));
  const [activationMode, setActivationMode] = createSignal<TabActivationMode>(
    options.activationMode ?? "automatic",
  );
  let registrations: TabRegistration[] = [];

  const setValue = (next: string) => {
    if (options.selectedValue === undefined) setUncontrolled(next);
    setFocusValue(next);
    options.onTabSelect?.({ value: next });
  };

  const enabledTabs = () => registrations.filter((tab) => !tab.disabled());

  const focusTab = (tab: TabRegistration | undefined) => {
    if (!tab) return;
    setFocusValue(tab.value);
    tab.focus();
    // manual activation only moves focus; Enter/Space commits the selection
    if (isAutomatic(activationMode())) setValue(tab.value);
  };

  const moveFocus = (from: string, key: string) => {
    const tabs = enabledTabs();
    if (tabs.length === 0) return;
    let index = tabs.findIndex((tab) => tab.value === from);
    if (index < 0) index = 0;

    let target: TabRegistration | undefined;
    if (key === "Home") target = tabs[0];
    else if (key === "End") target = tabs[tabs.length - 1];
    else if (key === "ArrowRight" || key === "ArrowDown") target = tabs[moveActiveIndex(index, 1, tabs.length)];
    else if (key === "ArrowLeft" || key === "ArrowUp") target = tabs[moveActiveIndex(index, -1, tabs.length)];
    else return;
    focusTab(target);
  };

  const selectFocused = () => {
    const tab = registrations.find((item) => item.value === focusValue() && !item.disabled());
    if (tab) setValue(tab.value);
  };

  // keep the roving tab stop in sync with an externally controlled selection
  createEffect(() => {
    const current = value();
    if (current) setFocusValue(current);
  });

  // if the initial selection is missing or disabled, focus the first enabled tab
  onMount(() => {
    queueMicrotask(() => {
      const tabs = enabledTabs();
      if (!tabs.some((tab) => tab.value === focusValue())) {
        setFocusValue(tabs[0]?.value ?? "");
      }
    });
  });

  return {
    value,
    setValue,
    focusValue,
    setFocusValue,
    vertical,
    activationMode,
    baseId: createId("sf-tabs"),
    register: (tab) => {
      registrations.push(tab);
      return () => {
        registrations = registrations.filter((item) => item !== tab);
      };
    },
    moveFocus,
    selectFocused,
    configure: (next) => {
      if (next.vertical !== undefined) setVertical(Boolean(next.vertical));
      if (next.activationMode !== undefined) setActivationMode(next.activationMode);
    },
  };
}

export type TabsProps = TabsStateOptions & {
  class?: string;
  children?: JSX.Element;
};

/**
 * Optional wrapper that shares one tabs state between a TabList and its
 * TabPanels even when the panels are rendered as siblings of the list.
 */
export function Tabs(props: TabsProps) {
  const state = createTabsState(props);
  return (
    <TabsContext.Provider value={state}>
      <div class={cx("sf-Tabs", props.class)}>{props.children}</div>
    </TabsContext.Provider>
  );
}

export type TabListProps = {
  selectedValue?: string;
  defaultSelectedValue?: string;
  onTabSelect?: (event: { value: string }) => void;
  vertical?: boolean;
  activationMode?: TabActivationMode;
  size?: "small" | "medium" | "large";
  appearance?: "transparent" | "subtle";
  class?: string;
  children?: JSX.Element;
};

export function TabList(props: TabListProps) {
  // when nested inside <Tabs>, reuse the shared state so TabPanel can read it
  const inherited = useContext(TabsContext);
  const state = inherited ?? createTabsState(props);
  if (inherited) inherited.configure({ vertical: props.vertical, activationMode: props.activationMode });

  return (
    <TabsContext.Provider value={state}>
      <div
        role="tablist"
        aria-orientation={props.vertical ? "vertical" : "horizontal"}
        class={cx(
          "sf-TabList",
          props.vertical && "sf-TabList--vertical",
          props.class,
        )}
        data-size={props.size ?? "medium"}
        data-appearance={props.appearance ?? "transparent"}
      >
        {props.children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabProps = {
  value: string;
  disabled?: boolean;
  icon?: JSX.Element;
  class?: string;
  children?: JSX.Element;
};

export function Tab(props: TabProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be used within TabList");

  let el!: HTMLButtonElement;

  onMount(() => {
    const unregister = ctx.register({
      value: props.value,
      disabled: () => Boolean(props.disabled),
      focus: () => el?.focus(),
    });
    onCleanup(unregister);
  });

  const selected = () => ctx.value() === props.value;
  const id = () => `${ctx.baseId}-tab-${props.value}`;
  const panelId = () => `${ctx.baseId}-panel-${props.value}`;
  const rovingIndex = () => (ctx.focusValue() === props.value ? 0 : -1);

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    const isActivation = key === "Enter" || key === " ";
    const isNavigation =
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "Home" ||
      key === "End";
    if (!isActivation && !isNavigation) return;
    if (props.disabled) return;
    event.preventDefault();
    if (isActivation) {
      if (!isAutomatic(ctx.activationMode())) ctx.selectFocused();
      else ctx.setValue(props.value);
      return;
    }
    ctx.moveFocus(props.value, key);
  };

  return (
    <button
      ref={el}
      type="button"
      role="tab"
      id={id()}
      aria-controls={panelId()}
      aria-selected={selected()}
      tabIndex={rovingIndex()}
      disabled={props.disabled}
      class={cx("sf-Tab", "sf-focus-ring", props.class)}
      onClick={() => {
        if (!props.disabled) ctx.setValue(props.value);
      }}
      onKeyDown={handleKeyDown}
    >
      {props.icon}
      {props.children}
    </button>
  );
}

export type TabPanelsProps = {
  selectedValue?: string;
  class?: string;
  children?: JSX.Element;
};

export function TabPanels(props: TabPanelsProps) {
  return <div class={props.class}>{props.children}</div>;
}

export type TabPanelProps = {
  value: string;
  selectedValue?: string;
  class?: string;
  children?: JSX.Element;
};

export function TabPanel(props: TabPanelProps) {
  const ctx = useContext(TabsContext);
  // standalone fallback keeps the legacy controlled `selectedValue` API working
  const fallbackId = createId("sf-tabs");
  const selected = () =>
    ctx
      ? ctx.value() === props.value
      : props.selectedValue === undefined || props.selectedValue === props.value;
  const baseId = () => ctx?.baseId ?? fallbackId;

  return (
    <div
      role="tabpanel"
      id={`${baseId()}-panel-${props.value}`}
      aria-labelledby={`${baseId()}-tab-${props.value}`}
      tabIndex={0}
      hidden={!selected()}
      class={props.class}
    >
      {props.children}
    </div>
  );
}

export type SimpleTabsProps = {
  items: Array<{ value: string; label: JSX.Element; content: JSX.Element; disabled?: boolean }>;
  defaultSelectedValue?: string;
  class?: string;
};

export function SimpleTabs(props: SimpleTabsProps) {
  const [value, setValue] = createSignal(props.defaultSelectedValue ?? props.items[0]?.value ?? "");
  return (
    <div class={props.class}>
      <TabList selectedValue={value()} onTabSelect={(e) => setValue(e.value)}>
        <For each={props.items}>
          {(item) => (
            <Tab value={item.value} disabled={item.disabled}>
              {item.label}
            </Tab>
          )}
        </For>
      </TabList>
      <Show when={props.items.find((item) => item.value === value())}>
        {(item) => <div style={{ padding: "12px 0" }}>{item().content}</div>}
      </Show>
    </div>
  );
}
