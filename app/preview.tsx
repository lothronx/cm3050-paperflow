import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { BackArrow } from "@/components/BackArrow";
import { ImageSwiper } from "@/components/ImageSwiper";
import { CustomButton } from "@/components/CustomButton";

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ images: string }>();

  // Parse the stringified array of image URIs
  const images: string[] = params.images ? JSON.parse(params.images) : [];

  const handleShare = async (type: "photos" | "pdf") => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert("Sharing is not available on your platform");
        return;
      }
      if (type === "photos") {
        // Share multiple images
        await Promise.all(
          images.map(async (imageUri) => {
            await Sharing.shareAsync(imageUri);
          })
        );
      } else {
        // // Generate and share PDF
        // const { filePath } = await createPdf({
        //   imagePaths: images,
        //   name: "paperflow_scan",
        //   paperSize: "A4",
        // });
        // await Sharing.shareAsync(filePath);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Failed to share. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      // Implement saving logic
      console.log(images);
    } finally {
    }
  };

  const handleDone = () => {
    router.push("/");
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <BackArrow />
        <View style={styles.content}>
          <ImageSwiper images={images} />

          <View style={styles.buttonContainer}>
            <CustomButton
              text="Share as Photos"
              onPress={() => handleShare("photos")}
              variant="outline"
              icon={<Ionicons name="images-outline" size={20} color={COLORS.primary} />}
            />
            <CustomButton
              text="Share as PDF"
              onPress={() => handleShare("pdf")}
              variant="outline"
              icon={<Ionicons name="document-outline" size={20} color={COLORS.primary} />}
            />
            <CustomButton text="Done" onPress={handleDone} />
          </View>
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
  content: {
    flex: 1,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 32,
  },
});
