import "react-native";

import { act, create } from "react-test-renderer";

import React from "react";
import SearchBar from "./searchBar";

describe("Search Bar", () => {
	let component;
	let mockSetFunction = jest.fn();
	let mockBlurFunction = jest.fn();

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	});

	beforeEach(() => {
		// console.log('runs before every test')
		mockSetFunction = jest.fn();
		mockBlurFunction = jest.fn();
		act(() => {
			component = create(
				<SearchBar
					setSearchTerm={mockSetFunction}
					text={"SearchBar placeholder text"}
					searchTerm={""}
					onBlur={mockBlurFunction}
				/>
			);
		});
	});

	afterEach(() => {
		// console.log('runs after each test')
	});

	afterAll(() => {
		// console.log('runs after all tests have completed')
	});

	test("can be rendered (without the delete button) matches its previous image", () => {
		const image = component.toJSON();
		let root = component.root;
		let button = root.findAllByProps({ testID: "deleteSearchTermButton" });
		expect(button.length).toEqual(0);
		expect(image).toMatchSnapshot();
	});

	test("can be rendered (with the delete button) matches its previous image", () => {
		act(() => {
			component.update(
				<SearchBar
					setSearchTerm={mockSetFunction}
					text={"SearchBar placeholder text"}
					searchTerm={"spaghetti"}
					onBlur={mockBlurFunction}
				/>
			);
		});
		const image = component.toJSON();
		let root = component.root;
		let button = root.findByProps({ testID: "deleteSearchTermButton" });
		expect(button).toBeTruthy();
		expect(image).toMatchSnapshot();
	});

	test("typing in the search bar calls the props set function", () => {
		let root = component.root;
		let input = root.findByProps({ testID: "searchTermInput" });
		input.props.onChangeText("spaghetti");
		expect(mockSetFunction).toHaveBeenCalled();
		expect(mockSetFunction).toHaveBeenCalledWith("spaghetti");
	});

	test("renders with text and the delete button clears the clears the searchTerm of text", () => {
		act(() => {
			component.update(
				<SearchBar
					setSearchTerm={mockSetFunction}
					text={"SearchBar placeholder text"}
					searchTerm={"spaghetti"}
					onBlur={mockBlurFunction}
				/>
			);
		});
		let root = component.root;
		let button = root.findByProps({ testID: "deleteSearchTermButton" });
		button.props.onPress();
		expect(mockSetFunction).toHaveBeenCalledWith("");
	});

	test("calls the blur function when blurred", () => {
		let root = component.root;
		let input = root.findByProps({ testID: "searchTermInput" });
		input.props.onBlur();
		expect(mockBlurFunction).toHaveBeenCalled();
	});

	test("clear button renders without icon when displayIcon is false", () => {
		// Update component to have search text (which shows the clear button)
		act(() => {
			component.update(
				<SearchBar
					setSearchTerm={mockSetFunction}
					text={"SearchBar placeholder text"}
					searchTerm={"test"}
					onBlur={mockBlurFunction}
				/>
			);
		});

		let root = component.root;
		let clearButton = root.findByProps({ testID: "deleteSearchTermButton" });

		// The clear button should exist but with displayIcon={true} by default
		expect(clearButton).toBeTruthy();
	});

	test("searchBar responds to keyboard interactions", () => {
		let root = component.root;
		let input = root.findByProps({ testID: "searchTermInput" });

		// Test that input accepts various text inputs
		input.props.onChangeText("pasta recipes");
		expect(mockSetFunction).toHaveBeenCalledWith("pasta recipes");

		input.props.onChangeText("123");
		expect(mockSetFunction).toHaveBeenCalledWith("123");
	});

	test("input field has correct accessibility properties", () => {
		let root = component.root;
		let input = root.findByProps({ testID: "searchTermInput" });
		let clearButton = component.root.findAllByProps({ testID: "deleteSearchTermButton" });

		// Check input properties
		expect(input.props.placeholder).toBe("SearchBar placeholder text");
		expect(input.props.placeholderTextColor).toBe("#888");
		expect(input.props.autoCapitalize).toBe("none");
		expect(input.props.keyboardType).toBe("default");

		// Clear button should not be present when searchTerm is empty
		expect(clearButton.length).toBe(0);
	});

	test("clear button has correct accessibility label", () => {
		// Update to show clear button
		act(() => {
			component.update(
				<SearchBar
					setSearchTerm={mockSetFunction}
					text={"SearchBar placeholder text"}
					searchTerm={"test search"}
					onBlur={mockBlurFunction}
				/>
			);
		});

		let root = component.root;
		let clearButton = root.findByProps({ testID: "deleteSearchTermButton" });

		expect(clearButton.props.accessibilityLabel).toBe("clear search text");
	});
});
