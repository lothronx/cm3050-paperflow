/**
 * Auto Split Option Component
 * 
 * Provides a toggle switch for enabling/disabling automatic image splitting
 * Includes:
 * - Title text
 * - Optional tooltip for additional information
 * - Custom styled switch
 */

// React Native core imports
import { StyleSheet, View, Switch } from "react-native";

// Custom constants and components
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";
import { Text } from "@/components/Text";
import { InfoTooltip } from "@/components/InfoTooltip";


/**
 * Props for AutoSplitOption component
 * 
 * @property title - The text to display next to the switch
 * @property tooltip - Optional tooltip content for additional information
 * @property defaultValue - Initial value of the switch
 * @property onValueChange - Callback when switch value changes
 */
interface AutoSplitOptionProps {
  title: string;
  tooltip?: string;
  defaultValue: boolean;
  onValueChange: (value: boolean) => void;
}

/**
 * Auto Split Option Component
 * 
 * Displays a toggle switch with title and optional tooltip
 */
export const AutoSplitOption = ({
  title,
  tooltip,
  defaultValue,
  onValueChange,
}: AutoSplitOptionProps) => {
  return (
    <View style={styles.container} testID="auto-split-option">
      {/* Title and tooltip container */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {tooltip && <InfoTooltip content={tooltip} />}
      </View>

      {/* Toggle switch */}
      <Switch
        value={defaultValue}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        ios_backgroundColor={COLORS.border}
      />
    </View>
  );
};

// Styles for component layout and appearance
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: MARGINS.horizontal,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    marginRight: 4,
  },
});
