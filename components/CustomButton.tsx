import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Text } from "@/components/Text";
interface CustomButtonProps {
  text: string;
  onPress: () => void;
}

export const CustomButton = ({ text, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "500",
  },
});
