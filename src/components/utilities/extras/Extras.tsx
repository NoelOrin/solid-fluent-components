import { t } from "../../../i18n";
import {
  For,
  Show,
  createContext,
  createMemo,
  createSignal,
  onMount,
  useContext,
  type JSX,
} from "solid-js";
import { createId, cx } from "../../../utils/index";
import { Button } from "../../button/Button";

export type ToastContainerPosition =
  | "top-end"
  | "top-start"
  | "bottom-end"
  | "bottom-start"
  | "top"
  | "bottom";

export type ToastOffset = {
  horizontal?: number;
  vertical?: number;
};

export type ToastContainerProps = {
  position?: ToastContainerPosition;
  offset?: ToastOffset;
  class?: string;
  children?: JSX.Element;
};

export function ToastContainer(props: ToastContainerProps) {
  const position = () => props.position ?? "top-end";
  return (
    <div
      class={cx("sf-Toaster", `sf-Toaster--${position()}`, props.class)}
      style={{
        "padding-inline": `${props.offset?.horizontal ?? 16}px`,
        "padding-block": `${props.offset?.vertical ?? 16}px`,
      }}
    >
      {props.children}
    </div>
  );
}

export type ProgressBarLabelProps = {
  class?: string;
  children?: JSX.Element;
};
export function ProgressBarLabel(props: ProgressBarLabelProps) {
  return <div class={cx("sf-ProgressBarLabel", props.class)}>{props.children}</div>;
}

export type Caption1StrongProps = { class?: string; children?: JSX.Element };
export function Caption1Strong(props: Caption1StrongProps) {
  return <span class={cx("sf-Text", "sf-Text--200", "sf-Text--semibold", props.class)}>{props.children}</span>;
}
export function Caption1Stronger(props: Caption1StrongProps) {
  return <span class={cx("sf-Text", "sf-Text--200", "sf-Text--bold", props.class)}>{props.children}</span>;
}
export function Caption2Strong(props: Caption1StrongProps) {
  return <span class={cx("sf-Text", "sf-Text--100", "sf-Text--semibold", props.class)}>{props.children}</span>;
}
export function Body1Stronger(props: Caption1StrongProps) {
  return <span class={cx("sf-Text", "sf-Text--300", "sf-Text--bold", props.class)}>{props.children}</span>;
}

export type DialogBodySectionProps = {
  class?: string;
  children?: JSX.Element;
};
export function DialogContentContainer(props: DialogBodySectionProps) {
  return <div class={cx("sf-Dialog__body", props.class)}>{props.children}</div>;
}

export type DrawerHeaderTitleProps = {
  class?: string;
  children?: JSX.Element;
  action?: JSX.Element;
};
export function DrawerHeaderTitle(props: DrawerHeaderTitleProps) {
  return (
    <div class={cx("sf-DrawerHeaderTitle", props.class)}>
      <div class="sf-DrawerHeaderTitle__text">{props.children}</div>
      {props.action}
    </div>
  );
}

export type AccordionToggleEventData = {
  value: string | number;
  openItems: Array<string | number>;
};

export type OptionOnSelectData = {
  optionValue?: string;
  optionText?: string;
  selectedOptions: string[];
};

type ComboboxContextValue = {
  selectedOptions: () => string[];
  setSelectedOptions: (next: string[]) => void;
  multiselect: () => boolean;
};

const ComboboxContext = createContext<ComboboxContextValue>();

export type FluentComboboxProps = {
  multiselect?: boolean;
  selectedOptions?: string[];
  defaultSelectedOptions?: string[];
  placeholder?: string;
  class?: string;
  children?: JSX.Element;
  onOptionSelect?: (data: OptionOnSelectData) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the combobox input. */
  label?: string;
};

export function FluentCombobox(props: FluentComboboxProps) {
  const [selected, setSelected] = createSignal(props.defaultSelectedOptions ?? []);
  const selectedOptions = createMemo(() => props.selectedOptions ?? selected());
  const [internalOpen, setInternalOpen] = createSignal(props.defaultOpen ?? true);
  const open = () => props.open ?? internalOpen();
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
  };
  const listboxId = createId("sf-combobox-listbox");
  let listboxEl!: HTMLDivElement;

  const value: ComboboxContextValue = {
    selectedOptions,
    setSelectedOptions: (next: string[]) => {
      if (props.selectedOptions === undefined) setSelected(next);
      props.onOptionSelect?.({ selectedOptions: next });
    },
    multiselect: () => Boolean(props.multiselect),
  };

  const focusOption = (delta: number) => {
    const options = Array.from(
      listboxEl?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
    ).filter((el) => el.getAttribute("aria-disabled") !== "true");
    if (options.length === 0) return;
    const current = options.indexOf(document.activeElement as HTMLElement);
    const next = options[(Math.max(current, -1) + delta + options.length) % options.length];
    next?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      focusOption(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(-1);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <ComboboxContext.Provider value={value}>
      <div class={cx("sf-Combobox", props.class)}>
        <div
          class="sf-Combobox__input"
          role="combobox"
          tabIndex={0}
          aria-label={props.label ?? "Combobox"}
          aria-expanded={open()}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          onKeyDown={handleKeyDown}
        >
          <span>{selectedOptions().join(", ") || props.placeholder || t("common.select")}</span>
          <span aria-hidden="true">▾</span>
        </div>
        <div
          ref={listboxEl}
          class="sf-Listbox"
          id={listboxId}
          role="listbox"
          aria-multiselectable={props.multiselect ? true : undefined}
          style={{ position: "relative", "margin-top": "4px" }}
        >
          {props.children}
        </div>
      </div>
    </ComboboxContext.Provider>
  );
}

export type FluentOptionProps = {
  value: string;
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
};

