import React from "react";
import StyledActivityIndicator from "./styledActivityIndicator";
import { render } from "@testing-library/react-native";

describe("StyledActivityIndicator", () => {
	test("can be rendered", async () => {
		const { toJSON } = render(<StyledActivityIndicator />);
		expect(toJSON()).toMatchSnapshot();
	});
});
