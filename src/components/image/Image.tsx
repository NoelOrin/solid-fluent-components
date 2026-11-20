import { splitProps, type JSX } from "solid-js";
import { cx } from "../../utils/index";

export type ImageProps = {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  shape?: "square" | "circular" | "rounded";
  bordered?: boolean;
  shadow?: boolean;
  fit?: "none" | "center" | "contain" | "cover" | "default";
  block?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  loading?: "eager" | "lazy";
  referrerPolicy?: JSX.HTMLElementTags["img"]["referrerPolicy"];
};

export function Image(props: ImageProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "style",
    "shape",
    "bordered",
    "shadow",
    "fit",
    "block",
  ]);

  const fit = () => local.fit ?? "default";

  const style = () => {
    const next: JSX.CSSProperties = { ...(local.style ?? {}) };
    const current = fit();
    if (current === "contain" || current === "cover") {
      next["object-fit"] = current;
    } else if (current === "center") {
      next["object-fit"] = "none";
      next["object-position"] = "center";
    } else if (current === "none") {
      next["object-fit"] = "none";
    }
    // "default" intentionally leaves object-fit unset (browser fill behavior).
    return next;
  };

  return (
    <img
      {...rest}
      class={cx(
        "sf-Image",
        local.shape === "circular" && "sf-Image--circular",
        local.shape === "rounded" && "sf-Image--rounded",
        local.bordered && "sf-Image--bordered",
        local.shadow && "sf-Image--shadow",
        local.block && "sf-Image--block",
        `sf-Image--fit-${fit()}`,
        local.class,
      )}
      data-fit={fit()}
      style={style()}
    />
  );
}
