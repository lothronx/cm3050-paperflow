import { useState } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PageSizeOption } from "@/components/PageSizeOption";
import { OCROption } from "@/components/OCROption";
import { CustomButton } from "@/components/CustomButton";
import { COLORS } from "@/constants/Colors";

export default function HomeScreen() {
  const [preventTruncation, setPreventTruncation] = useState(false);

  const handleSelectImage = () => {
    // Implement image selection logic
    console.log("Select image pressed");
  };

  const handlePageSizePress = () => {
    // Implement page size selection logic
    console.log("Page size pressed");
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
            <PageSizeOption value="A4" onValueChange={handlePageSizePress} />
            <OCROption
              title="Prevent Text Truncation"
              value={preventTruncation}
              onValueChange={setPreventTruncation}
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
