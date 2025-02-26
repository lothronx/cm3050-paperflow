import { render, fireEvent } from "@testing-library/react-native";
import { CheckArrow } from "@/components/CheckArrow";

// Mock the Ionicons component
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("CheckArrow", () => {
  const mockOnClick = jest.fn();

  it("should match snapshot", () => {
    const tree = render(<CheckArrow onClick={mockOnClick} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("calls onClick handler when pressed", () => {
    const { getByTestId } = render(<CheckArrow onClick={mockOnClick} />);

    const checkButton = getByTestId("check-arrow-button");
    fireEvent.press(checkButton);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
