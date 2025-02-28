/**
 * Split Actions Component
 * 
 * Provides UI buttons for managing splits in the application.
 * Includes:
 * - A button to remove all splits
 * - A button to add a new split
 */

// Core React and React Native imports
import { StyleSheet, View, TouchableOpacity } from "react-native";

// Internationalization
import { useTranslation } from "react-i18next";

// Haptics for feedback
import * as Haptics from "expo-haptics";

// Custom constants and components
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";
import { Text } from "@/components/Text";

/**
 * Props for SplitActions component
 * 
 * @property onAddSplit - Callback when the 'Add Split' button is pressed
 * @property onRemoveAllSplits - Callback when the 'Remove All Splits' button is pressed
 */
interface SplitActionsProps {
  onAddSplit: () => void;
  onRemoveAllSplits: () => void;
}

/**
 * Split Actions Component
 * 
 * Displays buttons for adding and removing splits.
 * Provides haptic feedback when removing all splits.
 */
export const SplitActions = ({ onAddSplit, onRemoveAllSplits }: SplitActionsProps) => {
  const { t } = useTranslation();

  // Handle removal of all splits with haptic feedback
  const handleRemoveAllSplits = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onRemoveAllSplits();
  };

  return (
    <View style={styles.container}>
      {/* Button to remove all splits */}
      <TouchableOpacity onPress={handleRemoveAllSplits}>
        <View style={styles.button}>
          <Text style={styles.removeText}>{t("split.removeAllSplits")}</Text>
        </View>
      </TouchableOpacity>

      {/* Button to add a new split */}
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
