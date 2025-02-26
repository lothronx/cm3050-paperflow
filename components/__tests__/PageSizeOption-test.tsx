import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PageSizeOption } from "../PageSizeOption";
import type { PageSize } from "@/types/PageSize";

// Mock the child components
jest.mock("@/components/PageSizeModal", () => {
  const { View, TouchableOpacity } = require("react-native");
  return {
    PageSizeModal: ({
      isVisible,
      onClose,
      onSelect,
      value,
      options,
    }: {
      isVisible: boolean;
      onClose: () => void;
      onSelect: (value: PageSize) => void;
      value?: PageSize;
      options: PageSize[];
    }) =>
      isVisible ? (
        <View testID="page-size-modal">
          <TouchableOpacity testID="modal-close-button" onPress={onClose} />
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              testID={`modal-select-button-${option}`}
              onPress={() => onSelect(option)}
            />
          ))}
        </View>
      ) : null,
  };
});

// Mock react-native-walkthrough-tooltip
jest.mock("react-native-walkthrough-tooltip", () => {
  return function MockTooltip({
    children,
    content,
    isVisible,
  }: {
    children: React.ReactNode;
    content: React.ReactNode;
    isVisible: boolean;
  }) {
    return isVisible ? (
      <>
        {children}
        {content}
      </>
    ) : (
      children
    );
  };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("PageSizeOption", () => {
  const defaultProps = {
    title: "Page Size",
    defaultValue: "A4" as PageSize,
    onValueChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with required props", () => {
    const { getByText } = render(<PageSizeOption {...defaultProps} />);
    expect(getByText("Page Size")).toBeTruthy();
    expect(getByText("A4")).toBeTruthy();
  });

  it("opens modal when pressed", () => {
    const { getByTestId, queryByTestId } = render(<PageSizeOption {...defaultProps} />);

    // Initially modal should not be visible
    expect(queryByTestId("page-size-modal")).toBeNull();

    // Press the button to open modal
    const button = getByTestId("page-size-button");
    fireEvent.press(button);

    // Modal should now be visible
    expect(getByTestId("page-size-modal")).toBeTruthy();
  });

  it("calls onValueChange and closes modal when a value is selected", async () => {
    const onValueChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <PageSizeOption {...defaultProps} onValueChange={onValueChange} />
    );

    // Open the modal
    const button = getByTestId("page-size-button");
    fireEvent.press(button);

    // Simulate selecting "Letter" size
    const letterButton = getByTestId("modal-select-button-Letter");
    fireEvent.press(letterButton);

    // Check if onValueChange was called with the new value
    expect(onValueChange).toHaveBeenCalledWith("Letter");

    // Modal should be closed
    expect(queryByTestId("page-size-modal")).toBeNull();
  });

  it("closes modal when onClose is triggered", () => {
    const { getByTestId, queryByTestId } = render(<PageSizeOption {...defaultProps} />);

    // Open the modal
    const button = getByTestId("page-size-button");
    fireEvent.press(button);

    // Modal should be visible
    expect(getByTestId("page-size-modal")).toBeTruthy();

    // Close the modal using the close button
    const closeButton = getByTestId("modal-close-button");
    fireEvent.press(closeButton);

    // Modal should be closed
    expect(queryByTestId("page-size-modal")).toBeNull();
  });


  it("does not render tooltip when tooltip prop is not provided", () => {
    const { queryByTestId } = render(<PageSizeOption {...defaultProps} />);
    expect(queryByTestId("info-tooltip-button")).toBeNull();
  });
  
  it("should render tooltip button when tooltip is provided", () => {
    const { getByTestId } = render(<PageSizeOption {...defaultProps} tooltip="Test tooltip" />);
    const tooltipButton = getByTestId("info-tooltip-button");
    expect(tooltipButton).toBeTruthy();
  });
});
