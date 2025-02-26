import { render, fireEvent } from "@testing-library/react-native";
import { LanguageOption } from "@/components/LanguageOption";
import { COLORS } from "@/constants/Colors";

// Mock the FontAwesome6 component
jest.mock("@expo/vector-icons", () => ({
  FontAwesome6: "FontAwesome6",
}));

describe("LanguageOption", () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  it("calls onToggle when pressed", () => {
    const { getByTestId } = render(<LanguageOption isEnglish={true} onToggle={mockOnToggle} />);

    const button = getByTestId("language-option-button");
    fireEvent.press(button);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("applies correct styles based on isEnglish prop", () => {
    const { getByTestId, rerender } = render(
      <LanguageOption isEnglish={true} onToggle={mockOnToggle} />
    );

    let button = getByTestId("language-option-button");

    // Check English styles
    expect(button).toHaveStyle({
      backgroundColor: COLORS.background,
    });

    // Rerender with isEnglish=false and check styles
    rerender(<LanguageOption isEnglish={false} onToggle={mockOnToggle} />);
    button = getByTestId("language-option-button");
    expect(button).toHaveStyle({
      backgroundColor: COLORS.textSecondary,
    });
  });
});
