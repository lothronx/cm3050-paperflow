import { StyleSheet, View, Switch } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";
import { InfoTooltip } from "@/components/InfoTooltip";
import { MARGINS } from "@/constants/Margins";
interface AutoSplitOptionProps {
  title: string;
  tooltip?: string;
  defaultValue: boolean;
  onValueChange: (value: boolean) => void;
}

export const AutoSplitOption = ({ title, tooltip, defaultValue, onValueChange }: AutoSplitOptionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {tooltip && <InfoTooltip content={tooltip} />}
      </View>
      <Switch
        value={defaultValue}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        ios_backgroundColor={COLORS.border}
      />
    </View>
  );
};

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
