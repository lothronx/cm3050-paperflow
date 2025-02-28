/**
 * Animated Title Component
 * 
 * Displays the application title with:
 * - Language-specific styling (Chinese vs English)
 * - Spring animations for entrance
 * - Two-part title with highlighted section
 * - Subtitle text
 * 
 * Uses React Native Reanimated for smooth animations
 */

// React and React Native core imports
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

// Animation library
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// Internationalization
import { useTranslation } from "react-i18next";

// Custom constants and components
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

/**
 * Hook for language-specific styles
 * 
 * Returns different font sizes and families based on current language
 */
const useLanguageStyles = () => {
  const { i18n } = useTranslation();

  const isChinese = i18n.language === "zh";

  return StyleSheet.create({
    title: {
      fontSize: isChinese ? 62 : 48,
      fontFamily: isChinese ? "PangMenZhengDao" : "PlayfairDisplay-BlackItalic",
    },
  });
};

/**
 * Animated Title Component
 * 
 * Displays the application title with entrance animations
 */
export const AnimatedTitle = () => {
  const { t } = useTranslation();
  const languageStyles = useLanguageStyles();

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-100);

  // Start animations on mount
  useEffect(() => {
    opacity.value = withSpring(1, {
      damping: 15,
      stiffness: 90,
    });
    translateY.value = withSpring(0, {
      damping: 8,
      stiffness: 100,
      mass: 1,
      velocity: 20,
    });
  }, [opacity, translateY]);

  // Animated style combining opacity and translation
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Title container with two parts */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, languageStyles.title]}>{t("home.title1")}</Text>
        <Text style={[styles.title, styles.titleHighlight, languageStyles.title]}>
          {t("home.title2")}
        </Text>
      </View>
      {/* Subtitle text */}
      <Text style={styles.subtitle}>{t("home.subTitle")}</Text>
    </Animated.View>
  );
};

// Styles for component layout and appearance
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
    color: COLORS.text,
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
    fontSize: 18,
    color: COLORS.textSecondary,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3.84,
  },
});
