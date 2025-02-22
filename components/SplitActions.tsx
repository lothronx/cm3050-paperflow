import { StyleSheet, View, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface SplitActionsProps {
  onAddSplit: () => void;
  onRemoveAllSplits: () => void;
  showAddSplit: boolean;
}

export const SplitActions = ({
  onAddSplit,
  onRemoveAllSplits,
  showAddSplit,
}: SplitActionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onRemoveAllSplits}>
        <Text style={styles.removeText}>Remove All Splits</Text>
      </TouchableOpacity>
      {showAddSplit && (
        <TouchableOpacity onPress={onAddSplit}>
          <Text style={styles.addText}>Add Split</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  removeText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "500",
  },
  addText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
