/**
 * Language Option Component for the PaperFlow application
 *
 * Provides a toggle button for switching between English and other languages
 * Handles language state and updates the UI accordingly
 */

// React Native core imports
import { TouchableOpacity, StyleSheet } from "react-native";

// Icons
import { FontAwesome6 } from "@expo/vector-icons";

// App constants
import { COLORS } from "@/constants/Colors";
import { MARGINS } from "@/constants/Margins";

/**
 * Interface defining the props for the LanguageOption component
 *
 * @property isEnglish - Boolean indicating if English is currently selected
 * @property onToggle - Callback function to handle language toggle
 */
interface LanguageOptionProps {
  isEnglish: boolean;
  onToggle: () => void;
}

/**
 * Language Option Component
 *
 * A touchable language toggle button with appropriate styling
 */
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
      size={24}
      color={isEnglish ? COLORS.textSecondary : COLORS.background}
    />
  </TouchableOpacity>
);

// Styles for the language toggle button
const styles = StyleSheet.create({
  languageButton: {
    position: "absolute",
    top: MARGINS.top,
    right: MARGINS.horizontal,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
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
