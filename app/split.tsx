import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Image, type LayoutChangeEvent } from "react-native";
import {
  ScrollView,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { PageSizes } from "@/constants/PageSizes";
import type { PageSize } from "@/types/PageSize";
import type { ImageDimensions } from "@/types/ImageDimensions";
import { BackArrow } from "@/components/BackArrow";
import { CheckArrow } from "@/components/CheckArrow";
import { ZoomControl } from "@/components/ZoomControl";
import { SplitActions } from "@/components/SplitActions";
import { SplitLine } from "@/components/SplitLine";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useZoomAndScroll } from "@/hooks/useZoomAndScroll";
import { useSplitManagement } from "@/hooks/useSplitManagement";
import { useImageProcessing } from "@/hooks/useImageProcessing";
import { calculateImageMetrics } from "@/utils/calculateImageMetrics";

export default function SplitScreen() {
  const params = useLocalSearchParams<{
    imageUri: string;
    imageHeight: string;
    imageWidth: string;
    pageSize: PageSize;
    autoSplit: string;
  }>();

  const scrollViewRef = useRef<ScrollView>(null);
  const topSpacing = useSafeAreaInsets().top;

  const [containerDimensions, setContainerDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });

  const actualDimensions: ImageDimensions = {
    width: Number(params.imageWidth),
    height: Number(params.imageHeight),
  };

  const { handleScroll, handleZoom, isZoomedIn, currentScrollPosition } =
    useZoomAndScroll(scrollViewRef);

  const { displayDimensions, splitLineWidth, scaleFactor } = calculateImageMetrics({
    actualDimensions,
    containerDimensions,
    isZoomedIn,
  });

  const { splitPositions, addSplit, updateSplit, removeSplit, removeAllSplits, autoSplit, handleDragEnd } =
    useSplitManagement({
      actualDimensions,
      pageDimensions: PageSizes[params.pageSize],
      containerDimensions,
      topSpacing,
      currentScrollPosition,
      scaleFactor,
    });

  const { isProcessing, handlePreview } = useImageProcessing({
    imageUri: params.imageUri,
    splitPositions,
    actualDimensions,
    pageSize: params.pageSize,
  });

  useEffect(() => {
    if (params.autoSplit == "true") {
      autoSplit();
    }
  }, [params.imageUri, params.pageSize, params.autoSplit]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
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
                    index={index + 1}
                    positionDisplay={position * scaleFactor}
                    splitLineWidth={splitLineWidth}
                    onUpdatePosition={(pointerY) => updateSplit(index, pointerY)}
                    onRemoveSplit={() => removeSplit(index)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </ScrollView>
            </PinchGestureHandler>
          </View>

          <SplitActions onAddSplit={addSplit} onRemoveAllSplits={removeAllSplits} />
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  scrollContainer: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
});
