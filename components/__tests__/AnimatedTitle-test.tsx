import { render } from "@testing-library/react-native";
import { AnimatedTitle } from "@/components/AnimatedTitle";

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  return {
    ...Reanimated,
    useSharedValue: jest.fn((value) => ({ value })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((value) => value),
  };
});

// Create a mockI18n that we can control
const mockI18n = { language: "en" };

// Mock i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: "home.title1" | "home.title2" | "home.subTitle") => {
      const translations = {
        "home.title1": "Welcome to",
        "home.title2": "PaperFlow",
        "home.subTitle": "Your Digital Document Assistant",
      } as const;
      return translations[key];
    },
    i18n: mockI18n,
  }),
}));

describe("AnimatedTitle", () => {
  it("should render all text elements", () => {
    const { getByText } = render(<AnimatedTitle />);

    expect(getByText("Welcome to")).toBeTruthy();
    expect(getByText("PaperFlow")).toBeTruthy();
    expect(getByText("Your Digital Document Assistant")).toBeTruthy();
  });

  it("should match snapshot for English", () => {
    mockI18n.language = "en";
    const { toJSON } = render(<AnimatedTitle />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should match snapshot for Chinese", () => {
    mockI18n.language = "zh";
    const { toJSON } = render(<AnimatedTitle />);
    expect(toJSON()).toMatchSnapshot();
  });
});
