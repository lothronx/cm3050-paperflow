import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

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

export const AnimatedTitle = () => {
  const { t } = useTranslation();
  const languageStyles = useLanguageStyles();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-100);

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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, languageStyles.title]}>{t("home.title1")}</Text>
        <Text style={[styles.title, styles.titleHighlight, languageStyles.title]}>
          {t("home.title2")}
        </Text>
      </View>
      <Text style={styles.subtitle}>{t("home.subTitle")}</Text>
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
    fontSize: 20,
    color: COLORS.textSecondary,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3.84,
  },
});
