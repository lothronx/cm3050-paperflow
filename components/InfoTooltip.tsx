/**
 * InfoTooltip Component
 * 
 * A reusable tooltip component that displays additional information when clicked.
 * Uses react-native-walkthrough-tooltip for the tooltip functionality.
 */
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

/**
 * Props for the InfoTooltip component
 * 
 * @property content - The content to display inside the tooltip
 */
interface InfoTooltipProps {
  content: string;
}

/**
 * InfoTooltip Component
 * 
 * Displays a tooltip with the given content when pressed.
 */
export const InfoTooltip = ({ content }: InfoTooltipProps) => {
  // State to control tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      isVisible={showTooltip}
      content={<Text>{content}</Text>}
      placement="top"
      onClose={() => setShowTooltip(false)}>
      {/* Button to toggle tooltip visibility */}
      <TouchableOpacity onPress={() => setShowTooltip(true)} testID="info-tooltip-button">
        <View style={styles.helpIcon}>
          <Ionicons name="help-circle" size={16} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>
    </Tooltip>
  );
};

// Styles for component layout and appearance
const styles = StyleSheet.create({
  helpIcon: {
    marginLeft: 4,
  },
});
