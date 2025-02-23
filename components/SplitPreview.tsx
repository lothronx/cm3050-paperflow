"use client";

import { StyleSheet, View, Image, type LayoutChangeEvent } from "react-native";
import { useState } from "react";
import { SplitLine } from "./SplitLine";
import { COLORS } from "@/constants/Colors";

interface SplitPreviewProps {
  imageUri: string;
  splits: number[];
  onUpdateSplit: () => void;
  onRemoveSplit: () => void;
}

export const SplitPreview = ({
  imageUri,
  splits,
  onUpdateSplit,
  onRemoveSplit,
}: SplitPreviewProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      {splits.map((split, index) => (
        <SplitLine
          key={index}
          onUpdatePosition={onUpdateSplit}
          onRemoveSplit={onRemoveSplit}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 150,
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    overflow: "visible",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
