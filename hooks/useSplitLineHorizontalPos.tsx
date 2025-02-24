import type { ImageDimensions } from "@/hooks/useImageDimensions";

// Custom hook for managing split line horizontal position
export const useSplitLineHorizontalPos = (
  displayDimensions: ImageDimensions,
  containerDimensions: ImageDimensions
) => {
  const SPLIT_LINE_PADDING = 36;
  const width = Math.min(displayDimensions.width + SPLIT_LINE_PADDING, containerDimensions.width);
  const left = containerDimensions.width / 2 - width / 2;

  return { width, left };
};
