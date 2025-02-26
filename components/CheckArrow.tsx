import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";

type CheckArrowProps = {
  onClick: () => void;
};

export const CheckArrow = ({ onClick }: CheckArrowProps) => {
  return (
    <View style={styles.checkArrow}>
      <TouchableOpacity onPress={onClick} testID="check-arrow-button">
        <Ionicons name="checkmark" size={24} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
};

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
