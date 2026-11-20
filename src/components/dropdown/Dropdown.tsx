import { t } from "../../i18n";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import {
  createId,
  cx,
  isTypingKey,
  moveActiveIndex,
  scrollIntoViewIfNeeded,
} from "../../utils/index";
import { useControllableOpen } from "../utilities/overlay/Overlay";
import { useFieldA11yProps, useFieldControlId } from "../field/Field";

export type DropdownOption = {
  value: string;
  label: JSX.Element | string;
  disabled?: boolean;
  text?: string;
};

export type DropdownProps = {
  options?: DropdownOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  buttonClass?: string;
  listboxClass?: string;
  onOptionSelect?: (data: { value: string; option?: DropdownOption }) => void;
  children?: JSX.Element;
  id?: string;
};

export function Dropdown(props: DropdownProps) {
  const fieldId = useFieldControlId();
  const fieldA11y = useFieldA11yProps();
  const [open, setOpen] = useControllableOpen(() => undefined, false);
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultValue ?? "");
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const value = createMemo(() => props.value ?? uncontrolled());
  const listboxId = createId("dropdown-listbox");
  let triggerEl!: HTMLButtonElement;
  let listEl!: HTMLDivElement;
  const [coords, setCoords] = createSignal({ x: 0, y: 0 });
  let typeahead = "";
  let typeaheadTimer: number | undefined;

  const options = createMemo(() => props.options ?? []);
  const selected = createMemo(() =>
    options().find((option) => option.value === value()),
  );
  const optionText = (option: DropdownOption) =>
    option.text ??
    (typeof option.label === "string" ? option.label : option.value);
  const optionId = (index: number) => `${listboxId}-opt-${index}`;
  const activeDescendant = () =>
    open() && activeIndex() >= 0 && activeIndex() < options().length
      ? optionId(activeIndex())
      : undefined;

  createEffect(() => {
    if (!open()) {
      setActiveIndex(-1);
      return;
    }
    const selectedIndex = options().findIndex((item) => item.value === value());
    const firstEnabled = options().findIndex((item) => !item.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabled);

    const update = async () => {
      if (!triggerEl || !listEl) return;
      const result = await computePosition(triggerEl, listEl, {
        placement: "bottom-start",
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      });
      setCoords({ x: result.x, y: result.y });
    };
    void update();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (listEl.contains(target) || triggerEl.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerEl.focus();
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", update);
    onCleanup(() => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", update);
    });
  });

  createEffect(() => {
    if (!open() || !listEl) return;
    const item = listEl.querySelector<HTMLElement>(
      `[data-index="${activeIndex()}"]`,
    );
    scrollIntoViewIfNeeded(listEl, item ?? undefined);
  });

  const selectIndex = (index: number) => {
    const option = options()[index];
    if (!option || option.disabled) return;
    if (props.value === undefined) setUncontrolled(option.value);
    props.onOptionSelect?.({ value: option.value, option });
    setOpen(false);
    triggerEl.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (props.disabled) return;
    const list = options();
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      if (!open()) {
        setOpen(true);
        return;
      }
      if (event.key === "ArrowDown") {
        setActiveIndex((current) =>
          moveActiveIndex(current, 1, list.length, {
            disabled: (index) => Boolean(list[index]?.disabled),
          }),
        );
      } else if (event.key === "ArrowUp") {
        setActiveIndex((current) =>
          moveActiveIndex(current, -1, list.length, {
            disabled: (index) => Boolean(list[index]?.disabled),
          }),
        );
      } else {
        selectIndex(activeIndex());
      }
      return;
    }

    if (isTypingKey(event) && open()) {
      typeahead += event.key.toLowerCase();
      window.clearTimeout(typeaheadTimer);
      typeaheadTimer = window.setTimeout(() => {
        typeahead = "";
      }, 500);
      const match = list.findIndex(
        (option, index) =>
          !option.disabled &&
          optionText(option).toLowerCase().startsWith(typeahead) &&
          index >= 0,
      );
      if (match >= 0) setActiveIndex(match);
    }
  };

  return (
    <div class={cx("sf-Dropdown", props.class)}>
      <button
        ref={triggerEl}
        id={props.id ?? fieldId}
        type="button"
        class={cx(
          "sf-Select",
          "sf-Dropdown__button",
          fieldA11y().invalid && "sf-Select--invalid",
          "sf-focus-ring",
          props.buttonClass,
        )}
        disabled={props.disabled}
        aria-haspopup="listbox"
        aria-expanded={open()}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant()}
        aria-invalid={fieldA11y().invalid}
        aria-describedby={fieldA11y().describedBy}
        onClick={() => setOpen(!open())}
        onKeyDown={onTriggerKeyDown}
      >
        <span class="sf-Dropdown__value">
          {selected()?.label ?? props.placeholder ?? t("common.select")}
        </span>
        <span aria-hidden="true">▾</span>
      </button>
      <Show when={open()}>
        <Portal>
          <div
            ref={listEl}
            id={listboxId}
            class={cx("sf-Listbox", "sf-Dropdown__listbox", props.listboxClass)}
            role="listbox"
            tabindex={-1}
            aria-activedescendant={activeDescendant()}
            style={{
              position: "absolute",
              left: `${coords().x}px`,
              top: `${coords().y}px`,
              "min-width": `${triggerEl?.offsetWidth ?? 160}px`,
            }}
          >
            <For each={options()}>
              {(option, index) => {
                const active = () => activeIndex() === index();
                const isSelected = () => value() === option.value;
                return (
                  <div
                    id={optionId(index())}
                    role="option"
                    data-index={index()}
                    class={cx(
                      "sf-Option",
                      isSelected() && "sf-Option--selected",
                      active() && "sf-Option--active",
                      option.disabled && "sf-Option--disabled",
                    )}
                    aria-selected={isSelected()}
                    aria-disabled={option.disabled ? true : undefined}
                    onMouseEnter={() => {
                      if (!option.disabled) setActiveIndex(index());
                    }}
                    onClick={() => selectIndex(index())}
                  >
                    {option.label}
                  </div>
                );
              }}
            </For>
            {props.children}
          </div>
        </Portal>
      </Show>
    </div>
  );
}
