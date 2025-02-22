"use client";

import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

export const AnimatedTitle = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withSpring(1);
    translateY.value = withSpring(0);
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Paper</Text>
        <Text style={[styles.title, styles.titleHighlight]}>Flow</Text>
      </View>
      <Text style={styles.subtitle}>Split Long Image for Printing</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    fontStyle: "italic",
    color: COLORS.text,
    fontFamily: "Playfair",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3.84,
  },
  titleHighlight: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "400",
    color: COLORS.textSecondary,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3.84,
  },
});
