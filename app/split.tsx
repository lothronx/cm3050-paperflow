import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { BackArrow } from "@/components/BackArrow";
import { CheckArrow } from "@/components/CheckArrow";
import { SplitPreview } from "@/components/SplitPreview";
import { SplitActions } from "@/components/SplitActions";

export default function SplitScreen() {
  const { imageUri, height, width, pageSize, ocrString } = useLocalSearchParams();
  const ocr = ocrString === "true";

  const [splits, setSplits] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const handleAddSplit = () => {};

  const handleUpdateSplit = () => {};

  const handleRemoveSplit = () => {};

  const handleRemoveAllSplits = () => {
    setSplits([]);
  };

  const handlePreview = () => {
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
          onRemoveSplit={handleRemoveSplit}
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
