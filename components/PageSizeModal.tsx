import { StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import type { PageSize } from "@/types/PageSize";
import { Text } from "@/components/Text";

interface PageSizeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (value: PageSize) => void;
  value?: PageSize;
  options: PageSize[];
}

export const PageSizeModal = ({
  isVisible,
  onClose,
  onSelect,
  value,
  options,
}: PageSizeModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
        testID="modal-overlay">
        <SafeAreaView style={styles.modalContent}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("modal.title")}</Text>
              <TouchableOpacity onPress={onClose} testID="close-button">
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, item === value && styles.selectedOption]}
                  onPress={() => onSelect(item)}>
                  <Text style={[styles.optionText, item === value && styles.selectedOptionText]}>
                    {item}
                  </Text>
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
    fontFamily: "Montserrat_600SemiBold",
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
