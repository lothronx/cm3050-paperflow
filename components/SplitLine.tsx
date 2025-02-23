import { StyleSheet, View, PanResponder, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
interface SplitLineProps {
  onUpdatePosition: () => void;
  onRemoveSplit: () => void;
}

export const SplitLine = ({ onUpdatePosition, onRemoveSplit }: SplitLineProps) => {
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: () => {},
    onPanResponderRelease: () => {},
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onRemoveSplit}>
        <View style={[styles.iconContainer, styles.deleteIconContainer]}>
          <MaterialIcons name="delete" size={16} color={COLORS.background} />
        </View>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity {...panResponder.panHandlers}>
        <View style={[styles.iconContainer, styles.dragHandleIconContainer]}>
          <MaterialIcons name="drag-indicator" size={16} color={COLORS.background} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    flexDirection: "row",
    zIndex: 1,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 12,
    backgroundColor: COLORS.border,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    shadowColor: COLORS.border,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,
  },
  iconContainer: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ translateY: -12 }],
  },
  deleteIconContainer: {
    backgroundColor: COLORS.secondary,
    left: -12,
  },
  dragHandleIconContainer: {
    backgroundColor: COLORS.primary,
    right: -12,
  },
});
