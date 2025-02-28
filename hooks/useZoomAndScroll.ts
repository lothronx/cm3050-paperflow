import { RefObject, useState, useRef } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

/**
 * Custom React hook for managing zoom and scroll functionality in a ScrollView component.
 * Maintains scroll position when toggling between zoomed and unzoomed states.
 * @param {RefObject<ScrollView>} scrollViewRef - Reference to the ScrollView component
 * @returns Object containing:
 * - handleScroll: Function to handle scroll events
 * - handleZoom: Function to handle zoom state changes
 * - isZoomedIn: Current zoom state
 * - currentScrollPosition: Current vertical scroll position
 */
export const useZoomAndScroll = (scrollViewRef: RefObject<ScrollView>) => {
  const lastScrollPosition = useRef(0);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [isZoomedIn, setIsZoomedIn] = useState(true);

  /**
   * Handles scroll events in the ScrollView when zoomed in.
   * Updates and maintains the current scroll position.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event - The scroll event
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isZoomedIn) {
      setCurrentScrollPosition(event.nativeEvent.contentOffset.y);
      lastScrollPosition.current = currentScrollPosition;
    }
  };

  /**
   * Handles zoom state changes and manages scroll position accordingly.
   * When zooming in, restores the previous scroll position.
   * When zooming out, scrolls to the top of the view.
   *
   * @param {boolean} zoomIn - Whether to zoom in (true) or out (false)
   */
  const handleZoom = (zoomIn: boolean) => {
    setIsZoomedIn(zoomIn);

    if (scrollViewRef.current) {
      if (zoomIn) {
        // Zooming in - restore previous position
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: lastScrollPosition.current,
            animated: false,
          });
        }, 0);
        setCurrentScrollPosition(lastScrollPosition.current);
      } else {
        // Zooming out - scroll to top
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
        setCurrentScrollPosition(0);
      }
    }
  };

  return { handleScroll, handleZoom, isZoomedIn, currentScrollPosition };
};
