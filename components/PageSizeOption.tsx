import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";
import { useState } from "react";
import { PageSizeModal } from "./PageSizeModal";
import { InfoTooltip } from "./InfoTooltip";

export type PageSize = "A4" | "Letter" | "Legal" | "Manual";

const PAGE_SIZE_OPTIONS: PageSize[] = ["A4", "Letter", "Legal", "Manual"];

interface PageSizeOptionProps {
  title: string;
  tooltip?: string;
  defaultValue?: PageSize;
  onValueChange?: (value: PageSize) => void;
}

export const PageSizeOption = ({
  title,
  tooltip,
  defaultValue,
  onValueChange,
}: PageSizeOptionProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (selectedValue: PageSize) => {
    onValueChange?.(selectedValue);
    setIsModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {tooltip && <InfoTooltip content={tooltip} />}
        </View>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <View style={styles.rightContent}>
            {defaultValue && <Text style={styles.value}>{defaultValue}</Text>}
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      <PageSizeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSelect}
        value={defaultValue}
        options={PAGE_SIZE_OPTIONS}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 4,
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
