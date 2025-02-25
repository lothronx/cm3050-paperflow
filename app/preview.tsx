import { useState } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import type { PageSize } from "@/types/PageSize";
import { BackArrow } from "@/components/BackArrow";
import { ImageSwiper } from "@/components/ImageSwiper";
import { CustomButton } from "@/components/CustomButton";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import generatePdfFromImages from "@/utils/generatePdfFromImages";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ images: string; pageSize: PageSize }>();

  // Parse the stringified array of image URIs
  const images: string[] = params.images ? JSON.parse(params.images) : [];

  const { saveToLibrary } = useMediaLibrary();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSharePDF = async () => {
    try {
      setIsProcessing(true);

      const result = await generatePdfFromImages(images, params.pageSize);

      await Sharing.shareAsync(result.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Failed to share. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePhotos = async () => {
    try {
      await saveToLibrary(images);
      Alert.alert("Success", "Images saved successfully!");
    } catch (error) {
      Alert.alert("Permission Required", "Please grant access to save photos");
    }
  };

  const handleDone = () => {
    router.push("/");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover">
      {isProcessing && <LoadingIndicator />}
      <SafeAreaView style={styles.container}>
        <BackArrow />

        <ImageSwiper images={images} />

        <View style={styles.buttonContainer}>
          <CustomButton
            text="Save Photos"
            onPress={handleSavePhotos}
            variant="outline"
            icon={<Ionicons name="images-outline" size={20} color={COLORS.primary} />}
          />
          <CustomButton
            text="Share PDF"
            onPress={handleSharePDF}
            variant="outline"
            icon={<Ionicons name="document-outline" size={20} color={COLORS.primary} />}
          />
          <CustomButton text="Done" onPress={handleDone} />
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
  buttonContainer: {
    gap: 10,
    marginBottom: 32,
  },
});
