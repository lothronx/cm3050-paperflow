import { render } from "@testing-library/react-native";
import { Text } from "@/components/Text";

describe("Text", () => {
  it("should render text content correctly", () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText("Hello World")).toBeTruthy();
  });

  it("should apply custom style", () => {
    const { getByText } = render(<Text style={{ color: "red" }}>Styled Text</Text>);
    const textElement = getByText("Styled Text");
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "red" })])
    );
  });
});
