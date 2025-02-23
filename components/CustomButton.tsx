import { StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  variant?: "solid" | "outline";
}

export const CustomButton = ({
  text,
  onPress,
  variant = "solid",
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, variant === "outline" && styles.outlineButton]}>
      <Text style={[styles.buttonText, variant === "outline" && styles.outlineButtonText]}>
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
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outlineButton: {
    backgroundColor: COLORS.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3.84,
  },
  outlineButtonText: {
    color: COLORS.primary,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3.84,
  },
});
