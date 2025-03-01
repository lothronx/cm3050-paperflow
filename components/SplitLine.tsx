/**
 * SplitLine Component for the PaperFlow application
 *
 * This component renders a draggable line that:
 * - Indicates where a page will be split
 * - Allows users to adjust the split position through drag gestures
 * - Provides haptic feedback during interactions
 * - Shows line index and delete controls
 *
 * Features:
 * - Draggable line with visual feedback
 * - Delete button with warning haptics
 * - Line index display
 * - Gesture handling with haptic feedback
 */

// React and React Native imports
import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";

// Gesture handling and haptic feedback
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

// Icon library
import { MaterialIcons } from "@expo/vector-icons";

// Custom constants and components
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

/**
 * Props for the SplitLine component
 *
 * @param index - The index of the split line
 * @param positionDisplay - The display position of the split line
 * @param splitLineWidth - The width of the split line
 * @param onUpdatePosition - Callback function to update the split line position
 * @param onRemoveSplit - Callback function to remove the split line
 * @param onDragEnd - Callback function to handle drag end event
 */
interface SplitLineProps {
  index: number;
  positionDisplay: number;
  splitLineWidth: number;
  onUpdatePosition: (moveY: number) => void;
  onRemoveSplit: () => void;
  onDragEnd: () => void;
}

/**
 * SplitLine Component
 *
 * A draggable line component that represents a page split point.
 * Includes gesture handling, haptic feedback, and visual indicators.
 */
export const SplitLine = ({
  index,
  positionDisplay,
  splitLineWidth,
  onUpdatePosition,
  onRemoveSplit,
  onDragEnd,
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
    onDragEnd();
  };

  const handleRemoveSplit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onRemoveSplit();
  };

  return (
    // Wrap the entire component in a gesture handler for drag interactions
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onBegan={handleGestureBegin}
      onEnded={handleGestureEnd}
      onFailed={handleGestureEnd}
      onCancelled={handleGestureEnd}
      minDist={0} 
      activeOffsetY={[-5, 5]}>  
      <View
        testID="split-line-container"
        style={[
          styles.container,
          {
            top: positionDisplay,
            width: splitLineWidth,
            transform: [{ translateX: -splitLineWidth / 2 }], // Center the line horizontally
          },
        ]}>
        <Pressable
          testID="split-line-delete-button"
          onPress={handleRemoveSplit}
          style={({ pressed }) => [
            styles.iconContainer,
            styles.deleteIconContainer,
            pressed && styles.deleteIconContainerActive, // Visual feedback on press
          ]}>
          <MaterialIcons
            testID="split-line-delete-icon"
            name="delete"
            size={16}
            color={COLORS.background}
          />
        </Pressable>

        <View style={[styles.line, isDragging && styles.lineActive]} />

        <View
          style={[
            styles.iconContainer,
            styles.dragHandleIconContainer,
            isDragging && styles.dragHandleIconContainerActive, // Visual feedback while dragging
          ]}>
          <MaterialIcons
            testID="split-line-drag-icon"
            name="drag-indicator"
            size={16}
            color={COLORS.background}
          />
        </View>

        <View style={[styles.iconContainer, styles.indexContainer]}>
          <Text style={styles.index}>{index}</Text>
        </View>
      </View>
    </PanGestureHandler>
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
    fontFamily: "Montserrat-Medium",
    color: COLORS.textSecondary,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
  },
});
