import type { ImageDimensions } from "@/types/ImageDimensions";

export const calculateImageDisplay = (
  actualDimensions: ImageDimensions,
  containerDimensions: ImageDimensions,
  isZoomedIn: boolean
) => {
  const imageAspectRatio = actualDimensions.height / actualDimensions.width;

  const width = isZoomedIn
    ? containerDimensions.width
    : containerDimensions.height / imageAspectRatio;

  const height = isZoomedIn
    ? containerDimensions.width * imageAspectRatio
    : containerDimensions.height;

  const displayDimensions = {
    width,
    height,
  };

  return displayDimensions;
};
