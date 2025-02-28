/**
 * Check Arrow Component
 * 
 * Provides a confirmation button to proceed to the next step
 * Features:
 * - Checkmark icon
 * - Primary color background
 * - Shadow effect for visibility
 * - Absolute positioning in top-right corner
 */

// React Native core imports
import { StyleSheet, View, TouchableOpacity } from "react-native";

// Icon library
import { Ionicons } from "@expo/vector-icons";

// Custom constants
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";

/**
 * Props for CheckArrow component
 * 
 * @property onClick - Callback function when the check arrow is pressed
 */
type CheckArrowProps = {
  onClick: () => void;
};

/**
 * Check Arrow Component
 * 
 * Displays a confirmation button in the top-right corner of the screen
 */
export const CheckArrow = ({ onClick }: CheckArrowProps) => {
  return (
    <View style={styles.checkArrow}>
      <TouchableOpacity onPress={onClick} testID="check-arrow-button">
        <Ionicons name="checkmark" size={24} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
};

// Styles for component layout and appearance
const styles = StyleSheet.create({
  checkArrow: {
    position: "absolute",
    top: MARGINS.top,
    right: MARGINS.horizontal,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
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
