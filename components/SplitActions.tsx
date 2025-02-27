import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";
import { Text } from "@/components/Text";


interface SplitActionsProps {
  onAddSplit: () => void;
  onRemoveAllSplits: () => void;
}

export const SplitActions = ({ onAddSplit, onRemoveAllSplits }: SplitActionsProps) => {
  const { t } = useTranslation();

  const handleRemoveAllSplits = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onRemoveAllSplits();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRemoveAllSplits}>
        <View style={styles.button}>
          <Text style={styles.removeText}>{t("split.removeAllSplits")}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onAddSplit}>
        <View style={styles.button}>
          <Text style={styles.addText}>{t("split.addSplit")}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  button: {
    paddingHorizontal: MARGINS.horizontal,
    paddingVertical: 16,
    marginBottom: MARGINS.bottom,
    alignItems: "center",
  },
  removeText: {
    color: COLORS.secondary,
    fontFamily: "Montserrat-Medium",
  },
  addText: {
    color: COLORS.primary,
    fontFamily: "Montserrat-Medium",
  },
});
