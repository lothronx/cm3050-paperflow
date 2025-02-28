/**
 * Page Size Modal Component for the PaperFlow application
 *
 * Displays a modal for selecting page sizes
 * Handles page size selection and modal state management
 */

// React Native core imports
import { StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView, View } from "react-native";

// Internationalization
import { useTranslation } from "react-i18next";

// Icon library
import { Ionicons } from "@expo/vector-icons";

// Custom constants, types, and components
import { COLORS } from "@/constants/Colors";
import type { PageSize } from "@/types/PageSize";
import { Text } from "@/components/Text";

/**
 * Interface defining the props for the PageSizeModal component
 *
 * @property isVisible - Boolean controlling modal visibility
 * @property onClose - Callback function to close the modal
 * @property onSelect - Callback function for page size selection
 * @property value - Currently selected page size
 * @property options - Array of available page size options
 */
interface PageSizeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (value: PageSize) => void;
  value?: PageSize;
  options: PageSize[];
}

/**
 * Page Size Modal Component
 *
 * A modal component for page size selection
 */
export const PageSizeModal = ({
  isVisible,
  onClose,
  onSelect,
  value,
  options,
}: PageSizeModalProps) => {
  const { t } = useTranslation();

  return (
    // Main modal container with slide animation
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Overlay that captures clicks outside the modal */}
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
        testID="modal-overlay">
        {/* Safe area container for modal content */}
        <SafeAreaView style={styles.modalContent}>
          <TouchableOpacity activeOpacity={1}>
            {/* Modal header with title and close button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("modal.title")}</Text>
              <TouchableOpacity onPress={onClose} testID="close-button">
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {/* FlatList of page size options */}
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                // Individual option item with selection state
                <TouchableOpacity
                  style={[styles.optionItem, item === value && styles.selectedOption]}
                  onPress={() => onSelect(item)}>
                  <Text style={[styles.optionText, item === value && styles.selectedOptionText]}>
                    {item}
                  </Text>
                  {/* Checkmark icon for selected option */}
                  {item === value && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

// Styles for the modal and its components
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: COLORS.text,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  selectedOption: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  optionText: {
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
  },
});
