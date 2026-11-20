import { describe, expect, it, vi } from "vitest";
import { fireEvent, waitFor } from "@solidjs/testing-library";
import {
  buildTimes,
  Calendar,
  CalendarDateRange,
  DatePicker,
  DateRangePicker,
  formatDate,
  parseDate,
  TimePicker,
} from "./DatePicker";
import { renderWithFluent } from "../../test-utils/index";

describe("DatePicker", () => {
  it("renders a date picker input", () => {
    const { container } = renderWithFluent(() => (
      <DatePicker value={new Date(2026, 0, 15)} />
    ));
    expect(container.querySelector("input, .sf-Combobox, .sf-Input")).toBeTruthy();
  });

  it("formats and parses dates", () => {
    const date = new Date(2026, 0, 15);
    expect(formatDate(date)).toContain("2026");
    expect(parseDate("2026-01-15")?.getFullYear()).toBe(2026);
  });

  it("rejects invalid calendar dates", () => {
    expect(parseDate("2026-02-30")).toBeUndefined();
    expect(parseDate("2026-13-01")).toBeUndefined();
    expect(parseDate("2026-02-29")).toBeUndefined();
    expect(parseDate("2024-02-29")?.getDate()).toBe(29);
    expect(parseDate("not-a-date")).toBeUndefined();
  });

  it("moves real DOM focus with arrow keys in Calendar", async () => {
    const { getByRole } = renderWithFluent(() => (
      <Calendar defaultValue={new Date(2026, 0, 15)} />
    ));
    const start = getByRole("gridcell", { name: "2026年1月15日" });
    start.focus();
    expect(document.activeElement).toBe(start);
    fireEvent.keyDown(start, { key: "ArrowRight" });
    await waitFor(() => {
      expect(document.activeElement).toBe(
        getByRole("gridcell", { name: "2026年1月16日" }),
      );
    });
  });

  it("honors minDate / maxDate / disabledDate", () => {
    const { getByRole } = renderWithFluent(() => (
      <Calendar
        defaultValue={new Date(2026, 0, 15)}
        minDate={new Date(2026, 0, 10)}
        disabledDate={(date) => date.getDate() === 20}
      />
    ));
    expect(getByRole("gridcell", { name: "2026年1月9日" })).toBeDisabled();
    expect(getByRole("gridcell", { name: "2026年1月20日" })).toBeDisabled();
    expect(getByRole("gridcell", { name: "2026年1月15日" })).not.toBeDisabled();
  });

  it("closes the popover after selecting a date", async () => {
    const onSelectDate = vi.fn();
    const { container, getByRole } = renderWithFluent(() => (
      <DatePicker onSelectDate={onSelectDate} />
    ));
    const input = container.querySelector("input")!;
    fireEvent.click(input);
    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".sf-MenuPopover")!;
      expect(el).toBeTruthy();
      return el;
    });
    expect(popover.querySelector('[role="grid"]')).toBeTruthy();
    const day = Array.from(popover.querySelectorAll<HTMLElement>('[role="gridcell"]')).find(
      (cell) => !cell.hasAttribute("disabled"),
    )!;
    fireEvent.click(day);
    expect(onSelectDate).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(document.querySelector(".sf-MenuPopover")).toBeNull());
  });

  it("accepts injected localization", () => {
    const { container } = renderWithFluent(() => (
      <Calendar
        defaultValue={new Date(2026, 0, 15)}
        locale={{
          months: ["Januar"],
          weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        }}
      />
    ));
    expect(container.querySelector(".sf-Calendar__title")?.textContent).toContain("Januar");
    expect(container.querySelector(".sf-Calendar__weekdays")?.textContent).toContain("Mo");
  });

  it("does not commit a half range on the first click, and supports keyboard", async () => {
    const onSelectRange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <CalendarDateRange
        defaultValue={{ start: new Date(2026, 0, 1) }}
        onSelectRange={onSelectRange}
      />
    ));
    fireEvent.click(getByRole("gridcell", { name: "2026年1月10日" }));
    expect(onSelectRange).not.toHaveBeenCalled();
    fireEvent.click(getByRole("gridcell", { name: "2026年1月14日" }));
    expect(onSelectRange).toHaveBeenCalledTimes(1);
    expect(onSelectRange.mock.calls[0]![0]).toEqual({
      start: new Date(2026, 0, 10),
      end: new Date(2026, 0, 14),
    });

    const day = getByRole("gridcell", { name: "2026年1月10日" });
    day.focus();
    fireEvent.keyDown(day, { key: "ArrowRight" });
    await waitFor(() => {
      expect(document.activeElement).toBe(getByRole("gridcell", { name: "2026年1月11日" }));
    });
  });

  it("builds a finite option list for invalid minuteStep values", () => {
    expect(buildTimes(0)).toHaveLength(48);
    expect(buildTimes(-5)).toHaveLength(48);
    expect(buildTimes(Number.NaN)).toHaveLength(48);
    expect(buildTimes(15)).toHaveLength(24 * 4);
  });

  it("renders TimePicker with a safe fallback step", async () => {
    const { getByRole } = renderWithFluent(() => <TimePicker minuteStep={0} />);
    fireEvent.click(getByRole("button", { name: "选择时间" }));
    await waitFor(() => {
      expect(document.querySelectorAll(".sf-TimePicker__option")).toHaveLength(48);
    });
  });

  it("selects the focused day with Enter and Space and updates aria-selected", () => {
    const onSelectDate = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Calendar defaultValue={new Date(2026, 0, 15)} onSelectDate={onSelectDate} />
    ));
    const day = getByRole("gridcell", { name: "2026年1月16日" });
    day.focus();
    expect(day).toHaveAttribute("aria-selected", "false");

    fireEvent.keyDown(day, { key: "Enter" });
    expect(onSelectDate).toHaveBeenCalledTimes(1);
    expect(onSelectDate).toHaveBeenCalledWith(new Date(2026, 0, 16));
    expect(day).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(day, { key: " " });
    expect(onSelectDate).toHaveBeenCalledTimes(2);
  });

  it("moves focus with Home and End keys in Calendar", async () => {
    const { getByRole } = renderWithFluent(() => (
      <Calendar defaultValue={new Date(2026, 0, 15)} />
    ));
    const start = getByRole("gridcell", { name: "2026年1月15日" });
    start.focus();
    fireEvent.keyDown(start, { key: "Home" });
    await waitFor(() =>
      expect(document.activeElement).toBe(
        getByRole("gridcell", { name: "2026年1月1日" }),
      ),
    );
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    await waitFor(() =>
      expect(document.activeElement).toBe(
        getByRole("gridcell", { name: "2026年1月31日" }),
      ),
    );
  });

  it("does not move Calendar focus onto a disabled boundary day", () => {
    const { getByRole } = renderWithFluent(() => (
      <Calendar
        defaultValue={new Date(2026, 0, 15)}
        minDate={new Date(2026, 0, 10)}
        maxDate={new Date(2026, 0, 20)}
      />
    ));
    const middle = getByRole("gridcell", { name: "2026年1月15日" });
    middle.focus();
    fireEvent.keyDown(middle, { key: "Home" });
    expect(document.activeElement).toBe(middle);

    const min = getByRole("gridcell", { name: "2026年1月10日" });
    min.focus();
    fireEvent.keyDown(min, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(min);

    const max = getByRole("gridcell", { name: "2026年1月20日" });
    max.focus();
    fireEvent.keyDown(max, { key: "ArrowRight" });
    expect(document.activeElement).toBe(max);
  });

  it("commits a typed date and reflects it in the input", () => {
    const onSelectDate = vi.fn();
    const { container } = renderWithFluent(() => (
      <DatePicker
        defaultValue={new Date(2026, 0, 15)}
        onSelectDate={onSelectDate}
      />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("2026-01-15");

    input.value = "2026-03-20";
    fireEvent.change(input);
    expect(onSelectDate).toHaveBeenCalledWith(new Date(2026, 2, 20));
    expect(input.value).toBe("2026-03-20");
  });

  it("uses the injected locale format and parse functions", () => {
    const locale = {
      format: (date: Date) =>
        date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
      parse: (value: string) => {
        const match = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(value);
        return match
          ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
          : undefined;
      },
    };
    const onSelectDate = vi.fn();
    const { container } = renderWithFluent(() => (
      <DatePicker defaultValue={new Date(2026, 0, 15)} locale={locale} onSelectDate={onSelectDate} />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("2026/1/15");

    input.value = "2026/2/20";
    fireEvent.change(input);
    expect(onSelectDate).toHaveBeenCalledWith(new Date(2026, 1, 20));
  });

  it("selects a TimePicker option and reports the callback", async () => {
    const onTimeChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <TimePicker defaultValue="08:00" onTimeChange={onTimeChange} />
    ));
    fireEvent.click(getByRole("button", { name: "08:00" }));
    const optionByText = (text: string) =>
      Array.from(document.querySelectorAll<HTMLElement>(".sf-TimePicker__option")).find(
        (option) => option.textContent === text,
      )!;
    await waitFor(() => expect(optionByText("08:00")).toBeTruthy());
    expect(optionByText("08:00")).toHaveAttribute("aria-selected", "true");

    fireEvent.click(optionByText("08:30"));
    expect(onTimeChange).toHaveBeenCalledWith("08:30");
    expect(getByRole("button", { name: "08:30" })).toBeInTheDocument();
    expect(optionByText("08:30")).toHaveClass("sf-TimePicker__option--selected");
  });

  it("marks the range start, end and in-between days", () => {
    const { getByRole } = renderWithFluent(() => (
      <CalendarDateRange
        defaultValue={{ start: new Date(2026, 0, 10), end: new Date(2026, 0, 14) }}
      />
    ));
    expect(getByRole("gridcell", { name: "2026年1月10日" })).toHaveClass(
      "sf-Calendar__day--rangeStart",
      "sf-Calendar__day--selected",
    );
    expect(getByRole("gridcell", { name: "2026年1月14日" })).toHaveClass(
      "sf-Calendar__day--rangeEnd",
      "sf-Calendar__day--selected",
    );
    expect(getByRole("gridcell", { name: "2026年1月12日" })).toHaveClass("sf-Calendar__day--inRange");
    expect(getByRole("gridcell", { name: "2026年1月15日" })).not.toHaveClass("sf-Calendar__day--inRange");
  });

  it("DateRangePicker commits a full range and closes the popover", async () => {
    const onSelectRange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <DateRangePicker
        defaultValue={{ start: new Date(2026, 0, 10) }}
        onSelectRange={onSelectRange}
      />
    ));
    fireEvent.click(getByRole("button", { name: /2026-01-10/ }));
    await waitFor(() => expect(document.querySelector(".sf-MenuPopover")).toBeTruthy());
    const popover = document.querySelector(".sf-MenuPopover")!;
    const findDay = (label: string) =>
      Array.from(popover.querySelectorAll<HTMLElement>('[role="gridcell"]')).find(
        (cell) => cell.getAttribute("aria-label") === label,
      )!;

    fireEvent.click(findDay("2026年1月12日"));
    expect(onSelectRange).not.toHaveBeenCalled();
    fireEvent.click(findDay("2026年1月16日"));
    expect(onSelectRange).toHaveBeenCalledTimes(1);
    expect(onSelectRange.mock.calls[0]![0]).toEqual({
      start: new Date(2026, 0, 12),
      end: new Date(2026, 0, 16),
    });
    await waitFor(() => expect(document.querySelector(".sf-MenuPopover")).toBeNull());
  });
});
