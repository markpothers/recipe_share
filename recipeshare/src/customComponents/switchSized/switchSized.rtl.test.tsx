import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Platform } from "react-native";
import SwitchSized from "./switchSized";
import { setMockDeviceType } from "../../../__mocks__/expo-device";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../redux";
import { Provider } from "react-redux";

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
		const { getByRole } = render(
			<Provider store={store}>
				<SwitchSized value={true} onValueChange={mockChangeFunction} />
			</Provider>
		);
		fireEvent(getByRole("switch"), "onValueChange");
		expect(mockChangeFunction).toHaveBeenCalled();
		expect(mockChangeFunction).toHaveBeenCalledTimes(1);
	});

	test("can be rendered and switched on", async () => {
		const { getByRole } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} />
			</Provider>
		);
		fireEvent(getByRole("switch"), "onValueChange");
		expect(mockChangeFunction).toHaveBeenCalled();
		expect(mockChangeFunction).toHaveBeenCalledTimes(1);
	});

	test("can be rendered and switched on and off", async () => {
		const { getByRole } = render(
			<Provider store={store}>
				<SwitchSized value={false} onValueChange={mockChangeFunction} />
			</Provider>
		);
		fireEvent(getByRole("switch"), "onValueChange");
		fireEvent(getByRole("switch"), "onValueChange");
		expect(mockChangeFunction).toHaveBeenCalled();
		expect(mockChangeFunction).toHaveBeenCalledTimes(2);
	});
});
