import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

interface ZoomControlProps {
  isZoomedIn: boolean;
  onToggle: () => void;
}

export const ZoomControl = ({ isZoomedIn, onToggle }: ZoomControlProps) => (
  <Pressable onPress={onToggle} style={styles.zoomButton} testID="zoom-button">
    <MaterialIcons
      name={isZoomedIn ? "zoom-in-map" : "zoom-out-map"}
      size={18}
      color={COLORS.primary}
    />
  </Pressable>
);

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
