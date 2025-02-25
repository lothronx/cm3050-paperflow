import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

export const useMediaLibrary = () => {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const saveToLibrary = async (images: string[]) => {
    // Only check permissions on Android
    if (Platform.OS === "android" && !status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        throw new Error("Permission denied");
      }
    }

    await Promise.all(images.map((uri) => MediaLibrary.saveToLibraryAsync(uri)));
  };

  return { saveToLibrary };
};