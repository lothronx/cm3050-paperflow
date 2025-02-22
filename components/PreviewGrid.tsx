import { StyleSheet, View, Image, Dimensions } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface PreviewGridProps {
  images: string[];
}

export const PreviewGrid = ({ images }: PreviewGridProps) => {
  const screenWidth = Dimensions.get("window").width;
  const padding = 32; // Total horizontal padding
  const gap = 8; // Gap between items
  const itemWidth = (screenWidth - padding - gap * 2) / 3;

  return (
    <View style={styles.container}>
      {[...Array(9)].map((_, index) => (
        <View key={index} style={[styles.imageContainer, { width: itemWidth, height: itemWidth }]}>
          {images[index] ? (
            <Image source={{ uri: images[index] }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Image {index + 1}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 16,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
