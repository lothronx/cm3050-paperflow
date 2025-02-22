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
        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
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
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 17,
    color: COLORS.primary,
    marginLeft: 4,
  },
  previewText: {
    fontSize: 17,
    color: COLORS.primary,
  },
});
