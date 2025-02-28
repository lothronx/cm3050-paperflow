/**
 * Translation service configuration for the PaperFlow application.
 * This module sets up i18next for internationalization, implements a custom language detector,
 * and manages language preferences using device settings and local storage.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import { StorageService } from "@/services/storage";
import en from "@/translations/en";
import zh from "@/translations/zh";

/**
 * Custom language detector class that implements i18next's language detection interface.
 * Handles language detection logic by:
 * 1. Checking for user's saved language preference
 * 2. Falling back to device language if no preference is saved
 * 3. Defaulting to English if neither option is available
 */
class LanguageDetector {
  /** Identifies this as a language detector plugin for i18next */
  type = "languageDetector" as const;
  /** Indicates that detection methods are asynchronous */
  async = true;

  /**
   * Detects the user's preferred language using a prioritized strategy
   * @param callback - Function to call with the detected language code
   */
  async detect(callback: (lng: string) => void) {
    try {
      // First try to get user's saved language preference
      const savedLanguage = await StorageService.getUserLanguage();
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

      // Save the detected language for future use
      await StorageService.saveUserLanguage(finalLanguage);
      callback(finalLanguage);
    } catch {
      // Default to English in case of any errors
      callback("en");
    }
  }

  /** Required by i18next language detector interface */
  init() {}

  /**
   * Persists the user's language preference to storage
   * @param lng - Language code to save
   */
  async cacheUserLanguage(lng: string) {
    try {
      await StorageService.saveUserLanguage(lng);
    } catch {}
  }
}

// Initialize i18next with our custom language detector and translations
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
