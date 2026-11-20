import {
  createContext,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  onCleanup,
  useContext,
  type JSX,
  type ParentProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  applyThemeToElement,
  removeThemeFromElement,
  webLightTheme,
} from "./themes";
import type { PartialTheme, Theme } from "./types";

export type FluentProviderProps = ParentProps<{
  theme?: Theme;
  /** Merge overrides on top of theme. */
  themeOverrides?: PartialTheme;
  class?: string;
  style?: JSX.CSSProperties;
  applyToDocument?: boolean;
  dir?: "ltr" | "rtl";
  targetDocument?: Document;
  /** Element rendered as the provider container. Defaults to `div`. */
  as?: keyof JSX.IntrinsicElements;
}>;

type FluentContextValue = {
  theme: () => Theme;
  dir: () => "ltr" | "rtl";
};

const FluentContext = createContext<FluentContextValue>({
  theme: () => webLightTheme,
  dir: () => "ltr" as const,
});

function mergeTheme(base: Theme, overrides?: PartialTheme): Theme {
  if (!overrides) return base;
  return { ...base, ...overrides };
}

/**
 * Document-level themes are owned by one provider at a time. Applicants
 * register in mount order (outermost first); a signal tracks the active owner
 * so ownership can be handed over reactively when a provider unmounts or
 * toggles `applyToDocument`. The global effect clears stale variables from the
 * previous document on handoff.
 */
type DocumentThemeApplicant = {
  getDoc: () => Document;
  getTheme: () => Theme;
};

const documentThemeApplicants: DocumentThemeApplicant[] = [];
const [documentThemeOwner, setDocumentThemeOwner] =
  createSignal<DocumentThemeApplicant | null>(null);

function refreshDocumentOwner() {
  setDocumentThemeOwner(documentThemeApplicants[0] ?? null);
}

createRoot(() => {
  let appliedDoc: Document | undefined;
  createEffect(() => {
    const owner = documentThemeOwner();
    if (!owner) {
      if (appliedDoc) {
        removeThemeFromElement(appliedDoc.documentElement);
        appliedDoc = undefined;
      }
      return;
    }
    const doc = owner.getDoc();
    // Reading the theme memo here makes ownership reactive to theme changes.
    const theme = owner.getTheme();
    if (appliedDoc && appliedDoc !== doc) {
      removeThemeFromElement(appliedDoc.documentElement);
    }
    applyThemeToElement(doc.documentElement, theme);
    appliedDoc = doc;
  });
});

export function FluentProvider(props: FluentProviderProps) {
  let root!: HTMLElement;

  const theme = createMemo(() =>
    mergeTheme(props.theme ?? webLightTheme, props.themeOverrides),
  );
  const dir = createMemo(() => props.dir ?? "ltr");

  // Local container always receives the theme, even without document apply.
  createEffect(() => {
    const next = theme();
    if (root) applyThemeToElement(root, next);
  });

  createEffect(() => {
    if (!props.applyToDocument) return;
    const applicant: DocumentThemeApplicant = {
      getDoc: () => props.targetDocument ?? document,
      getTheme: theme,
    };
    documentThemeApplicants.push(applicant);
    refreshDocumentOwner();
    onCleanup(() => {
      const index = documentThemeApplicants.indexOf(applicant);
      if (index !== -1) documentThemeApplicants.splice(index, 1);
      refreshDocumentOwner();
    });
  });

  const value: FluentContextValue = {
    theme,
    dir,
  };
  const Tag = (props.as ?? "div") as "div";

  return (
    <FluentContext.Provider value={value}>
      <Dynamic
        component={Tag}
        ref={(el: HTMLElement) => {
          root = el;
        }}
        class={["sf-provider", props.class].filter(Boolean).join(" ")}
        style={props.style}
        dir={dir()}
        data-fluent-provider
      >
        {props.children}
      </Dynamic>
    </FluentContext.Provider>
  );
}

export function useFluentTheme(): Theme {
  return useContext(FluentContext)?.theme() ?? webLightTheme;
}

export function useFluentDir(): "ltr" | "rtl" {
  return useContext(FluentContext)?.dir() ?? "ltr";
}

export function useFluent() {
  return (
    useContext(FluentContext) ?? {
      theme: () => webLightTheme,
      dir: () => "ltr" as const,
    }
  );
}
