import { useState } from "react";
import { StyleSheet, View, PanResponder, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";

interface SplitLineProps {
  position: number;
  containerHeight: number;
  onUpdatePosition: (position: number) => void;
  onRemoveSplit: () => void;
}

export const SplitLine = ({
  position,
  containerHeight,
  onUpdatePosition,
  onRemoveSplit,
}: SplitLineProps) => {
  const [lastPosition, setLastPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsDragging(true);
    },

    onPanResponderMove: (_, gestureState) => {
      const change = (gestureState.dy / containerHeight) * 100;
      const newPosition = Math.max(0, Math.min(100, lastPosition + change));
      onUpdatePosition(newPosition);
      setLastPosition(newPosition);
    },

    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });

  return (
    <View style={[styles.container, { top: position }]}>
      <Pressable
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onRemoveSplit();
        }}
        style={({ pressed }) => [
          styles.iconContainer,
          styles.deleteIconContainer,
          pressed && styles.deleteIconContainerActive,
        ]}>
        <MaterialIcons name="delete" size={16} color={COLORS.background} />
      </Pressable>
      <View style={[styles.line, isDragging && styles.lineActive]} />
      <View
        style={[
          styles.iconContainer,
          styles.dragHandleIconContainer,
          isDragging && styles.dragHandleIconContainerActive,
        ]}
        {...panResponder.panHandlers}>
        <MaterialIcons name="drag-indicator" size={16} color={COLORS.background} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    flexDirection: "row",
    zIndex: 1,
  },
  line: {
    flex: 1,
    height: 1,
    marginHorizontal: 24,
    backgroundColor: COLORS.border,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dotted",
    shadowColor: COLORS.border,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,
  },
  lineActive: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
  },
  iconContainer: {
    position: "absolute",
    transform: [{ translateY: -12 }],
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
  },
  deleteIconContainer: {
    backgroundColor: COLORS.secondary,
    left: 0,
  },
  deleteIconContainerActive: {
    backgroundColor: COLORS.secondaryActive,
  },
  dragHandleIconContainer: {
    backgroundColor: COLORS.primary,
    right: 0,
  },
  dragHandleIconContainerActive: {
    backgroundColor: COLORS.primaryActive,
  },
});
