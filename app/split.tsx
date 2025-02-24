import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  type LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ScrollView,
  PinchGestureHandler,
  GestureHandlerRootView,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { BackArrow } from "@/components/BackArrow";
import { CheckArrow } from "@/components/CheckArrow";
import { ZoomControl } from "@/components/ZoomControl";
import { SplitActions } from "@/components/SplitActions";
import { SplitLine } from "@/components/SplitLine";
import { PageSizes, type PageSize } from "@/constants/PageSizes";

type SplitScreenParams = {
  imageUri: string;
  imageHeight: string;
  imageWidth: string;
  pageSize: PageSize;
  ocrString: string;
};

export default function SplitScreen() {
  const params = useLocalSearchParams<SplitScreenParams>();
  const ocr: boolean = params.ocrString === "true";
  const pageSize = params.pageSize;
  const imageActualDimensions = {
    width: Number(params.imageWidth),
    height: Number(params.imageHeight),
  };
  const imageAspectRatio = imageActualDimensions.height / imageActualDimensions.width;
  const pageAspectRatio = PageSizes[pageSize].height / PageSizes[pageSize].width;

  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrollPosition = useRef(0);

  const [isProcessing, setIsProcessing] = useState(true);
  const [isZoomedIn, setIsZoomedIn] = useState(true);
  const [scaleFactor, setScaleFactor] = useState(1);

  const [imageContainerDimensions, setImageContainerDimensions] = useState({ width: 0, height: 0 });
  const [imageDisplayDimensions, setImageDisplayDimensions] = useState({
    width: imageActualDimensions.width,
    height: imageActualDimensions.height,
  });
  // Stores vertical positions (in pixels) where the image will be split
  // These positions use the original image dimensions, not the scaled display dimensions
  const [splitPositions, setSplitPositions] = useState<number[]>([]);
  const [splitLineWidth, setSplitLineWidth] = useState(0);

  useEffect(() => {
    const newDisplayDimensions = {
      width: isZoomedIn
        ? imageContainerDimensions.width
        : imageContainerDimensions.height / imageAspectRatio,
      height: isZoomedIn
        ? imageContainerDimensions.width * imageAspectRatio
        : imageContainerDimensions.height,
    };
    setImageDisplayDimensions(newDisplayDimensions);

    const newScaleFactor = newDisplayDimensions.height / imageActualDimensions.height;
    setScaleFactor(newScaleFactor);

    const newSplitLineWidth = Math.min(
      newDisplayDimensions.width + 36,
      imageContainerDimensions.width
    );
    setSplitLineWidth(newSplitLineWidth);
  }, [imageContainerDimensions, isZoomedIn, imageAspectRatio]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setImageContainerDimensions({ width, height });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isZoomedIn) {
      lastScrollPosition.current = event.nativeEvent.contentOffset.y;
    }
  };

  const handlePinchGesture = (event: PinchGestureHandlerGestureEvent) => {
    handleZoom(event.nativeEvent.scale > 1);
  };

  const handleZoom = (newZoomState: boolean) => {
    setIsZoomedIn(newZoomState);

    if (scrollViewRef.current) {
      if (!newZoomState) {
        // Zooming out - scroll to top
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      } else {
        // Zooming in - restore previous position
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: lastScrollPosition.current,
            animated: false,
          });
        }, 0);
      }
    }
  };

  const handleToggle = () => {
    handleZoom(!isZoomedIn);
  };

  // Add a new split to the middle of the image viewport
  const handleAddSplit = () => {
    if (scrollViewRef.current) {
      // Get the current scroll position
      const currentScrollPosition = isZoomedIn ? lastScrollPosition.current : 0;
      // Calculate the visible height based on the container dimensions
      const visibleHeight = imageContainerDimensions.height;
      // Calculate the middle position relative to the current scroll
      const positionOnImageDisplay = currentScrollPosition + visibleHeight / 2;
      // Convert the screen position to the actual image position
      const positionOnActualImage = positionOnImageDisplay / scaleFactor;

      setSplitPositions([...splitPositions, Math.round(positionOnActualImage)]);
    }
  };

  // Update the position of a specific split
  const handleUpdateSplit = (index: number, pointerY: number) => {
    const currentScrollPosition = isZoomedIn ? lastScrollPosition.current : 0;
    const newPositionOnImageDisplay =
      Math.min(imageContainerDimensions.height, Math.max(0, pointerY)) + currentScrollPosition;
    const newPositionOnActualImage = newPositionOnImageDisplay / scaleFactor;

    const newSplits = [...splitPositions];
    newSplits[index] = newPositionOnActualImage;
    setSplitPositions(newSplits);
  };

  // Remove a split
  const handleRemoveSplit = (index: number) => {
    const newSplits = splitPositions.filter((_, i) => i !== index);
    setSplitPositions(newSplits);
  };

  const handleRemoveAllSplits = () => {
    setSplitPositions([]);
  };

  const handlePreview = () => {
    router.push({
      pathname: "/preview",
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <BackArrow />
        <CheckArrow onClick={handlePreview} />
        <View style={styles.innerContainer} onLayout={handleLayout}>
          <ZoomControl isZoomedIn={isZoomedIn} onToggle={handleToggle} />
          <PinchGestureHandler onGestureEvent={handlePinchGesture}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.innerContainer}
              contentContainerStyle={styles.scrollContent}
              scrollEnabled={isZoomedIn}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={isZoomedIn}>
              <Image
                source={{ uri: params.imageUri }}
                style={imageDisplayDimensions}
                resizeMode="cover"
              />
              {splitPositions.map((position, index) => (
                <SplitLine
                  key={index}
                  position={position}
                  scaleFactor={scaleFactor}
                  width={splitLineWidth}
                  left={imageContainerDimensions.width / 2 - splitLineWidth / 2}
                  onUpdatePosition={(pointerY) => handleUpdateSplit(index, pointerY)}
                  onRemoveSplit={() => handleRemoveSplit(index)}
                />
              ))}
            </ScrollView>
          </PinchGestureHandler>
        </View>

        <SplitActions onAddSplit={handleAddSplit} onRemoveAllSplits={handleRemoveAllSplits} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollContent: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
});
