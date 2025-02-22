import { StyleSheet, View, PanResponder } from "react-native";
import { COLORS } from "@/constants/Colors";
import { useRef, useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface SplitLineProps {
  position: number;
  containerHeight: number;
  onUpdatePosition: (position: number) => void;
}

export const SplitLine = ({ position, containerHeight, onUpdatePosition }: SplitLineProps) => {
  const translateY = useSharedValue(position * containerHeight);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current) {
      translateY.value = withSpring(position * containerHeight);
    }
  }, [position, containerHeight, translateY]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      isDragging.current = true;
    },
    onPanResponderMove: (_, gestureState) => {
      const newPosition = translateY.value + gestureState.dy;
      if (newPosition >= 0 && newPosition <= containerHeight) {
        translateY.value = newPosition;
        onUpdatePosition(newPosition / containerHeight);
      }
    },
    onPanResponderRelease: () => {
      isDragging.current = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]} {...panResponder.panHandlers}>
      <View style={styles.line} />
      <View style={[styles.handle, styles.handleLeft]} />
      <View style={[styles.handle, styles.handleRight]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 20,
    justifyContent: "center",
    zIndex: 1000,
  },
  line: {
    height: 2,
    backgroundColor: COLORS.border,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  handle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    top: -9,
  },
  handleLeft: {
    left: -10,
    borderColor: COLORS.secondary,
  },
  handleRight: {
    right: -10,
    borderColor: COLORS.primary,
  },
});
