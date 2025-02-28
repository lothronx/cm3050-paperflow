import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import { PageSizeModal } from "@/components/PageSizeModal";
import type { PageSize } from "@/types/PageSize";

// Mock the translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Ionicons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("PageSizeModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();
  const options: PageSize[] = ["A4", "Letter", "Legal"];
  const defaultProps = {
    isVisible: true,
    onClose: mockOnClose,
    onSelect: mockOnSelect,
    options,
    value: "A4" as PageSize,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    render(<PageSizeModal {...defaultProps} />);

    expect(screen.getByText("modal.title")).toBeTruthy();
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeTruthy();
    });
  });

  it("does not render when not visible", () => {
    render(<PageSizeModal {...defaultProps} isVisible={false} />);

    expect(screen.queryByText("modal.title")).toBeNull();
  });

  it("calls onClose when overlay is pressed", () => {
    render(<PageSizeModal {...defaultProps} />);

    const overlay = screen.getByTestId("page-size-modal-overlay");
    fireEvent.press(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is pressed", () => {
    render(<PageSizeModal {...defaultProps} />);

    const closeButton = screen.getByTestId("page-size-modal-close-button");
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect with correct value when an option is selected", () => {
    render(<PageSizeModal {...defaultProps} />);

    const option = screen.getByText("Letter");
    fireEvent.press(option);

    expect(mockOnSelect).toHaveBeenCalledWith("Letter");
  });
});
