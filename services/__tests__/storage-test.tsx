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

      // Mock console.error to prevent error output in tests
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const settings = await StorageService.getSettings();

      expect(settings).toEqual({
        pageSize: null,
        autoSplit: null,
      });

      expect(consoleSpy).toHaveBeenCalledWith("Error loading saved values:", expect.any(Error));

      consoleSpy.mockRestore();
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

      // Mock console.error to prevent error output in tests
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await StorageService.savePageSize("A4");

      expect(consoleSpy).toHaveBeenCalledWith("Error saving page size:", expect.any(Error));

      consoleSpy.mockRestore();
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

      // Mock console.error to prevent error output in tests
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await StorageService.saveAutoSplit(true);

      expect(consoleSpy).toHaveBeenCalledWith("Error saving autoSplit setting:", expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
