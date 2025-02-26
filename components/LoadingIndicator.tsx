import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "@/constants/Colors";

export function LoadingIndicator() {
  return (
    <View style={styles.loadingContainer} testID="loading-container">
      <ActivityIndicator size="large" color={COLORS.primary} testID="loading-indicator" />
    </View>
  );
}

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
