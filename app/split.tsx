import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { BackArrow } from "@/components/BackArrow";
import { CheckArrow } from "@/components/CheckArrow";
import { SplitPreview } from "@/components/SplitPreview";
import { SplitActions } from "@/components/SplitActions";
import { Text } from "@/components/Text";

export default function SplitScreen() {
  const { imageUri, height, width, pageSize, ocrString } = useLocalSearchParams();
  const ocr = ocrString === "true";

  const [splits, setSplits] = useState<number[]>([0.5]); // Normalized positions (0-1)
  const [isProcessing, setIsProcessing] = useState(true);

  const handleAddSplit = () => {
    const newSplit = splits.length > 0 ? splits[splits.length - 1] + 0.25 : 200;
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

  const handleRemoveSplit = () => {
    setSplits(splits.slice(0, -1));
  };

  const handlePreview = () => {
    // Convert the splits into actual image URIs (this is a placeholder)
    const splitImages = splits.map((_, index) => `${imageUri}_split_${index}`);

    router.push({
      pathname: "/preview",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <BackArrow />
        <CheckArrow onClick={handlePreview} />
        <SplitPreview
          imageUri={imageUri as string}
          splits={splits}
          onUpdateSplit={handleUpdateSplit}
          onLoadEnd={() => setIsProcessing(false)}
          handleRemoveSplit={handleRemoveSplit}
        />
        <SplitActions onAddSplit={handleAddSplit} onRemoveAllSplits={handleRemoveAllSplits} />
      </View>
    </SafeAreaView>
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
