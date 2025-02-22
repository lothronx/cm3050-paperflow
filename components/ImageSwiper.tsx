import Swiper from "react-native-swiper";
import { View, Image, StyleSheet } from "react-native";
import { COLORS } from "@/constants/Colors";

interface ImageSwiperProps {
  images: string[];
}

export const ImageSwiper = ({ images }: ImageSwiperProps) => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: COLORS.backgroundSecondary,
  },
  swiper: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dot: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: "#007AFF",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});
