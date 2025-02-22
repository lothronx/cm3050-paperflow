import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as Font from "expo-font";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Playfair: require("@/assets/fonts/PlayfairDisplay-BlackItalic.ttf"),
        Karla: require("@/assets/fonts/Karla-Regular.ttf"),
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
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="split" />
      <Stack.Screen name="preview" />
    </Stack>
  );
}
