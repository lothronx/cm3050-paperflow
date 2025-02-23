import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";


interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip = ({ content }: InfoTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      isVisible={showTooltip}
      content={<Text>{content}</Text>}
      placement="top"
      onClose={() => setShowTooltip(false)}>
      <TouchableOpacity onPress={() => setShowTooltip(true)}>
        <View style={styles.helpIcon}>
          <Ionicons name="help-circle" size={16} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  helpIcon: {
    marginLeft: 4,
  },
});
