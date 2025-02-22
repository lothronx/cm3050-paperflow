import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface PageSizeOptionProps {
  title: string;
  value?: string;
  showIcon?: boolean;
  onPress?: () => void;
}

export const PageSizeOption = ({ title, value, showIcon = true, onPress }: PageSizeOptionProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightContent}>
          {value && <Text style={styles.value}>{value}</Text>}
          {showIcon && <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    color: COLORS.text,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  value: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
