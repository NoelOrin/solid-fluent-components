import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@solidjs/testing-library";
import { Rating, RatingDisplay, RatingItem } from "./Rating";
import { renderWithFluent } from "../../test-utils/index";

describe("Rating sub-components", () => {
  it("renders stars and display", () => {
    const onChange = vi.fn();
    const { container, getAllByRole } = renderWithFluent(() => (
      <Rating value={3} onChange={onChange} />
    ));
    expect(container.querySelector("[role='slider']")).toBeTruthy();
    expect(getAllByRole("button").length).toBe(5);
    fireEvent.click(getAllByRole("button")[4]!);
    expect(onChange).toHaveBeenCalledWith(5);
    expect(typeof RatingDisplay).toBe("function");
    expect(typeof RatingItem).toBe("function");
  });

  it("RatingItem renders an interactive star", () => {
    const onSelect = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <RatingItem value={2} selected onSelect={onSelect} />
    ));
    const star = getByRole("button", { name: "2 star" });
    fireEvent.click(star);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("exposes slider semantics with tabindex and aria-valuetext", () => {
    const { getByRole } = renderWithFluent(() => (
      <Rating defaultValue={2} aria-label="Rate this" />
    ));
    const slider = getByRole("slider", { name: "Rate this" });
    expect(slider).toHaveAttribute("tabindex", "0");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "5");
    expect(slider).toHaveAttribute("aria-valuenow", "2");
    expect(slider).toHaveAttribute("aria-valuetext", "2 of 5 stars");
  });

  it("responds to Arrow/Home/End keys on the slider container", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Rating defaultValue={2} onChange={onChange} />
    ));
    const slider = getByRole("slider");
    const press = (key: string) =>
      fireEvent.keyDown(slider, { key });

    press("ArrowRight");
    expect(onChange).toHaveBeenLastCalledWith(3);
    press("ArrowLeft");
    expect(onChange).toHaveBeenLastCalledWith(2);
    press("Home");
    expect(onChange).toHaveBeenLastCalledWith(0);
    press("End");
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(slider).toHaveAttribute("aria-valuenow", "5");
  });

  it("uses half-star steps for keyboard and left/right half clicks", () => {
    const onChange = vi.fn();
    const { getByRole, getAllByRole } = renderWithFluent(() => (
      <Rating defaultValue={3} step={0.5} onChange={onChange} />
    ));
    const slider = getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(3.5);

    const thirdStar = getAllByRole("button")[2]!;
    thirdStar.getBoundingClientRect = () =>
      ({
        left: 0,
        width: 20,
        top: 0,
        height: 20,
        right: 20,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.click(thirdStar, { clientX: 5 });
    expect(onChange).toHaveBeenLastCalledWith(2.5);
    expect(slider).toHaveAttribute("aria-valuetext", "2.5 of 5 stars");
    expect(thirdStar).toHaveClass("sf-Rating__item--half");

    fireEvent.click(thirdStar, { clientX: 15 });
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it("does not react to keyboard when disabled or readOnly", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Rating value={2} readOnly onChange={onChange} />
    ));
    const slider = getByRole("slider");
    expect(slider).not.toHaveAttribute("tabindex");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables all stars and ignores clicks when disabled", () => {
    const onChange = vi.fn();
    const { container, getByRole, getAllByRole } = renderWithFluent(() => (
      <Rating value={2} disabled onChange={onChange} />
    ));
    const slider = getByRole("slider");
    expect(slider).toHaveAttribute("aria-disabled", "true");
    expect(slider).not.toHaveAttribute("tabindex");
    expect(container.querySelector(".sf-Rating")).toHaveClass("sf-Rating--disabled");
    const stars = getAllByRole("button") as HTMLButtonElement[];
    expect(stars.every((star) => star.disabled)).toBe(true);

    fireEvent.click(stars[4]!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps a controlled value fixed while reporting the clicked value", () => {
    const onChange = vi.fn();
    const { getByRole, getAllByRole } = renderWithFluent(() => (
      <Rating value={2} onChange={onChange} />
    ));
    const slider = getByRole("slider");
    fireEvent.click(getAllByRole("button")[4]!);
    expect(onChange).toHaveBeenCalledWith(5);
    expect(slider).toHaveAttribute("aria-valuenow", "2");
    expect(slider).toHaveAttribute("aria-valuetext", "2 of 5 stars");
    expect(getAllByRole("button")[4]).not.toHaveClass("sf-Rating__item--filled");
  });

  it("applies size, color and class variants to the root", () => {
    const { container } = renderWithFluent(() => (
      <Rating value={1} size="large" color="brand" class="my-rating" />
    ));
    expect(container.querySelector(".sf-Rating")).toHaveClass(
      "sf-Rating",
      "sf-Rating--large",
      "sf-Rating--brand",
      "my-rating",
    );
  });

  it("RatingDisplay renders a read-only rating plus its children", () => {
    const { container, getByRole, getByText } = renderWithFluent(() => (
      <RatingDisplay value={3} max={4} size="small">
        <span>summary</span>
      </RatingDisplay>
    ));
    expect(container.querySelector(".sf-RatingDisplay")).toBeInTheDocument();
    expect(getByText("summary")).toBeInTheDocument();
    const slider = getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "3");
    expect(slider).toHaveAttribute("aria-valuemax", "4");
    expect(slider).toHaveAttribute("aria-readonly", "true");
    expect(slider).not.toHaveAttribute("tabindex");
  });

  it("clamps keyboard values at the min and max boundaries", () => {
    const onChange = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <Rating defaultValue={0} onChange={onChange} />
    ));
    const slider = getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(0);
    fireEvent.keyDown(slider, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(5);
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(slider).toHaveAttribute("aria-valuenow", "5");
  });

  it("previews a hovered value without changing the committed value", () => {
    const { getByRole, getAllByRole } = renderWithFluent(() => (
      <Rating defaultValue={2} />
    ));
    const slider = getByRole("slider");
    const stars = getAllByRole("button");
    fireEvent.mouseEnter(stars[3]!);
    expect(stars[3]).toHaveClass("sf-Rating__item--filled");
    expect(slider).toHaveAttribute("aria-valuenow", "2");

    fireEvent.mouseLeave(slider);
    expect(stars[3]).not.toHaveClass("sf-Rating__item--filled");
  });

  it("RatingItem exposes half and disabled states", () => {
    const onSelect = vi.fn();
    const { getByRole } = renderWithFluent(() => (
      <RatingItem value={3} half disabled onSelect={onSelect} />
    ));
    const star = getByRole("button", { name: "3 star" });
    expect(star).toHaveClass("sf-Rating__item--half");
    expect(star).toBeDisabled();
    fireEvent.click(star);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
