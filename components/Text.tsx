import { StyleSheet, Text as RNText } from "react-native";
import type { TextProps } from "react-native";

const defaultStyles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat",
    fontSize: 16,
  },
});

// Create a custom Text component that wraps React Native's Text
export const Text = (props: TextProps) => {
  const { style, ...otherProps } = props;
  return <RNText style={[defaultStyles.text, style]} {...otherProps} />;
};

Text.displayName = "Text";
