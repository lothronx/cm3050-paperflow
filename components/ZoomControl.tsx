/**
 * ZoomControl Component for the PaperFlow application
 *
 * This component provides a floating button that:
 * - Toggles between zoomed-in and zoomed-out states
 * - Shows appropriate zoom icons based on current state
 * - Provides visual feedback through Material Icons
 *
 * Features:
 * - Floating button with shadow effects
 * - Dynamic icon based on zoom state
 * - Centered positioning at the bottom of the screen
 * - Touch-friendly circular design
 */

// React Native and icon imports
import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Custom constants
import { COLORS } from "@/constants/Colors";

/**
 * Props for the ZoomControl component
 *
 * @param isZoomedIn - Current zoom state of the view
 * @param onToggle - Callback function to handle zoom state changes
 */
interface ZoomControlProps {
  isZoomedIn: boolean;
  onToggle: () => void;
}

/**
 * ZoomControl Component
 *
 * A floating button component that controls zoom state.
 * Renders a Material Icon that changes based on the current zoom state.
 */
export const ZoomControl = ({ isZoomedIn, onToggle }: ZoomControlProps) => (
  // Pressable container with shadow and positioning
  <Pressable onPress={onToggle} style={styles.zoomButton} testID="zoom-button">
    {/* Dynamic icon that changes based on zoom state */}
    <MaterialIcons
      name={isZoomedIn ? "zoom-in-map" : "zoom-out-map"}
      size={18}
      color={COLORS.primary}
    />
  </Pressable>
);

// Styles for the ZoomControl component
const styles = StyleSheet.create({
  zoomButton: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -17 }],
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    zIndex: 1,
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
