import { StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  variant?: "solid" | "outline";
  disabled?: boolean;
}

export const CustomButton = ({
  text,
  onPress,
  variant = "solid",
  disabled = false,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.button,
        variant === "outline" && styles.outlineButton,
        disabled && styles.disabledButton,
      ]}>
      <Text
        style={[
          styles.buttonText,
          variant === "outline" && styles.outlineButtonText,
          disabled && styles.disabledButtonText,
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.backgroundSecondary,
    borderColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "500",
  },
  outlineButtonText: {
    color: COLORS.primary,
  },
  disabledButtonText: {
    color: COLORS.textSecondary,
  },
});
