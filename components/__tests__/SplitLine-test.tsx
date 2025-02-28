import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SplitLine } from "../SplitLine";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";

// Mock expo-haptics
jest.mock("expo-haptics");

// Mock MaterialIcons from @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    PanGestureHandler: View,
  };
});

describe("SplitLine", () => {
  const defaultProps = {
    index: 1,
    positionDisplay: 100,
    splitLineWidth: 200,
    onUpdatePosition: jest.fn(),
    onRemoveSplit: jest.fn(),
    onDragEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all elements", () => {
    const { getByText, getByTestId } = render(<SplitLine {...defaultProps} />);

    // Check if index is displayed
    expect(getByText("1")).toBeTruthy();

    // Check if icons are rendered
    expect(getByTestId("split-line-delete-icon")).toBeTruthy();
    expect(getByTestId("split-line-drag-icon")).toBeTruthy();
  });

  it("applies correct position and width styles", () => {
    const { getByTestId } = render(<SplitLine {...defaultProps} />);
    const container = getByTestId("split-line-container");

    expect(container).toHaveStyle({
      position: "absolute",
      top: 100,
      width: 200,
      transform: [{ translateX: -100 }], // -splitLineWidth/2
    });
  });

  it("triggers haptic feedback and calls onRemoveSplit when delete button is pressed", () => {
    const { getByTestId } = render(<SplitLine {...defaultProps} />);

    fireEvent.press(getByTestId("split-line-delete-button"));

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Warning
    );
    expect(defaultProps.onRemoveSplit).toHaveBeenCalledTimes(1);
  });

  it("handles gesture events correctly", () => {
    const { getByTestId } = render(<SplitLine {...defaultProps} />);
    const gestureHandler = getByTestId("split-line-container");

    // Simulate gesture begin
    fireEvent(gestureHandler, "onBegan");
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate gesture movement
    fireEvent(gestureHandler, "onGestureEvent", {
      nativeEvent: { absoluteY: 150 },
    });
    expect(defaultProps.onUpdatePosition).toHaveBeenCalledWith(150);

    // Simulate gesture end
    fireEvent(gestureHandler, "onEnded");
    expect(defaultProps.onDragEnd).toHaveBeenCalledTimes(1);
  });

  it("handles gesture failures and cancellations", () => {
    const { getByTestId } = render(<SplitLine {...defaultProps} />);
    const gestureHandler = getByTestId("split-line-container");

    // Test gesture failure
    fireEvent(gestureHandler, "onFailed");
    expect(defaultProps.onDragEnd).toHaveBeenCalled();

    // Test gesture cancellation
    fireEvent(gestureHandler, "onCancelled");
    expect(defaultProps.onDragEnd).toHaveBeenCalled();
  });
});
