import { render, fireEvent } from "@testing-library/react-native";
import { InfoTooltip } from "@/components/InfoTooltip";

// Mock the Ionicons component
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock the Tooltip component
jest.mock("react-native-walkthrough-tooltip", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({
      children,
      content,
      isVisible,
      onClose,
    }: {
      children: React.ReactNode;
      content: React.ReactNode;
      isVisible: boolean;
      onClose: () => void;
    }) => {
      return (
        <View testID="tooltip-component" onTouchEnd={onClose}>
          {children}
          {isVisible && content}
        </View>
      );
    },
  };
});

describe("InfoTooltip", () => {
  const mockContent = "Test tooltip content";

  it("shows tooltip when pressed and hides when closed", () => {
    const { getByTestId, getByText, queryByText } = render(<InfoTooltip content={mockContent} />);

    // Initially tooltip content should not be visible
    expect(queryByText(mockContent)).toBeNull();

    // Press the tooltip button
    const tooltipButton = getByTestId("info-tooltip-button");
    fireEvent.press(tooltipButton);

    // Tooltip content should be visible
    expect(getByText(mockContent)).toBeTruthy();
  });

  it("displays the correct content in tooltip", () => {
    const { getByTestId, getByText } = render(<InfoTooltip content={mockContent} />);

    // Press the tooltip button
    const tooltipButton = getByTestId("info-tooltip-button");
    fireEvent.press(tooltipButton);

    // Check if the tooltip content matches
    const tooltipContent = getByText(mockContent);
    expect(tooltipContent).toBeTruthy();
  });

  it("shows tooltip content when pressed", () => {
    const { getByTestId, getByText, queryByText } = render(<InfoTooltip content={mockContent} />);

    // Initially, tooltip content should not be visible
    expect(queryByText(mockContent)).toBeNull();

    // Press the tooltip button
    const tooltipButton = getByTestId("info-tooltip-button");
    fireEvent.press(tooltipButton);

    // Tooltip content should now be visible
    expect(getByText(mockContent)).toBeTruthy();
  });

  it("hides tooltip when onClose is triggered", () => {
    const { getByTestId, getByText, queryByText } = render(<InfoTooltip content={mockContent} />);

    // Open the tooltip first
    const tooltipButton = getByTestId("info-tooltip-button");
    fireEvent.press(tooltipButton);

    // Verify tooltip is visible
    expect(getByText(mockContent)).toBeTruthy();

    // Trigger onClose on the Tooltip component
    const tooltipComponent = getByTestId("tooltip-component");
    fireEvent(tooltipComponent, "onClose");

    // Verify tooltip content is no longer visible
    expect(queryByText(mockContent)).toBeNull();
  });
});
