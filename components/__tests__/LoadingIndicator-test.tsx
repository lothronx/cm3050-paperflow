import React from "react";
import { render } from "@testing-library/react-native";
import { LoadingIndicator } from "../LoadingIndicator";

describe("<LoadingIndicator />", () => {
  test("renders correctly", () => {
    const { getByTestId } = render(<LoadingIndicator />);
    const activityIndicator = getByTestId("loading-indicator");
    expect(activityIndicator).toBeTruthy();
  });
});
