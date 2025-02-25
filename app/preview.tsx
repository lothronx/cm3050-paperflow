import { StyleSheet, View, SafeAreaView, ImageBackground, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { type PageSize } from "@/constants/PageSizes";
import { BackArrow } from "@/components/BackArrow";
import { ImageSwiper } from "@/components/ImageSwiper";
import { CustomButton } from "@/components/CustomButton";
import generatePdfFromImages from "@/utils/generatePdfFromImages";

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ images: string; pageSize: PageSize }>();

  // Parse the stringified array of image URIs
  const images: string[] = params.images ? JSON.parse(params.images) : [];

  const handleSharePDF = async () => {
    try {
      const result = await generatePdfFromImages(images, params.pageSize);

      await Sharing.shareAsync(result.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Failed to share. Please try again.");
    }
  };

  const handleSavePhotos = async () => {
    try {
      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant permission to save photos.");
        return;
      }

      // Save each image to the photo gallery
      const savedAssets = await Promise.all(
        images.map(async (uri) => {
          const asset = await MediaLibrary.createAssetAsync(uri);
          return asset;
        })
      );

      if (savedAssets.length > 0) {
        Alert.alert("Success", "Images saved successfully!");
      }
    } catch (error) {
      console.error("Error saving photos:", error);
      Alert.alert("Error", "Failed to save photos. Please try again.");
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
