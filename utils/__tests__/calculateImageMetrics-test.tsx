import { calculateImageMetrics } from "@/utils/calculateImageMetrics";
import type { ImageDimensions } from "@/types/ImageDimensions";

describe("calculateImageMetrics", () => {
  // Test case 1: Zoomed out state
  test("calculates correct metrics for zoomed-out image", () => {
    const actualDimensions: ImageDimensions = {
      width: 1200,
      height: 4200,
    };
    const containerDimensions: ImageDimensions = {
      width: 500,
      height: 700,
    };
    const isZoomedIn = false;

    const result = calculateImageMetrics({
      actualDimensions,
      containerDimensions,
      isZoomedIn,
    });

    // Check displayDimensions
    expect(result.displayDimensions.width).toBe(200);
    expect(result.displayDimensions.height).toBe(700);

    // Check splitLineWidth (should be display width since it's > 88 and <= container width)
    expect(result.splitLineWidth).toBe(200);

    // Check scaleFactor (display height / actual height)
    expect(result.scaleFactor).toBe(1 / 6);
  });

  // Test case 2: Zoomed in state
  test("calculates correct metrics for zoomed-in image", () => {
    const actualDimensions: ImageDimensions = {
      width: 1000,
      height: 4200,
    };
    const containerDimensions: ImageDimensions = {
      width: 500,
      height: 700,
    };
    const isZoomedIn = true;

    const result = calculateImageMetrics({
      actualDimensions,
      containerDimensions,
      isZoomedIn,
    });

    // Check displayDimensions
    expect(result.displayDimensions.width).toBe(500);
    expect(result.displayDimensions.height).toBe(2100);

    // Check splitLineWidth (should be container width since display width > container width)
    expect(result.splitLineWidth).toBe(500);

    // Check scaleFactor
    expect(result.scaleFactor).toBe(0.5);
  });

  // Test case 3: Image dimensions with very small display width
  test("calculates correct metrics when display width is less than minimum", () => {
    const actualDimensions: ImageDimensions = {
      width: 1200,
      height: 10000,
    };
    const containerDimensions: ImageDimensions = {
      width: 500,
      height: 700,
    };
    const isZoomedIn = false;

    const result = calculateImageMetrics({
      actualDimensions,
      containerDimensions,
      isZoomedIn,
    });

    // Check splitLineWidth (should be 88 since display width would be less than minimum)
    expect(result.splitLineWidth).toBe(88);
  });
});
