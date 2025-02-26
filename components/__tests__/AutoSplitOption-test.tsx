import { render, fireEvent } from "@testing-library/react-native";
import { AutoSplitOption } from "@/components/AutoSplitOption";

// Mock Ionicons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

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

describe("AutoSplitOption", () => {
  const defaultProps = {
    title: "Test Option",
    defaultValue: false,
    onValueChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render title correctly", () => {
    const { getByText } = render(<AutoSplitOption {...defaultProps} />);
    expect(getByText("Test Option")).toBeTruthy();
  });

  it("should render switch with correct default value", () => {
    const { UNSAFE_getByProps } = render(<AutoSplitOption {...defaultProps} defaultValue={true} />);
    const switchComponent = UNSAFE_getByProps({ value: true });
    expect(switchComponent).toBeTruthy();
  });

  it("should call onValueChange when switch is toggled", () => {
    const onValueChange = jest.fn();
    const { UNSAFE_getByProps } = render(
      <AutoSplitOption {...defaultProps} onValueChange={onValueChange} />
    );

    const switchComponent = UNSAFE_getByProps({ value: false });
    fireEvent(switchComponent, "valueChange", true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("should not render tooltip button when tooltip is not provided", () => {
    const { queryByTestId } = render(<AutoSplitOption {...defaultProps} />);
    const tooltipButton = queryByTestId("info-tooltip-button");
    expect(tooltipButton).toBeFalsy();
  });

  it("should render tooltip button when tooltip is provided", () => {
    const { getByTestId } = render(<AutoSplitOption {...defaultProps} tooltip="Test tooltip" />);
    const tooltipButton = getByTestId("info-tooltip-button");
    expect(tooltipButton).toBeTruthy();
  });

  it("should show tooltip content when tooltip button is pressed", () => {
    const tooltipText = "Test tooltip";
    const { getByTestId, getByText } = render(
      <AutoSplitOption {...defaultProps} tooltip={tooltipText} />
    );

    const tooltipButton = getByTestId("info-tooltip-button");
    fireEvent.press(tooltipButton);

    expect(getByText(tooltipText)).toBeTruthy();
  });
});
