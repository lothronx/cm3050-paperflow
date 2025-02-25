import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import en from "@/translations/en";
import zh from "@/translations/zh";

class LanguageDetector {
  type = "languageDetector" as const;
  async = true;

  async detect(callback: (lng: string) => void) {
    try {
      // First try to get user's saved language preference
      const savedLanguage = await AsyncStorage.getItem("user-language");
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // If no saved preference, use device language
      const deviceLocale = getLocales()[0];
      const languageCode = deviceLocale?.languageCode || "en";

      // Check if we support this language, if not fallback to English
      const supportedLanguages = ["en", "zh"];
      const finalLanguage = supportedLanguages.includes(languageCode) ? languageCode : "en";

      // Save the detected language
      await AsyncStorage.setItem("user-language", finalLanguage);
      callback(finalLanguage);
    } catch {
      callback("en");
    }
  }

  init() {}

  async cacheUserLanguage(lng: string) {
    try {
      await AsyncStorage.setItem("user-language", lng);
    } catch {}
  }
}

i18n
  .use(new LanguageDetector())
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
