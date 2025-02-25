import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Image, Alert, type LayoutChangeEvent } from "react-native";
import {
  ScrollView,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { PageSizes, type PageSize } from "@/constants/PageSizes";
import type { ImageDimensions } from "@/types/ImageDimensions";
import { BackArrow } from "@/components/BackArrow";
import { CheckArrow } from "@/components/CheckArrow";
import { ZoomControl } from "@/components/ZoomControl";
import { SplitActions } from "@/components/SplitActions";
import { SplitLine } from "@/components/SplitLine";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useZoomAndScroll } from "@/hooks/useZoomAndScroll";
import { useImageCalculations } from "@/hooks/useImageCalculation";
import { splitImage } from "@/utils/splitImage";

export default function SplitScreen() {
  const params = useLocalSearchParams<{
    imageUri: string;
    imageHeight: string;
    imageWidth: string;
    pageSize: PageSize;
    ocrString: string;
  }>();

  const scrollViewRef = useRef<ScrollView>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const [splitPositions, setSplitPositions] = useState<number[]>([]);

  const actualDimensions: ImageDimensions = {
    width: Number(params.imageWidth),
    height: Number(params.imageHeight),
  };

  const pageDimensions: ImageDimensions = PageSizes[params.pageSize];

  const [containerDimensions, setContainerDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });

  const topSpacing = useSafeAreaInsets().top;

  const { handleScroll, handleZoom, isZoomedIn, currentScrollPosition } =
    useZoomAndScroll(scrollViewRef);

  const { displayDimensions, splitLineDisplay, scaleFactor } = useImageCalculations({
    actualDimensions,
    containerDimensions,
    isZoomedIn,
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  useEffect(() => {
    if (params.pageSize != "Manual") {
      const ratio =
        (actualDimensions.height * pageDimensions.width) /
        (actualDimensions.width * pageDimensions.height);

      const numSplits = Math.floor(ratio);

      if (numSplits > 0) {
        const newSplitPositions = [];
        for (let i = 1; i <= numSplits; i++) {
          const position =
            (i * actualDimensions.width * pageDimensions.height) / pageDimensions.width;
          newSplitPositions.push(position);
        }
        setSplitPositions(newSplitPositions);
      }
    }
  }, [actualDimensions.height, params.pageSize]);

  const handleAddSplit = () => {
    if (scrollViewRef.current) {
      const visibleHeight = containerDimensions.height;
      const positionOnImageDisplay = currentScrollPosition + visibleHeight / 2;
      const positionOnActualImage = positionOnImageDisplay / scaleFactor;

      setSplitPositions([
        ...splitPositions,
        Math.min(Math.max(0, positionOnActualImage), actualDimensions.height),
      ]);
    }
  };

  const handleUpdateSplit = (index: number, pointerY: number) => {
    const newPositionOnViewport = Math.min(
      containerDimensions.height,
      Math.max(0, pointerY - topSpacing)
    );
    const newPositionOnImageDisplay = newPositionOnViewport + currentScrollPosition;
    const newPositionOnActualImage = newPositionOnImageDisplay / scaleFactor;

    // Only update split if it's within the actual image bounds
    if (newPositionOnActualImage >= 0 && newPositionOnActualImage <= actualDimensions.height) {
      const newSplits = [...splitPositions];
      newSplits[index] = Math.round(newPositionOnActualImage);
      setSplitPositions(newSplits);
    }
  };

  const handleRemoveSplit = (index: number) => {
    const newSplits = splitPositions.filter((_, i) => i !== index);
    setSplitPositions(newSplits);
  };

  const handleRemoveAllSplits = () => {
    setSplitPositions([]);
  };

  const handlePreview = async () => {
    try {
      setIsProcessing(true);

      const result = await splitImage(params.imageUri, splitPositions, actualDimensions);

      router.push({
        pathname: "/preview",
        params: {
          images: JSON.stringify(result),
          pageSize: params.pageSize,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to split images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {isProcessing && <LoadingIndicator />}
      <BackArrow />
      <CheckArrow onClick={handlePreview} />

      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.innerContainer} onLayout={handleLayout}>
            <ZoomControl isZoomedIn={isZoomedIn} onToggle={() => handleZoom(!isZoomedIn)} />
            <PinchGestureHandler
              onGestureEvent={(event) => handleZoom(event.nativeEvent.scale > 1)}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.innerContainer}
                contentContainerStyle={styles.scrollContainer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={isZoomedIn}>
                <Image
                  source={{ uri: params.imageUri }}
                  style={displayDimensions}
                  resizeMode="cover"
                />
                {splitPositions.map((position, index) => (
                  <SplitLine
                    key={index}
                    positionDisplay={position * scaleFactor}
                    splitLineDisplay={splitLineDisplay}
                    onUpdatePosition={(pointerY) => handleUpdateSplit(index, pointerY)}
                    onRemoveSplit={() => handleRemoveSplit(index)}
                  />
                ))}
              </ScrollView>
            </PinchGestureHandler>
          </View>

          <SplitActions onAddSplit={handleAddSplit} onRemoveAllSplits={handleRemoveAllSplits} />
        </View>
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
  scrollContainer: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
});
