export type ImageDimensions = {
  width: number;
  height: number;
};
// Custom hook for managing image dimensions
export const useImageDimensions = (
  actualDimensions: ImageDimensions,
  containerDimensions: ImageDimensions,
  isZoomedIn: boolean
) => {
  const imageAspectRatio = actualDimensions.height / actualDimensions.width;

  const displayDimensions = {
    width: isZoomedIn ? containerDimensions.width : containerDimensions.height / imageAspectRatio,
    height: isZoomedIn ? containerDimensions.width * imageAspectRatio : containerDimensions.height,
  };

  const scaleFactor = displayDimensions.height / actualDimensions.height;

  return { displayDimensions, scaleFactor };
};
