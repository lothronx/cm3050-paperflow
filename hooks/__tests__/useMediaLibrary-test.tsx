import { renderHook } from "@testing-library/react-native";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

// Mock expo-media-library
jest.mock("expo-media-library", () => ({
  usePermissions: jest.fn(),
  saveToLibraryAsync: jest.fn(),
}));

// Mock Platform
jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "android", // Default to android, we'll change this in tests
}));

describe("useMediaLibrary", () => {
  const mockSaveToLibraryAsync = MediaLibrary.saveToLibraryAsync as jest.Mock;
  const mockUsePermissions = MediaLibrary.usePermissions as jest.Mock;
  const mockRequestPermission = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    mockUsePermissions.mockReturnValue([{ granted: false }, mockRequestPermission]);
    mockRequestPermission.mockResolvedValue({ granted: true });
    mockSaveToLibraryAsync.mockResolvedValue(undefined);
  });

  describe("saveToLibrary", () => {
    test("requests permission on Android if not granted", async () => {
      // Ensure we're testing Android
      (Platform.OS as string) = "android";

      const { result } = renderHook(() => useMediaLibrary());
      const images = ["uri1", "uri2"];

      await result.current.saveToLibrary(images);

      expect(mockRequestPermission).toHaveBeenCalled();
      expect(mockSaveToLibraryAsync).toHaveBeenCalledTimes(2);
      expect(mockSaveToLibraryAsync).toHaveBeenCalledWith("uri1");
      expect(mockSaveToLibraryAsync).toHaveBeenCalledWith("uri2");
    });

    test("doesn't request permission on Android if already granted", async () => {
      // Ensure we're testing Android
      (Platform.OS as string) = "android";
      // Mock permissions as already granted
      mockUsePermissions.mockReturnValue([{ granted: true }, mockRequestPermission]);

      const { result } = renderHook(() => useMediaLibrary());
      const images = ["uri1"];

      await result.current.saveToLibrary(images);

      expect(mockRequestPermission).not.toHaveBeenCalled();
      expect(mockSaveToLibraryAsync).toHaveBeenCalledWith("uri1");
    });

    test("doesn't request permission on iOS", async () => {
      // Switch to iOS for this test
      (Platform.OS as string) = "ios";

      const { result } = renderHook(() => useMediaLibrary());
      const images = ["uri1", "uri2", "uri3"];

      await result.current.saveToLibrary(images);

      expect(mockRequestPermission).not.toHaveBeenCalled();
      expect(mockSaveToLibraryAsync).toHaveBeenCalledTimes(3);
      images.forEach((uri) => {
        expect(mockSaveToLibraryAsync).toHaveBeenCalledWith(uri);
      });
    });

    test("throws error if permission denied on Android", async () => {
      // Ensure we're testing Android
      (Platform.OS as string) = "android";
      // Mock permission request to be denied
      mockRequestPermission.mockResolvedValue({ granted: false });

      const { result } = renderHook(() => useMediaLibrary());
      const images = ["uri1"];

      await expect(result.current.saveToLibrary(images)).rejects.toThrow("Permission denied");
      expect(mockSaveToLibraryAsync).not.toHaveBeenCalled();
    });

    test("handles empty image array", async () => {
      const { result } = renderHook(() => useMediaLibrary());
      const images: string[] = [];

      await result.current.saveToLibrary(images);

      expect(mockSaveToLibraryAsync).not.toHaveBeenCalled();
    });

    test("handles saveToLibraryAsync failure", async () => {
      // Mock saveToLibraryAsync to fail
      mockSaveToLibraryAsync.mockRejectedValue(new Error("Save failed"));

      const { result } = renderHook(() => useMediaLibrary());
      const images = ["uri1"];

      await expect(result.current.saveToLibrary(images)).rejects.toThrow("Save failed");
    });
  });
});
