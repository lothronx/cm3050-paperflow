import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "@/services/translation";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock expo-localization
jest.mock("expo-localization", () => ({
  getLocales: jest.fn(),
}));

describe("LanguageDetector", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
    (getLocales as jest.Mock).mockReset();
  });

  describe("detect", () => {
    test("uses saved language preference if available", async () => {
      // Mock saved language
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("zh");

      const callback = jest.fn();
      await i18n.services.languageDetector.detect(callback);

      expect(callback).toHaveBeenCalledWith("zh");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("user-language");
    });

    test("uses device language if no saved preference and language is supported", async () => {
      // Mock no saved language
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      // Mock device locale
      (getLocales as jest.Mock).mockReturnValueOnce([{ languageCode: "zh" }]);

      const callback = jest.fn();
      await i18n.services.languageDetector.detect(callback);

      expect(callback).toHaveBeenCalledWith("zh");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("user-language", "zh");
    });

    test("falls back to English for unsupported device language", async () => {
      // Mock no saved language
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      // Mock unsupported device locale
      (getLocales as jest.Mock).mockReturnValueOnce([{ languageCode: "fr" }]);

      const callback = jest.fn();
      await i18n.services.languageDetector.detect(callback);

      expect(callback).toHaveBeenCalledWith("en");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("user-language", "en");
    });

    test("falls back to English when no device locale is available", async () => {
      // Mock no saved language
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      // Mock no device locale
      (getLocales as jest.Mock).mockReturnValueOnce([]);

      const callback = jest.fn();
      await i18n.services.languageDetector.detect(callback);

      expect(callback).toHaveBeenCalledWith("en");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("user-language", "en");
    });

    test("falls back to English on AsyncStorage error", async () => {
      // Mock AsyncStorage error
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error("Storage error"));

      const callback = jest.fn();
      await i18n.services.languageDetector.detect(callback);

      expect(callback).toHaveBeenCalledWith("en");
    });
  });

  describe("cacheUserLanguage", () => {
    test("saves language preference successfully", async () => {
      await i18n.services.languageDetector.cacheUserLanguage("zh");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("user-language", "zh");
    });

    test("silently handles AsyncStorage errors", async () => {
      // Mock AsyncStorage error
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("Storage error"));

      // Should not throw error
      await expect(i18n.services.languageDetector.cacheUserLanguage("zh")).resolves.not.toThrow();
    });
  });

  describe("i18n configuration", () => {
    test("has correct initial configuration", () => {
      expect(i18n.options.fallbackLng).toEqual(["en"]);
      expect(i18n.options.interpolation?.escapeValue).toBe(false);
    });

    test("has all required language resources", () => {
      expect(i18n.options.resources).toHaveProperty("en.translation");
      expect(i18n.options.resources).toHaveProperty("zh.translation");
    });

    test("can change language", async () => {
      await i18n.changeLanguage("zh");
      expect(i18n.language).toBe("zh");

      await i18n.changeLanguage("en");
      expect(i18n.language).toBe("en");
    });
  });
});
