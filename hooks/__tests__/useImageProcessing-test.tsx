import { renderHook, act } from "@testing-library/react-native";
import { useImageProcessing } from "@/hooks/useImageProcessing";
import { splitImage } from "@/utils/splitImage";
import { router } from "expo-router";
import { Alert } from "react-native";

// Mock dependencies
jest.mock("@/utils/splitImage", () => ({
  splitImage: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("useImageProcessing", () => {
  const defaultProps = {
    imageUri: "test-image-uri",
    actualDimensions: { width: 1000, height: 2000 },
    splitPositions: [500, 1000, 1500],
    pageSize: "A4" as const,
  };

  const mockSplitImage = splitImage as jest.Mock;
  const mockRouterPush = router.push as jest.Mock;
  const mockAlert = Alert.alert as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default successful mock implementations
    mockSplitImage.mockResolvedValue(["split1.jpg", "split2.jpg", "split3.jpg"]);
  });

  test("initializes with isProcessing as false", () => {
    const { result } = renderHook(() => useImageProcessing(defaultProps));
    expect(result.current.isProcessing).toBe(false);
  });

  describe("handlePreview", () => {
    test("processes image and navigates to preview on success", async () => {
      const { result } = renderHook(() => useImageProcessing(defaultProps));

      await act(async () => {
        await result.current.handlePreview();
      });

      // Check that splitImage was called with correct params
      expect(mockSplitImage).toHaveBeenCalledWith(
        defaultProps.imageUri,
        defaultProps.actualDimensions,
        defaultProps.splitPositions
      );

      // Check that router.push was called with correct params
      expect(mockRouterPush).toHaveBeenCalledWith({
        pathname: "/preview",
        params: {
          images: JSON.stringify(["split1.jpg", "split2.jpg", "split3.jpg"]),
          pageSize: defaultProps.pageSize,
        },
      });

      // Check that isProcessing was set back to false
      expect(result.current.isProcessing).toBe(false);
    });

    test("handles error when splitting fails", async () => {
      // Mock splitImage to throw an error
      mockSplitImage.mockRejectedValue(new Error("Split failed"));

      const { result } = renderHook(() => useImageProcessing(defaultProps));

      await act(async () => {
        await result.current.handlePreview();
      });

      // Check that Alert.alert was called with error message
      expect(mockAlert).toHaveBeenCalledWith("Error", "Failed to split image");

      // Check that router.push was not called
      expect(mockRouterPush).not.toHaveBeenCalled();

      // Check that isProcessing was set back to false
      expect(result.current.isProcessing).toBe(false);
    });

    test("sets isProcessing while processing", async () => {
      // Create a promise that we can control
      let resolvePromise: (value: string[]) => void;
      const processingPromise = new Promise<string[]>((resolve) => {
        resolvePromise = resolve;
      });

      // Mock splitImage to use our controlled promise
      mockSplitImage.mockReturnValue(processingPromise);

      const { result } = renderHook(() => useImageProcessing(defaultProps));

      // Start the preview process and wait for initial state updates
      let handlePreviewPromise: Promise<void>;
      await act(async () => {
        handlePreviewPromise = result.current.handlePreview();
      });

      // Now check if isProcessing is true during operation
      expect(result.current.isProcessing).toBe(true);

      // Resolve the processing
      await act(async () => {
        resolvePromise!(["split1.jpg", "split2.jpg", "split3.jpg"]);
        await handlePreviewPromise;
      });

      // Check that isProcessing is false after completion
      expect(result.current.isProcessing).toBe(false);
    });

    test("handles empty split positions", async () => {
      const props = {
        ...defaultProps,
        splitPositions: [],
      };

      const { result } = renderHook(() => useImageProcessing(props));

      await act(async () => {
        await result.current.handlePreview();
      });

      expect(mockSplitImage).toHaveBeenCalledWith(props.imageUri, props.actualDimensions, []);
    });
  });
});
