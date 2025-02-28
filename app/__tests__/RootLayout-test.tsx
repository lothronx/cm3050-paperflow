import { render, act } from "@testing-library/react-native";
import RootLayout from "../_layout";
import * as Font from "expo-font";
import React from "react";

// Mock dependencies
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
}));

// Single mock for expo-router
jest.mock("expo-router", () => ({
  Stack: {
    Screen: function MockScreen(props: { name: string }) {
      const { View } = require("react-native");
      return <View testID={`stack-screen-${props.name}`} />;
    },
  },
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  router: {
    push: jest.fn(),
  },
}));

jest.mock("react-i18next", () => ({
  I18nextProvider: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View testID="i18next-provider">{children}</View>;
  },
}));

jest.mock("@/services/translation", () => ({}));

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initially renders null when fonts are not loaded", () => {
    // Mock loadAsync to not resolve immediately
    (Font.loadAsync as jest.Mock).mockReturnValue(new Promise(() => {}));

    const { toJSON } = render(<RootLayout />);

    // Component should render null initially
    expect(toJSON()).toBeNull();
  });
});
