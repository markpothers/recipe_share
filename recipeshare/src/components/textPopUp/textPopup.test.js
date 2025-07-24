import renderer, { act } from "react-test-renderer";

import React from "react";
import { TextPopup } from "./textPopup";
import { TouchableOpacity, Text, View } from "react-native";
import { termsAndConditions } from "../../constants/termsAndConditions";

describe("TextPopup", () => {
	let component;

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	});

	beforeEach(() => {
		// console.log('runs before every test')
	});

	afterEach(() => {
		// console.log('runs after each test')
	});

	afterAll(() => {
		// console.log('runs after all tests have completed')
	});

	test("renders with some mock props", () => {
		let mockCallback = jest.fn();
		act(() => {
			component = renderer.create(
				<TextPopup title={"Terms & Conditions"} text={termsAndConditions} close={mockCallback} />
			);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const buttons = root.findAllByType(TouchableOpacity);
		expect(buttons.length).toEqual(1);
		buttons[0].props.onPress();
		expect(mockCallback).toHaveBeenCalled();
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	test("renders with children components", () => {
		let mockCallback = jest.fn();
		const childElement = (
			<View>
				<Text>Additional Content</Text>
			</View>
		);

		act(() => {
			component = renderer.create(
				<TextPopup title={"Privacy Policy"} text={"This is privacy policy text"} close={mockCallback}>
					{childElement}
				</TextPopup>
			);
		});

		const image = component.toJSON();
		expect(image).toMatchSnapshot();

		let root = component.root;
		// Verify child content is rendered
		const textElements = root.findAllByType(Text);
		expect(textElements.length).toBeGreaterThan(2); // Title, main text, and child text

		// Verify close button still works
		const buttons = root.findAllByType(TouchableOpacity);
		expect(buttons.length).toEqual(1);
		buttons[0].props.onPress();
		expect(mockCallback).toHaveBeenCalled();
	});

	test("renders with different title and text content", () => {
		let mockCallback = jest.fn();
		const customTitle = "Custom Dialog Title";
		const customText = "This is some custom text content for testing purposes.";

		act(() => {
			component = renderer.create(<TextPopup title={customTitle} text={customText} close={mockCallback} />);
		});

		const image = component.toJSON();
		expect(image).toMatchSnapshot();

		let root = component.root;
		// Verify custom content appears
		const textElements = root.findAllByType(Text);
		expect(textElements.length).toBeGreaterThan(0);

		// Find title and verify it matches
		expect(root.findByProps({ children: customTitle })).toBeTruthy();
	});

	test("renders without children (children prop not provided)", () => {
		let mockCallback = jest.fn();

		act(() => {
			component = renderer.create(
				<TextPopup title={"No Children Test"} text={"Testing without children prop"} close={mockCallback} />
			);
		});

		const image = component.toJSON();
		expect(image).toMatchSnapshot();

		let root = component.root;
		const buttons = root.findAllByType(TouchableOpacity);
		expect(buttons.length).toEqual(1);
	});

	test("close button functionality with multiple clicks", () => {
		let mockCallback = jest.fn();

		act(() => {
			component = renderer.create(
				<TextPopup title={"Multi-click Test"} text={"Testing multiple clicks"} close={mockCallback} />
			);
		});

		let root = component.root;
		const button = root.findByType(TouchableOpacity);

		// Click multiple times
		button.props.onPress();
		button.props.onPress();
		button.props.onPress();

		expect(mockCallback).toHaveBeenCalledTimes(3);
	});
});
