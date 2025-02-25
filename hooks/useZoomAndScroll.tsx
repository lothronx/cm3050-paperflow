import { useState, useRef } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Custom hook for managing zoom and scroll
export const useZoomAndScroll = (scrollViewRef: React.RefObject<ScrollView>) => {
  const [isZoomedIn, setIsZoomedIn] = useState(true);
  const lastScrollPosition = useRef(0);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isZoomedIn) {
      lastScrollPosition.current = event.nativeEvent.contentOffset.y;
      setCurrentScrollPosition(lastScrollPosition.current);
    }
  };

  const handleZoom = (newZoomState: boolean) => {
    setIsZoomedIn(newZoomState);

    if (scrollViewRef.current) {
      if (!newZoomState) {
        // Zooming out - scroll to top
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
        setCurrentScrollPosition(0);
      } else {
        // Zooming in - restore previous position
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: lastScrollPosition.current,
            animated: false,
          });
        }, 0);
        setCurrentScrollPosition(lastScrollPosition.current);
      }
    }
  };

  return { handleScroll, handleZoom, isZoomedIn, currentScrollPosition };
};
