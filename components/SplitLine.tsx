import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface SplitLineProps {
  index: number;
  positionDisplay: number;
  splitLineWidth: number;
  onUpdatePosition: (moveY: number) => void;
  onRemoveSplit: () => void;
}

export const SplitLine = ({
  index,
  positionDisplay,
  splitLineWidth,
  onUpdatePosition,
  onRemoveSplit,
}: SplitLineProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    onUpdatePosition(event.nativeEvent.absoluteY);
  };

  const handleGestureBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsDragging(true);
  };

  const handleGestureEnd = () => {
    setIsDragging(false);
  };

  const handleRemoveSplit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onRemoveSplit();
  };

  return (
    <View
      style={[
        styles.container,
        {
          top: positionDisplay,
          width: splitLineWidth,
          transform: [{ translateX: -splitLineWidth / 2 }],
        },
      ]}>
      <Pressable
        onPress={handleRemoveSplit}
        style={({ pressed }) => [
          styles.iconContainer,
          styles.deleteIconContainer,
          pressed && styles.deleteIconContainerActive,
        ]}>
        <MaterialIcons name="delete" size={16} color={COLORS.background} />
      </Pressable>
      <View style={[styles.line, isDragging && styles.lineActive]} />
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onBegan={handleGestureBegin}
        onEnded={handleGestureEnd}
        onFailed={handleGestureEnd}
        onCancelled={handleGestureEnd}
        minDist={0}
        activeOffsetY={[-5, 5]}>
        <View
          style={[
            styles.iconContainer,
            styles.dragHandleIconContainer,
            isDragging && styles.dragHandleIconContainerActive,
          ]}>
          <MaterialIcons name="drag-indicator" size={16} color={COLORS.background} />
        </View>
      </PanGestureHandler>
      <View style={[styles.iconContainer, styles.indexContainer]}>
        <Text style={styles.index}>{index}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 1,
    left: "50%",
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
  indexContainer: {
    width: 36,
    height: 16,
    left: "50%",
    transform: [{ translateY: -8 }, { translateX: -18 }],
    backgroundColor: COLORS.background,
  },
  index: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
  },
});
