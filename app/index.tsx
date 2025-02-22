import { useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AnimatedTitle />

        <View style={styles.settings}>
          <PageSizeOption title="Page Size" value="A4" onPress={handlePageSizePress} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  settings: {
    marginVertical: 20,
    marginHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 32,
  },
});
