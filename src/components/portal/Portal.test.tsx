import { describe, expect, it } from "vitest";
import { Portal } from "./Portal";
import { renderWithFluent } from "../../test-utils/index";

describe("Portal", () => {
  it("renders children into document.body by default", () => {
    renderWithFluent(() => (
      <Portal>
        <span class="sf-PortalChild">Hi</span>
      </Portal>
    ));
    expect(document.body.querySelector(".sf-PortalChild")).toBeTruthy();
  });

  it("renders children into a custom mountNode", () => {
    const target = document.createElement("div");
    target.id = "portal-target";
    document.body.appendChild(target);
    renderWithFluent(() => (
      <Portal mountNode={target}>
        <span class="sf-PortalChild">Target</span>
      </Portal>
    ));
    expect(target.querySelector(".sf-PortalChild")).toBeTruthy();
    target.remove();
  });

  it("keeps the legacy mount alias working", () => {
    const target = document.createElement("div");
    target.id = "portal-legacy";
    document.body.appendChild(target);
    renderWithFluent(() => (
      <Portal mount={target}>
        <span class="sf-PortalChild">Legacy</span>
      </Portal>
    ));
    expect(target.querySelector(".sf-PortalChild")).toBeTruthy();
    target.remove();
  });

  it("renders inline when disablePortal is set", () => {
    const { container } = renderWithFluent(() => (
      <Portal disablePortal>
        <span class="sf-PortalChild">Inline</span>
      </Portal>
    ));
    expect(container.querySelector(".sf-PortalChild")).toBeTruthy();
  });

  it("does not leave portalled children inside the render container", () => {
    const { container } = renderWithFluent(() => (
      <Portal>
        <span class="sf-PortalChild">Outside</span>
      </Portal>
    ));
    expect(container.querySelector(".sf-PortalChild")).toBeNull();
    expect(document.body.querySelector(".sf-PortalChild")?.textContent).toBe("Outside");
  });

  it("prefers mountNode over the deprecated mount alias when both are given", () => {
    const legacy = document.createElement("div");
    const explicit = document.createElement("div");
    document.body.append(legacy, explicit);
    renderWithFluent(() => (
      <Portal mount={legacy} mountNode={explicit}>
        <span class="sf-PortalChild">New</span>
      </Portal>
    ));
    expect(explicit.querySelector(".sf-PortalChild")).toBeTruthy();
    expect(legacy.querySelector(".sf-PortalChild")).toBeNull();
    legacy.remove();
    explicit.remove();
  });

  it("removes portalled children from the DOM on unmount", () => {
    const view = renderWithFluent(() => (
      <Portal>
        <span class="sf-PortalChild">Gone</span>
      </Portal>
    ));
    expect(document.body.querySelector(".sf-PortalChild")).toBeTruthy();
    view.unmount();
    expect(document.body.querySelector(".sf-PortalChild")).toBeNull();
  });
});
