import { splitProps } from "solid-js";
import { cx } from "../../utils/index";

export type ProgressBarProps = {
  /** When `undefined` the bar renders the indeterminate state. */
  value?: number;
  max?: number;
  thickness?: "medium" | "large";
  shape?: "rounded" | "square";
  color?: "brand" | "success" | "warning" | "error";
  /** Enables the indeterminate animation. @default true */
  indeterminateMotion?: boolean;
  class?: string;
  "aria-label"?: string;
  "aria-valuetext"?: string;
};

export function ProgressBar(props: ProgressBarProps) {
  const [local, rest] = splitProps(props, [
    "value",
    "max",
    "thickness",
    "shape",
    "color",
    "indeterminateMotion",
    "class",
    "aria-label",
    "aria-valuetext",
  ]);

  const max = () => local.max ?? 1;
  const indeterminate = () => local.value === undefined;
  const value = () => Math.min(Math.max(local.value ?? 0, 0), max());
  const percent = () => (max() > 0 ? (value() / max()) * 100 : 0);
  const color = () => local.color ?? "brand";
  const thickness = () => local.thickness ?? "medium";
  const shape = () => local.shape ?? "rounded";
  const motion = () => local.indeterminateMotion ?? true;

  return (
    <div
      {...rest}
      class={cx(
        "sf-ProgressBar",
        indeterminate() && "sf-ProgressBar--indeterminate",
        !motion() && "sf-ProgressBar--no-motion",
        color() === "error" && "sf-ProgressBar--error",
        color() === "warning" && "sf-ProgressBar--warning",
        color() === "success" && "sf-ProgressBar--success",
        local.class,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max()}
      aria-valuenow={indeterminate() ? undefined : value()}
      aria-label={local["aria-label"]}
      aria-valuetext={local["aria-valuetext"]}
      data-indeterminate={indeterminate() ? "true" : "false"}
      data-thickness={thickness()}
      data-shape={shape()}
      style={{ height: thickness() === "large" ? "8px" : "4px" }}
    >
      <div
        class="sf-ProgressBar__bar"
        style={{
          width: indeterminate() ? undefined : `${percent()}%`,
          "border-radius": shape() === "square" ? "0" : undefined,
        }}
      />
    </div>
  );
}
