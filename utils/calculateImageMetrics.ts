import type { ImageDimensions } from "@/types/ImageDimensions";
import { calculateImageDisplay } from "@/utils/calculateImageDisplay";
import { calculateSplitLineDisplay } from "@/utils/calculateSplitLineDisplay";

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

  const splitLineDisplay = calculateSplitLineDisplay(displayDimensions, containerDimensions);

  const scaleFactor = displayDimensions.height / actualDimensions.height;

  return {
    displayDimensions,
    splitLineDisplay,
    scaleFactor,
  };
}
