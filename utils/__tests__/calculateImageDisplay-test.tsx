import { calculateImageDisplay } from "@/utils/calculateImageDisplay";
import type { ImageDimensions } from "@/types/ImageDimensions";

describe("calculateImageDisplay", () => {
  // Test case 1: Image not zoomed in
  test("calculates correct dimensions for zoomed-out image", () => {
    const actualDimensions: ImageDimensions = {
      width: 1200,
      height: 4200,
    };
    const containerDimensions: ImageDimensions = {
      width: 500,
      height: 700,
    };
    const isZoomedIn = false;

    const result = calculateImageDisplay(actualDimensions, containerDimensions, isZoomedIn);

    expect(result.width).toBe(200);
    expect(result.height).toBe(700);
  });

  // Test case 2: Image zoomed in
  test("calculates correct dimensions for zoomed-in image", () => {
    const actualDimensions: ImageDimensions = {
      width: 1000,
      height: 4200,
    };
    const containerDimensions: ImageDimensions = {
      width: 500,
      height: 700,
    };
    const isZoomedIn = true;

    const result = calculateImageDisplay(actualDimensions, containerDimensions, isZoomedIn);

    expect(result.width).toBe(500);
    expect(result.height).toBe(2100);
  });
});
