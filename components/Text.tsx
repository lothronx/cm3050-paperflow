import { StyleSheet, Text as RNText, Platform } from "react-native";
import type { TextProps } from "react-native";

const customStyles = StyleSheet.create({
  text: {
    fontFamily: Platform.OS === "ios" ? "Montserrat" : "Montserrat-Medium",
    fontSize: 16,
  },
});

// Create a custom Text component that wraps React Native's Text with the custom styles
export const Text = (props: TextProps) => {
  const { style, ...otherProps } = props;
  return <RNText style={[customStyles.text, style]} {...otherProps} />;
};

Text.displayName = "Text";
