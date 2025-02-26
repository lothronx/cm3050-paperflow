import { Platform } from "react-native";

export const MARGINS = {
  top: Platform.OS === "ios" ? 64 : 24,
  horizontal: 18,
  bottom: Platform.OS === "ios" ? 32 : 24,
};
