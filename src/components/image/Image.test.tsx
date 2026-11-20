import { describe, expect, it } from "vitest";
import { createSignal } from "solid-js";
import { Image } from "./Image";
import { renderWithFluent } from "../../test-utils/index";

describe("Image", () => {
  it("renders an img with the fluent class and source/alt attributes", () => {
    const { getByRole } = renderWithFluent(() => (
      <Image src="a.png" alt="A picture" />
    ));
    const img = getByRole("img", { name: "A picture" }) as HTMLImageElement;
    expect(img).toHaveClass("sf-Image", "sf-Image--fit-default");
    expect(img).toHaveAttribute("src", "a.png");
    expect(img).toHaveAttribute("alt", "A picture");
    expect(img).toHaveAttribute("data-fit", "default");
  });

  it("is hidden from the image role when alt is empty", () => {
    const { queryByRole } = renderWithFluent(() => (
      <Image src="decoration.png" alt="" />
    ));
    expect(queryByRole("img")).toBeNull();
  });

  it("maps shape, border, shadow and block props to classes", () => {
    const { getByRole } = renderWithFluent(() => (
      <Image
        src="a.png"
        alt="A"
        shape="rounded"
        bordered
        shadow
        block
      />
    ));
    const img = getByRole("img");
    expect(img).toHaveClass(
      "sf-Image--rounded",
      "sf-Image--bordered",
      "sf-Image--shadow",
      "sf-Image--block",
    );
    expect(img).not.toHaveClass("sf-Image--circular");
  });

  it("applies object-fit for contain and cover", () => {
    const { getByRole: getContain } = renderWithFluent(() => (
      <Image src="a.png" alt="Contain" fit="contain" />
    ));
    const contain = getContain("img") as HTMLImageElement;
    expect(contain).toHaveClass("sf-Image--fit-contain");
    expect(contain).toHaveAttribute("data-fit", "contain");
    expect(contain.style.objectFit).toBe("contain");
  });

  it("uses object-position center for the center fit", () => {
    const { getByRole } = renderWithFluent(() => (
      <Image src="a.png" alt="Center" fit="center" />
    ));
    const img = getByRole("img") as HTMLImageElement;
    expect(img).toHaveClass("sf-Image--fit-center");
    expect(img.style.objectFit).toBe("none");
    expect(img.style.objectPosition).toBe("center");
  });

  it("leaves object-fit unset for the default fit", () => {
    const { getByRole } = renderWithFluent(() => (
      <Image src="a.png" alt="Default" />
    ));
    const img = getByRole("img") as HTMLImageElement;
    expect(img.style.objectFit).toBe("");
    expect(img.style.objectPosition).toBe("");
  });

  it("forwards width, height, loading and referrerPolicy to the img", () => {
    const { getByRole } = renderWithFluent(() => (
      <Image
        src="a.png"
        alt="A"
        width={120}
        height="auto"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    ));
    const img = getByRole("img");
    expect(img).toHaveAttribute("width", "120");
    expect(img).toHaveAttribute("height", "auto");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("referrerpolicy", "no-referrer");
  });

  it("merges a custom class and custom style", () => {
    const { getByRole } = renderWithFluent(() => (
      <Image src="a.png" alt="A" class="my-image" style={{ opacity: "0.5" }} />
    ));
    const img = getByRole("img") as HTMLImageElement;
    expect(img).toHaveClass("sf-Image", "my-image");
    expect(img.style.opacity).toBe("0.5");
  });

  it("keeps the fit class and data attribute in sync when fit changes", () => {
    const [fit, setFit] = createSignal<"cover" | "none">("cover");
    const { getByRole } = renderWithFluent(() => (
      <Image src="a.png" alt="A" fit={fit()} />
    ));
    const img = getByRole("img") as HTMLImageElement;
    expect(img).toHaveClass("sf-Image--fit-cover");
    expect(img.style.objectFit).toBe("cover");
    setFit("none");
    expect(img).toHaveClass("sf-Image--fit-none");
    expect(img).toHaveAttribute("data-fit", "none");
    expect(img.style.objectFit).toBe("none");
  });
});
