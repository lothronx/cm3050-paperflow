import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useState } from "react";
import { COLORS } from "@/constants/Colors";
import { SplitHeader } from "@/components/SplitHeader";
import { SplitPreview } from "@/components/SplitPreview";
import { SplitActions } from "@/components/SplitActions";
import { Text } from "@/components/Text";

export default function SplitScreen() {
  const { imageUri, height, width, pageSize, ocrString } = useLocalSearchParams();
  const ocr = ocrString === "true";

  const [splits, setSplits] = useState<number[]>([0.5]); // Normalized positions (0-1)
  const [isProcessing, setIsProcessing] = useState(true);

  const handleAddSplit = () => {
    const newSplit = splits.length > 0 ? splits[splits.length - 1] + 0.25 : 0.5;
    if (newSplit < 1) {
      setSplits([...splits, newSplit]);
    }
  };

  const handleRemoveAllSplits = () => {
    setSplits([]);
  };

  const handleUpdateSplit = (index: number, position: number) => {
    const newSplits = [...splits];
    newSplits[index] = position;
    setSplits(newSplits);
  };

  const handlePreview = () => {
    // Convert the splits into actual image URIs (this is a placeholder)
    const splitImages = splits.map((_, index) => `${imageUri}_split_${index}`);

    router.push({
      pathname: "/preview",
      
    });
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <SplitHeader onBack={() => router.back()} onPreview={handlePreview} />

        <View style={styles.content}>
          <SplitPreview
            imageUri={imageUri as string}
            splits={splits}
            onUpdateSplit={handleUpdateSplit}
            onLoadEnd={() => setIsProcessing(false)}
          />

          <Text style={styles.instructionText}>
            Press and drag lines to adjust split positions.
          </Text>

          <SplitActions
            onAddSplit={handleAddSplit}
            onRemoveAllSplits={handleRemoveAllSplits}
            showAddSplit={splits.length < 4}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  instructionText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginVertical: 8,
    fontSize: 10,
  },
});
