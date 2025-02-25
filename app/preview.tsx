import { StyleSheet, View, SafeAreaView, ImageBackground, Alert, Platform } from "react-native";
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

  const [status, requestPermission] = MediaLibrary.usePermissions();

  const handleSharePDF = async () => {
    try {
      const result = await generatePdfFromImages(images, params.pageSize);

      await Sharing.shareAsync(result.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Failed to share. Please try again.");
    }
  };

  const handleSavePhotos = async () => {
    try {
      // On iOS 11+, it's possible to use saveToLibraryAsync without asking for CAMERA_ROLL permission
      // Thus, only check for permissions on Android
      if (Platform.OS === "android") {
        if (!status?.granted) {
          const permission = await requestPermission();
          if (!permission.granted) {
            Alert.alert(
              "Permission Required",
              "Please go to Settings and grant PaperFlow access to your gallery."
            );
            return;
          }
        }
      }

      await Promise.all(
        images.map(async (uri) => {
          await MediaLibrary.saveToLibraryAsync(uri);
        })
      );

      Alert.alert("Success", "Images saved successfully!");
    } catch (error) {
      Alert.alert(
        "Permission Required",
        "Please go to Settings and grant PaperFlow access to your Photos."
      );
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
