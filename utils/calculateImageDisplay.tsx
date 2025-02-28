import type { ImageDimensions } from "@/types/ImageDimensions";
import { PixelRatio } from "react-native";

/**
 * Calculates the display dimensions for an image within a container while handling zoom states
 * and device pixel ratios.
 * 
 * @param actualDimensions - The actual width and height of the source image
 * @param containerDimensions - The width and height of the container where the image will be displayed
 * @param isZoomedIn - Boolean flag indicating if the image is in zoomed-in state
 * @returns {ImageDimensions} The calculated display dimensions adjusted for the device's pixel ratio
 * 
 * The function handles two display modes:
 * - Normal (zoomed out): Image fits within container height while maintaining aspect ratio
 * - Zoomed in: Image fills container width while maintaining aspect ratio
 */
export const calculateImageDisplay = (
  actualDimensions: ImageDimensions,
  containerDimensions: ImageDimensions,
  isZoomedIn: boolean
): ImageDimensions => {
  // Calculate the aspect ratio of the original image
  const imageAspectRatio = actualDimensions.height / actualDimensions.width;
  
  // Get the device's pixel ratio for high DPI display adjustments
  const scale = PixelRatio.get();

  // Scale up container dimensions to account for high DPI displays
  const scaledContainerWidth = containerDimensions.width * scale;
  const scaledContainerHeight = containerDimensions.height * scale;

  // Calculate dimensions based on zoom state:
  // - When zoomed in: Width fills container, height adjusts to maintain aspect ratio
  // - When zoomed out: Height fills container, width adjusts to maintain aspect ratio
  const width = isZoomedIn ? scaledContainerWidth : scaledContainerHeight / imageAspectRatio;
  const height = isZoomedIn ? scaledContainerWidth * imageAspectRatio : scaledContainerHeight;

  // Scale dimensions back down to logical pixels for display
  const displayDimensions = {
    width: width / scale,
    height: height / scale,
  };

  return displayDimensions;
};
