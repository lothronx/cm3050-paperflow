import { StyleSheet, View, SafeAreaView } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useState } from "react";
import { COLORS } from "@/constants/Colors";
import { SplitHeader } from "@/components/SplitHeader";
import { SplitPreview } from "@/components/SplitPreview";
import { SplitActions } from "@/components/SplitActions";
import { Text } from "@/components/Text";

export default function SplitScreen() {
  const { imageUri, height, width, ocr } = useLocalSearchParams();
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
    const [splits, setSplits] = useState([]);
    const [imageUri, setImageUri] = useState("");

    // Convert the splits into actual image URIs (this is a placeholder)
    const splitImages = splits.map((_, index) => `${imageUri}_split_${index}`);

    router.push({
      pathname: "/preview",
      params: { images: JSON.stringify(splitImages) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <SplitHeader onBack={() => console.log("back")} onPreview={handlePreview} />
          ),
        }}
      />

      <View style={styles.content}>
        <SplitPreview
          imageUri={imageUri as string}
          splits={splits}
          onUpdateSplit={handleUpdateSplit}
          onLoadEnd={() => setIsProcessing(false)}
        />

        <Text style={styles.instructionText}>Press and drag lines to adjust split positions.</Text>

        <SplitActions
          onAddSplit={handleAddSplit}
          onRemoveAllSplits={handleRemoveAllSplits}
          showAddSplit={splits.length < 4}
        />
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
    padding: 16,
  },
  instructionText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginVertical: 8,
    fontSize: 14,
  },
});
