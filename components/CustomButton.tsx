import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  variant?: "solid" | "outline";
  icon?: React.ReactNode;
}

export const CustomButton = ({ text, onPress, variant = "solid", icon }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, variant === "outline" && styles.outlineButton]}>
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.buttonText, variant === "outline" && styles.outlineButtonText]}>
          {text}
        </Text>
      </View>
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
    fontFamily: "Montserrat-Medium",
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
});
