/**
 * Back Arrow Component
 * 
 * Provides a navigation button to go back to the previous screen
 * Features:
 * - Chevron back icon
 * - Shadow effect for visibility
 * - Absolute positioning in top-left corner
 * - Handles navigation via expo-router
 */

// React Native core imports
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

// Icon library
import { Ionicons } from "@expo/vector-icons";

// Custom constants
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";

/**
 * Back Arrow Component
 * 
 * Displays a back button in the top-left corner of the screen
 */
export const BackArrow = () => {
  return (
    <View style={styles.backArrow}>
      <TouchableOpacity onPress={() => router.back()} testID="back-arrow-button">
        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

// Styles for component layout and appearance
const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: MARGINS.top,
    left: MARGINS.horizontal,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
