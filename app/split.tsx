import { useState, useRef } from "react";
import { StyleSheet, View, Image, Alert, type LayoutChangeEvent } from "react-native";
import {
  ScrollView,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { COLORS } from "@/constants/Colors";
import { PageSizes, type PageSize } from "@/constants/PageSizes";
import { BackArrow } from "@/components/BackArrow";
import { CheckArrow } from "@/components/CheckArrow";
import { ZoomControl } from "@/components/ZoomControl";
import { SplitActions } from "@/components/SplitActions";
import { SplitLine } from "@/components/SplitLine";
import { useZoomAndScroll } from "@/hooks/useZoomAndScroll";
import calculateDisplayDimensions, {
  type ImageDimensions,
} from "@/utils/calculateDisplayDimensions";
import calculateSplitLineWidth from "@/utils/calculateSplitLineWidth";

export default function SplitScreen() {
  const params = useLocalSearchParams<{
    imageUri: string;
    imageHeight: string;
    imageWidth: string;
    pageSize: PageSize;
    ocrString: string;
  }>();

  const scrollViewRef = useRef<ScrollView>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });
  const [splitPositions, setSplitPositions] = useState<number[]>([]);

  const actualDimensions: ImageDimensions = {
    width: Number(params.imageWidth),
    height: Number(params.imageHeight),
  };

  const { isZoomedIn, getCurrentScrollPosition, handleScroll, handleZoom } =
    useZoomAndScroll(scrollViewRef);
    
  const displayDimensions = calculateDisplayDimensions(
    actualDimensions,
    containerDimensions,
    isZoomedIn
  );
  const { width: splitLineWidth, left: splitLineLeft } = calculateSplitLineWidth(
    displayDimensions,
    containerDimensions
  );

  const scaleFactor = displayDimensions.height / actualDimensions.height;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  const handleAddSplit = () => {
    if (scrollViewRef.current) {
      const visibleHeight = containerDimensions.height;
      const positionOnImageDisplay = getCurrentScrollPosition() + visibleHeight / 2;
      const positionOnActualImage = positionOnImageDisplay / scaleFactor;

      setSplitPositions([...splitPositions, Math.round(positionOnActualImage)]);
    }
  };

  const handleUpdateSplit = (index: number, pointerY: number) => {
    const newPositionOnViewport = Math.min(containerDimensions.height, Math.max(0, pointerY));
    const newPositionOnImageDisplay = newPositionOnViewport + getCurrentScrollPosition();
    const newPositionOnActualImage = newPositionOnImageDisplay / scaleFactor;

    const newSplits = [...splitPositions];
    newSplits[index] = Math.round(newPositionOnActualImage);
    setSplitPositions(newSplits);
  };

  const handleRemoveSplit = (index: number) => {
    const newSplits = splitPositions.filter((_, i) => i !== index);
    setSplitPositions(newSplits);
  };

  const handleRemoveAllSplits = () => {
    setSplitPositions([]);
  };

  const splitImage = async (imageUri: string, positions: number[]) => {
    const sortedPositions = [...positions]
      .sort((a, b) => a - b)
      .reduce((acc: number[], curr: number) => {
        if (acc.length === 0 || curr - acc[acc.length - 1] >= 10) {
          acc.push(curr);
        }
        return acc;
      }, []);
    const images: string[] = [];

    let startY = 0;
    for (const position of sortedPositions) {
      const result = await manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: 0,
              originY: startY,
              width: actualDimensions.width,
              height: position - startY,
            },
          },
        ],
        { compress: 1, format: SaveFormat.JPEG }
      );
      images.push(result.uri);
      startY = position;
    }

    // Handle the last segment
    if (startY < actualDimensions.height) {
      const result = await manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: 0,
              originY: startY,
              width: actualDimensions.width,
              height: actualDimensions.height - startY,
            },
          },
        ],
        { compress: 1, format: SaveFormat.JPEG }
      );
      images.push(result.uri);
    }

    return images;
  };

  const handlePreview = async () => {
    try {
      const splitImages = await splitImage(params.imageUri, splitPositions);

      router.push({
        pathname: "/preview",
        params: {
          images: JSON.stringify(splitImages),
          pageSize: params.pageSize,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to split images. Please try again.");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <BackArrow />
        <CheckArrow onClick={handlePreview} />
        <View style={styles.innerContainer} onLayout={handleLayout}>
          <ZoomControl isZoomedIn={isZoomedIn} onToggle={() => handleZoom(!isZoomedIn)} />
          <PinchGestureHandler onGestureEvent={(event) => handleZoom(event.nativeEvent.scale > 1)}>
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
                  position={position}
                  scaleFactor={scaleFactor}
                  width={splitLineWidth}
                  left={splitLineLeft}
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
  scrollContainer: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
});
