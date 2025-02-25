import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { BackArrow } from "@/components/BackArrow";
import { ImageSwiper } from "@/components/ImageSwiper";
import { CustomButton } from "@/components/CustomButton";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { manipulateAsync } from "expo-image-manipulator";
import { type PageSize, PageSizes } from "@/constants/PageSizes";

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ images: string; pageSize: PageSize }>();

  // Parse the stringified array of image URIs
  const images: string[] = params.images ? JSON.parse(params.images) : [];

  const generatePdfForImages = async (uris: string[], pageSize: PageSize) => {
    const images = await Promise.all(uris.map((uri) => manipulateAsync(uri, [], { base64: true })));

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            .page {
              width: 100%;
              height: 100%;
              page-break-after: always;
            }
            .page:last-child {
              page-break-after: avoid;
            }
            img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          ${images
            .map(
              (image) => `
            <div class="page">
              <img src="data:image/jpeg;base64,${image.base64}" />
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;

    return Print.printToFileAsync({
      html,
      base64: false,
      height: PageSizes[pageSize].height,
      width: PageSizes[pageSize].width,
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  };

  const handleSharePDF = async () => {
    try {
      const result = await generatePdfForImages(images, params.pageSize);

      await Sharing.shareAsync(result.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Failed to share. Please try again.");
    }
  };

  const handleSavePhotos = async () => {
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

        <ImageSwiper images={images} />

        <View style={styles.buttonContainer}>
          <CustomButton
            text="Save as Photos"
            onPress={handleSavePhotos}
            variant="outline"
            icon={<Ionicons name="images-outline" size={20} color={COLORS.primary} />}
          />
          <CustomButton
            text="Share as PDF"
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
