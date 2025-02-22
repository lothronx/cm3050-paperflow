import { StyleSheet, View, Switch } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";
interface OCROptionProps {
  title: string;
  defaultValue: boolean;
  onValueChange: (value: boolean) => void;
}

export const OCROption = ({ title, defaultValue, onValueChange }: OCROptionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: COLORS.text,
  },
});
