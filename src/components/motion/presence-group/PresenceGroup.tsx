import {
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  untrack,
  type JSX,
} from "solid-js";
import { cx } from "../../../utils/index";
import { PresenceBadge, type PresenceBadgeStatus } from "../../badge/PresenceBadge";

export type PresenceComponentProps = {
  status?: PresenceBadgeStatus;
  size?: "tiny" | "extra-small" | "small" | "medium" | "large" | "extra-large";
  outOfOffice?: boolean;
  class?: string;
};

export function PresenceComponent(props: PresenceComponentProps) {
  return <PresenceBadge status={props.status} size={props.size} outOfOffice={props.outOfOffice} class={props.class} />;
}

export type PresenceGroupProps = {
  children?: JSX.Element;
  class?: string;
};

export function PresenceGroup(props: PresenceGroupProps) {
  return (
    <div class={cx("sf-PresenceGroup", props.class)} role="group" aria-label="Presence">
      {props.children}
    </div>
  );
}

export type PresenceGroupPopoverProps = {
  items?: PresenceComponentProps[];
  class?: string;
};

export function PresenceGroupPopover(props: PresenceGroupPopoverProps) {
  return (
    <div class={cx("sf-PresenceGroup__popover", props.class)} role="group">
      <For each={props.items ?? []}>
        {(item) => <PresenceComponent {...item} />}
      </For>
    </div>
  );
}

// Motion helpers used by presence-aware components.
export type PresenceMotion = {
  keyframes?: Keyframe[];
  duration?: number;
  delay?: number;
  easing?: string;
};

export type PresenceMotionFn = (options: {
  element: HTMLElement;
}) => PresenceMotion;

export function presenceEnterMotion(_options: { element: HTMLElement }): PresenceMotion {
  return {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    duration: 200,
    easing: "ease",
  };
}

export function presenceExitMotion(_options: { element: HTMLElement }): PresenceMotion {
  return {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    duration: 150,
    easing: "ease",
  };
}

export type ShowWithPresenceProps = {
  when: boolean;
  class?: string;
  children?: JSX.Element;
  enterMotion?: PresenceMotionFn;
  exitMotion?: PresenceMotionFn;
  onExited?: () => void;
};

export type PresencePhase = "enter" | "entered" | "exit";

/**
 * 真正执行进/出场的包装器：挂载时播放 enter，卸载前播放 exit 并延迟移除 DOM。
 */
export function ShowWithPresence(props: ShowWithPresenceProps) {
  const [mounted, setMounted] = createSignal(props.when);
  const [phase, setPhase] = createSignal<PresencePhase>(props.when ? "enter" : "exit");
  let el: HTMLDivElement | undefined;
  let timer: number | undefined;
  let token = 0;

  const clearTimer = () => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };

  const play = (motion: PresenceMotion, id: number, done: () => void) => {
    const duration = (motion.duration ?? 200) + (motion.delay ?? 0);
    if (el && typeof el.animate === "function" && motion.keyframes?.length) {
      try {
        const animation = el.animate(motion.keyframes, {
          duration: motion.duration,
          delay: motion.delay,
          easing: motion.easing,
        });
        void animation.finished
          .then(() => {
            if (id === token) done();
          })
          .catch(() => {
            if (id === token) done();
          });
        return;
      } catch {
        // jsdom 等环境没有 WAAPI，回退到 class + 定时器
      }
    }
    timer = window.setTimeout(() => {
      if (id === token) done();
    }, duration);
  };

  const runEnter = (id: number) => {
    if (!el) return;
    clearTimer();
    setPhase("enter");
    play((props.enterMotion ?? presenceEnterMotion)({ element: el }), id, () =>
      setPhase("entered"),
    );
  };

  const runExit = (id: number) => {
    if (!el) return;
    clearTimer();
    setPhase("exit");
    play((props.exitMotion ?? presenceExitMotion)({ element: el }), id, () => {
      setMounted(false);
      props.onExited?.();
    });
  };

  createEffect(() => {
    const when = props.when;
    const id = ++token;
    if (when) {
      clearTimer();
      setMounted(true);
      queueMicrotask(() => {
        if (id === token) runEnter(id);
      });
    } else if (untrack(mounted)) {
      clearTimer();
      queueMicrotask(() => {
        if (id === token) runExit(id);
      });
    }
  });
  onCleanup(clearTimer);

  return (
    <Show when={mounted()}>
      <div
        ref={(node) => (el = node)}
        class={cx(
          "sf-Presence",
          phase() === "enter" && "sf-Presence--enter",
          phase() === "entered" && "sf-Presence--entered",
          phase() === "exit" && "sf-Presence--exit",
          props.class,
        )}
      >
        {props.children}
      </div>
    </Show>
  );
}
