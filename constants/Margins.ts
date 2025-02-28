import { Platform } from "react-native";

// iOS needs a bigger vertical margin because of its safe area display feature
export const MARGINS = {
  top: Platform.OS === "ios" ? 64 : 24,
  horizontal: 18,
  bottom: Platform.OS === "ios" ? 32 : 24,
};
