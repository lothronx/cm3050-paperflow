import { StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";
import { PageSize } from "./PageSizeOption";

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
  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <SafeAreaView style={styles.modalContent}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Page Size</Text>
              <TouchableOpacity onPress={onClose}>
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
    fontWeight: "600",
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
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
  },
});
