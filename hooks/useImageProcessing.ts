import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { splitImage } from "@/utils/splitImage";
import type { ImageDimensions } from "@/types/ImageDimensions";
import type { PageSize } from "@/types/PageSize";

/**
 * Props interface for the useImageProcessing hook
 * @interface ImageProcessingProps
 * @property {string} imageUri - URI of the image to be processed
 * @property {ImageDimensions} actualDimensions - Actual width and height of the image
 * @property {number[]} splitPositions - Array of positions where the image should be split
 * @property {PageSize} pageSize - Target page size for the split images
 */
interface ImageProcessingProps {
  imageUri: string;
  actualDimensions: ImageDimensions;
  splitPositions: number[];
  pageSize: PageSize;
}

/**
 * Custom React hook for handling image processing operations,
 * specifically for splitting images and navigating to preview.
 * @returns Object containing:
 *  -  isProcessing: Indicates if image processing is in progress
 *  -  handlePreview: Function to process image and navigate to preview
 */
export function useImageProcessing({
  imageUri,
  actualDimensions,
  splitPositions,
  pageSize,
}: ImageProcessingProps) {
  // State to track the processing status
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles the image preview process:
   * 1. Splits the image based on provided positions
   * 2. Navigates to preview screen with processed images
   * @async
   * @throws Will show an alert if image splitting fails
   */
  const handlePreview = async () => {
    try {
      setIsProcessing(true);
      // Split the image into multiple parts based on split positions
      const splitImages = await splitImage(imageUri, actualDimensions, splitPositions);

      // Navigate to preview screen with processed images and page size
      router.push({
        pathname: "/preview",
        params: {
          images: JSON.stringify(splitImages),
          pageSize: pageSize,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to split image");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handlePreview,
  };
}
