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

export default function SplitScreen() {
  const { imageUri, imageHeight, imageWidth, pageSize, ocrString } = useLocalSearchParams();
  const ocr = ocrString === "true";
  const numImageWidth = Number(Array.isArray(imageWidth) ? imageWidth[0] : imageWidth);
  const numImageHeight = Number(Array.isArray(imageHeight) ? imageHeight[0] : imageHeight);
  const imageRatio = numImageWidth / numImageHeight;

  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrollPosition = useRef(0);

  const [isProcessing, setIsProcessing] = useState(true);
  const [isZoomedIn, setIsZoomedIn] = useState(true);
  const [splits, setSplits] = useState<number[]>([]);
  const [imageContainerDimensions, setImageContainerDimensions] = useState({ width: 0, height: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: numImageWidth,
    height: numImageHeight,
  });

  useEffect(() => {
    setImageDimensions({
      width: isZoomedIn
        ? imageContainerDimensions.width
        : imageContainerDimensions.height * imageRatio,
      height: isZoomedIn
        ? imageContainerDimensions.width / imageRatio
        : imageContainerDimensions.height,
    });
  }, [imageContainerDimensions, isZoomedIn, imageRatio]);

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
    setSplits([...splits, 300]);
  };

  const handleUpdateSplit = (index: number, position: number) => {
    const newSplits = [...splits];
    newSplits[index] = position;
    setSplits(newSplits);
  };

  const handleRemoveSplit = (index: number) => {
    const newSplits = splits.filter((_, i) => i !== index);
    setSplits(newSplits);
  };

  const handleRemoveAllSplits = () => {
    setSplits([]);
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
                source={{ uri: imageUri as string }}
                style={imageDimensions}
                resizeMode="contain"
              />
              {splits.map((position, index) => (
                <SplitLine
                  key={index}
                  position={position}
                  onUpdatePosition={(newPosition) => handleUpdateSplit(index, newPosition)}
                  onRemoveSplit={() => handleRemoveSplit(index)}
                  containerHeight={imageContainerDimensions.height}
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
