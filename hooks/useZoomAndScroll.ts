import { RefObject, useState, useRef } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Custom hook for managing zoom and scroll
export const useZoomAndScroll = (scrollViewRef: RefObject<ScrollView>) => {
  const lastScrollPosition = useRef(0);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [isZoomedIn, setIsZoomedIn] = useState(true);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isZoomedIn) {
      setCurrentScrollPosition(event.nativeEvent.contentOffset.y);
      lastScrollPosition.current = currentScrollPosition;
    }
  };

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
