import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

export const PreviewHeader = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Preview</Text>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="share-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: 70,
  },
  backText: {
    fontSize: 17,
    color: COLORS.primary,
    marginLeft: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },
});
