import { useState } from "react";
import type { ImageDimensions } from "@/types/ImageDimensions";

/**
 * Props interface for the useSplitManagement hook
 * @interface SplitManagementProps
 * @property {ImageDimensions} actualDimensions - Actual dimensions of the image
 * @property {ImageDimensions} pageDimensions - Target page dimensions for splitting
 * @property {ImageDimensions} containerDimensions - Dimensions of the container displaying the image
 * @property {number} topSpacing - Spacing from the top of the container
 * @property {number} currentScrollPosition - Current scroll position in the container
 * @property {number} scaleFactor - Scale factor between display and actual image size
 */
interface SplitManagementProps {
  actualDimensions: ImageDimensions;
  pageDimensions: ImageDimensions;
  containerDimensions: ImageDimensions;
  topSpacing: number;
  currentScrollPosition: number;
  scaleFactor: number;
}

/**
 * Custom React hook for managing image splitting operations,
 * including adding, updating, removing splits and auto-splitting based on page dimensions.
 * @returns Object containing:
 * - splitPositions: Array of split positions
 * - addSplit: Adds a new split at the current scroll position
 * - updateSplit: Updates the position of an existing split
 * - removeSplit: Removes a split at the specified index
 * - removeAllSplits: Removes all splits
 * - autoSplit: Automatically creates splits based on page aspect ratio
 * - handleDragEnd: Handles the end of a drag operation by sorting split positions
 */
export function useSplitManagement({
  actualDimensions,
  pageDimensions,
  containerDimensions,
  topSpacing,
  currentScrollPosition,
  scaleFactor,
}: SplitManagementProps) {
  const [splitPositions, setSplitPositions] = useState<number[]>([]);

  /**
   * Sorts the split positions in ascending order
   * @param {number[]} positions - Array of split positions
   * @returns {number[]} Sorted array of split positions
   */
  const sortPositions = (positions: number[]) => {
    return [...positions].sort((a, b) => a - b);
  };

  /**
   * Clamps a position value between 0 and the image height
   * @param {number} position - Position to clamp
   * @returns {number} Clamped position value
   */
  const clampPosition = (position: number) => {
    return Math.min(Math.max(0, position), actualDimensions.height);
  };

  /**
   * Adds a new split at the middle of the visible area
   */
  const addSplit = () => {
    const visibleHeight = containerDimensions.height;
    const positionOnImageDisplay = currentScrollPosition + visibleHeight / 2;
    const positionOnActualImage = positionOnImageDisplay / scaleFactor;

    setSplitPositions((prevPositions) =>
      sortPositions([...prevPositions, clampPosition(positionOnActualImage)])
    );
  };

  /**
   * Updates the position of an existing split
   * @param {number} index - Index of the split to update
   * @param {number} pointerY - New Y position of the pointer
   */
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

  /**
   * Handles the end of a drag operation by sorting split positions
   */
  const handleDragEnd = () => {
    setSplitPositions((positions) => sortPositions([...positions]));
  };

  /**
   * Removes a split at the specified index
   * @param {number} index - Index of the split to remove
   */
  const removeSplit = (index: number) => {
    setSplitPositions((prevPositions) =>
      sortPositions(prevPositions.filter((_, i) => i !== index))
    );
  };

  /**
   * Removes all splits
   */
  const removeAllSplits = () => {
    setSplitPositions([]);
  };

  /**
   * Automatically creates splits based on page aspect ratio
   * Calculates optimal number of splits based on image and page dimensions
   */
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
    handleDragEnd,
  };
}
