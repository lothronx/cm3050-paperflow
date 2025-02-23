import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, type LayoutChangeEvent, Pressable } from "react-native";
import {
  ScrollView,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { SplitLine } from "@/components/SplitLine";
import { COLORS } from "@/constants/Colors";

type ImageDimensions = {
  width: number;
  height: number;
};

interface SplitPreviewProps {
  imageUri: string;
  splits: number[];
  onUpdateSplit: (index: number, position: number) => void;
  onRemoveSplit: (index: number) => void;
}

const useImageDimensions = (imageUri: string, containerWidth: number) => {
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });

  useEffect(() => {
    if (containerWidth > 0) {
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = height / width;
        setDimensions({
          width: containerWidth,
          height: containerWidth * aspectRatio,
        });
      });
    }
  }, [containerWidth, imageUri]);

  return dimensions;
};

const ZoomControl = ({ isZoomedIn, onToggle }: { isZoomedIn: boolean; onToggle: () => void }) => (
  <Pressable onPress={onToggle} style={styles.zoomButton}>
    <MaterialIcons
      name={isZoomedIn ? "zoom-in-map" : "zoom-out-map"}
      size={18}
      color={COLORS.primary}
    />
  </Pressable>
);

export const SplitPreview = ({
  imageUri,
  splits,
  onUpdateSplit,
  onRemoveSplit,
}: SplitPreviewProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrollPosition = useRef(0);

  const [isZoomedIn, setIsZoomedIn] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const { height: imageHeight } = useImageDimensions(imageUri, containerDimensions.width);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  const handleScroll = (event: any) => {
    if (isZoomedIn) {
      lastScrollPosition.current = event.nativeEvent.contentOffset.y;
    }
  };

  const handlePinchEnd = () => {
    const newZoomState = !isZoomedIn;
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

  const toggleZoom = () => {
    const newZoomState = !isZoomedIn;
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

  const imageStyle = {
    width: containerDimensions.width,
    height: isZoomedIn ? imageHeight : containerDimensions.height,
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <ZoomControl isZoomedIn={isZoomedIn} onToggle={toggleZoom} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler onEnded={handlePinchEnd}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEnabled={isZoomedIn}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={isZoomedIn}>
            <View
              style={[
                styles.imageContainer,
                !isZoomedIn && { height: containerDimensions.height },
              ]}>
              <Image
                source={{ uri: imageUri }}
                style={[styles.image, imageStyle]}
                resizeMode="contain"
              />
              {splits.map((position, index) => (
                <SplitLine
                  key={index}
                  position={position}
                  onUpdatePosition={(newPosition) => onUpdateSplit(index, newPosition)}
                  onRemoveSplit={() => onRemoveSplit(index)}
                  containerHeight={containerDimensions.height}
                />
              ))}
            </View>
          </ScrollView>
        </PinchGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  zoomButton: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -17 }],

    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    zIndex: 1,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
