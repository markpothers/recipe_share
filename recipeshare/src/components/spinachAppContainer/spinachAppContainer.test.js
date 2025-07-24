import { ActivityIndicator, Platform, ScrollView, Text, View } from "react-native";
import renderer, { act } from "react-test-renderer";

import React from "react";
import SpinachAppContainer from "./spinachAppContainer";

describe("SpinachAppContainer", () => {
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

	test("renders with scrollView on IOS", () => {
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={true} awaitingServer={false} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(1);
	});

	test("renders without scrollView on IOS", () => {
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={false} awaitingServer={false} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(0);
	});

	test("renders with scrollView and activityIndicator on IOS", () => {
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={true} awaitingServer={true} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(1);
		const indicator = root.findAllByType(ActivityIndicator);
		expect(indicator.length).toEqual(1);
	});

	test("renders without scrollView and with ActivityIndicator on IOS", () => {
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={false} awaitingServer={true} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(0);
		const indicator = root.findAllByType(ActivityIndicator);
		expect(indicator.length).toEqual(1);
	});

	test("renders with scrollView on Android", () => {
		Platform.OS = "android";
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={true} awaitingServer={false} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(1);
	});

	test("renders without scrollView on Android", () => {
		Platform.OS = "android";
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={false} awaitingServer={false} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(0);
	});

	test("renders with scrollView and activityIndicator on Android", () => {
		Platform.OS = "android";
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={true} awaitingServer={true} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(1);
		const indicator = root.findAllByType(ActivityIndicator);
		expect(indicator.length).toEqual(1);
	});

	test("renders without scrollView and with ActivityIndicator on Android", () => {
		Platform.OS = "android";
		act(() => {
			component = renderer.create(<SpinachAppContainer scrollingEnabled={false} awaitingServer={true} />);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const scrollView = root.findAllByType(ScrollView);
		expect(scrollView.length).toEqual(0);
		const indicator = root.findAllByType(ActivityIndicator);
		expect(indicator.length).toEqual(1);
	});

	test("renders children correctly", () => {
		Platform.OS = "ios"; // Reset to iOS for consistency
		const testChild = (
			<View testID="test-child">
				<Text>Test Child Content</Text>
			</View>
		);

		act(() => {
			component = renderer.create(
				<SpinachAppContainer scrollingEnabled={true} awaitingServer={false}>
					{testChild}
				</SpinachAppContainer>
			);
		});

		const image = component.toJSON();
		expect(image).toMatchSnapshot();

		let root = component.root;
		// Verify the child component is rendered
		const childView = root.findByProps({ testID: "test-child" });
		expect(childView).toBeTruthy();

		// Verify the text content is rendered
		const textElement = root.findByType(Text);
		expect(textElement.props.children).toBe("Test Child Content");
	});

	test("renders multiple children correctly", () => {
		Platform.OS = "ios";
		const children = [
			<View key="child-1" testID="child-1">
				<Text>First Child</Text>
			</View>,
			<View key="child-2" testID="child-2">
				<Text>Second Child</Text>
			</View>,
		];

		act(() => {
			component = renderer.create(
				<SpinachAppContainer scrollingEnabled={false} awaitingServer={false}>
					{children}
				</SpinachAppContainer>
			);
		});

		const image = component.toJSON();
		expect(image).toMatchSnapshot();

		let root = component.root;
		// Verify both child components are rendered
		const firstChild = root.findByProps({ testID: "child-1" });
		const secondChild = root.findByProps({ testID: "child-2" });
		expect(firstChild).toBeTruthy();
		expect(secondChild).toBeTruthy();

		// Verify both text contents are rendered
		const textElements = root.findAllByType(Text);
		expect(textElements.length).toBe(2);
		expect(textElements[0].props.children).toBe("First Child");
		expect(textElements[1].props.children).toBe("Second Child");
	});
});
