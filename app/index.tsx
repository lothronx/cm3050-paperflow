import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PageSizeOption, PageSize } from "@/components/PageSizeOption";
import { OCROption } from "@/components/OCROption";
import { CustomButton } from "@/components/CustomButton";
import { COLORS } from "@/constants/Colors";

const STORAGE_KEYS = {
  PAGE_SIZE: "@paperflow_page_size",
  OCR: "@paperflow_ocr",
} as const;

export default function HomeScreen() {
  const [ocr, setOcr] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("A4");

  useEffect(() => {
    // Load saved values when component mounts
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

  const handleSelectImage = () => {
    // Implement image selection logic
    console.log("Select image pressed");
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
              title="Select Page Size"
              defaultValue={pageSize}
              onValueChange={handlePageSizeChange}
            />
            <OCROption
              title="Prevent Text Truncation"
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
    marginVertical: 20,
    marginHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    borderRadius: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 32,
  },
});
