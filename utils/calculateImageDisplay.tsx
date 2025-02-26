import type { ImageDimensions } from "@/types/ImageDimensions";
import { PixelRatio } from "react-native";

export const calculateImageDisplay = (
  actualDimensions: ImageDimensions,
  containerDimensions: ImageDimensions,
  isZoomedIn: boolean
) => {
  const imageAspectRatio = actualDimensions.height / actualDimensions.width;
  const scale = PixelRatio.get();

  // Scale dimensions up for high DPI displays
  const scaledContainerWidth = containerDimensions.width * scale;
  const scaledContainerHeight = containerDimensions.height * scale;

  const width = isZoomedIn ? scaledContainerWidth : scaledContainerHeight / imageAspectRatio;

  const height = isZoomedIn ? scaledContainerWidth * imageAspectRatio : scaledContainerHeight;

  // Scale back down for display
  const displayDimensions = {
    width: width / scale,
    height: height / scale,
  };

  return displayDimensions;
};
