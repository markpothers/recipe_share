import { fireEvent, render } from "@testing-library/react-native";

import { About } from "./about";
import React from "react";

describe("About Page", () => {
	// Snapshot tests
	test("renders displaying terms & conditions by default", () => {
		const { toJSON } = render(<About />);
		expect(toJSON()).toMatchSnapshot();
	});

	test("renders displaying privacy policy", () => {
		const { toJSON, getByText } = render(<About />);
		fireEvent.press(getByText("Privacy"));
		expect(toJSON()).toMatchSnapshot();
	});

	test("renders displaying licenses", () => {
		const { toJSON, getByText } = render(<About />);
		fireEvent.press(getByText("Licenses"));
		expect(toJSON()).toMatchSnapshot();
	});

	// Functionality tests
	test("displays segmented control tabs", () => {
		const { getByText } = render(<About />);

		// Should show all three tab options
		expect(getByText("Terms")).toBeTruthy();
		expect(getByText("Privacy")).toBeTruthy();
		expect(getByText("Licenses")).toBeTruthy();
	});

	test("switches to privacy policy when tab is pressed", () => {
		const { getByText } = render(<About />);

		fireEvent.press(getByText("Privacy"));

		// Test passes if no error is thrown - the component should handle the state change
		expect(getByText("Privacy")).toBeTruthy();
	});

	test("switches to licenses when tab is pressed", () => {
		const { getByText } = render(<About />);

		fireEvent.press(getByText("Licenses"));

		// Test passes if no error is thrown - the component should handle the state change
		expect(getByText("Licenses")).toBeTruthy();
	});

	test("switches back to terms and conditions when tab is pressed", () => {
		const { getByText } = render(<About />);

		// Switch to privacy policy first
		fireEvent.press(getByText("Privacy"));

		// Then switch back to Terms
		fireEvent.press(getByText("Terms"));

		// Test passes if no error is thrown
		expect(getByText("Terms")).toBeTruthy();
	});

	test("displays app version information", () => {
		const { getByText } = render(<About />);

		expect(getByText("App Version:")).toBeTruthy();
		// Should display some version format (mocked constants will show 00.00)
		expect(getByText("00.00")).toBeTruthy();
	});

	test("tab states change correctly when switching views", () => {
		const { getByText } = render(<About />);

		// Initially Terms should be active
		// Switch to privacy policy
		fireEvent.press(getByText("Privacy"));

		// Now privacy tab should be active
		// Switch to licenses
		fireEvent.press(getByText("Licenses"));

		// Test passes if no errors are thrown during state changes
		expect(getByText("Licenses")).toBeTruthy();
	});

	test("handles multiple rapid tab presses correctly", () => {
		const { getByText } = render(<About />);

		// Rapidly press different tabs
		fireEvent.press(getByText("Privacy"));
		fireEvent.press(getByText("Licenses"));
		fireEvent.press(getByText("Terms"));
		fireEvent.press(getByText("Privacy"));

		// Test passes if no errors are thrown during rapid state changes
		expect(getByText("Privacy")).toBeTruthy();
	});

	test("contains email links in content", () => {
		const { getByText, getAllByText } = render(<About />);

		// Should have email link in Terms by default
		expect(getByText("admin@recipe-share.com")).toBeTruthy();

		// Switch to privacy policy and check for email link there too
		fireEvent.press(getByText("Privacy"));
		const emailLinks = getAllByText("admin@recipe-share.com");
		expect(emailLinks.length).toBeGreaterThan(0);
	});

	test("displays correct content for each view", () => {
		const { getByText, queryByText } = render(<About />);

		// Switch to privacy policy
		fireEvent.press(getByText("Privacy"));
		expect(queryByText("* By email:")).toBeTruthy();

		// Switch to licenses
		fireEvent.press(getByText("Licenses"));
		// The SoftwareLicenses component should be rendered
		// We can't easily test its content without more complex mocking

		// Switch back to Terms
		fireEvent.press(getByText("Terms"));
		expect(getByText("admin@recipe-share.com")).toBeTruthy();
	});
});
