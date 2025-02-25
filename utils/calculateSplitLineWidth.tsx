import type { ImageDimensions } from "@/utils/calculateDisplayDimensions";

const calculateSplitLineWidth = (
  displayDimensions: ImageDimensions,
  containerDimensions: ImageDimensions
) => {
  const SPLIT_LINE_PADDING = 36;
  const width = Math.min(displayDimensions.width + SPLIT_LINE_PADDING, containerDimensions.width);
  const left = containerDimensions.width / 2 - width / 2;

  return { width, left };
};

export default calculateSplitLineWidth;