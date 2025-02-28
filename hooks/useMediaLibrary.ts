import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

/**
 * Custom hook for managing media library operations in the application.
 * Provides functionality to save images to the device's media library with proper permission handling.
 * Handles platform-specific permission requirements (Android vs iOS).
 * @returns Object containing:
 * - saveToLibrary: Function to save images to the device's media library
 */
export const useMediaLibrary = () => {
  // Get and manage media library permissions using Expo's MediaLibrary
  const [status, requestPermission] = MediaLibrary.usePermissions();

  /**
   * Saves multiple images to the device's media library
   * @param {string[]} images - Array of image URIs to save
   */
  const saveToLibrary = async (images: string[]) => {
    // Permission check is only required on Android
    // iOS handles "save to library" permissions through Info.plist
    if (Platform.OS === "android" && !status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        throw new Error("Permission denied");
      }
    }

    // Save all images concurrently using Promise.all
    await Promise.all(images.map((uri) => MediaLibrary.saveToLibraryAsync(uri)));
  };

  return { saveToLibrary };
};
