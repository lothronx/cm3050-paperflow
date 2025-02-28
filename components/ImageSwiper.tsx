/**
 * Image Swiper Component
 * 
 * Provides a image carousel with:
 * - Custom pagination dots
 * - Image carousel display
 * - Shadow effects for container
 */

// Swiper library for image carousel
import Swiper from "react-native-swiper";

// React Native core imports
import { View, Image, StyleSheet } from "react-native";

// Custom constants
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";

/**
 * Props for ImageSwiper component
 * 
 * @property images - Array of image URIs to display in the swiper
 */
interface ImageSwiperProps {
  images: string[];
}

/**
 * Image Swiper Component
 * 
 * Displays a image carousel with custom pagination
 */
export const ImageSwiper = ({ images }: ImageSwiperProps) => {
  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
        loop={false}
        showsButtons={false}
        showsPagination={true}>
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

// Styles for component layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: MARGINS.horizontal,
    marginTop: 12,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wrapper: {},
  slide: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    bottom: -20,
  },
  dot: {
    backgroundColor: COLORS.background,
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 3,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
