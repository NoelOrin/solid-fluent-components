import { createEffect, createMemo, createSignal, splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type Hsva = { h: number; s: number; v: number; a: number };

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function hsvFromRgb(r: number, g: number, b: number): Hsva {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / d + 2) * 60;
        break;
      default:
        h = ((rn - gn) / d + 4) * 60;
    }
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max, a: 1 };
}

export function hsvaToRgb({ h, s, v }: Hsva) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  };
}

/** HSVA -> CSS 字符串：不透明时输出 #RRGGBB，否则输出 rgba() */
export function hsvaToCss(color: Hsva): string {
  const { r, g, b } = hsvaToRgb(color);
  const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  if (color.a >= 1) return hex;
  return `rgba(${r}, ${g}, ${b}, ${Number(color.a.toFixed(2))})`;
}

/**
 * 解析 #RGB / #RGBA / #RRGGBB / #RRGGBBAA / rgb() / rgba()，非法输入返回 undefined。
 */
export function parseColor(input: string): Hsva | undefined {
  const value = input.trim();
  let r: number;
  let g: number;
  let b: number;
  let a = 1;

  const hex = /^#([0-9a-f]+)$/i.exec(value);
  if (hex) {
    const raw = hex[1]!;
    const channel = (text: string) => Number.parseInt(text, 16);
    if (raw.length === 3) {
      r = channel(raw[0]! + raw[0]!);
      g = channel(raw[1]! + raw[1]!);
      b = channel(raw[2]! + raw[2]!);
    } else if (raw.length === 4) {
      r = channel(raw[0]! + raw[0]!);
      g = channel(raw[1]! + raw[1]!);
      b = channel(raw[2]! + raw[2]!);
      a = channel(raw[3]! + raw[3]!) / 255;
    } else if (raw.length === 6) {
      r = channel(raw.slice(0, 2));
      g = channel(raw.slice(2, 4));
      b = channel(raw.slice(4, 6));
    } else if (raw.length === 8) {
      r = channel(raw.slice(0, 2));
      g = channel(raw.slice(2, 4));
      b = channel(raw.slice(4, 6));
      a = channel(raw.slice(6, 8)) / 255;
    } else {
      return undefined;
    }
  } else {
    const rgba =
      /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(
        value,
      );
    if (!rgba) return undefined;
    r = Number(rgba[1]);
    g = Number(rgba[2]);
    b = Number(rgba[3]);
    a = rgba[4] === undefined ? 1 : Number(rgba[4]);
    if ([r, g, b].some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return undefined;
    if (!Number.isFinite(a) || a < 0 || a > 1) return undefined;
  }

  return { ...hsvFromRgb(r, g, b), a };
}

/** 兼容旧 API：等价于 hsvaToCss */
export function hsvaToHex(color: Hsva): string {
  return hsvaToCss(color);
}

/** 兼容旧 API：解析失败时回退为黑色 */
export function hexToHsva(hex: string): Hsva {
  return parseColor(hex) ?? { h: 0, s: 0, v: 0, a: 1 };
}

export type ColorPickerProps = {
  color?: Hsva;
  defaultColor?: Hsva;
  shape?: "square" | "rounded";
  class?: string;
  children?: JSX.Element;
  onColorChange?: (color: Hsva, hex: string) => void;
};

export function ColorPicker(props: ColorPickerProps) {
  const [uncontrolled, setUncontrolled] = createSignal<Hsva>(
    props.defaultColor ?? { h: 210, s: 0.72, v: 0.74, a: 1 },
  );
  const color = createMemo(() => props.color ?? uncontrolled());
  const css = createMemo(() => hsvaToCss(color()));

  const setColor = (next: Partial<Hsva>) => {
    const merged = { ...color(), ...next };
    if (props.color === undefined) setUncontrolled(merged);
    props.onColorChange?.(merged, hsvaToCss(merged));
  };

  return (
    <div class={cx("sf-ColorPicker", props.class)} data-shape={props.shape ?? "rounded"}>
      {props.children ?? (
        <>
          <ColorArea
            h={color().h}
            s={color().s}
            v={color().v}
            onChange={(s, v) => setColor({ s, v })}
          />
          <ColorSlider type="hue" value={color().h} onChange={(h) => setColor({ h })} />
          <AlphaSlider color={color()} value={color().a} onChange={(a) => setColor({ a })} />
          <div class="sf-ColorPicker__previewRow">
            <ColorPreview color={color()} class="sf-ColorSwatch" />
            <HexInput
              value={color()}
              onColorChange={(next) => setColor(next)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export type ColorAreaProps = {
  h: number;
  s: number;
  v: number;
  class?: string;
  "aria-label"?: string;
  onChange?: (s: number, v: number) => void;
};

export function ColorArea(props: ColorAreaProps) {
  let areaEl!: HTMLDivElement;

  const updateFromEvent = (event: PointerEvent | MouseEvent) => {
    const rect = areaEl.getBoundingClientRect();
    const s = clamp((event.clientX - rect.left) / rect.width);
    const v = clamp(1 - (event.clientY - rect.top) / rect.height);
    props.onChange?.(s, v);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 0.1 : 0.01;
    let s = props.s;
    let v = props.v;
    switch (event.key) {
      case "ArrowLeft":
        s -= step;
        break;
      case "ArrowRight":
        s += step;
        break;
      case "ArrowUp":
        v += step;
        break;
      case "ArrowDown":
        v -= step;
        break;
      case "Home":
        s = 0;
        break;
      case "End":
        s = 1;
        break;
      case "PageUp":
        v = 1;
        break;
      case "PageDown":
        v = 0;
        break;
      default:
        return;
    }
    event.preventDefault();
    props.onChange?.(clamp(s), clamp(v));
  };

  return (
    <div
      ref={areaEl}
      class={cx("sf-ColorArea", "sf-focus-ring", props.class)}
      role="slider"
      tabindex={0}
      aria-label={props["aria-label"] ?? "Color area"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(props.v * 100)}
      aria-valuetext={`Saturation ${Math.round(props.s * 100)}%, Value ${Math.round(props.v * 100)}%`}
      style={{
        background: `
          linear-gradient(to top, #000, rgba(0, 0, 0, 0)),
          linear-gradient(to right, #fff, hsl(${props.h} 100% 50%))
        `,
      }}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        areaEl.setPointerCapture(event.pointerId);
        updateFromEvent(event);
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) return;
        updateFromEvent(event);
      }}
    >
      <span
        class="sf-ColorArea__thumb"
        style={{
          left: `${props.s * 100}%`,
          top: `${(1 - props.v) * 100}%`,
        }}
      />
    </div>
  );
}

export type ColorSliderProps = {
  type?: "hue" | "saturation" | "value";
  value: number;
  class?: string;
  onChange?: (value: number) => void;
};

export function ColorSlider(props: ColorSliderProps) {
  const type = () => props.type ?? "hue";
  const max = () => (type() === "hue" ? 360 : 1);
  return (
    <input
      class={cx("sf-ColorSlider", `sf-ColorSlider--${type()}`, props.class)}
      type="range"
      min={0}
      max={max()}
      step={type() === "hue" ? 1 : 0.01}
      value={props.value}
      onInput={(event) => props.onChange?.(Number(event.currentTarget.value))}
      aria-label={type()}
    />
  );
}

export type AlphaSliderProps = {
  color: Hsva;
  value: number;
  class?: string;
  onChange?: (value: number) => void;
};

export function AlphaSlider(props: AlphaSliderProps) {
  const rgb = createMemo(() => hsvaToRgb({ ...props.color, a: 1 }));
  const transparent = createMemo(() => {
    const { r, g, b } = rgb();
    return `rgba(${r}, ${g}, ${b}, 0)`;
  });
  const solid = createMemo(() => {
    const { r, g, b } = rgb();
    return `rgba(${r}, ${g}, ${b}, 1)`;
  });
  const checkerTransparent = "rgba(255, 255, 255, 0)";
  return (
    <input
      class={cx("sf-ColorSlider", "sf-ColorSlider--alpha", props.class)}
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={props.value}
      style={{
        background: `linear-gradient(to right, ${transparent()}, ${solid()}),
          linear-gradient(45deg, #ccc 25%, ${checkerTransparent} 25%),
          linear-gradient(-45deg, #ccc 25%, ${checkerTransparent} 25%),
          linear-gradient(45deg, ${checkerTransparent} 75%, #ccc 75%),
          linear-gradient(-45deg, ${checkerTransparent} 75%, #ccc 75%)`,
        "background-size": "100% 100%, 12px 12px, 12px 12px, 12px 12px, 12px 12px",
        "background-position": "0 0, 0 0, 0 6px, 6px -6px, -6px 0",
      }}
      onInput={(event) => props.onChange?.(Number(event.currentTarget.value))}
      aria-label="alpha"
    />
  );
}

export type HexInputProps = {
  value?: Hsva;
  defaultValue?: string;
  class?: string;
  "aria-label"?: string;
  onColorChange?: (color: Hsva, css: string) => void;
};

/** 十六进制输入子件：解析合法颜色后回调，非法输入保留文本 */
export function HexInput(props: HexInputProps) {
  const initial = props.defaultValue ?? (props.value ? hsvaToCss(props.value) : "");
  const [text, setText] = createSignal(initial);
  createEffect(() => {
    if (props.value) setText(hsvaToCss(props.value));
  });
  const commit = (value: string) => {
    setText(value);
    const parsed = parseColor(value);
    if (parsed) props.onColorChange?.(parsed, hsvaToCss(parsed));
  };
  return (
    <input
      class={cx("sf-ColorPicker__hexInput", props.class)}
      type="text"
      spellcheck={false}
      aria-label={props["aria-label"] ?? "Hex color"}
      value={text()}
      onInput={(event) => commit(event.currentTarget.value)}
      onChange={(event) => commit(event.currentTarget.value)}
    />
  );
}

export type ColorPreviewProps = {
  color: Hsva | string;
  class?: string;
  label?: string;
};

export function ColorPreview(props: ColorPreviewProps) {
  const css = () =>
    typeof props.color === "string" ? props.color : hsvaToCss(props.color);
  return (
    <span
      class={cx("sf-ColorPicker__preview", props.class)}
      style={{ background: css() }}
      role="img"
      aria-label={props.label ?? css()}
    />
  );
}

/** 兼容别名 */
export const ColorPickerPreview = ColorPreview;

export type ColorSwatchControlProps = {
  color: string;
  value?: string;
  selected?: boolean;
  disabled?: boolean;
  size?: "extra-small" | "small" | "medium" | "large";
  shape?: "square" | "circular" | "rounded";
  class?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

export function ColorSwatchControl(props: ColorSwatchControlProps) {
  const [local] = splitProps(props, [
    "color",
    "selected",
    "disabled",
    "size",
    "shape",
    "class",
    "onClick",
    "aria-label",
  ]);
  return (
    <button
      type="button"
      class={cx(
        "sf-ColorSwatch",
        local.selected && "sf-ColorSwatch--selected",
        local.disabled && "sf-ColorSwatch--disabled",
        local.class,
      )}
      style={{ background: local.color }}
      data-size={local.size ?? "medium"}
      data-shape={local.shape ?? "rounded"}
      disabled={local.disabled}
      aria-label={local["aria-label"] ?? local.color}
      aria-selected={local.selected}
      onClick={local.onClick}
    />
  );
}
