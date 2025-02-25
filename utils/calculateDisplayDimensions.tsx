export type ImageDimensions = {
  width: number;
  height: number;
};

const calculateDisplayDimensions = (
  actualDimensions: ImageDimensions,
  containerDimensions: ImageDimensions,
  isZoomedIn: boolean
) => {
  const imageAspectRatio = actualDimensions.height / actualDimensions.width;

  const displayDimensions = {
    width: isZoomedIn ? containerDimensions.width : containerDimensions.height / imageAspectRatio,
    height: isZoomedIn ? containerDimensions.width * imageAspectRatio : containerDimensions.height,
  };

  return displayDimensions;
};

export default calculateDisplayDimensions;
