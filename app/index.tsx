/**
 * Home Screen Component for the PaperFlow application
 * 
 * This is the main entry point of the application where users can:
 * - Select their preferred page size (A4, etc.)
 * - Toggle automatic page splitting
 * - Choose the application language
 * - Select images for processing
 * 
 * The component handles user preferences persistence and navigation to the split screen
 * when an image is selected.
 */

// Core React and React Native imports
import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground, Platform } from "react-native";
import { router } from "expo-router";

// Internationalization
import { useTranslation } from "react-i18next";

// Image handling and file system
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// Custom constants, types, and components
import type { PageSize } from "@/types/PageSize";
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PageSizeOption } from "@/components/PageSizeOption";
import { AutoSplitOption } from "@/components/AutoSplitOption";
import { CustomButton } from "@/components/CustomButton";
import { LanguageOption } from "@/components/LanguageOption";
import { StorageService } from "@/services/storage";

/**
 * Home Screen Component
 * 
 * Handles user preferences, image selection, and navigation to the split screen
 */
export default function HomeScreen() {
  const { t, i18n } = useTranslation();

  // State management for user preferences
  const [autoSplit, setAutoSplit] = useState(true);
  const [pageSize, setPageSize] = useState<PageSize>("A4");

  /**
   * Load saved user settings on component mount
   * Retrieves previously saved page size and auto-split preferences
   */
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await StorageService.getSettings();
      if (settings.pageSize) setPageSize(settings.pageSize);
      if (settings.autoSplit !== null) setAutoSplit(settings.autoSplit);
    };
    loadSettings();
  }, []);

  /**
   * Updates the selected page size and persists it to storage
   * @param selectedSize - The new page size selected by the user
   */
  const handlePageSizeChange = async (selectedSize: PageSize) => {
    setPageSize(selectedSize);
    await StorageService.savePageSize(selectedSize);
  };

  /**
   * Updates the auto-split preference and persists it to storage
   * @param value - The new auto-split value
   */
  const handleAutoSplitChange = async (value: boolean) => {
    setAutoSplit(value);
    await StorageService.saveAutoSplit(value);
  };

  /**
   * Toggles between English and Chinese language
   */
  const handleLanguageChange = async () => {
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  /**
   * Handles image selection from device library
   * - Opens image picker
   * - Handles platform-specific URI management for Android
   * - Navigates to split screen with image and settings
   */
  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      let imageUri = result.assets[0].uri;

      // Handle Android-specific behavior
      if (Platform.OS === "android") {
        const fileName = imageUri.split("/").pop(); // Extract the file name
        const newUri = `${FileSystem.cacheDirectory}${fileName}`;

        // Copy the file to a persistent location
        await FileSystem.copyAsync({
          from: imageUri,
          to: newUri,
        });

        imageUri = newUri; // Update the URI to the persistent location
      }

      router.push({
        pathname: "/split",
        params: {
          imageUri: imageUri,
          imageHeight: result.assets[0].height,
          imageWidth: result.assets[0].width,
          pageSize: pageSize,
          autoSplit: autoSplit ? "true" : "false",
        },
      });
    }
  };

  return (
    // Main background container with image
    <ImageBackground
      source={require("@/assets/images/background.jpeg")}
      style={styles.backgroundImage}
      resizeMode="cover">
      {/* Language toggle in the top-right corner */}
      <LanguageOption isEnglish={i18n.language === "en"} onToggle={handleLanguageChange} />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Animated title component */}
          <AnimatedTitle />

          {/* User settings section */}
          <View style={styles.settings}>
            <PageSizeOption
              title={t("home.pageSize")}
              tooltip={t("home.pageSizeTooltip")}
              defaultValue={pageSize}
              onValueChange={handlePageSizeChange}
            />
            <AutoSplitOption
              title={t("home.autoSplit")}
              tooltip={t("home.autoSplitTooltip")}
              defaultValue={autoSplit}
              onValueChange={handleAutoSplitChange}
            />
          </View>

          {/* Image selection button */}
          <View style={styles.buttonContainer}>
            <CustomButton text={t("home.selectImage")} onPress={handleSelectImage} />
          </View>
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
    marginBottom: MARGINS.bottom,
  },
});
