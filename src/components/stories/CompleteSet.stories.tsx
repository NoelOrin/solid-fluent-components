import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import {
  AlphaSlider,
  ColorArea,
  ColorPicker,
  ColorSlider,
  hsvaToHex,
} from "../color-picker/ColorPicker";
import { Calendar, DatePicker, DateRangePicker, TimePicker } from "../date-picker/DatePicker";
import { Popover, PopoverSurface, PopoverTrigger } from "../popover/Popover";
import { Portal } from "../portal/Portal";
import { List } from "../list/List";
import { Overflow } from "../overflow/Overflow";
import { InteractionTag } from "../tag/InteractionTag";
import { Virtualizer, AppItem, InfoButton } from "../utilities/virtualizer/Virtualizer";
import { InlineDrawer } from "../drawer/InlineDrawer";
import {
  EmptyState,
  FluentCombobox,
  FluentOption,
  Stepper,
  ToastContainer,
} from "../utilities/extras/Extras";
import { Button } from "../button/Button";
import { Body1, Title3 } from "../text/Text";
import { Tag } from "../tag/Tag";
import { Toast, ToastBody, ToastTitle } from "../toast/Toast";

const meta = {
  title: "Complete/Remaining",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPickerStory: Story = {
  name: "ColorPicker",
  render: () => {
    const [color, setColor] = createSignal({ h: 210, s: 0.7, v: 0.75, a: 1 });
    return (
      <div style={{ display: "flex", gap: "20px", "align-items": "flex-start" }}>
        <ColorPicker
          color={color()}
          onColorChange={(next) => setColor(next)}
        />
        <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
          <Title3>拆分控件</Title3>
          <ColorArea
            h={color().h}
            s={color().s}
            v={color().v}
            onChange={(s, v) => setColor({ ...color(), s, v })}
          />
          <ColorSlider
            type="hue"
            value={color().h}
            onChange={(h) => setColor({ ...color(), h })}
          />
          <AlphaSlider
            color={color()}
            value={color().a}
            onChange={(a) => setColor({ ...color(), a })}
          />
          <Body1>{hsvaToHex(color())}</Body1>
        </div>
      </div>
    );
  },
};

export const DateTimeStory: Story = {
  name: "DatePicker / TimePicker",
  render: () => {
    const [date, setDate] = createSignal<Date | undefined>(new Date());
    const [range, setRange] = createSignal<{ start?: Date; end?: Date }>({});
    const [time, setTime] = createSignal("09:30");
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "16px", width: "320px" }}>
        <DatePicker value={date()} onSelectDate={setDate} />
        <DateRangePicker value={range()} onSelectRange={setRange} />
        <TimePicker value={time()} onTimeChange={setTime} minuteStep={15} />
        <Calendar value={date()} onSelectDate={setDate} />
        <Body1>
          日期：{date() ? date()!.toLocaleDateString() : "未选择"} / 时间：{time()}
        </Body1>
      </div>
    );
  },
};

export const PopoverPortalStory: Story = {
  name: "Popover / Portal",
  render: () => {
    const [mounted, setMounted] = createSignal(false);
    return (
      <div style={{ display: "flex", gap: "12px", "align-items": "center" }}>
        <Popover>
          <PopoverTrigger>
            <Button appearance="primary">打开 Popover</Button>
          </PopoverTrigger>
          <PopoverSurface>
            <Title3>完整 Popover</Title3>
            <Body1>支持定位、点击外部关闭与 Esc。</Body1>
          </PopoverSurface>
        </Popover>
        <Button appearance="outline" onClick={() => setMounted(!mounted())}>
          切换 Portal
        </Button>
        {mounted() ? (
          <Portal>
            <div
              style={{
                position: "fixed",
                right: "24px",
                bottom: "24px",
                padding: "12px 16px",
                background: "var(--sf-colorBrandBackground)",
                color: "var(--sf-colorNeutralForegroundOnBrand)",
                "border-radius": "8px",
                "z-index": "2000",
              }}
            >
              Portal 内容
            </div>
          </Portal>
        ) : null}
      </div>
    );
  },
};

