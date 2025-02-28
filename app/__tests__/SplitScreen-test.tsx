import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import SplitScreen from "../split";
import { calculateImageMetrics } from "@/utils/calculateImageMetrics";
import { ViewProps, LayoutChangeEvent } from "react-native";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: (props: ViewProps) => {
    const MockComponent = require("react-native").View;
    return <MockComponent {...props} testID="safe-area-view" />;
  },
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock("expo-image", () => ({
  Image: (props: any) => {
    const MockComponent = require("react-native").View;
    return <MockComponent {...props} testID="image" />;
  },
}));

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  const ScrollView = require("react-native").ScrollView;
  const React = require("react");

  return {
    GestureHandlerRootView: (props: ViewProps) => <View {...props} testID="gesture-root" />,
    PinchGestureHandler: (props: ViewProps) => <View {...props} testID="pinch-handler" />,
    ScrollView: React.forwardRef((props: any, ref: React.Ref<any>) => {
      return <ScrollView {...props} ref={ref} testID="scroll-view" />;
    }),
  };
});

jest.mock("@/utils/calculateImageMetrics", () => ({
  calculateImageMetrics: jest.fn(),
}));

// Mock hooks
jest.mock("@/hooks/useZoomAndScroll", () => ({
  useZoomAndScroll: jest.fn(),
}));

jest.mock("@/hooks/useSplitManagement", () => ({
  useSplitManagement: jest.fn(),
}));

jest.mock("@/hooks/useImageProcessing", () => ({
  useImageProcessing: jest.fn(),
}));

// Mock components
jest.mock("@/components/BackArrow", () => ({
  BackArrow: () => {
    const MockComponent = require("react-native").View;
    return <MockComponent testID="back-arrow" />;
  },
}));

jest.mock("@/components/CheckArrow", () => ({
  CheckArrow: (props: { onClick: () => void }) => {
    const MockComponent = require("react-native").TouchableOpacity;
    return <MockComponent testID="check-arrow" onPress={props.onClick} />;
  },
}));

jest.mock("@/components/ZoomControl", () => ({
  ZoomControl: (props: { isZoomedIn: boolean; onToggle: () => void }) => {
    const MockComponent = require("react-native").TouchableOpacity;
    return (
      <MockComponent testID="zoom-control" onPress={props.onToggle} isZoomedIn={props.isZoomedIn} />
    );
  },
}));

jest.mock("@/components/SplitActions", () => ({
  SplitActions: (props: { onAddSplit: () => void; onRemoveAllSplits: () => void }) => {
    const MockComponent = require("react-native").View;
    const TouchableOpacity = require("react-native").TouchableOpacity;
    return (
      <MockComponent testID="split-actions">
        <TouchableOpacity testID="add-split-button" onPress={props.onAddSplit} />
        <TouchableOpacity testID="remove-all-splits-button" onPress={props.onRemoveAllSplits} />
      </MockComponent>
    );
  },
}));

jest.mock("@/components/SplitLine", () => ({
  SplitLine: (props: any) => {
    const MockComponent = require("react-native").View;
    return <MockComponent testID={`split-line-${props.index}`} {...props} />;
  },
}));

jest.mock("@/components/LoadingIndicator", () => ({
  LoadingIndicator: () => {
    const MockComponent = require("react-native").View;
    return <MockComponent testID="loading-indicator" />;
  },
}));

