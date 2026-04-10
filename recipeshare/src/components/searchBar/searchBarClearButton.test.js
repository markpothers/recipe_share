import "react-native";

import { act, create } from "react-test-renderer";

import React from "react";
import SearchBarClearButton from "./searchBarClearButton";

describe("SearchBarClearButton", () => {
	let component;
	let mockSetSearchTerm = jest.fn();

	beforeEach(() => {
		mockSetSearchTerm = jest.fn();
	});

	test("renders with icon when displayIcon is true", () => {
		act(() => {
			component = create(<SearchBarClearButton setSearchTerm={mockSetSearchTerm} displayIcon={true} />);
		});

		const root = component.root;
		const button = root.findByProps({ testID: "deleteSearchTermButton" });

		expect(button).toBeTruthy();
		expect(button.props.accessibilityLabel).toBe("clear search text");

		// Should contain an icon when displayIcon is true
		const icons = root.findAllByType("Icon");
		expect(icons.length).toBe(1);
		expect(icons[0].props.name).toBe("close");
	});

	test("renders without icon when displayIcon is false", () => {
		act(() => {
			component = create(<SearchBarClearButton setSearchTerm={mockSetSearchTerm} displayIcon={false} />);
		});

		const root = component.root;
		const button = root.findByProps({ testID: "deleteSearchTermButton" });

		expect(button).toBeTruthy();
		expect(button.props.accessibilityLabel).toBe("clear search text");

		// Should not contain an icon when displayIcon is false
		const icons = root.findAllByType("Icon");
		expect(icons.length).toBe(0);
	});

	test("renders without icon when displayIcon is undefined", () => {
		act(() => {
			component = create(
				<SearchBarClearButton
					setSearchTerm={mockSetSearchTerm}
					// displayIcon prop not provided
				/>
			);
		});

		const root = component.root;
		const button = root.findByProps({ testID: "deleteSearchTermButton" });

		expect(button).toBeTruthy();

		// Should not contain an icon when displayIcon is undefined (falsy)
		const icons = root.findAllByType("Icon");
		expect(icons.length).toBe(0);
	});

	test("calls setSearchTerm with empty string when pressed", () => {
		act(() => {
			component = create(<SearchBarClearButton setSearchTerm={mockSetSearchTerm} displayIcon={true} />);
		});

		const root = component.root;
		const button = root.findByProps({ testID: "deleteSearchTermButton" });

		button.props.onPress();

		expect(mockSetSearchTerm).toHaveBeenCalledWith("");
		expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
	});

	test("matches snapshot when displayIcon is true", () => {
		act(() => {
			component = create(<SearchBarClearButton setSearchTerm={mockSetSearchTerm} displayIcon={true} />);
		});

		expect(component.toJSON()).toMatchSnapshot();
	});

	test("matches snapshot when displayIcon is false", () => {
		act(() => {
			component = create(<SearchBarClearButton setSearchTerm={mockSetSearchTerm} displayIcon={false} />);
		});

		expect(component.toJSON()).toMatchSnapshot();
	});
});
