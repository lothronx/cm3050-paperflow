import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface SplitHeaderProps {
  onBack: () => void;
  onPreview: () => void;
}

export const SplitHeader = ({ onBack, onPreview }: SplitHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.button}>
        <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPreview} style={styles.button}>
        <Text style={styles.previewText}>Preview</Text>
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
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: "500",
  },
  previewText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
