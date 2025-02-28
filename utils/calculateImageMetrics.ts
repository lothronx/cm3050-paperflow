import type { ImageDimensions } from "@/types/ImageDimensions";
import { calculateImageDisplay } from "@/utils/calculateImageDisplay";

/**
 * Interface defining the required properties for calculating image metrics
 * @property {ImageDimensions} actualDimensions - The actual width and height of the source image
 * @property {ImageDimensions} containerDimensions - The width and height of the container where the image will be displayed
 * @property {boolean} isZoomedIn - Flag indicating if the image is in zoomed-in state
 */
interface calculateImageMetricsProps {
  actualDimensions: ImageDimensions;
  containerDimensions: ImageDimensions;
  isZoomedIn: boolean;
}

/**
 * Calculates various metrics needed for image display and manipulation
 * 
 * @param props - Object containing the required dimensions and zoom state
 * @returns An object containing:
 *   - displayDimensions: The calculated dimensions for displaying the image
 *   - splitLineWidth: The optimal width for split lines, constrained between 88px and container width
 *   - scaleFactor: The ratio between display height and actual image height
 */
export function calculateImageMetrics({
  actualDimensions,
  containerDimensions,
  isZoomedIn,
}: calculateImageMetricsProps) {
  const displayDimensions = calculateImageDisplay(
    actualDimensions,
    containerDimensions,
    isZoomedIn
  );

  // Calculate the width for split lines:
  // - Minimum width of 88 pixels for usability
  // - Maximum width constrained by container
  const splitLineWidth = Math.min(Math.max(displayDimensions.width, 88), containerDimensions.width);

  // Calculate the scale factor between displayed and actual image size
  const scaleFactor = displayDimensions.height / actualDimensions.height;

  return {
    displayDimensions,
    splitLineWidth,
    scaleFactor,
  };
}
