import { children, Show, type JSX } from "solid-js";
import { Portal as SolidPortal } from "solid-js/web";

export type PortalProps = {
  /** @deprecated Use `mountNode` instead. Kept as a backwards-compatible alias. */
  mount?: Node;
  /** The DOM node the children are appended to. Defaults to `document.body`. */
  mountNode?: Node;
  /** When true, render children in place instead of using a portal. */
  disablePortal?: boolean;
  children?: JSX.Element;
};

export function Portal(props: PortalProps) {
  const resolved = children(() => props.children);
  const target = () => props.mountNode ?? props.mount;

  return (
    <Show when={!props.disablePortal} fallback={resolved()}>
      <SolidPortal mount={target()}>{resolved()}</SolidPortal>
    </Show>
  );
}
