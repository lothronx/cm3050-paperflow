import { renderHook, act } from "@testing-library/react-native";
import { useSplitManagement } from "@/hooks/useSplitManagement";

describe("useSplitManagement", () => {
  const defaultProps = {
    actualDimensions: { width: 1000, height: 2000 },
    pageDimensions: { width: 500, height: 700 },
    containerDimensions: { width: 300, height: 400 },
    topSpacing: 50,
    currentScrollPosition: 0,
    scaleFactor: 0.5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initializes with empty split positions", () => {
    const { result } = renderHook(() => useSplitManagement(defaultProps));
    expect(result.current.splitPositions).toEqual([]);
  });

  describe("addSplit", () => {
    test("adds split at middle of visible area", () => {
      const { result } = renderHook(() => useSplitManagement(defaultProps));

      act(() => {
        result.current.addSplit();
      });

      expect(result.current.splitPositions).toEqual([400]);
    });

    test("adds multiple splits in sorted order", () => {
      // Create a mutable props object
      let currentProps = {
        ...defaultProps,
        currentScrollPosition: 100,
      };

      // Render hook with a function that always uses the latest props
      const { result, rerender } = renderHook((props) => useSplitManagement(props), {
        initialProps: currentProps,
      });

      act(() => {
        result.current.addSplit(); // Should add at (100 + 200) / 0.5 = 600
      });

      // Update props and rerender with new props
      currentProps = {
        ...currentProps,
        currentScrollPosition: 300,
      };
      rerender(currentProps);

      act(() => {
        result.current.addSplit(); // Should add at (300 + 200) / 0.5 = 1000
      });

      expect(result.current.splitPositions).toEqual([600, 1000]);
    });

    test("clamps split position to image bounds", () => {
      const props = {
        ...defaultProps,
        currentScrollPosition: 1800, // This would place split beyond image height
      };
      const { result } = renderHook(() => useSplitManagement(props));

      act(() => {
        result.current.addSplit();
      });

      // Should be clamped to actualDimensions.height (2000)
      expect(result.current.splitPositions).toEqual([2000]);
    });
  });

  describe("updateSplit", () => {
    test("updates split position based on pointer position", () => {
      const { result } = renderHook(() => useSplitManagement(defaultProps));

      // First add a split
      act(() => {
        result.current.addSplit();
      });

      // Update the split
      act(() => {
        result.current.updateSplit(0, 250); // pointerY = 250
      });

      // Calculation:
      // newPositionOnViewport = 250 - topSpacing = 200
      // newPositionOnImageDisplay = 200 + currentScrollPosition = 200
      // newPositionOnActualImage = 200 / 0.5 = 400
      expect(result.current.splitPositions).toEqual([400]);
    });

    test("clamps updated position to container bounds", () => {
      const { result } = renderHook(() => useSplitManagement(defaultProps));

      act(() => {
        result.current.addSplit();
        // Try to update with position below 0
        result.current.updateSplit(0, -100);
      });

      expect(result.current.splitPositions).toEqual([0]);

      act(() => {
        // Try to update with position above container height
        result.current.updateSplit(0, 5000);
      });

      expect(result.current.splitPositions[0]).toBeLessThanOrEqual(
        defaultProps.actualDimensions.height
      );
    });
  });

  describe("removeSplit", () => {
    test("removes split at specified index", () => {
      const { result } = renderHook(() => useSplitManagement(defaultProps));

      act(() => {
        result.current.addSplit(); // Add first split
        result.current.addSplit(); // Add second split
      });

      const initialSplits = [...result.current.splitPositions];

      act(() => {
        result.current.removeSplit(0); // Remove first split
      });

      expect(result.current.splitPositions).toEqual([initialSplits[1]]);
    });
  });

  describe("removeAllSplits", () => {
    test("removes all splits", () => {
      const { result } = renderHook(() => useSplitManagement(defaultProps));

      act(() => {
        result.current.addSplit();
        result.current.addSplit();
        result.current.addSplit();
      });

      act(() => {
        result.current.removeAllSplits();
      });

      expect(result.current.splitPositions).toEqual([]);
    });
  });

  describe("autoSplit", () => {
    test("creates splits based on aspect ratios", () => {
      const { result } = renderHook(() => useSplitManagement(defaultProps));

      act(() => {
        result.current.autoSplit();
      });

      // Calculation:
      // imageAspectRatio = 2000/1000 = 2
      // pageAspectRatio = 700/500 = 1.4
      // numSplits = floor(2/1.4) = 1
      // splitPosition = 1 * 1000 * 1.4 = 1400
      expect(result.current.splitPositions).toEqual([1400]);
    });

    test("doesn't create splits if image is shorter than page", () => {
      const props = {
        ...defaultProps,
        actualDimensions: { width: 1000, height: 500 }, // Shorter image
      };
      const { result } = renderHook(() => useSplitManagement(props));

      act(() => {
        result.current.autoSplit();
      });

      expect(result.current.splitPositions).toEqual([]);
    });
  });

  describe("handleDragEnd", () => {
    test("sorts positions after drag", () => {
      const { result } = renderHook(() => useSplitManagement(defaultProps));

      // Add splits and manually set them in unsorted order
      act(() => {
        result.current.addSplit();
        result.current.addSplit();
        result.current.updateSplit(0, 800); // Will result in a larger position
        result.current.updateSplit(1, 400); // Will result in a smaller position
      });

      const unsortedPositions = [...result.current.splitPositions];

      act(() => {
        result.current.handleDragEnd();
      });

      expect(result.current.splitPositions).toEqual([...unsortedPositions].sort((a, b) => a - b));
    });
  });
});
