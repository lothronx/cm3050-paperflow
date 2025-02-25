import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { splitImage } from "@/utils/splitImage";
import type { ImageDimensions } from "@/types/ImageDimensions";
import type { PageSize } from "@/types/PageSize";

interface ImageProcessingProps {
  imageUri: string;
  actualDimensions: ImageDimensions;
  splitPositions: number[];
  pageSize: PageSize;
}

export function useImageProcessing({
  imageUri,
  actualDimensions,
  splitPositions,
  pageSize,
}: ImageProcessingProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePreview = async () => {
    try {
      setIsProcessing(true);
      const splitImages = await splitImage(imageUri, actualDimensions, splitPositions);
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
