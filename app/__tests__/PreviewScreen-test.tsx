import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import PreviewScreen from "../preview";
import { router, useLocalSearchParams } from "expo-router";
import { generatePdfFromImages } from "@/utils/generatePdfFromImages";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("expo-sharing", () => ({
  shareAsync: jest.fn(),
}));

jest.mock("@/utils/generatePdfFromImages", () => ({
  generatePdfFromImages: jest.fn(),
}));

// Create the mock function outside the mock definition
const mockSaveToLibrary = jest.fn();

jest.mock("@/hooks/useMediaLibrary", () => ({
  useMediaLibrary: jest.fn(() => ({
    saveToLibrary: mockSaveToLibrary,
  })),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Alert.alert
jest.spyOn(Alert, "alert").mockImplementation(() => null);

// Mock ImageSwiper component
jest.mock("@/components/ImageSwiper", () => ({
  ImageSwiper: (props: { images: string[] }) => {
    const MockComponent = require("react-native").View;
    return <MockComponent testID="image-swiper" images={props.images} />;
  },
}));

// Mock BackArrow component
jest.mock("@/components/BackArrow", () => ({
  BackArrow: () => {
    const MockComponent = require("react-native").View;
    return <MockComponent testID="back-arrow" />;
  },
}));

// Mock CustomButton component
jest.mock("@/components/CustomButton", () => ({
  CustomButton: (props: { text: string; onPress: () => void }) => {
    const MockComponent = require("react-native").TouchableOpacity;
    return (
      <MockComponent testID={`button-${props.text}`} onPress={props.onPress}>
        {props.text}
      </MockComponent>
    );
  },
}));

// Mock LoadingIndicator component
jest.mock("@/components/LoadingIndicator", () => ({
  LoadingIndicator: () => {
    const MockComponent = require("react-native").View;
    return <MockComponent testID="loading-indicator" />;
  },
}));

describe("PreviewScreen", () => {
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up route parameters mock
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      images: JSON.stringify(["file://test1.jpg", "file://test2.jpg"]),
      pageSize: "A4",
    });
  });

  it("renders component and displays correct images", () => {
    const { getByTestId } = render(<PreviewScreen />);

    // Verify key elements exist
    expect(getByTestId("image-swiper")).toBeTruthy();
    expect(getByTestId("back-arrow")).toBeTruthy();

    // Verify buttons exist
    expect(getByTestId("button-preview.savePhotos")).toBeTruthy();
    expect(getByTestId("button-preview.sharePDF")).toBeTruthy();
    expect(getByTestId("button-preview.done")).toBeTruthy();

    // Verify image data is correctly passed to ImageSwiper
    expect(getByTestId("image-swiper").props.images).toEqual([
      "file://test1.jpg",
      "file://test2.jpg",
    ]);
  });

  it("handles case when no images are present", () => {
    // Set route parameters with no images
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      images: undefined,
      pageSize: "A4",
    });

    const { getByTestId } = render(<PreviewScreen />);

    // Verify ImageSwiper receives empty array
    expect(getByTestId("image-swiper").props.images).toEqual([]);
  });

  it("correctly calls media library function when saving photos", async () => {
    const { getByTestId } = render(<PreviewScreen />);
    const mockSaveToLibrary = useMediaLibrary().saveToLibrary;

    // Click save button
    fireEvent.press(getByTestId("button-preview.savePhotos"));

    // Verify saveToLibrary was called
    await waitFor(() => {
      expect(mockSaveToLibrary).toHaveBeenCalledWith(["file://test1.jpg", "file://test2.jpg"]);
      expect(Alert.alert).toHaveBeenCalledWith("Success", "Images saved successfully!");
    });
  });

  it("displays error message when saving photos fails", async () => {
    const { getByTestId } = render(<PreviewScreen />);

    // Set up save failure
    mockSaveToLibrary.mockRejectedValue(new Error("Permission denied"));

    // Click save button
    fireEvent.press(getByTestId("button-preview.savePhotos"));

    // Verify error message is displayed
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Permission Required",
        "Please grant access to save photos"
      );
    });
  });

  it("generates and shares PDF", async () => {
    // Set up successful PDF generation
    (generatePdfFromImages as jest.Mock).mockResolvedValue({
      uri: "file://test.pdf",
    });

    const { getByTestId, queryByTestId } = render(<PreviewScreen />);

    // Click share button
    fireEvent.press(getByTestId("button-preview.sharePDF"));

    // Verify loading indicator is displayed
    expect(queryByTestId("loading-indicator")).toBeTruthy();

    // Verify PDF generation and sharing
    await waitFor(() => {
      expect(generatePdfFromImages).toHaveBeenCalledWith(
        ["file://test1.jpg", "file://test2.jpg"],
        "A4"
      );
      expect(Sharing.shareAsync).toHaveBeenCalledWith("file://test.pdf", {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
        UTI: "com.adobe.pdf",
      });
      expect(queryByTestId("loading-indicator")).toBeNull();
    });
  });

  it("displays error message when PDF generation fails", async () => {
    // Set up PDF generation failure
    (generatePdfFromImages as jest.Mock).mockRejectedValue(new Error("Failed to generate PDF"));

    const { getByTestId } = render(<PreviewScreen />);

    // Click share button
    fireEvent.press(getByTestId("button-preview.sharePDF"));

    // Verify error message is displayed
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Failed to share. Please try again.");
    });
  });

  it("navigates back to home screen when done button is pressed", () => {
    const { getByTestId } = render(<PreviewScreen />);

    // Click done button
    fireEvent.press(getByTestId("button-preview.done"));

    // Verify navigation to home screen
    expect(router.push).toHaveBeenCalledWith("/");
  });
});