export const ListOverflowStory: Story = {
  name: "List / Overflow",
  render: () => {
    const [selected, setSelected] = createSignal<Array<string | number>>(["b"]);
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "20px", width: "420px" }}>
        <List
          selectionMode="multiselect"
          selectedItems={selected()}
          onSelectionChange={setSelected}
          items={[
            { value: "a", content: "Alpha" },
            { value: "b", content: "Beta" },
            { value: "c", content: "Gamma" },
            { value: "d", content: "Delta", disabled: true },
          ]}
        />
        <div style={{ width: "260px" }}>
          <Overflow
            minimumVisible={2}
            items={[
              { id: "1", content: <Tag>设计</Tag> },
              { id: "2", content: <Tag>研发</Tag> },
              { id: "3", content: <Tag>测试</Tag> },
              { id: "4", content: <Tag>发布</Tag> },
              { id: "5", content: <Tag>运维</Tag> },
              { id: "6", content: <Tag>文档</Tag> },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const InteractionAndVirtual: Story = {
  name: "InteractionTag / Virtualizer",
  render: () => {
    const [selected, setSelected] = createSignal(true);
    const items = Array.from({ length: 1000 }, (_, i) => `Item #${i + 1}`);
    return (
      <div style={{ display: "flex", "flex-direction": "column", gap: "16px", width: "420px" }}>
        <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
          <InteractionTag
            appearance="brand"
            selected={selected()}
            onClick={() => setSelected(!selected())}
            onDismiss={() => setSelected(false)}
            secondaryText="可交互"
          >
            Fluent
          </InteractionTag>
          <InteractionTag appearance="outline">Solid</InteractionTag>
          <InfoButton />
        </div>
        <Virtualizer items={items} itemSize={36} height={220}>
          {(item) => <Body1>{item}</Body1>}
        </Virtualizer>
      </div>
    );
  },
};

export const NavigationExtras: Story = {
  name: "Nav extras / Drawer / Empty",
  render: () => {
    const [app, setApp] = createSignal("home");
    return (
      <div style={{ display: "flex", gap: "16px", "align-items": "flex-start" }}>
        <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
          <AppItem selected={app() === "home"} onClick={() => setApp("home")} icon={<span>⌂</span>}>
            首页
          </AppItem>
          <AppItem selected={app() === "lib"} onClick={() => setApp("lib")} icon={<span>▦</span>}>
            组件库
          </AppItem>
          <AppItem selected={app() === "set"} onClick={() => setApp("set")} icon={<span>⚙</span>}>
            设置
          </AppItem>
        </div>
        <InlineDrawer defaultOpen size={240}>
          <div style={{ padding: "12px" }}>
            <Title3>Inline Drawer</Title3>
            <Body1>适合侧边导航或筛选面板。</Body1>
          </div>
        </InlineDrawer>
        <EmptyState
          icon={<span style={{ "font-size": "28px" }}>📭</span>}
          title="暂无数据"
          description="DateRange 与虚拟表格见 Polish/Interactions。"
          action={<Button appearance="primary">新建</Button>}
        />
      </div>
    );
  },
};

export const ComboboxAndStepper: Story = {
  name: "Combobox options / Stepper / Toast",
  render: () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "20px", width: "360px" }}>
      <FluentCombobox multiselect defaultSelectedOptions={["apple"]} placeholder="选择水果">
        <FluentOption value="apple">Apple</FluentOption>
        <FluentOption value="banana">Banana</FluentOption>
        <FluentOption value="cherry">Cherry</FluentOption>
      </FluentCombobox>
      <Stepper
        activeStep={1}
        steps={[
          { label: "基础信息", description: "名称与描述" },
          { label: "主题配置", description: "颜色与字体" },
          { label: "完成", description: "检查并发布" },
        ]}
      />
      <ToastContainer position="bottom-end">
        <Toast intent="info">
          <ToastTitle>全量组件补充中</ToastTitle>
          <ToastBody>已覆盖 ColorPicker / DatePicker / Virtualizer 等。</ToastBody>
        </Toast>
      </ToastContainer>
    </div>
  ),
};
