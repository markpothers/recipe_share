import React from "react";
import renderer, { act } from "react-test-renderer";

import SpinachAppContainer from "./SpinachAppContainer.js";
import { ScrollView, ActivityIndicator, Platform } from "react-native";

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
});
