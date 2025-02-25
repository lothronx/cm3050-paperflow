import { useState } from "react";
import type { ImageDimensions } from "@/types/ImageDimensions";

interface SplitManagementProps {
  actualDimensions: ImageDimensions;
  pageDimensions: ImageDimensions;
  containerDimensions: ImageDimensions;
  topSpacing: number;
  currentScrollPosition: number;
  scaleFactor: number;
}

export function useSplitManagement({
  actualDimensions,
  pageDimensions,
  containerDimensions,
  topSpacing,
  currentScrollPosition,
  scaleFactor,
}: SplitManagementProps) {
  const [splitPositions, setSplitPositions] = useState<number[]>([]);

  const addSplit = () => {
    const visibleHeight = containerDimensions.height;
    const positionOnImageDisplay = currentScrollPosition + visibleHeight / 2;
    const positionOnActualImage = positionOnImageDisplay / scaleFactor;

    setSplitPositions([
      ...splitPositions,
      Math.min(Math.max(0, positionOnActualImage), actualDimensions.height),
    ]);
  };

  const updateSplit = (index: number, pointerY: number) => {
    const newPositionOnViewport = Math.min(
      containerDimensions.height,
      Math.max(0, pointerY - topSpacing)
    );
    const newPositionOnImageDisplay = newPositionOnViewport + currentScrollPosition;
    const newPositionOnActualImage = newPositionOnImageDisplay / scaleFactor;

    const newSplitPositions = [...splitPositions];
    newSplitPositions[index] = Math.min(
      Math.max(0, newPositionOnActualImage),
      actualDimensions.height
    );
    setSplitPositions(newSplitPositions);
  };

  const removeSplit = (index: number) => {
    setSplitPositions(splitPositions.filter((_, i) => i !== index));
  };

  const removeAllSplits = () => {
    setSplitPositions([]);
  };

  const autoSplit = () => {
    const imageAspectRatio = actualDimensions.height / actualDimensions.width;
    const pageAspectRatio = pageDimensions.height / pageDimensions.width;
    const numSplits = Math.floor(imageAspectRatio / pageAspectRatio);

    if (numSplits > 0) {
      const newSplitPositions = Array.from(
        { length: numSplits },
        (_, i) => (i + 1) * actualDimensions.width * pageAspectRatio
      );
      setSplitPositions(newSplitPositions);
    }
  };

  return {
    splitPositions,
    addSplit,
    updateSplit,
    removeSplit,
    removeAllSplits,
    autoSplit,
  };
}
