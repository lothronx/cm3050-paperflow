import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

interface LanguageOptionProps {
  isEnglish: boolean;
  onToggle: () => void;
}

export const LanguageOption = ({ isEnglish, onToggle }: LanguageOptionProps) => (
  <TouchableOpacity
    onPress={onToggle}
    testID="language-option-button"
    style={[
      styles.languageButton,
      { backgroundColor: isEnglish ? COLORS.background : COLORS.textSecondary },
    ]}>
    <FontAwesome6
      name={"language"}
      size={18}
      color={isEnglish ? COLORS.textSecondary : COLORS.background}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  languageButton: {
    position: "absolute",
    top: 64,
    right: 18,
    zIndex: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