describe("SplitScreen", () => {
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock route parameters
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      imageUri: "file://test-image.jpg",
      imageHeight: "1000",
      imageWidth: "800",
      pageSize: "A4",
      autoSplit: "false",
    });

    // Mock useZoomAndScroll hook
    (require("@/hooks/useZoomAndScroll").useZoomAndScroll as jest.Mock).mockReturnValue({
      handleScroll: jest.fn(),
      handleZoom: jest.fn(),
      isZoomedIn: false,
      currentScrollPosition: 0,
    });

    // Mock useSplitManagement hook
    (require("@/hooks/useSplitManagement").useSplitManagement as jest.Mock).mockReturnValue({
      splitPositions: [100, 200, 300],
      addSplit: jest.fn(),
      updateSplit: jest.fn(),
      removeSplit: jest.fn(),
      removeAllSplits: jest.fn(),
      autoSplit: jest.fn(),
      handleDragEnd: jest.fn(),
    });

    // Mock useImageProcessing hook
    (require("@/hooks/useImageProcessing").useImageProcessing as jest.Mock).mockReturnValue({
      isProcessing: false,
      handlePreview: jest.fn(),
    });

    // Mock calculateImageMetrics
    (calculateImageMetrics as jest.Mock).mockReturnValue({
      displayDimensions: { width: 400, height: 500 },
      splitLineWidth: 400,
      scaleFactor: 0.5,
    });
  });

  it("renders correctly with proper components", () => {
    const { getByTestId, queryByTestId } = render(<SplitScreen />);

    // Check that main components are rendered
    expect(getByTestId("gesture-root")).toBeTruthy();
    expect(getByTestId("safe-area-view")).toBeTruthy();
    expect(getByTestId("back-arrow")).toBeTruthy();
    expect(getByTestId("check-arrow")).toBeTruthy();
    expect(getByTestId("zoom-control")).toBeTruthy();
    expect(getByTestId("pinch-handler")).toBeTruthy();
    expect(getByTestId("scroll-view")).toBeTruthy();
    expect(getByTestId("image")).toBeTruthy();
    expect(getByTestId("split-actions")).toBeTruthy();

    // Loading indicator should not be visible by default
    expect(queryByTestId("loading-indicator")).toBeNull();
  });

  it("displays loading indicator when processing", () => {
    // Mock isProcessing flag to true
    (require("@/hooks/useImageProcessing").useImageProcessing as jest.Mock).mockReturnValue({
      isProcessing: true,
      handlePreview: jest.fn(),
    });

    const { getByTestId } = render(<SplitScreen />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders the correct image with proper dimensions", () => {
    const { getByTestId } = render(<SplitScreen />);
    const image = getByTestId("image");

    expect(image.props.source).toEqual({ uri: "file://test-image.jpg" });
    expect(image.props.style).toEqual({
      width: 400,
      height: 500,
    });
  });

  it("renders split lines based on split positions", () => {
    const { getByTestId } = render(<SplitScreen />);

    // Check that split lines are rendered for each position
    expect(getByTestId("split-line-1")).toBeTruthy();
    expect(getByTestId("split-line-2")).toBeTruthy();
    expect(getByTestId("split-line-3")).toBeTruthy();
  });

  it("triggers autoSplit when autoSplit param is true", () => {
    // Update autoSplit param to true
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      imageUri: "file://test-image.jpg",
      imageHeight: "1000",
      imageWidth: "800",
      pageSize: "A4",
      autoSplit: "true",
    });

    const autoSplitMock = jest.fn();
    (require("@/hooks/useSplitManagement").useSplitManagement as jest.Mock).mockReturnValue({
      splitPositions: [],
      addSplit: jest.fn(),
      updateSplit: jest.fn(),
      removeSplit: jest.fn(),
      removeAllSplits: jest.fn(),
      autoSplit: autoSplitMock,
      handleDragEnd: jest.fn(),
    });

    render(<SplitScreen />);
    expect(autoSplitMock).toHaveBeenCalled();
  });

  it("handles container layout changes", () => {
    const { getByTestId } = render(<SplitScreen />);
    const innerContainer = getByTestId("pinch-handler").parent;

    // Create mock layout event
    const layoutEvent: LayoutChangeEvent = {
      nativeEvent: {
        layout: {
          width: 400,
          height: 600,
          x: 0,
          y: 0,
        },
      },
    } as LayoutChangeEvent;

    // Trigger layout event
    fireEvent(innerContainer, "layout", layoutEvent);

    // calculateImageMetrics should be called with updated container dimensions
    expect(calculateImageMetrics).toHaveBeenCalledWith(
      expect.objectContaining({
        containerDimensions: { width: 400, height: 600 },
      })
    );
  });

  it("handles zoom toggle", () => {
    const handleZoomMock = jest.fn();
    (require("@/hooks/useZoomAndScroll").useZoomAndScroll as jest.Mock).mockReturnValue({
      handleScroll: jest.fn(),
      handleZoom: handleZoomMock,
      isZoomedIn: false,
      currentScrollPosition: 0,
    });

    const { getByTestId } = render(<SplitScreen />);
    const zoomControl = getByTestId("zoom-control");

    // Trigger zoom toggle
    fireEvent.press(zoomControl);

    // handleZoom should be called with true (toggle from false)
    expect(handleZoomMock).toHaveBeenCalledWith(true);
  });

  it("handles add split action", () => {
    const addSplitMock = jest.fn();
    (require("@/hooks/useSplitManagement").useSplitManagement as jest.Mock).mockReturnValue({
      splitPositions: [],
      addSplit: addSplitMock,
      updateSplit: jest.fn(),
      removeSplit: jest.fn(),
      removeAllSplits: jest.fn(),
      autoSplit: jest.fn(),
      handleDragEnd: jest.fn(),
    });

    const { getByTestId } = render(<SplitScreen />);
    const addSplitButton = getByTestId("add-split-button");

    // Trigger add split
    fireEvent.press(addSplitButton);

    // addSplit should be called
    expect(addSplitMock).toHaveBeenCalled();
  });

  it("handles remove all splits action", () => {
    const removeAllSplitsMock = jest.fn();
    (require("@/hooks/useSplitManagement").useSplitManagement as jest.Mock).mockReturnValue({
      splitPositions: [100, 200],
      addSplit: jest.fn(),
      updateSplit: jest.fn(),
      removeSplit: jest.fn(),
      removeAllSplits: removeAllSplitsMock,
      autoSplit: jest.fn(),
      handleDragEnd: jest.fn(),
    });

    const { getByTestId } = render(<SplitScreen />);
    const removeAllSplitsButton = getByTestId("remove-all-splits-button");

    // Trigger remove all splits
    fireEvent.press(removeAllSplitsButton);

    // removeAllSplits should be called
    expect(removeAllSplitsMock).toHaveBeenCalled();
  });

  it("handles preview action", () => {
    const handlePreviewMock = jest.fn();
    (require("@/hooks/useImageProcessing").useImageProcessing as jest.Mock).mockReturnValue({
      isProcessing: false,
      handlePreview: handlePreviewMock,
    });

    const { getByTestId } = render(<SplitScreen />);
    const checkArrow = getByTestId("check-arrow");

    // Trigger preview
    fireEvent.press(checkArrow);

    // handlePreview should be called
    expect(handlePreviewMock).toHaveBeenCalled();
  });

  it("passes correct handlers to SplitLine components", () => {
    // Setup mocks with spies to check function calls
    const removeSplitMock = jest.fn();
    const handleDragEndMock = jest.fn();

    (require("@/hooks/useSplitManagement").useSplitManagement as jest.Mock).mockReturnValue({
      splitPositions: [100, 200, 300],
      addSplit: jest.fn(),
      updateSplit: jest.fn(),
      removeSplit: removeSplitMock,
      removeAllSplits: jest.fn(),
      autoSplit: jest.fn(),
      handleDragEnd: handleDragEndMock,
    });

    const { getByTestId } = render(<SplitScreen />);

    // Get all split line components (each with a unique testID)
    const splitLines = [
      getByTestId("split-line-1"),
      getByTestId("split-line-2"),
      getByTestId("split-line-3"),
    ];

    // Test each split line to ensure it has the correct props
    splitLines.forEach((splitLine, index) => {
      // Call the onRemoveSplit function for each split line
      splitLine.props.onRemoveSplit();

      // Check if removeSplit was called with the correct index
      expect(removeSplitMock).toHaveBeenCalledWith(index);

      // Call the onDragEnd function for each split line
      splitLine.props.onDragEnd();

      // Check if handleDragEnd was called
      expect(handleDragEndMock).toHaveBeenCalled();
    });

    // Verify total call counts
    expect(removeSplitMock).toHaveBeenCalledTimes(3);
    expect(handleDragEndMock).toHaveBeenCalledTimes(3);
  });
});
