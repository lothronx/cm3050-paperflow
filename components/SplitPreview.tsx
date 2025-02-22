"use client";

import { StyleSheet, View, Image, type LayoutChangeEvent } from "react-native";
import { useState } from "react";
import { SplitLine } from "./SplitLine";
import { COLORS } from "@/constants/Colors";

interface SplitPreviewProps {
  imageUri: string;
  splits: number[];
  onUpdateSplit: (index: number, position: number) => void;
  onLoadEnd: () => void;
}

export const SplitPreview = ({ imageUri, splits, onUpdateSplit, onLoadEnd }: SplitPreviewProps) => {
  const [containerHeight, setContainerHeight] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
        onLoadEnd={onLoadEnd}
      />
      {splits.map((split, index) => (
        <SplitLine
          key={index}
          position={split}
          containerHeight={containerHeight}
          onUpdatePosition={(position) => onUpdateSplit(index, position)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
