import { render, fireEvent } from "@testing-library/react-native";
import { ZoomControl } from "@/components/ZoomControl";

// Mock the MaterialIcons component
jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

describe("ZoomControl", () => {
  const mockOnToggle = jest.fn();

  it("should match snapshot", () => {
    const tree = render(<ZoomControl isZoomedIn={false} onToggle={mockOnToggle} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("calls onToggle when pressed", () => {
    const { getByTestId } = render(<ZoomControl isZoomedIn={false} onToggle={mockOnToggle} />);
    
    const zoomButton = getByTestId("zoom-button");
    fireEvent.press(zoomButton);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("uses correct icon name based on isZoomedIn prop", () => {
    const { UNSAFE_queryByProps, rerender } = render(
      <ZoomControl isZoomedIn={false} onToggle={mockOnToggle} />
    );

    // Check icon when not zoomed in
    let icon = UNSAFE_queryByProps({ name: "zoom-out-map" });
    expect(icon).toBeTruthy();

    // Rerender with isZoomedIn=true and check icon
    rerender(<ZoomControl isZoomedIn={true} onToggle={mockOnToggle} />);
    icon = UNSAFE_queryByProps({ name: "zoom-in-map" });
    expect(icon).toBeTruthy();
  });
});
