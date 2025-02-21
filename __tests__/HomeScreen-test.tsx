import { render } from "@testing-library/react-native";

import HomeScreen, { CustomText } from "@/app/index";

describe("<HomeScreen />", () => {
  test("example test", () => {
    expect(1 + 1).toBe(2);
  });
//   test("Text renders correctly on HomeScreen", () => {
//     const { getByText } = render(<HomeScreen />);

//     getByText("Welcome!");
//   });
//   test("CustomText renders correctly", () => {
//     const tree = render(<CustomText>Some text</CustomText>).toJSON();

//     expect(tree).toMatchSnapshot();
//   });
});
