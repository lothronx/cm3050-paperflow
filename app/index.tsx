import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PageSize } from "@/types/PageSize";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PageSizeOption } from "@/components/PageSizeOption";
import { AutoSplitOption } from "@/components/AutoSplitOption";
import { CustomButton } from "@/components/CustomButton";
import { COLORS } from "@/constants/Colors";

const STORAGE_KEYS = {
  PAGE_SIZE: "@paperflow_page_size",
  AUTO_SPLIT: "@paperflow_auto_split",
} as const;

export default function HomeScreen() {
  const [autoSplit, setAutoSplit] = useState(true);
  const [pageSize, setPageSize] = useState<PageSize>("A4");

  useEffect(() => {
    const getData = async () => {
      try {
        const [savedPageSize, savedAutoSplit] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PAGE_SIZE),
          AsyncStorage.getItem(STORAGE_KEYS.AUTO_SPLIT),
        ]);

        if (savedPageSize) {
          setPageSize(savedPageSize as PageSize);
        }
        if (savedAutoSplit !== null) {
          setAutoSplit(savedAutoSplit === "true");
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

  const handleAutoSplitChange = async (value: boolean) => {
    setAutoSplit(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_SPLIT, value.toString());
    } catch (error) {
      console.error("Error saving autoSplit setting:", error);
    }
  };

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      router.push({
        pathname: "/split",
        params: {
          imageUri: result.assets[0].uri,
          imageHeight: result.assets[0].height,
          imageWidth: result.assets[0].width,
          pageSize: pageSize,
          autoSplit: autoSplit ? "true" : "false",
        },
      });
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <AnimatedTitle />

          <View style={styles.settings}>
            <PageSizeOption
              title="Page Size"
              tooltip="Select the page size for splitting your image"
              defaultValue={pageSize}
              onValueChange={handlePageSizeChange}
            />
            <AutoSplitOption
              title="Auto Split"
              tooltip="Enable automatic image splitting according to the selected page size"
              defaultValue={autoSplit}
              onValueChange={handleAutoSplitChange}
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
