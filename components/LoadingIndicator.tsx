/**
 * Loading Indicator Component for the PaperFlow application
 *
 * Displays a full-screen loading spinner with a semi-transparent overlay
 * Used during asynchronous operations to indicate loading state
 */

// React Native core imports
import { View, ActivityIndicator, StyleSheet } from "react-native";

// App constants
import { COLORS } from "@/constants/Colors";

/**
 * Loading Indicator Component
 *
 * @returns A full-screen loading spinner with overlay
 */
export function LoadingIndicator() {
  return (
    <View style={styles.loadingContainer} testID="loading-container">
      <ActivityIndicator size="large" color={COLORS.primary} testID="loading-indicator" />
    </View>
  );
}

// Styles for the loading indicator container
const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
});
