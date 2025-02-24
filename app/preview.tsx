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
  const params = useLocalSearchParams<{ images: string }>();

  // Parse the stringified array of image URIs
  const images: string[] = params.images ? JSON.parse(params.images) : [];

  const generatePdfForImages = async (uris: string[]) => {
    const images = await Promise.all(uris.map((uri) => manipulateAsync(uri, [], { base64: true })));

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              margin: 0;
              size: auto;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .page {
              width: 100vw;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              page-break-after: always;
            }
            .page:last-child {
              page-break-after: avoid;
            }
            img {
              max-width: 100%;
              max-height: 100%;
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
      
    });
  };

  const handleShare = async (type: "photos" | "pdf") => {
    try {
      if (type === "photos") {
      } else {
        // Generate PDF for first image (for testing)
        const result = await generatePdfForImages(images);

        await Sharing.shareAsync(result.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share PDF",
          UTI: "com.adobe.pdf",
        });
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
