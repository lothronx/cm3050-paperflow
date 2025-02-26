import { renderHook, act } from "@testing-library/react-native";
import { useZoomAndScroll } from "@/hooks/useZoomAndScroll";
import { ScrollView } from "react-native-gesture-handler";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { RefObject } from "react";

// Mock ScrollView
jest.mock("react-native-gesture-handler", () => ({
  ScrollView: jest.fn(),
}));

describe("useZoomAndScroll", () => {
  // Create a mock ref for ScrollView
  const mockScrollTo = jest.fn();
  const mockScrollViewRef: RefObject<ScrollView> = {
    current: {
      scrollTo: mockScrollTo,
    } as unknown as ScrollView,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("initializes with default values", () => {
    const { result } = renderHook(() => useZoomAndScroll(mockScrollViewRef));

    expect(result.current.isZoomedIn).toBe(true);
    expect(result.current.currentScrollPosition).toBe(0);
  });

  describe("handleScroll", () => {
    test("updates scroll position when zoomed in", () => {
      const { result } = renderHook(() => useZoomAndScroll(mockScrollViewRef));

      const mockScrollEvent: NativeSyntheticEvent<NativeScrollEvent> = {
        nativeEvent: {
          contentOffset: {
            y: 100,
            x: 0,
          },
        },
      } as NativeSyntheticEvent<NativeScrollEvent>;

      act(() => {
        result.current.handleScroll(mockScrollEvent);
      });

      expect(result.current.currentScrollPosition).toBe(100);
    });

    test("doesn't update scroll position when zoomed out", () => {
      const { result } = renderHook(() => useZoomAndScroll(mockScrollViewRef));

      act(() => {
        // First zoom out
        result.current.handleZoom(false);
      });

      const mockScrollEvent: NativeSyntheticEvent<NativeScrollEvent> = {
        nativeEvent: {
          contentOffset: {
            y: 100,
            x: 0,
          },
        },
      } as NativeSyntheticEvent<NativeScrollEvent>;

      act(() => {
        result.current.handleScroll(mockScrollEvent);
      });

      expect(result.current.currentScrollPosition).toBe(0);
    });
  });

  describe("handleZoom", () => {
    test("zooms in and restores previous scroll position", () => {
      const { result } = renderHook(() => useZoomAndScroll(mockScrollViewRef));

      // First scroll event
      act(() => {
        result.current.handleScroll({
          nativeEvent: {
            contentOffset: { y: 50, x: 0 },
          },
        } as NativeSyntheticEvent<NativeScrollEvent>);
      });

      // Second scroll event - this will set currentScrollPosition to 100
      // but lastScrollPosition will still be 50
      act(() => {
        result.current.handleScroll({
          nativeEvent: {
            contentOffset: { y: 100, x: 0 },
          },
        } as NativeSyntheticEvent<NativeScrollEvent>);
      });

      act(() => {
        result.current.handleZoom(false);
      });

      expect(mockScrollTo).toHaveBeenCalledWith({ y: 0, animated: false });
      expect(result.current.currentScrollPosition).toBe(0);

      act(() => {
        result.current.handleZoom(true);
        jest.runAllTimers();
      });

      // Should restore to lastScrollPosition which is 50, not 100
      expect(mockScrollTo).toHaveBeenLastCalledWith({
        y: 50,
        animated: false,
      });
      expect(result.current.currentScrollPosition).toBe(50);
    });

    test("maintains scroll position state correctly", () => {
      const { result } = renderHook(() => useZoomAndScroll(mockScrollViewRef));

      // Need to do scrolls one at a time to properly update lastScrollPosition
      act(() => {
        result.current.handleScroll({
          nativeEvent: {
            contentOffset: { y: 50, x: 0 },
          },
        } as NativeSyntheticEvent<NativeScrollEvent>);
      });

      act(() => {
        result.current.handleScroll({
          nativeEvent: {
            contentOffset: { y: 100, x: 0 },
          },
        } as NativeSyntheticEvent<NativeScrollEvent>);
      });

      act(() => {
        result.current.handleScroll({
          nativeEvent: {
            contentOffset: { y: 150, x: 0 },
          },
        } as NativeSyntheticEvent<NativeScrollEvent>);
      });

      expect(result.current.currentScrollPosition).toBe(150);

      act(() => {
        result.current.handleZoom(false);
      });

      expect(result.current.currentScrollPosition).toBe(0);

      act(() => {
        result.current.handleZoom(true);
        jest.runAllTimers();
      });

      // Should restore to lastScrollPosition which is 100, not 150
      expect(result.current.currentScrollPosition).toBe(100);
    });
  });
});
