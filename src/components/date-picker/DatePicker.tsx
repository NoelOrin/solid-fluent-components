import { t } from "../../i18n";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
} from "solid-js";
import { cx } from "../../utils/index";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import {
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "../menu/Menu";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + count);
  return next;
}

function sameDay(a?: Date, b?: Date) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isBefore(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfter(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function inRange(date: Date, start?: Date, end?: Date) {
  if (!start || !end) return false;
  const min = isBefore(start, end) ? start : end;
  const max = isBefore(start, end) ? end : start;
  return !isBefore(date, min) && !isAfter(date, max);
}

const DEFAULT_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 可注入的本地化信息；未提供的字段回退到默认中文/ISO 格式 */
export type DatePickerLocale = {
  months?: string[];
  weekdays?: string[];
  format?: (date: Date) => string;
  parse?: (value: string) => Date | undefined;
  label?: string;
};

export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const date = new Date(year, month - 1, day);
  // 拒绝 2026-02-30 / 2026-13-01 这类被 Date 自动归一化的值
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  return date;
}

function chunkWeeks(days: Date[]) {
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function monthTitle(date: Date, locale?: DatePickerLocale) {
  const month = locale?.months?.[date.getMonth()];
  return month
    ? `${date.getFullYear()} 年 ${month}`
    : `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function dayLabel(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export type CalendarProps = {
  value?: Date;
  defaultValue?: Date;
  onSelectDate?: (date: Date) => void;
  class?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (date: Date) => boolean;
  locale?: DatePickerLocale;
  "aria-label"?: string;
};

export function Calendar(props: CalendarProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultValue ?? new Date());
  const [month, setMonth] = createSignal(startOfMonth(props.value ?? uncontrolled()));
  const [focusDate, setFocusDate] = createSignal(props.value ?? uncontrolled());
  const selected = createMemo(() => props.value ?? uncontrolled());
  const cells = new Map<number, HTMLButtonElement>();

  createEffect(() => {
    if (props.value) {
      setMonth(startOfMonth(props.value));
      setFocusDate(props.value);
    }
  });

  const days = createMemo(() => {
    const first = month();
    const startWeekday = first.getDay();
    const start = new Date(first);
    start.setDate(1 - startWeekday);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  });
  const weeks = createMemo(() => chunkWeeks(days()));

  const isDisabled = (date: Date) => {
    if (props.minDate && isBefore(date, props.minDate)) return true;
    if (props.maxDate && isAfter(date, props.maxDate)) return true;
    if (props.disabledDate?.(date)) return true;
    return false;
  };

  const select = (date: Date) => {
    if (isDisabled(date)) return;
    if (props.value === undefined) setUncontrolled(date);
    setFocusDate(date);
    props.onSelectDate?.(date);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    let next = focusDate();
    if (event.key === "ArrowLeft") next = addDays(next, -1);
    else if (event.key === "ArrowRight") next = addDays(next, 1);
    else if (event.key === "ArrowUp") next = addDays(next, -7);
    else if (event.key === "ArrowDown") next = addDays(next, 7);
    else if (event.key === "Home") next = startOfMonth(next);
    else if (event.key === "End") next = addDays(addMonths(startOfMonth(next), 1), -1);
    else if (event.key === "PageUp") next = addMonths(next, event.shiftKey ? -12 : -1);
    else if (event.key === "PageDown") next = addMonths(next, event.shiftKey ? 12 : 1);
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(focusDate());
      return;
    } else return;

    event.preventDefault();
    if (isDisabled(next)) return;
    setFocusDate(next);
    setMonth(startOfMonth(next));
    // 真正的 DOM 焦点跟随 roving tabindex 移动，而不是只改 tabindex
    queueMicrotask(() => cells.get(next.getTime())?.focus());
  };

  return (
    <div
      class={cx("sf-Calendar", props.class)}
      role="group"
      aria-label={props["aria-label"] ?? props.locale?.label ?? "Calendar"}
    >
      <div class="sf-Calendar__header">
        <Button
          appearance="subtle"
          size="small"
          aria-label={t("common.previousMonth")}
          onClick={() => setMonth(addMonths(month(), -1))}
        >
          ‹
        </Button>
        <div class="sf-Calendar__title">{monthTitle(month(), props.locale)}</div>
        <Button
          appearance="subtle"
          size="small"
          aria-label={t("common.nextMonth")}
          onClick={() => setMonth(addMonths(month(), 1))}
        >
          ›
        </Button>
      </div>
      <div class="sf-Calendar__weekdays" role="row">
        <For each={props.locale?.weekdays ?? DEFAULT_WEEKDAYS}>
          {(label) => <span role="columnheader">{label}</span>}
        </For>
      </div>
      <div class="sf-Calendar__grid" role="grid" aria-label={props["aria-label"] ?? "日期"} onKeyDown={onKeyDown}>
        <For each={weeks()}>
          {(week) => (
            <div class="sf-Calendar__row" role="row">
              <For each={week}>
                {(date) => {
                  const inMonth = () => date.getMonth() === month().getMonth();
                  const isSelected = () => sameDay(date, selected());
                  const isToday = () => sameDay(date, new Date());
                  const focused = () => sameDay(date, focusDate());
                  const disabled = () => isDisabled(date);
                  return (
                    <button
                      ref={(el) => {
                        if (el) cells.set(date.getTime(), el);
                        else cells.delete(date.getTime());
                      }}
                      type="button"
                      role="gridcell"
                      class={cx(
                        "sf-Calendar__day",
                        "sf-focus-ring",
                        !inMonth() && "sf-Calendar__day--out",
                        isSelected() && "sf-Calendar__day--selected",
                        isToday() && "sf-Calendar__day--today",
                        focused() && "sf-Calendar__day--focused",
                      )}
                      tabindex={focused() ? 0 : -1}
                      disabled={disabled()}
                      aria-selected={isSelected()}
                      aria-current={isToday() ? "date" : undefined}
                      aria-label={dayLabel(date)}
                      onClick={() => select(date)}
                      onFocus={() => setFocusDate(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export type DateRange = {
  start?: Date;
  end?: Date;
};

export type CalendarDateRangeProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onSelectRange?: (range: DateRange) => void;
  class?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (date: Date) => boolean;
  locale?: DatePickerLocale;
  "aria-label"?: string;
};

export function CalendarDateRange(props: CalendarDateRangeProps) {
  const [uncontrolled, setUncontrolled] = createSignal<DateRange>(
    props.defaultValue ?? {},
  );
  const [month, setMonth] = createSignal(
    startOfMonth(props.value?.start ?? props.defaultValue?.start ?? new Date()),
  );
  const [draftStart, setDraftStart] = createSignal<Date | undefined>();
  const [focusDate, setFocusDate] = createSignal(
    props.value?.start ?? props.defaultValue?.start ?? new Date(),
  );
  const range = createMemo(() => props.value ?? uncontrolled());
  const cells = new Map<number, HTMLButtonElement>();

  const days = createMemo(() => {
    const first = month();
    const startWeekday = first.getDay();
    const start = new Date(first);
    start.setDate(1 - startWeekday);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  });
  const weeks = createMemo(() => chunkWeeks(days()));

  const isDisabled = (date: Date) => {
    if (props.minDate && isBefore(date, props.minDate)) return true;
    if (props.maxDate && isAfter(date, props.maxDate)) return true;
    if (props.disabledDate?.(date)) return true;
    return false;
  };

  const commit = (next: DateRange) => {
    if (props.value === undefined) setUncontrolled(next);
    props.onSelectRange?.(next);
  };

  const onSelect = (date: Date) => {
    if (isDisabled(date)) return;
    const draft = draftStart();
    // 第一次点击只记录起点，不提交半区间；第二次点击才提交完整区间
    if (!draft || (range().start && range().end)) {
      setDraftStart(date);
      setFocusDate(date);
      return;
    }
    const next = isBefore(date, draft) ? { start: date, end: draft } : { start: draft, end: date };
    setDraftStart(undefined);
    setFocusDate(date);
    commit(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    let next = focusDate();
    if (event.key === "ArrowLeft") next = addDays(next, -1);
    else if (event.key === "ArrowRight") next = addDays(next, 1);
    else if (event.key === "ArrowUp") next = addDays(next, -7);
    else if (event.key === "ArrowDown") next = addDays(next, 7);
    else if (event.key === "Home") next = startOfMonth(next);
    else if (event.key === "End") next = addDays(addMonths(startOfMonth(next), 1), -1);
    else if (event.key === "PageUp") next = addMonths(next, event.shiftKey ? -12 : -1);
    else if (event.key === "PageDown") next = addMonths(next, event.shiftKey ? 12 : 1);
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(focusDate());
      return;
    } else return;

    event.preventDefault();
    if (isDisabled(next)) return;
    setFocusDate(next);
    setMonth(startOfMonth(next));
    queueMicrotask(() => cells.get(next.getTime())?.focus());
  };

  return (
    <div
      class={cx("sf-Calendar", "sf-Calendar--range", props.class)}
      role="group"
      aria-label={props["aria-label"] ?? props.locale?.label ?? "日期范围"}
    >
      <div class="sf-Calendar__header">
        <Button
          appearance="subtle"
          size="small"
          aria-label={t("common.previousMonth")}
          onClick={() => setMonth(addMonths(month(), -1))}
        >
          ‹
        </Button>
        <div class="sf-Calendar__title">{monthTitle(month(), props.locale)}</div>
        <Button
          appearance="subtle"
          size="small"
          aria-label={t("common.nextMonth")}
          onClick={() => setMonth(addMonths(month(), 1))}
        >
          ›
        </Button>
      </div>
      <div class="sf-Calendar__weekdays" role="row">
        <For each={props.locale?.weekdays ?? DEFAULT_WEEKDAYS}>
          {(label) => <span role="columnheader">{label}</span>}
        </For>
      </div>
      <div
        class="sf-Calendar__grid"
        role="grid"
        aria-label={props["aria-label"] ?? "日期范围"}
        onKeyDown={onKeyDown}
      >
        <For each={weeks()}>
          {(week) => (
            <div class="sf-Calendar__row" role="row">
              <For each={week}>
                {(date) => {
                  const inMonth = () => date.getMonth() === month().getMonth();
                  const start = () => sameDay(date, range().start);
                  const end = () => sameDay(date, range().end);
                  const between = () => inRange(date, range().start, range().end);
                  const focused = () => sameDay(date, focusDate());
                  const disabled = () => isDisabled(date);
                  return (
                    <button
                      ref={(el) => {
                        if (el) cells.set(date.getTime(), el);
                        else cells.delete(date.getTime());
                      }}
                      type="button"
                      role="gridcell"
                      class={cx(
                        "sf-Calendar__day",
                        "sf-focus-ring",
                        !inMonth() && "sf-Calendar__day--out",
                        between() && "sf-Calendar__day--inRange",
                        (start() || end()) && "sf-Calendar__day--selected",
                        start() && "sf-Calendar__day--rangeStart",
                        end() && "sf-Calendar__day--rangeEnd",
                        focused() && "sf-Calendar__day--focused",
                      )}
                      tabindex={focused() ? 0 : -1}
                      disabled={disabled()}
                      aria-selected={start() || end()}
                      aria-current={sameDay(date, new Date()) ? "date" : undefined}
                      aria-label={dayLabel(date)}
                      onClick={() => onSelect(date)}
                      onFocus={() => setFocusDate(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (date: Date) => boolean;
  locale?: DatePickerLocale;
  onSelectDate?: (date?: Date) => void;
};

export function DatePicker(props: DatePickerProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultValue);
  const [open, setOpen] = createSignal(false);
  const format = (date: Date) => props.locale?.format?.(date) ?? formatDate(date);
  const initial = props.value ?? props.defaultValue;
  const [text, setText] = createSignal(initial ? format(initial) : "");
  const value = createMemo(() => props.value ?? uncontrolled());

  createEffect(() => {
    if (props.value) setText(format(props.value));
  });

  const commit = (date?: Date) => {
    if (props.value === undefined) setUncontrolled(date);
    setText(date ? format(date) : "");
    props.onSelectDate?.(date);
    // 选完日期关闭弹层
    setOpen(false);
  };

  const parse = (input: string) => props.locale?.parse?.(input) ?? parseDate(input);

  return (
    <div class={cx("sf-DatePicker", props.class)}>
      <Menu open={open()} onOpenChange={setOpen}>
        <MenuTrigger>
          <span style={{ display: "inline-flex", width: "100%" }}>
            <Input
              disabled={props.disabled}
              placeholder={props.placeholder ?? "选择日期"}
              value={text()}
              contentAfter="📅"
              aria-label={props.placeholder ?? "选择日期"}
              onInput={(event) => setText(event.currentTarget.value)}
              onChange={(event) => {
                const parsed = parse(event.currentTarget.value);
                commit(parsed);
              }}
            />
          </span>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <Calendar
              value={value()}
              onSelectDate={(date) => commit(date)}
              minDate={props.minDate}
              maxDate={props.maxDate}
              disabledDate={props.disabledDate}
              locale={props.locale}
            />
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}

export type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (date: Date) => boolean;
  locale?: DatePickerLocale;
  onSelectRange?: (range: DateRange) => void;
};

export function DateRangePicker(props: DateRangePickerProps) {
  const [uncontrolled, setUncontrolled] = createSignal<DateRange>(
    props.defaultValue ?? {},
  );
  const [open, setOpen] = createSignal(false);
  const format = (date: Date) => props.locale?.format?.(date) ?? formatDate(date);
  const range = createMemo(() => props.value ?? uncontrolled());
  const label = createMemo(() => {
    const { start, end } = range();
    if (start && end) return `${format(start)} ~ ${format(end)}`;
    if (start) return `${format(start)} ~`;
    return props.placeholder ?? "选择日期范围";
  });

  return (
    <div class={cx("sf-DatePicker", "sf-DateRangePicker", props.class)}>
      <Menu open={open()} onOpenChange={setOpen}>
        <MenuTrigger>
          <Button appearance="secondary" disabled={props.disabled}>
            {label()}
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <CalendarDateRange
              value={range()}
              minDate={props.minDate}
              maxDate={props.maxDate}
              disabledDate={props.disabledDate}
              locale={props.locale}
              onSelectRange={(next) => {
                if (props.value === undefined) setUncontrolled(next);
                props.onSelectRange?.(next);
                if (next.start && next.end) setOpen(false);
              }}
            />
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}

export type TimePickerProps = {
  value?: string;
  defaultValue?: string;
  minuteStep?: number;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  onTimeChange?: (value: string) => void;
};

export function buildTimes(step: number) {
  // 非法 step（<=0 / NaN / Infinity / 小数）回退为 30，避免死循环
  const floored = Number.isFinite(step) ? Math.floor(step) : 0;
  const safe = floored >= 1 ? Math.min(floored, 60) : 30;
  const items: string[] = [];
  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += safe) {
      items.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return items;
}

export function TimePicker(props: TimePickerProps) {
  const [uncontrolled, setUncontrolled] = createSignal(props.defaultValue ?? "");
  const value = createMemo(() => props.value ?? uncontrolled());
  const options = createMemo(() => buildTimes(props.minuteStep ?? 30));

  return (
    <div class={cx("sf-TimePicker", props.class)}>
      <Menu>
        <MenuTrigger>
          <Button appearance="secondary" disabled={props.disabled}>
            {value() || props.placeholder || "选择时间"}
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <div class="sf-TimePicker__list" role="listbox" aria-label="Time options">
            <For each={options()}>
              {(item) => (
                <button
                  type="button"
                  role="option"
                  class={cx(
                    "sf-TimePicker__option",
                    value() === item && "sf-TimePicker__option--selected",
                  )}
                  aria-selected={value() === item}
                  onClick={() => {
                    if (props.value === undefined) setUncontrolled(item);
                    props.onTimeChange?.(item);
                  }}
                >
                  {item}
                </button>
              )}
            </For>
          </div>
        </MenuPopover>
      </Menu>
    </div>
  );
}

export type DatePickerInfo = {
  format: (date: Date) => string;
  parse: (value: string) => Date | undefined;
};

export const datePickerUtils: DatePickerInfo = {
  format: formatDate,
  parse: parseDate,
};