export function FluentOption(props: FluentOptionProps) {
  const ctx = useContext(ComboboxContext);
  const selected = () => ctx?.selectedOptions().includes(props.value) ?? false;
  const select = () => {
    if (!ctx || props.disabled) return;
    const current = ctx.selectedOptions();
    const next = ctx.multiselect()
      ? current.includes(props.value)
        ? current.filter((value) => value !== props.value)
        : [...current, props.value]
      : [props.value];
    ctx.setSelectedOptions(next);
  };

  return (
    <div
      class={cx(
        "sf-Option",
        selected() && "sf-Option--selected",
        props.disabled && "sf-Option--disabled",
        props.class,
      )}
      role="option"
      tabIndex={-1}
      aria-selected={selected()}
      aria-disabled={props.disabled ? true : undefined}
      onClick={select}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      }}
    >
      {props.children}
    </div>
  );
}

export type StepperProps = {
  activeStep?: number;
  steps?: Array<{ label: JSX.Element; description?: JSX.Element }>;
  class?: string;
  children?: JSX.Element;
  onStepClick?: (index: number) => void;
};

type StepperContextValue = {
  activeStep: () => number;
  click: (index: number) => void;
  nextIndex: () => number;
};
const StepperContext = createContext<StepperContextValue>();

export function Stepper(props: StepperProps) {
  let counter = 0;
  const ctx: StepperContextValue = {
    activeStep: () => props.activeStep ?? 0,
    click: (index) => props.onStepClick?.(index),
    nextIndex: () => counter++,
  };

  return (
    <StepperContext.Provider value={ctx}>
      <ol class={cx("sf-Stepper", props.class)}>
        <Show when={props.steps} fallback={props.children}>
          <For each={props.steps}>
            {(step, index) => (
              <StepperItem index={index()} label={step.label} description={step.description} />
            )}
          </For>
        </Show>
      </ol>
    </StepperContext.Provider>
  );
}

export type StepperItemProps = {
  index?: number;
  label?: JSX.Element;
  description?: JSX.Element;
  active?: boolean;
  complete?: boolean;
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
  onClick?: () => void;
};

export function StepperItem(props: StepperItemProps) {
  const ctx = useContext(StepperContext);
  const [autoIndex, setAutoIndex] = createSignal(-1);
  onMount(() => {
    if (props.index === undefined && ctx) setAutoIndex(ctx.nextIndex());
  });

  const index = () => props.index ?? autoIndex();
  const active = () => props.active ?? (ctx?.activeStep() === index());
  const complete = () => props.complete ?? index() < (ctx?.activeStep() ?? 0);

  return (
    <li
      class={cx(
        "sf-Stepper__item",
        active() && "sf-Stepper__item--active",
        complete() && "sf-Stepper__item--complete",
        props.class,
      )}
      data-index={index()}
      aria-current={active() ? "step" : undefined}
    >
      <button
        type="button"
        class="sf-Stepper__button"
        disabled={props.disabled}
        aria-current={active() ? "step" : undefined}
        onClick={() => {
          if (props.disabled) return;
          props.onClick?.();
          ctx?.click(index());
        }}
      >
        <StepperIndicator>{index() + 1}</StepperIndicator>
        <span class="sf-Stepper__content">
          <StepperLabel>{props.label ?? props.children}</StepperLabel>
          <Show when={props.description}>
            <StepperDescription>{props.description}</StepperDescription>
          </Show>
        </span>
      </button>
    </li>
  );
}

export function StepperIndicator(props: { class?: string; children?: JSX.Element }) {
  return <span class={cx("sf-Stepper__index", props.class)}>{props.children}</span>;
}
export function StepperLabel(props: { class?: string; children?: JSX.Element }) {
  return <span class={cx("sf-Stepper__label", props.class)}>{props.children}</span>;
}
export function StepperDescription(props: { class?: string; children?: JSX.Element }) {
  return <span class={cx("sf-Stepper__desc", props.class)}>{props.children}</span>;
}

export function EmptyState(props: {
  title?: JSX.Element;
  description?: JSX.Element;
  action?: JSX.Element;
  icon?: JSX.Element;
  class?: string;
}) {
  return (
    <div class={cx("sf-EmptyState", props.class)}>
      <Show when={props.icon}>
        <div class="sf-EmptyState__icon">{props.icon}</div>
      </Show>
      <Show when={props.title}>
        <div class="sf-EmptyState__title">{props.title}</div>
      </Show>
      <Show when={props.description}>
        <div class="sf-EmptyState__desc">{props.description}</div>
      </Show>
      <Show when={props.action}>
        <div class="sf-EmptyState__action">{props.action}</div>
      </Show>
    </div>
  );
}

export function Anchor(props: {
  href?: string;
  class?: string;
  children?: JSX.Element;
  target?: string;
  rel?: string;
}) {
  return (
    <a class={cx("sf-Link", props.class)} href={props.href} target={props.target} rel={props.rel}>
      {props.children}
    </a>
  );
}

export function ToolbarRadioButton(props: {
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <Button
      appearance={props.checked ? "primary" : "subtle"}
      size="small"
      class={props.class}
      role="radio"
      aria-checked={Boolean(props.checked)}
      disabled={props.disabled}
      data-toolbar-radio={props.value !== undefined ? String(props.value) : undefined}
      onClick={() => props.onChange?.(true)}
    >
      {props.children}
    </Button>
  );
}

export function ToolbarToggleButton(props: {
  checked?: boolean;
  class?: string;
  children?: JSX.Element;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <Button
      appearance={props.checked ? "primary" : "subtle"}
      size="small"
      class={props.class}
      aria-pressed={Boolean(props.checked)}
      onClick={() => props.onChange?.(!props.checked)}
    >
      {props.children}
    </Button>
  );
}
