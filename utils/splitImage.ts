import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import type { ImageDimensions } from "@/types/ImageDimensions";

interface CropConfig {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

const filterPositions = (positions: number[], actualDimensions: ImageDimensions): number[] => {
  return [...positions]
    .filter((pos) => pos !== 0 && pos !== actualDimensions.height)
    .reduce((acc: number[], curr: number) => {
      if (acc.length === 0 || curr - acc[acc.length - 1] >= 10) {
        acc.push(curr);
      }
      return acc;
    }, []);
};

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

export const splitImage = async (
  imageUri: string,
  actualDimensions: ImageDimensions,
  positions: number[]
): Promise<string[]> => {
  try {
    const filteredPositions = filterPositions(positions, actualDimensions);
    const images: string[] = [];

    let startY = 0;
    for (const position of filteredPositions) {
      const cropConfig: CropConfig = {
        originX: 0,
        originY: startY,
        width: actualDimensions.width,
        height: position - startY,
      };

      const croppedImage = await cropImage(imageUri, cropConfig);
      images.push(croppedImage);
      startY = position;
    }

    // Handle the last segment
    if (startY < actualDimensions.height) {
      const cropConfig: CropConfig = {
        originX: 0,
        originY: startY,
        width: actualDimensions.width,
        height: actualDimensions.height - startY,
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
