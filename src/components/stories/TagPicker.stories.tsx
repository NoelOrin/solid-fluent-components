import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { For, createSignal } from "solid-js";
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerButton,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  TagPickerOptionGroup,
} from "../tag-picker/TagPicker";

const meta = {
  title: "Inputs/TagPicker",
  tags: ["autodocs"],
  component: TagPicker,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "react", label: "React" },
  { value: "solid", label: "Solid" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
];

export const Default: Story = {
  name: "TagPicker",
  render: () => (
    <div style={{ width: "320px" }}>
      <TagPicker options={options} placeholder="选择框架（方向键 / Enter / Esc）" />
    </div>
  ),
};

export const ControlledOpen: Story = {
  name: "受控弹层",
  render: () => {
    const [open, setOpen] = createSignal(false);
    const [selected, setSelected] = createSignal<string[]>([]);
    return (
      <div style={{ width: "320px" }}>
        <TagPicker
          options={options}
          selectedOptions={selected()}
          onOptionSelect={setSelected}
          open={open()}
          onOpenChange={setOpen}
          placeholder="open / onOpenChange 受控"
        />
        <button type="button" onClick={() => setOpen(!open())}>
          {open() ? "关闭" : "打开"}
        </button>
      </div>
    );
  },
};

export const SubComponents: Story = {
  name: "Sub-components",
  render: () => {
    const [sel, setSel] = createSignal<string[]>(["solid"]);
    return (
      <div style={{ width: "320px" }}>
        <TagPickerControl>
          <TagPickerGroup>
            <For each={sel()}>
              {(v) => <span class="sf-Tag">{v}</span>}
            </For>
            <TagPickerInput placeholder="输入筛选" />
          </TagPickerGroup>
          <TagPickerButton>选择</TagPickerButton>
        </TagPickerControl>
        <TagPickerList>
          <TagPickerOptionGroup label="前端">
            {options.map((o) => (
              <TagPickerOption
                value={o.value}
                label={o.label}
                selected={sel().includes(o.value)}
                onClick={(v) => setSel([...sel(), v])}
              />
            ))}
          </TagPickerOptionGroup>
        </TagPickerList>
      </div>
    );
  },
};

