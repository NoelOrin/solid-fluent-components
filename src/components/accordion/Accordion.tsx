import {
  Show,
  createContext,
  createMemo,
  createSignal,
  useContext,
  type JSX,
} from "solid-js";
import { createId, cx } from "../../utils/index";

type AccordionContextValue = {
  openItems: () => Array<string | number>;
  toggle: (value: string | number, disabled?: boolean) => void;
  collapsible: () => boolean;
  multiple: () => boolean;
};

const AccordionContext = createContext<AccordionContextValue>();
type AccordionItemContextValue = {
  value: string | number;
  disabled: () => boolean;
  headerId: string;
  panelId: string;
};
const AccordionItemContext = createContext<AccordionItemContextValue>();

export type AccordionProps = {
  openItems?: Array<string | number>;
  defaultOpenItems?: Array<string | number>;
  onToggle?: (event: { value: string | number; openItems: Array<string | number> }) => void;
  multiple?: boolean;
  collapsible?: boolean;
  class?: string;
  children?: JSX.Element;
};

export function Accordion(props: AccordionProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultOpenItems ?? []);
  const openItems = createMemo(() => props.openItems ?? uncontrolled());

  const toggle = (value: string | number, disabled = false) => {
    if (disabled) return;
    const current = openItems();
    const isOpen = current.includes(value);
    let next: Array<string | number>;
    if (props.multiple) {
      if (isOpen) {
        // with `collapsible={false}` the last open item must stay expanded
        next =
          props.collapsible === false && current.length === 1
            ? current
            : current.filter((item) => item !== value);
      } else {
        next = [...current, value];
      }
    } else if (isOpen) {
      next = props.collapsible === false ? current : [];
    } else {
      next = [value];
    }
    if (props.openItems === undefined) setUncontrolled(next);
    props.onToggle?.({ value, openItems: next });
  };

  const ctx: AccordionContextValue = {
    openItems,
    toggle,
    collapsible: () => props.collapsible !== false,
    multiple: () => Boolean(props.multiple),
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div class={cx("sf-Accordion", props.class)}>{props.children}</div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = {
  value: string | number;
  class?: string;
  children?: JSX.Element;
  disabled?: boolean;
};

export function AccordionItem(props: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider
      value={{
        value: props.value,
        disabled: () => Boolean(props.disabled),
        headerId: createId("sf-accordion-header"),
        panelId: createId("sf-accordion-panel"),
      }}
    >
      <div
        class={cx("sf-AccordionItem", props.class)}
        data-disabled={props.disabled ? "true" : undefined}
      >
        {props.children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export type AccordionHeaderProps = {
  class?: string;
  children?: JSX.Element;
  expandIcon?: JSX.Element;
  expandIconPosition?: "start" | "end";
};

export function AccordionHeader(props: AccordionHeaderProps) {
  const accordion = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);
  if (!accordion || !item) throw new Error("AccordionHeader must be used within AccordionItem");

  const open = () => accordion.openItems().includes(item.value);
  const position = () => props.expandIconPosition ?? "start";
  const icon = (
    <span
      class="sf-AccordionHeader__icon"
      data-open={open() ? "true" : undefined}
      aria-hidden="true"
    >
      {props.expandIcon ?? "▸"}
    </span>
  );
  const content = <span style={{ flex: "1 1 auto", "text-align": "start" }}>{props.children}</span>;

  return (
    <button
      type="button"
      class={cx("sf-AccordionHeader", "sf-focus-ring", props.class)}
      id={item.headerId}
      aria-controls={item.panelId}
      aria-expanded={open()}
      aria-disabled={item.disabled() ? true : undefined}
      disabled={item.disabled()}
      data-expand-icon-position={position()}
      onClick={() => accordion.toggle(item.value, item.disabled())}
    >
      {position() === "end" ? <>{content}{icon}</> : <>{icon}{content}</>}
    </button>
  );
}

export type AccordionPanelProps = {
  class?: string;
  children?: JSX.Element;
};

export function AccordionPanel(props: AccordionPanelProps) {
  const accordion = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);
  if (!accordion || !item) throw new Error("AccordionPanel must be used within AccordionItem");
  const open = () => accordion.openItems().includes(item.value);

  return (
    <div
      class={cx("sf-AccordionPanel", props.class)}
      id={item.panelId}
      role="region"
      aria-labelledby={item.headerId}
      hidden={!open()}
    >
      <Show when={open()}>{props.children}</Show>
    </div>
  );
}
