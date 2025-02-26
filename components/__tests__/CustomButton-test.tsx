import { render, fireEvent } from "@testing-library/react-native";
import { CustomButton } from "@/components/CustomButton";
import { View } from "react-native";

describe("CustomButton", () => {
  const defaultProps = {
    text: "Test Button",
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render button text correctly", () => {
    const { getByText } = render(<CustomButton {...defaultProps} />);
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("should call onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(<CustomButton {...defaultProps} onPress={onPress} />);

    fireEvent.press(getByText("Test Button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should render icon when provided", () => {
    const testIcon = <View testID="test-icon" />;
    const { getByTestId } = render(<CustomButton {...defaultProps} icon={testIcon} />);
    expect(getByTestId("test-icon")).toBeTruthy();
  });

  it("should not render icon container when no icon is provided", () => {
    const { queryByTestId } = render(<CustomButton {...defaultProps} />);
    expect(queryByTestId("test-icon")).toBeNull();
  });

  it("should apply outline styles when variant is outline", () => {
    const { getByText } = render(<CustomButton {...defaultProps} variant="outline" />);
    const buttonText = getByText("Test Button");
    expect(buttonText.props.style).toEqual(
      expect.arrayContaining([expect.any(Object), expect.any(Object)])
    );
  });

  it("should use default solid variant styles when no variant is provided", () => {
    const { getByText } = render(<CustomButton {...defaultProps} />);
    const buttonText = getByText("Test Button");
    expect(buttonText.props.style).toEqual(expect.arrayContaining([expect.any(Object)]));
  });
});
