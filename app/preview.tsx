"use client";

import { StyleSheet, View, SafeAreaView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { COLORS } from "@/constants/Colors";
import { BackArrow } from "@/components/BackArrow";
import { ImageSwiper } from "@/components/ImageSwiper";
import { CustomButton } from "@/components/CustomButton";

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

  const handleDone = () => {
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackArrow />
      <View style={styles.content}>
        <ImageSwiper images={imageUris} />

        <View style={styles.buttonContainer}>
          <CustomButton
            text="Share as Photos"
            onPress={() => handleShare("photos")}
            variant="outline"
          />
          <CustomButton text="Share as PDF" onPress={() => handleShare("pdf")} variant="outline" />
          <CustomButton text="Done" onPress={handleDone} />
        </View>
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
  buttonContainer: {
    gap: 10,
    marginBottom: 32,
  },
});
