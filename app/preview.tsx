import { StyleSheet, View, SafeAreaView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { COLORS } from "@/constants/Colors";
import { PreviewHeader } from "@/components/PreviewHeader";
import { ShareOptions } from "@/components/ShareOptions";
import { PreviewGrid } from "@/components/PreviewGrid";
import { PreviewActions } from "@/components/PreviewActions";

export default function PreviewScreen() {
  const { images } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Parse the stringified array of image URIs
  const imageUris = typeof images === "string" ? JSON.parse(images) : [];

  const handleShare = async (type: "photos" | "pdf") => {
    setIsLoading(true);
    try {
      // Implement sharing logic
      console.log(`Sharing as ${type}`, imageUris);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (type: "photos" | "pdf") => {
    setIsLoading(true);
    try {
      // Implement saving logic
      console.log(`Saving as ${type}`, imageUris);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <PreviewHeader />,
        }}
      />

      <View style={styles.content}>
        <ShareOptions onShare={handleShare} />
        <PreviewGrid images={imageUris} />
        <PreviewActions onSave={handleSave} isLoading={isLoading} />
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
});
