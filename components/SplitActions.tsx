import { StyleSheet, View, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface SplitActionsProps {
  onAddSplit: () => void;
  onRemoveAllSplits: () => void;
}

export const SplitActions = ({ onAddSplit, onRemoveAllSplits }: SplitActionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onRemoveAllSplits}>
        <Text style={styles.removeText}>Remove All Splits</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onAddSplit}>
        <Text style={styles.addText}>Add Split</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  removeText: {
    color: COLORS.secondary,
    fontWeight: "500",
  },
  addText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});
