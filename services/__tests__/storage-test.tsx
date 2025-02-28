import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageService } from "@/services/storage";
import type { PageSize } from "@/types/PageSize";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("StorageService", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Also clear any mock implementations
    (AsyncStorage.getItem as jest.Mock).mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
    // Silence console.error for tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks();
  });

  describe("getSettings", () => {
    test("returns settings when both values exist", async () => {
      // Mock AsyncStorage to return values
      (AsyncStorage.getItem as jest.Mock)
        .mockImplementationOnce(() => Promise.resolve("A4")) // PAGE_SIZE
        .mockImplementationOnce(() => Promise.resolve("true")); // AUTO_SPLIT

      const settings = await StorageService.getSettings();

      expect(settings).toEqual({
        pageSize: "A4",
        autoSplit: true,
      });

      // Verify AsyncStorage was called with correct keys
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@paperflow_page_size");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@paperflow_auto_split");
    });

    test("returns null values when settings don't exist", async () => {
      // Mock AsyncStorage to return null
      (AsyncStorage.getItem as jest.Mock)
        .mockImplementationOnce(() => Promise.resolve(null))
        .mockImplementationOnce(() => Promise.resolve(null));

      const settings = await StorageService.getSettings();

      expect(settings).toEqual({
        pageSize: null,
        autoSplit: null,
      });
    });

    test("handles false autoSplit value correctly", async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockImplementationOnce(() => Promise.resolve("Letter"))
        .mockImplementationOnce(() => Promise.resolve("false"));

      const settings = await StorageService.getSettings();

      expect(settings).toEqual({
        pageSize: "Letter",
        autoSplit: false,
      });
    });

    test("handles AsyncStorage errors", async () => {
      // Mock AsyncStorage to throw error
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error("Storage error"));

      const settings = await StorageService.getSettings();

      expect(settings).toEqual({
        pageSize: null,
        autoSplit: null,
      });
    });
  });

  describe("savePageSize", () => {
    test("saves page size successfully", async () => {
      const pageSize: PageSize = "A4";
      await StorageService.savePageSize(pageSize);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("@paperflow_page_size", pageSize);
    });

    test("handles AsyncStorage errors", async () => {
      // Mock AsyncStorage to throw error
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("Storage error"));

      await StorageService.savePageSize("A4");
    });
  });

  describe("saveAutoSplit", () => {
    test("saves true value successfully", async () => {
      await StorageService.saveAutoSplit(true);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("@paperflow_auto_split", "true");
    });

    test("saves false value successfully", async () => {
      await StorageService.saveAutoSplit(false);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("@paperflow_auto_split", "false");
    });

    test("handles AsyncStorage errors", async () => {
      // Mock AsyncStorage to throw error
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("Storage error"));

      await StorageService.saveAutoSplit(true);
    });
  });

  describe("getUserLanguage", () => {
    test("returns the saved language when it exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve("en")
      );

      const language = await StorageService.getUserLanguage();

      expect(language).toBe("en");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@paperflow_user_language");
    });

    test("returns null when no language is saved", async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      );

      const language = await StorageService.getUserLanguage();

      expect(language).toBeNull();
    });

    test("returns null and logs error when AsyncStorage fails", async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error("Storage error"))
      );

      const language = await StorageService.getUserLanguage();

      expect(language).toBeNull();
    });
  });

  describe("saveUserLanguage", () => {
    test("saves the language successfully", async () => {
      await StorageService.saveUserLanguage("fr");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@paperflow_user_language",
        "fr"
      );
    });

    test("logs error when AsyncStorage fails", async () => {
      (AsyncStorage.setItem as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error("Storage error"))
      );

      await StorageService.saveUserLanguage("es");
    });
  });
});
