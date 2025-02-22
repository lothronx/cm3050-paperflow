import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface ShareOptionsProps {
  onShare: (type: "photos" | "pdf") => void;
}

export const ShareOptions = ({ onShare }: ShareOptionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={() => onShare("photos")}>
        <Text style={styles.optionText}>Share as Photos</Text>
        <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => onShare("pdf")}>
        <Text style={styles.optionText}>Share as PDF</Text>
        <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
