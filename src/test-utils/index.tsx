import { render } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { FluentProvider, webLightTheme } from "../index";

export function renderWithFluent(ui: () => JSX.Element) {
  return render(() => (
    <FluentProvider theme={webLightTheme}>{ui()}</FluentProvider>
  ));
}
