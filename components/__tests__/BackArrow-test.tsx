import { render, fireEvent } from "@testing-library/react-native";
import { BackArrow } from "@/components/BackArrow";
import { router } from "expo-router";

// Mock the Ionicons component
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

describe("BackArrow", () => {
  it("should match snapshot", () => {
    const tree = render(<BackArrow />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("calls router.back when pressed", () => {
    const { getByTestId } = render(<BackArrow />);

    const backButton = getByTestId("back-arrow-button");
    fireEvent.press(backButton);

    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
