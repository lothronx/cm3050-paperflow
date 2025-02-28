/**
 * Split Screen Component for the PaperFlow application
 * 
 * This screen allows users to:
 * - View and zoom into their selected image
 * - Add split lines for page division
 * - Automatically or manually split the image into pages
 * - Preview the split results
 * 
 * Handles complex image manipulation and layout calculations
 */

// React and React Native core imports
import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

// Image handling and gestures
import { Image } from "expo-image";
import {
  ScrollView,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Custom constants, types, and components
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

// Custom hooks and utilities
import { useZoomAndScroll } from "@/hooks/useZoomAndScroll";
import { useSplitManagement } from "@/hooks/useSplitManagement";
import { useImageProcessing } from "@/hooks/useImageProcessing";
import { calculateImageMetrics } from "@/utils/calculateImageMetrics";

/**
 * Split Screen Component
 * 
 * Handles image splitting functionality with zoom and scroll capabilities
 */
export default function SplitScreen() {
  // Router parameters containing image and page settings
  const params = useLocalSearchParams<{
    imageUri: string;
    imageHeight: string;
    imageWidth: string;
    pageSize: PageSize;
    autoSplit: string;
  }>();

  // Scroll View Ref
  const scrollViewRef = useRef<ScrollView>(null);

  // Safe area top inset
  const topSpacing = useSafeAreaInsets().top;

  // State for container dimensions
  const [containerDimensions, setContainerDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });

  // Actual image dimensions from parameters
  const actualDimensions: ImageDimensions = {
    width: Number(params.imageWidth),
    height: Number(params.imageHeight),
  };

  // Zoom and scroll management
  const { handleScroll, handleZoom, isZoomedIn, currentScrollPosition } =
    useZoomAndScroll(scrollViewRef);

  // Image display metrics calculations
  const { displayDimensions, splitLineWidth, scaleFactor } = calculateImageMetrics({
    actualDimensions,
    containerDimensions,
    isZoomedIn,
  });

  // Split line management
  const {
    splitPositions,
    addSplit,
    updateSplit,
    removeSplit,
    removeAllSplits,
    autoSplit,
    handleDragEnd,
  } = useSplitManagement({
    actualDimensions,
    pageDimensions: PageSizes[params.pageSize],
    containerDimensions,
    topSpacing,
    currentScrollPosition,
    scaleFactor,
  });

  // Image processing for preview
  const { isProcessing, handlePreview } = useImageProcessing({
    imageUri: params.imageUri,
    splitPositions,
    actualDimensions,
    pageSize: params.pageSize,
  });

  // Auto-split on initial load if enabled
  useEffect(() => {
    if (params.autoSplit == "true") {
      autoSplit();
    }
  }, [params.imageUri, params.pageSize, params.autoSplit]);

  /**
   * Handles container layout changes
   * Updates container dimensions for proper image scaling
   */
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  return (
    // Main gesture handler container
    <GestureHandlerRootView style={styles.container}>
      {/* Loading indicator during processing */}
      {isProcessing && <LoadingIndicator />}

      {/* Navigation arrows */}
      <BackArrow />
      <CheckArrow onClick={handlePreview} />

      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/* Image container with zoom and scroll capabilities */}
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
                {/* Main image display */}
                <Image
                  source={{ uri: params.imageUri }}
                  style={{
                    width: displayDimensions.width,
                    height: displayDimensions.height,
                  }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />

                {/* Split lines */}
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

          {/* Split action buttons */}
          <SplitActions onAddSplit={addSplit} onRemoveAllSplits={removeAllSplits} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// Styles for component layout and appearance
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
