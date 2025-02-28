/**
 * This module provides functionality for splitting images into multiple segments based on specified positions.
 * It uses expo-image-manipulator for image processing operations and includes utilities for filtering
 * and validating split positions.
 */

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import type { ImageDimensions } from "@/types/ImageDimensions";

/**
 * Configuration object for cropping operations.
 * Defines the origin point (top-left corner) and dimensions of the crop area.
 */
interface CropConfig {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

/**
 * Filters and validates split positions to ensure they are properly spaced and within image bounds.
 * @param positions - Array of Y-coordinates where the image should be split
 * @param actualDimensions - The actual dimensions of the image being processed
 * @returns Filtered array of valid split positions
 */
const filterPositions = (positions: number[], actualDimensions: ImageDimensions): number[] => {
  return [...positions]
    .filter((pos) => pos !== 0 && pos !== actualDimensions.height) // Remove edge positions
    .reduce((acc: number[], curr: number) => {
      // Ensure minimum gap of 10px between split positions
      if (acc.length === 0 || curr - acc[acc.length - 1] >= 10) {
        acc.push(curr);
      }
      return acc;
    }, []);
};

/**
 * Crops an image according to the specified configuration.
 * @param imageUri - URI of the source image to crop
 * @param cropConfig - Configuration specifying the crop area
 * @returns Promise resolving to the URI of the cropped image
 * @throws Error if cropping operation fails
 */
const cropImage = async (imageUri: string, cropConfig: CropConfig): Promise<string> => {
  try {
    const result = await manipulateAsync(imageUri, [{ crop: cropConfig }], {
      compress: 1,
      format: SaveFormat.JPEG,
    });
    return result.uri;
  } catch (error) {
    throw new Error(
      `Failed to crop image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

/**
 * Splits an image into multiple segments based on specified Y-coordinates.
 * @param imageUri - URI of the source image to split
 * @param actualDimensions - The actual dimensions of the image
 * @param positions - Array of Y-coordinates where the image should be split
 * @returns Promise resolving to an array of URIs for the split image segments
 * @throws Error if any splitting operation fails
 */
export const splitImage = async (
  imageUri: string,
  actualDimensions: ImageDimensions,
  positions: number[]
): Promise<string[]> => {
  try {
    // Filter and validate the split positions
    const filteredPositions = filterPositions(positions, actualDimensions);
    const images: string[] = [];

    // Track the starting Y-coordinate for each segment
    let startY = 0;

    // Process each split position to create image segments
    for (const position of filteredPositions) {
      // Configure the crop area from current startY to the split position
      const cropConfig: CropConfig = {
        originX: 0,
        originY: startY,
        width: actualDimensions.width,
        height: position - startY, // Height is the distance between start and split position
      };

      // Crop and store the image segment
      const croppedImage = await cropImage(imageUri, cropConfig);
      images.push(croppedImage);
      startY = position; // Update startY for the next segment
    }

    // Handle the final segment from the last split position to the bottom of the image
    if (startY < actualDimensions.height) {
      const cropConfig: CropConfig = {
        originX: 0,
        originY: startY,
        width: actualDimensions.width,
        height: actualDimensions.height - startY, // Remaining height to the bottom
      };

      const croppedImage = await cropImage(imageUri, cropConfig);
      images.push(croppedImage);
    }

    return images;
  } catch (error) {
    throw new Error(
      `Failed to split image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
