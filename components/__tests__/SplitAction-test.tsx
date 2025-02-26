import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SplitActions } from "../SplitActions";
import * as Haptics from "expo-haptics";

// Mock the translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: "split.removeAllSplits" | "split.addSplit") => {
      const translations = {
        "split.removeAllSplits": "Remove All Splits",
        "split.addSplit": "Add Split",
      };
      return translations[key];
    },
  }),
}));

// Mock Haptics
jest.mock("expo-haptics");

describe("SplitActions", () => {
  const mockOnAddSplit = jest.fn();
  const mockOnRemoveAllSplits = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with both buttons", () => {
    const { getByText } = render(
      <SplitActions onAddSplit={mockOnAddSplit} onRemoveAllSplits={mockOnRemoveAllSplits} />
    );

    expect(getByText("Remove All Splits")).toBeTruthy();
    expect(getByText("Add Split")).toBeTruthy();
  });

  it("calls onAddSplit when Add Split button is pressed", () => {
    const { getByText } = render(
      <SplitActions onAddSplit={mockOnAddSplit} onRemoveAllSplits={mockOnRemoveAllSplits} />
    );

    fireEvent.press(getByText("Add Split"));
    expect(mockOnAddSplit).toHaveBeenCalledTimes(1);
  });

  it("calls onRemoveAllSplits and triggers haptic feedback when Remove All Splits button is pressed", () => {
    const { getByText } = render(
      <SplitActions onAddSplit={mockOnAddSplit} onRemoveAllSplits={mockOnRemoveAllSplits} />
    );

    fireEvent.press(getByText("Remove All Splits"));

    expect(mockOnRemoveAllSplits).toHaveBeenCalledTimes(1);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Warning
    );
  });
});
