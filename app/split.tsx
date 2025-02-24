import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Image, type LayoutChangeEvent } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ScrollView,
  PinchGestureHandler,
  GestureHandlerRootView,
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

  // Stores vertical positions (in pixels) where the image will be split
  // These positions use the original image dimensions, not the scaled display dimensions
  const [splitPositions, setSplitPositions] = useState<number[]>([]);

  const [imageContainerDimensions, setImageContainerDimensions] = useState({ width: 0, height: 0 });
  const [imageDisplayDimensions, setImageDisplayDimensions] = useState({
    width: imageActualDimensions.width,
    height: imageActualDimensions.height,
  });

  useEffect(() => {
    const newDisplayDimensions = {
      width: isZoomedIn
        ? imageContainerDimensions.width
        : imageContainerDimensions.height / imageAspectRatio,
      height: isZoomedIn
        ? imageContainerDimensions.width * imageAspectRatio
        : imageContainerDimensions.height,
    };
    const newScaleFactor = newDisplayDimensions.height / imageActualDimensions.height;
    
    setImageDisplayDimensions(newDisplayDimensions);
    setScaleFactor(newScaleFactor);
  }, [imageContainerDimensions, isZoomedIn, imageAspectRatio]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setImageContainerDimensions({ width, height });
  };

  const handleScroll = (event: any) => {
    if (isZoomedIn) {
      lastScrollPosition.current = event.nativeEvent.contentOffset.y;
    }
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

  const handlePinchGesture = (event: any) => {
    handleZoom(event.nativeEvent.scale > 1);
  };

  const handleToggle = () => {
    handleZoom(!isZoomedIn);
  };

  const handleAddSplit = () => {
    if (scrollViewRef.current) {
      // Get the current scroll position
      const currentScrollPosition = lastScrollPosition.current;
      // Calculate the visible height based on the container dimensions
      const visibleHeight = imageContainerDimensions.height;
      // Calculate the middle position relative to the current scroll
      const positionOnImageDisplay = currentScrollPosition + visibleHeight / 2;
      // Convert the screen position to the actual image position
      const positionOnActualImage = positionOnImageDisplay / scaleFactor;

      setSplitPositions([...splitPositions, Math.round(positionOnActualImage)]);
    }
  };

  const handleUpdateSplit = (index: number, position: number) => {
    const newSplits = [...splitPositions];
    newSplits[index] = position;
    setSplitPositions(newSplits);
  };

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
                  containerHeight={imageContainerDimensions.height}
                  onUpdatePosition={(newPosition) => handleUpdateSplit(index, newPosition)}
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
