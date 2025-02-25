import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import type { PageSize } from "@/types/PageSize";
import { COLORS } from "@/constants/Colors";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PageSizeOption } from "@/components/PageSizeOption";
import { AutoSplitOption } from "@/components/AutoSplitOption";
import { CustomButton } from "@/components/CustomButton";
import { StorageService } from "@/services/storage";

export default function HomeScreen() {
  const { t } = useTranslation();

  const [autoSplit, setAutoSplit] = useState(true);
  const [pageSize, setPageSize] = useState<PageSize>("A4");

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await StorageService.getSettings();
      if (settings.pageSize) setPageSize(settings.pageSize);
      if (settings.autoSplit !== null) setAutoSplit(settings.autoSplit);
    };
    loadSettings();
  }, []);

  const handlePageSizeChange = async (selectedSize: PageSize) => {
    setPageSize(selectedSize);
    await StorageService.savePageSize(selectedSize);
  };

  const handleAutoSplitChange = async (value: boolean) => {
    setAutoSplit(value);
    await StorageService.saveAutoSplit(value);
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

          <View style={styles.buttonContainer}>
            <CustomButton text={t("home.selectImage")} onPress={handleSelectImage} />
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
