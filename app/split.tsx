import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { BackArrow } from "@/components/BackArrow";
import { CheckArrow } from "@/components/CheckArrow";
import { SplitPreview } from "@/components/SplitPreview";
import { SplitActions } from "@/components/SplitActions";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SplitScreen() {
  const { imageUri, height, width, pageSize, ocrString } = useLocalSearchParams();
  const ocr = ocrString === "true";

  const [splits, setSplits] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const handleAddSplit = () => {
    // Add a new split at 50% of the image height
    setSplits([...splits, 50]);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.content}>
          <BackArrow />
          <CheckArrow onClick={handlePreview} />
          <SplitPreview
            imageUri={imageUri as string}
            splits={splits}
            onUpdateSplit={handleUpdateSplit}
            onRemoveSplit={handleRemoveSplit}
          />
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
  content: {
    flex: 1,
  },
});
