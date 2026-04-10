import { fireEvent, render } from "@testing-library/react-native";

import { Platform } from "react-native";
import { Provider } from "react-redux";
import React from "react";
import SwitchSized from "./switchSized";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../redux";
import { setMockDeviceType } from "../../../__mocks__/expo-device";

describe("SwitchSized", () => {
	let mockChangeFunction, store;

	beforeEach(async () => {
		mockChangeFunction = jest.fn();

		store = configureStore({
			reducer: {
				root: rootReducer,
			},
		});
	});

	test("can be rendered on an iPhone with reduced size switches where switch is on", async () => {
		setMockDeviceType(1); //phone
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered on an iPhone with reduced size switches where switch is off", async () => {
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered on an android switch is off", async () => {
		Platform.OS = "android";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered on an android where switch is on", async () => {
		Platform.OS = "android";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered on iPad with regular switch where switch is on", async () => {
		setMockDeviceType(2); //iPad
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered on iPad with regular switch where switch is off", async () => {
		setMockDeviceType(2);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered and switched off", async () => {
		const { getByTestId } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} testID="testSwitch" />
			</Provider>
		);
		fireEvent(getByTestId("testSwitch"), "onValueChange");
		expect(mockChangeFunction).toHaveBeenCalled();
		expect(mockChangeFunction).toHaveBeenCalledTimes(1);
	});

	test("can be rendered and switched on", async () => {
		const { getByTestId } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} testID="testSwitch" />
			</Provider>
		);
		fireEvent(getByTestId("testSwitch"), "onValueChange");
		expect(mockChangeFunction).toHaveBeenCalled();
		expect(mockChangeFunction).toHaveBeenCalledTimes(1);
	});

	test("can be rendered and switched on and off", async () => {
		const { getByTestId } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} testID="testSwitch" />
			</Provider>
		);
		fireEvent(getByTestId("testSwitch"), "onValueChange");
		fireEvent(getByTestId("testSwitch"), "onValueChange");
		expect(mockChangeFunction).toHaveBeenCalled();
		expect(mockChangeFunction).toHaveBeenCalledTimes(2);
	});

	test("can be rendered as disabled on Android with opacity styling", async () => {
		Platform.OS = "android";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} disabled={true} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered as disabled on iOS without opacity styling", async () => {
		Platform.OS = "ios";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} disabled={true} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered with custom trackColor", async () => {
		Platform.OS = "ios";
		setMockDeviceType(1);
		const customTrackColor = { true: "#ff0000", false: "#00ff00" };
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} trackColor={customTrackColor} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered with custom thumbColor", async () => {
		Platform.OS = "ios";
		setMockDeviceType(1);
		const customThumbColor = "#0000ff";
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} thumbColor={customThumbColor} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered with accessibility label", async () => {
		Platform.OS = "ios";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized
					value={true}
					onValueChange={mockChangeFunction}
					accessibilityLabel="Test switch for toggling feature"
					testID="accessibleSwitch"
				/>
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("renders default colors when no custom colors provided on iOS", async () => {
		Platform.OS = "ios";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("renders default colors when no custom colors provided on Android", async () => {
		Platform.OS = "android";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered as enabled on Android without opacity styling", async () => {
		Platform.OS = "android";
		setMockDeviceType(1);
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} disabled={false} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered on iOS with deviceType != 1 (no scaling)", async () => {
		Platform.OS = "ios";
		setMockDeviceType(3); // Not iPhone (deviceType 1) or iPad (deviceType 2)
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("can be rendered on Android with deviceType == 1 (no iOS scaling)", async () => {
		Platform.OS = "android";
		setMockDeviceType(1); // deviceType 1 but not iOS, so no scaling
		const { toJSON } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} />
			</Provider>
		);
		expect(toJSON()).toMatchSnapshot();
	});
});
