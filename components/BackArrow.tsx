import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";

export const BackArrow = () => {
  return (
    <View style={styles.backArrow}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: 64,
    left: 18,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
