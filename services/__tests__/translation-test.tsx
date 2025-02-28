import { getLocales } from "expo-localization";
import { StorageService } from "@/services/storage";
import i18n from "@/services/translation";

// Mock dependencies
jest.mock("expo-localization", () => ({
  getLocales: jest.fn(),
}));

jest.mock("@/services/storage", () => ({
  StorageService: {
    getUserLanguage: jest.fn(),
    saveUserLanguage: jest.fn(),
  },
}));

// Mock console.error to prevent noise in test output
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Translation Service", () => {
  describe("Language Detection", () => {
    test("uses saved language preference when available", async () => {
      (StorageService.getUserLanguage as jest.Mock).mockResolvedValueOnce("zh");
      
      // Trigger language detection by changing language
      await i18n.changeLanguage();
      
      expect(await i18n.language).toBe("zh");
      expect(StorageService.getUserLanguage).toHaveBeenCalled();
    });

    test("falls back to device language when no saved preference exists", async () => {
      (StorageService.getUserLanguage as jest.Mock).mockResolvedValueOnce(null);
      (getLocales as jest.Mock).mockReturnValueOnce([{ languageCode: "zh" }]);
      
      await i18n.changeLanguage();
      
      expect(await i18n.language).toBe("zh");
      expect(StorageService.saveUserLanguage).toHaveBeenCalledWith("zh");
    });

    test("uses English for unsupported device language", async () => {
      (StorageService.getUserLanguage as jest.Mock).mockResolvedValueOnce(null);
      (getLocales as jest.Mock).mockReturnValueOnce([{ languageCode: "fr" }]);
      
      await i18n.changeLanguage();
      
      expect(await i18n.language).toBe("en");
      expect(StorageService.saveUserLanguage).toHaveBeenCalledWith("en");
    });

    test("defaults to English when no device locale is available", async () => {
      (StorageService.getUserLanguage as jest.Mock).mockResolvedValueOnce(null);
      (getLocales as jest.Mock).mockReturnValueOnce([]);
      
      await i18n.changeLanguage();
      
      expect(await i18n.language).toBe("en");
      expect(StorageService.saveUserLanguage).toHaveBeenCalledWith("en");
    });

    test("defaults to English on storage error", async () => {
      (StorageService.getUserLanguage as jest.Mock).mockRejectedValueOnce(new Error("Storage error"));
      
      await i18n.changeLanguage();
      
      expect(await i18n.language).toBe("en");
    });
  });

  describe("Language Caching", () => {
    test("saves language preference when changed", async () => {
      await i18n.changeLanguage("zh");
      
      expect(StorageService.saveUserLanguage).toHaveBeenCalledWith("zh");
    });

    test("handles storage errors gracefully when saving language", async () => {
      (StorageService.saveUserLanguage as jest.Mock).mockRejectedValueOnce(new Error("Storage error"));
      
      // Should not throw error
      await expect(i18n.changeLanguage("zh")).resolves.not.toThrow();
    });
  });

  describe("Translation Resources", () => {
    test("has English translations loaded", () => {
      expect(i18n.hasResourceBundle("en", "translation")).toBe(true);
    });

    test("has Chinese translations loaded", () => {
      expect(i18n.hasResourceBundle("zh", "translation")).toBe(true);
    });

    test("uses English as fallback language", () => {
      expect(i18n.options.fallbackLng).toEqual(["en"]);
    });
  });
});