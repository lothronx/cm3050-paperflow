import { render } from "@testing-library/react-native";
import { ImageSwiper } from "@/components/ImageSwiper";
import { Image, StatusBar } from "react-native";

jest.mock("react-native-swiper", () => {
  const { View } = require("react-native");
  return ({ children, ...props }: { children: React.ReactNode }) => (
    <View testID="mock-swiper" {...props}>
      {children}
    </View>
  );
});

describe("ImageSwiper", () => {
  const mockImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  it("should render correctly with provided images", () => {
    const { getByTestId, UNSAFE_getAllByType } = render(<ImageSwiper images={mockImages} />);

    expect(getByTestId("mock-swiper")).toBeTruthy();

    const images = UNSAFE_getAllByType(Image);
    expect(images).toHaveLength(mockImages.length);
  });

  it("should render images with correct source URIs", () => {
    const { UNSAFE_getAllByType } = render(<ImageSwiper images={mockImages} />);

    const images = UNSAFE_getAllByType(Image);
    images.forEach((image, index) => {
      expect(image.props.source.uri).toBe(mockImages[index]);
    });
  });

  it("should render with correct image resizeMode", () => {
    const { UNSAFE_getAllByType } = render(<ImageSwiper images={mockImages} />);

    const images = UNSAFE_getAllByType(Image);
    images.forEach((image) => {
      expect(image.props.resizeMode).toBe("contain");
    });
  });

  it("should render empty when no images provided", () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(<ImageSwiper images={[]} />);

    // Swiper should still be rendered
    expect(getByTestId("mock-swiper")).toBeTruthy();

    // No images should be rendered
    const images = UNSAFE_queryAllByType(Image);
    expect(images).toHaveLength(0);
  });
});
