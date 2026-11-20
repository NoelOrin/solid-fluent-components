import { fireEvent } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
  ToastTrigger,
  Toaster,
  ToastProvider,
  useToastController,
  dispatchToast,
  clearToasts,
} from "./Toast";
import { renderWithFluent } from "../../test-utils/index";

beforeEach(() => clearToasts());
afterEach(() => {
  clearToasts();
  vi.useRealTimers();
});

describe("Toast sub-components", () => {
  it("ToastTrigger dispatches a toast on click", () => {
    renderWithFluent(() => (
      <ToastTrigger toast={{ title: "Saved", body: "ok" }}>Notify</ToastTrigger>
    ));
    renderWithFluent(() => <Toaster />);
    fireEvent.click(document.querySelector("button") as HTMLElement);
    expect(document.querySelector(".sf-Toast")).toBeTruthy();
  });

  it("Toast renders with intent class", () => {
    const { container } = renderWithFluent(() => <Toast intent="success">Done</Toast>);
    expect(container.querySelector(".sf-Toast--success")).toBeTruthy();
  });

  it("Toaster container exposes aria-live=polite", () => {
    renderWithFluent(() => <Toaster />);
    expect(document.querySelector(".sf-Toaster")).toHaveAttribute("aria-live", "polite");
  });

  it("Toast uses role=status by default and role=alert for warning/error or assertive politeness", () => {
    const { container } = renderWithFluent(() => (
      <>
        <Toast intent="info">info</Toast>
        <Toast intent="success">success</Toast>
        <Toast intent="warning">warning</Toast>
        <Toast intent="error">error</Toast>
        <Toast politeness="assertive">assertive</Toast>
      </>
    ));
    const roles = Array.from(container.querySelectorAll(".sf-Toast")).map((el) =>
      el.getAttribute("role"),
    );
    expect(roles).toEqual(["status", "status", "alert", "alert", "alert"]);
  });

  it("dispatched toasts follow the same role rules", () => {
    renderWithFluent(() => <Toaster />);
    dispatchToast({ id: "a", intent: "info", title: "info" });
    dispatchToast({ id: "b", intent: "error", title: "error" });
    const toasts = document.querySelectorAll(".sf-Toast");
    expect(toasts.length).toBe(2);
    expect(toasts[0]).toHaveAttribute("role", "status");
    expect(toasts[1]).toHaveAttribute("role", "alert");
  });

  it("supports position top / bottom", () => {
    renderWithFluent(() => <Toaster position="bottom" />);
    expect(document.querySelector(".sf-Toaster")).toHaveClass("sf-Toaster--bottom");
  });

  it("sorts toasts by priority (descending)", () => {
    renderWithFluent(() => <Toaster />);
    dispatchToast({ id: "low", title: "low", priority: 1 });
    dispatchToast({ id: "high", title: "high", priority: 10 });
    const toasts = document.querySelectorAll(".sf-Toast");
    expect(toasts[0]?.textContent).toContain("high");
    expect(toasts[1]?.textContent).toContain("low");
  });

  it("dismisses a toast through its dismiss button", () => {
    renderWithFluent(() => <Toaster />);
    dispatchToast({ id: "dismiss-me", title: "Dismiss me", timeout: 0 });
    expect(document.querySelectorAll(".sf-Toast")).toHaveLength(1);
    fireEvent.click(document.querySelector('[aria-label="Dismiss"]') as HTMLElement);
    expect(document.querySelectorAll(".sf-Toast")).toHaveLength(0);
  });

  it("renders title, body and footer sub-components with their classes", () => {
    const { container } = renderWithFluent(() => (
      <Toast>
        <ToastTitle class="my-title">T</ToastTitle>
        <ToastBody class="my-body">B</ToastBody>
        <ToastFooter class="my-footer">F</ToastFooter>
      </Toast>
    ));
    expect(container.querySelector(".sf-Toast__title.my-title")?.textContent).toBe("T");
    expect(container.querySelector(".sf-Toast__body.my-body")?.textContent).toBe("B");
    expect(container.querySelector(".my-footer")?.textContent).toBe("F");
  });

  it("replaces a toast with the same id instead of duplicating it", () => {
    renderWithFluent(() => <Toaster />);
    dispatchToast({ id: "same", title: "first", body: "old", timeout: 0 });
    dispatchToast({ id: "same", title: "second", body: "new", timeout: 0 });
    const toasts = document.querySelectorAll(".sf-Toast");
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.textContent).toContain("second");
    expect(toasts[0]?.textContent).not.toContain("old");
  });

  it("clearToasts removes all currently dispatched toasts", () => {
    renderWithFluent(() => <Toaster />);
    dispatchToast({ id: "one", title: "one", timeout: 0 });
    dispatchToast({ id: "two", title: "two", timeout: 0 });
    expect(document.querySelectorAll(".sf-Toast")).toHaveLength(2);
    clearToasts();
    expect(document.querySelectorAll(".sf-Toast")).toHaveLength(0);
  });

  it("renders no toast when the toaster region is empty", () => {
    renderWithFluent(() => <Toaster />);
    expect(document.querySelector(".sf-Toaster")).toBeTruthy();
    expect(document.querySelector(".sf-Toast")).toBeNull();
  });

  it("applies a custom class to the toaster region", () => {
    renderWithFluent(() => <Toaster class="my-toaster" />);
    expect(document.querySelector(".sf-Toaster")).toHaveClass("my-toaster");
  });

  it("ToastTrigger without a toast prop dispatches nothing", () => {
    renderWithFluent(() => <ToastTrigger>Notify</ToastTrigger>);
    renderWithFluent(() => <Toaster />);
    fireEvent.click(document.querySelector("button") as HTMLElement);
    expect(document.querySelector(".sf-Toast")).toBeNull();
  });

  it("sets aria-live=assertive for an assertive toast", () => {
    const { container } = renderWithFluent(() => (
      <Toast politeness="assertive">urgent</Toast>
    ));
    expect(container.querySelector(".sf-Toast")).toHaveAttribute("aria-live", "assertive");
  });
});

describe("ToastProvider", () => {
  it("scopes useToastController to the provider", () => {
    function Dispatcher() {
      const { dispatchToast: push } = useToastController();
      return <button onClick={() => push({ id: "scoped", title: "scoped toast" })}>push</button>;
    }
    renderWithFluent(() => (
      <ToastProvider position="bottom">
        <Dispatcher />
        <Toaster />
      </ToastProvider>
    ));
    expect(document.querySelector(".sf-Toaster")).toHaveClass("sf-Toaster--bottom");
    fireEvent.click(document.querySelector("button") as HTMLElement);
    expect(document.querySelector(".sf-Toast")?.textContent).toContain("scoped toast");
  });

  it("pauses and resumes auto-dismiss on hover", () => {
    vi.useFakeTimers();
    renderWithFluent(() => <Toaster />);
    dispatchToast({ id: "pauseme", title: "pauseme", timeout: 1000 });
    const toaster = document.querySelector(".sf-Toaster") as HTMLElement;

    fireEvent.mouseEnter(toaster);
    vi.advanceTimersByTime(5000);
    expect(document.querySelector(".sf-Toast")).toBeTruthy();

    fireEvent.mouseLeave(toaster);
    vi.advanceTimersByTime(1000);
    expect(document.querySelector(".sf-Toast")).toBeNull();
  });
});
