import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import HomeScreen from "../index";
import type { PageSize } from "@/types/PageSize";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

// Declare interfaces for component props
interface PageSizeOptionProps {
  title: string;
  tooltip?: string;
  defaultValue?: PageSize;
  onValueChange?: (value: PageSize) => void;
}

interface AutoSplitOptionProps {
  title: string;
  tooltip?: string;
  defaultValue: boolean;
  onValueChange: (value: boolean) => void;
}

interface LanguageOptionProps {
  isEnglish: boolean;
  onToggle: () => void;
}

interface CustomButtonProps {
  text: string;
  onPress: () => void;
}

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock("@/services/storage", () => ({
  StorageService: {
    getSettings: jest.fn().mockResolvedValue({ pageSize: "A4", autoSplit: true }),
    savePageSize: jest.fn(),
    saveAutoSplit: jest.fn(),
    saveUserLanguage: jest.fn(),
    getUserLanguage: jest.fn().mockResolvedValue("zh"),
  },
}));

jest.mock("react-i18next", () => {
  let currentLanguage = "zh";
  const changeLanguageMock = jest.fn().mockImplementation((lang) => {
    currentLanguage = lang;
  });

  return {
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        get language() {
          return currentLanguage;
        },
        changeLanguage: changeLanguageMock,
      },
    }),
  };
});

// Mock expo-font
jest.mock("expo-font", () => ({
  isLoaded: jest.fn().mockReturnValue(true),
  loadAsync: jest.fn().mockResolvedValue(true),
}));

// Mock expo-file-system
jest.mock("expo-file-system", () => ({
  cacheDirectory: "file://cache/",
  copyAsync: jest.fn().mockImplementation(({ from, to }) => {
    return Promise.resolve(true);
  }),
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn(),
    withTiming: jest.fn(),
  };
});

// Mock expo components
jest.mock("@/components/PageSizeOption", () => ({
  PageSizeOption: (props: PageSizeOptionProps) => {
    const MockComponent = require("react-native").View;
    return (
      <MockComponent
        testID="page-size-option"
        title={props.title}
        tooltip={props.tooltip}
        defaultValue={props.defaultValue}
        onValueChange={props.onValueChange}
      />
    );
  },
}));

jest.mock("@/components/AutoSplitOption", () => ({
  AutoSplitOption: (props: AutoSplitOptionProps) => {
    const MockComponent = require("react-native").View;
    return (
      <MockComponent
        testID="auto-split-option"
        title={props.title}
        tooltip={props.tooltip}
        defaultValue={props.defaultValue}
        onValueChange={props.onValueChange}
      />
    );
  },
}));

jest.mock("@/components/LanguageOption", () => ({
  LanguageOption: (props: LanguageOptionProps) => {
    const MockComponent = require("react-native").View;
    return (
      <MockComponent
        testID="language-option-button"
        isEnglish={props.isEnglish}
        onToggle={props.onToggle}
      />
    );
  },
}));

jest.mock("@/components/AnimatedTitle", () => ({
  AnimatedTitle: () => {
    const MockComponent = require("react-native").View;
    return <MockComponent testID="animated-title" />;
  },
}));

jest.mock("@/components/CustomButton", () => ({
  CustomButton: (props: CustomButtonProps) => {
    const MockComponent = require("react-native").TouchableOpacity;
    return (
      <MockComponent testID="custom-button" onPress={props.onPress}>
        {props.text}
      </MockComponent>
    );
  },
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId("custom-button")).toBeTruthy();
  });

  it("handles page size change", async () => {
    const { getByTestId } = render(<HomeScreen />);
    const pageSizeSelect = getByTestId("page-size-option");

    fireEvent(pageSizeSelect, "onValueChange", "A5");

    await waitFor(() => {
      expect(getByTestId("page-size-option").props.defaultValue).toBe("A5");
    });
  });

  it("handles auto split toggle", async () => {
    const { getByTestId } = render(<HomeScreen />);
    const autoSplitToggle = getByTestId("auto-split-option");

    fireEvent(autoSplitToggle, "onValueChange", false);

    await waitFor(() => {
      expect(getByTestId("auto-split-option").props.defaultValue).toBe(false);
    });
  });

  it("handles image selection", async () => {
    const mockImageResult = {
      canceled: false,
      assets: [
        {
          uri: "file://test.jpg",
          height: 1000,
          width: 800,
        },
      ],
    };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);

    const { getByTestId } = render(<HomeScreen />);
    const selectImageButton = getByTestId("custom-button");

    const expectedUri = "file://test.jpg";

    fireEvent.press(selectImageButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/split",
        params: {
          imageUri: expectedUri,
          imageHeight: 1000,
          imageWidth: 800,
          pageSize: "A4",
          autoSplit: "true",
        },
      });
    });
  });

  it("handles Android-specific file processing", async () => {
    const originalPlatform = Platform.OS;
    Object.defineProperty(Platform, "OS", { get: () => "android" });

    const mockImageResult = {
      canceled: false,
      assets: [
        {
          uri: "content://media/external/images/test.jpg",
          height: 1000,
          width: 800,
        },
      ],
    };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);

    const { getByTestId } = render(<HomeScreen />);
    const selectImageButton = getByTestId("custom-button");

    fireEvent.press(selectImageButton);

    await waitFor(() => {
      expect(FileSystem.copyAsync).toHaveBeenCalledWith({
        from: "content://media/external/images/test.jpg",
        to: "file://cache/test.jpg",
      });
    });

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/split",
        params: {
          imageUri: "file://cache/test.jpg",
          imageHeight: 1000,
          imageWidth: 800,
          pageSize: "A4",
          autoSplit: "true",
        },
      });
    });

    Object.defineProperty(Platform, "OS", { get: () => originalPlatform });
  });

  it("skips Android-specific file processing on iOS", async () => {
    const originalPlatform = Platform.OS;
    Object.defineProperty(Platform, "OS", { get: () => "ios" });

    const mockImageResult = {
      canceled: false,
      assets: [
        {
          uri: "file://test-ios.jpg",
          height: 1000,
          width: 800,
        },
      ],
    };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);

    const { getByTestId } = render(<HomeScreen />);
    const selectImageButton = getByTestId("custom-button");

    fireEvent.press(selectImageButton);

    await waitFor(() => {
      expect(FileSystem.copyAsync).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/split",
        params: {
          imageUri: "file://test-ios.jpg",
          imageHeight: 1000,
          imageWidth: 800,
          pageSize: "A4",
          autoSplit: "true",
        },
      });
    });

    Object.defineProperty(Platform, "OS", { get: () => originalPlatform });
  });
});
