/**
 * Preview Screen Component for the PaperFlow application
 * 
 * This screen allows users to:
 * - Preview processed images
 * - Save images to their device
 * - Generate and share a PDF of the images
 * - Navigate back to the home screen
 * 
 * Handles PDF generation and media library permissions
 */

// React and React Native core imports
import { useState } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

// Internationalization
import { useTranslation } from "react-i18next";

// Sharing capabilities
import * as Sharing from "expo-sharing";

// Icon library
import { Ionicons } from "@expo/vector-icons";

// Custom constants, types, and components
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";
import type { PageSize } from "@/types/PageSize";
import { BackArrow } from "@/components/BackArrow";
import { ImageSwiper } from "@/components/ImageSwiper";
import { CustomButton } from "@/components/CustomButton";
import { LoadingIndicator } from "@/components/LoadingIndicator";

// Utility functions and hooks
import { generatePdfFromImages } from "@/utils/generatePdfFromImages";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";

/**
 * Preview Screen Component
 * 
 * Handles image preview, PDF generation, and media saving functionality
 */
export default function PreviewScreen() {
  // Router parameters containing images and page size
  const params = useLocalSearchParams<{ images: string; pageSize: PageSize }>();

  const { t } = useTranslation();

  // Parse the stringified array of image URIs
  const images: string[] = params.images ? JSON.parse(params.images) : [];

  // Media library hook for saving images
  const { saveToLibrary } = useMediaLibrary();

  // State for tracking PDF generation status
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles PDF generation and sharing
   * - Generates PDF from images
   * - Shares PDF using native sharing capabilities
   * - Shows loading indicator during processing
   */
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

  /**
   * Saves processed images to device media library
   * - Handles permission requests
   * - Shows success/error alerts
   */
  const handleSavePhotos = async () => {
    try {
      await saveToLibrary(images);
      Alert.alert("Success", "Images saved successfully!");
    } catch (error) {
      Alert.alert("Permission Required", "Please grant access to save photos");
    }
  };

  /**
   * Navigates back to home screen
   */
  const handleDone = () => {
    router.push("/");
  };

  return (
    // Main background container with image
    <ImageBackground
      source={require("@/assets/images/background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover">
      {/* Loading indicator during PDF generation */}
      {isProcessing && <LoadingIndicator />}

      <SafeAreaView style={styles.container}>
        {/* Back navigation arrow */}
        <BackArrow />

        {/* Image swiper component */}
        <ImageSwiper images={images} />

        {/* Action buttons container */}
        <View style={styles.buttonContainer}>
          <CustomButton
            text={t("preview.savePhotos")}
            onPress={handleSavePhotos}
            variant="outline"
            icon={<Ionicons name="images-outline" size={20} color={COLORS.primary} />}
          />
          <CustomButton
            text={t("preview.sharePDF")}
            onPress={handleSharePDF}
            variant="outline"
            icon={<Ionicons name="document-outline" size={20} color={COLORS.primary} />}
          />
          <CustomButton text={t("preview.done")} onPress={handleDone} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Styles for component layout and appearance
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
    marginBottom: MARGINS.bottom,
  },
});
