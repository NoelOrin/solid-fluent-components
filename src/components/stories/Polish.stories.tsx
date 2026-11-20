import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { ComboboxField } from "../combobox/ComboboxField";
import { Dropdown } from "../dropdown/Dropdown";
import { List } from "../list/List";
import {
  Calendar,
  CalendarDateRange,
  DatePicker,
  DateRangePicker,
  TimePicker,
} from "../date-picker/DatePicker";
import { DataGrid } from "../data-grid/DataGrid";
import { Field } from "../field/Field";
import { Body1, Title3 } from "../text/Text";
import { Badge } from "../badge/Badge";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "pear", label: "Pear" },
];

const meta = {
  title: "Polish/Interactions",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
深度交互与可访问性演示。

### 覆盖能力
- ComboboxField：多选标签、过滤、方向键 / Home / End / Enter / Esc / Backspace
- Dropdown：键盘打开、高亮、选择
- List：方向键与 Space/Enter 选择
- DatePicker / DateRangePicker / Calendar：日期与范围选择
- DataGrid：virtualized、排序、多选、行键盘导航

### 关键 API
| 组件 | 属性 |
| --- | --- |
| ComboboxField | multiselect / selectedOptions / clearable / onOptionSelect |
| Dropdown | options / value / onOptionSelect |
| DataGrid | virtualized / height / rowHeight / sortable / selectionMode |
| DateRangePicker | value / onSelectRange |
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComboboxKeyboard: Story = {
  name: "Combobox multi select keyboard",
  render: () => {
    const [selected, setSelected] = createSignal(["apple", "grape"]);
    return (
      <div style={{ width: "360px", display: "flex", "flex-direction": "column", gap: "12px" }}>
        <Title3>完整 Combobox</Title3>
        <Body1>
          支持过滤、多选标签、方向键、Home/End、Enter 选择、Backspace 删除、Esc 关闭。
        </Body1>
        <Field label="水果（多选）">
          <ComboboxField
            multiselect
            clearable
            options={fruits}
            selectedOptions={selected()}
            placeholder="输入过滤并选择"
            onOptionSelect={(data) => setSelected(data.selectedOptions)}
          />
        </Field>
        <Body1>已选：{selected().join(", ") || "无"}</Body1>
      </div>
    );
  },
};

export const DropdownKeyboard: Story = {
  name: "Dropdown keyboard",
  render: () => {
    const [value, setValue] = createSignal("banana");
    return (
      <div style={{ width: "280px", display: "flex", "flex-direction": "column", gap: "12px" }}>
        <Field label="Dropdown">
          <Dropdown
            value={value()}
            options={fruits}
            onOptionSelect={(data) => setValue(data.value)}
          />
        </Field>
        <Body1>当前：{value()}</Body1>
      </div>
    );
  },
};

export const ListKeyboard: Story = {
  name: "List keyboard",
  render: () => {
    const [selected, setSelected] = createSignal(["b"]);
    return (
      <div style={{ width: "320px", display: "flex", "flex-direction": "column", gap: "12px" }}>
        <List
          aria-label="字母列表"
          selectionMode="multiselect"
          selectedItems={selected()}
          onSelectionChange={setSelected}
          items={[
            { value: "a", content: "Alpha" },
            { value: "b", content: "Beta" },
            { value: "c", content: "Gamma" },
            { value: "d", content: "Delta", disabled: true },
            { value: "e", content: "Epsilon" },
          ]}
        />
        <Body1>方向键移动，Space/Enter 切换选择。</Body1>
      </div>
    );
  },
};

export const DateRangeStory: Story = {
  name: "DateRange calendar a11y",
  render: () => {
    const [date, setDate] = createSignal(new Date());
    const [range, setRange] = createSignal({});
    const [time, setTime] = createSignal("09:30");
    return (
      <div style={{ display: "grid", gap: "16px", "grid-template-columns": "1fr 1fr", width: "720px" }}>
        <div>
          <Title3>单日 + 键盘日历</Title3>
          <DatePicker value={date()} onSelectDate={(next) => next && setDate(next)} />
          <div style={{ "margin-top": "12px" }}>
            <Calendar
              value={date()}
              onSelectDate={setDate}
              minDate={new Date(2026, 0, 1)}
              maxDate={new Date(2026, 11, 31)}
              disabledDate={(d) => d.getDay() === 0}
              locale={{ weekdays: ["日", "一", "二", "三", "四", "五", "六"] }}
            />
          </div>
        </div>
        <div>
          <Title3>日期范围</Title3>
          <DateRangePicker value={range()} onSelectRange={setRange} />
          <div style={{ "margin-top": "12px" }}>
            <CalendarDateRange value={range()} onSelectRange={setRange} />
          </div>
          <div style={{ "margin-top": "12px" }}>
            <TimePicker value={time()} minuteStep={15} onTimeChange={setTime} />
            <Body1>minuteStep 非法时回退为 30，不会死循环。</Body1>
          </div>
        </div>
      </div>
    );
  },
};

export const VirtualDataGridStory: Story = {
  name: "Virtual DataGrid",
  render: () => {
    const [selected, setSelected] = createSignal([2]);
    const rows = Array.from({ length: 500 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      role: index % 3 === 0 ? "Engineer" : index % 3 === 1 ? "Design" : "Ops",
      status: index % 3 === 0 ? "online" : index % 3 === 1 ? "away" : "busy",
    }));

    return (
      <div style={{ width: "720px", display: "flex", "flex-direction": "column", gap: "12px" }}>
        <Title3>虚拟表格 + 键盘行导航</Title3>
        <Body1>ArrowUp/Down 移动活动行，Space/Enter 切换选中；表头可排序。</Body1>
        <DataGrid
          items={rows}
          virtualized
          height={360}
          rowHeight={40}
          getRowId={(item) => item.id}
          sortable
          selectionMode="multiselect"
          selectedItems={selected()}
          onSelectionChange={setSelected}
          columns={[
            {
              columnId: "name",
              label: "姓名",
              width: 180,
              compare: (a, b) => a.name.localeCompare(b.name),
              renderCell: (item) => item.name,
            },
            {
              columnId: "role",
              label: "角色",
              width: 140,
              compare: (a, b) => a.role.localeCompare(b.role),
              renderCell: (item) => item.role,
            },
            {
              columnId: "status",
              label: "状态",
              compare: (a, b) => a.status.localeCompare(b.status),
              renderCell: (item) => (
                <Badge
                  color={
                    item.status === "online"
                      ? "success"
                      : item.status === "busy"
                        ? "danger"
                        : "warning"
                  }
                >
                  {item.status}
                </Badge>
              ),
            },
          ]}
        />
        <Body1>已选 {selected().length} 行</Body1>
      </div>
    );
  },
};
