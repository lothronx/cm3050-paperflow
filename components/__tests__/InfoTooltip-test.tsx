import { render, fireEvent } from "@testing-library/react-native";
import { InfoTooltip } from "@/components/InfoTooltip";

// Mock the Ionicons component
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock react-native-walkthrough-tooltip
jest.mock("react-native-walkthrough-tooltip", () => {
  return {
    __esModule: true,
    default: ({ children, content, isVisible }: { children: React.ReactNode; content: React.ReactNode; isVisible: boolean; }) => {
      return (
        <>
          {children}
          {isVisible && content}
        </>
      );
    },
  };
});

describe("InfoTooltip", () => {
  const testContent = "Test tooltip content";

  it("should match snapshot", () => {
    const tree = render(<InfoTooltip content={testContent} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows tooltip content when pressed", () => {
    const { getByTestId, getByText, queryByText } = render(<InfoTooltip content={testContent} />);

    // Initially, tooltip content should not be visible
    expect(queryByText(testContent)).toBeNull();

    // Press the tooltip button
    const tooltipButton = getByTestId("info-tooltip-button");
    fireEvent.press(tooltipButton);

    // Tooltip content should now be visible
    expect(getByText(testContent)).toBeTruthy();
  });
});
