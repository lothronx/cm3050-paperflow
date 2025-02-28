/**
 * Page Size Option Component
 * 
 * Provides a UI for selecting a page size from predefined options.
 * Includes:
 * - Title text
 * - Optional tooltip for additional information
 * - A button to open a modal for selecting page sizes
 */

// Core React and React Native imports
import { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

// Icon library
import { Ionicons } from "@expo/vector-icons";

// Custom constants, types, and components
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";
import { PageSizes } from "@/constants/PageSizes";
import type { PageSize } from "@/types/PageSize";
import { Text } from "@/components/Text";
import { PageSizeModal } from "@/components/PageSizeModal";
import { InfoTooltip } from "@/components/InfoTooltip";


/**
 * Props for PageSizeOption component
 * 
 * @property title - The text to display next to the page size selector
 * @property tooltip - Optional tooltip content for additional information
 * @property defaultValue - The currently selected page size
 * @property onValueChange - Callback when a new page size is selected
 */
interface PageSizeOptionProps {
  title: string;
  tooltip?: string;
  defaultValue?: PageSize;
  onValueChange?: (value: PageSize) => void;
}

/**
 * Page Size Option Component
 * 
 * Displays a selector for choosing a page size from predefined options.
 * Opens a modal for selection when the button is pressed.
 */
export const PageSizeOption = ({
  title,
  tooltip,
  defaultValue,
  onValueChange,
}: PageSizeOptionProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle selection of a new page size
  const handleSelect = (selectedValue: PageSize) => {
    onValueChange?.(selectedValue);
    setIsModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Title and tooltip container */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {tooltip && <InfoTooltip content={tooltip} />}
        </View>

        {/* Button to open the page size selection modal */}
        <TouchableOpacity onPress={() => setIsModalVisible(true)} testID="page-size-button">
          <View style={styles.rightContent}>
            {defaultValue && <Text style={styles.value}>{defaultValue}</Text>}
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting a page size */}
      <PageSizeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSelect}
        value={defaultValue}
        options={Object.keys(PageSizes) as PageSize[]}
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
    paddingHorizontal: MARGINS.horizontal,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    marginRight: 4,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  value: {
    color: COLORS.textSecondary,
  },
});
