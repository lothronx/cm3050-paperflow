import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PageSizeOption } from "@/components/PageSizeOption";
import { OCROption } from "@/components/OCROption";
import { CustomButton } from "@/components/CustomButton";
import { COLORS } from "@/constants/Colors";
import { type PageSize } from "@/constants/PageSizes";

const STORAGE_KEYS = {
  PAGE_SIZE: "@paperflow_page_size",
  OCR: "@paperflow_ocr",
} as const;

export default function HomeScreen() {
  const [ocr, setOcr] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("A4");

  useEffect(() => {
    const getData = async () => {
      try {
        const [savedPageSize, savedOcr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PAGE_SIZE),
          AsyncStorage.getItem(STORAGE_KEYS.OCR),
        ]);

        if (savedPageSize) {
          setPageSize(savedPageSize as PageSize);
        }
        if (savedOcr !== null) {
          setOcr(savedOcr === "true");
        }
      } catch (error) {
        console.error("Error loading saved values:", error);
      }
    };

    getData();
  }, []);

  const handlePageSizeChange = async (selectedSize: PageSize) => {
    setPageSize(selectedSize);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PAGE_SIZE, selectedSize);
    } catch (error) {
      console.error("Error saving page size:", error);
    }
  };

  const handleOcrChange = async (value: boolean) => {
    setOcr(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OCR, value.toString());
    } catch (error) {
      console.error("Error saving OCR setting:", error);
    }
  };

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    // result = {
    //   assets: [
    //     {
    //       assetId: "ED7AC36B-A150-4C38-BB8C-B6D696F4F2ED/L0/001",
    //       base64: null,
    //       duration: null,
    //       exif: null,
    //       fileName: "test-1.jpg",
    //       fileSize: 1922839,
    //       height: 16363,
    //       mimeType: "image/jpg",
    //       pairedVideoAsset: null,
    //       type: "image",
    //       uri: "file:///Users/lothron/Documents/UoL/CM3050-Mobile-Development/paperflow/assets/images/test-1.jpg",
    //       width: 682,
    //     },
    //   ],
    //   canceled: false,
    // };

    if (!result.canceled) {
      router.push({
        pathname: "/split",
        params: {
          imageUri: result.assets[0].uri,
          height: result.assets[0].height,
          width: result.assets[0].width,
          pageSize: pageSize,
          ocr: ocr.toString(),
        },
      });
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <AnimatedTitle />

          <View style={styles.settings}>
            <PageSizeOption
              title="Page Size"
              tooltip="Choose the page size for splitting your image."
              defaultValue={pageSize}
              onValueChange={handlePageSizeChange}
            />
            <OCROption
              title="Prevent Text Truncation"
              tooltip="Enable this to detect text using OCR (requires internet). This ensures your text stays complete during splitting."
              defaultValue={ocr}
              onValueChange={handleOcrChange}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton text="Select Image" onPress={handleSelectImage} />
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
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  settings: {
    margin: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    borderRadius: 16,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
});
