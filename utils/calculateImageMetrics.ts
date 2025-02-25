import type { ImageDimensions } from "@/types/ImageDimensions";
import { calculateImageDisplay } from "@/utils/calculateImageDisplay";

interface calculateImageMetricsProps {
  actualDimensions: ImageDimensions;
  containerDimensions: ImageDimensions;
  isZoomedIn: boolean;
}

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

  const splitLineWidth = Math.min(Math.max(displayDimensions.width, 88), containerDimensions.width);

  const scaleFactor = displayDimensions.height / actualDimensions.height;

  return {
    displayDimensions,
    splitLineWidth,
    scaleFactor,
  };
}
