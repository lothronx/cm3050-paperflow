import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import i18n from "@/services/translation";

/**
 * RootLayout component
 * 
 * This component serves as the root layout for the application.
 * It handles font loading and provides the i18next translation context.
 * 
 * @returns {JSX.Element | null} The root layout component or null if fonts are not loaded
 */
export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    /**
     * Asynchronously loads custom fonts
     */
    async function loadFonts() {
      await Font.loadAsync({
        "PlayfairDisplay-BlackItalic": require("@/assets/fonts/PlayfairDisplay-BlackItalic.ttf"),
        "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Medium": require("@/assets/fonts/Montserrat-Medium.ttf"),
        "Montserrat-SemiBold": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
        PangMenZhengDao: require("@/assets/fonts/PangMenZhengDao.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Return null if fonts are not loaded yet
  if (!fontsLoaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {/* Stack navigator for managing screen navigation */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="split" />
        <Stack.Screen name="preview" />
      </Stack>
    </I18nextProvider>
  );
}
