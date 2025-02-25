import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import i18n from "@/services/translation";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Playfair: require("@/assets/fonts/PlayfairDisplay-BlackItalic.ttf"),
        Montserrat: require("@/assets/fonts/Montserrat-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="split" />
        <Stack.Screen name="preview" />
      </Stack>
    </I18nextProvider>
  );
}
