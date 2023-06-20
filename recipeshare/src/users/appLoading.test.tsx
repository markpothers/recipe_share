import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "./appLoading";
import { loadToken } from "../auxFunctions/saveLoadToken";

// manual mocks
jest.mock("../auxFunctions/saveLoadToken.ts");

describe("appLoading page", () => {
	let store, mockSetLoadedAndLoggedIn, navigation, route;

	beforeEach(async () => {
		store = configureStore({
			reducer: {
				root: rootReducer,
			},
		});

		mockSetLoadedAndLoggedIn = jest.fn();
		navigation = {};
		route = {}
	});

	afterEach(async () => {
		(AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockClear();
		AsyncStorage.clear(); //clear out the contents of AsyncStorage between tests
	});

	test("should load and render with no saved login", async () => {
		const { toJSON } = render(
			<Provider store={store}>
				<AppLoading navigation={navigation} route={route} setLoadedAndLoggedIn={mockSetLoadedAndLoggedIn} />
			</Provider>
		);
		await waitFor(() => expect(toJSON()).toMatchSnapshot());
		expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({ loaded: true, loggedIn: false });
	});

	test("should load and render with saved token but no user", async () => {
		(loadToken as jest.MockedFunction<typeof loadToken>).mockImplementation(() => Promise.resolve("myMockToken"));
		render(
			<Provider store={store}>
				<AppLoading navigation={navigation} route={route} setLoadedAndLoggedIn={mockSetLoadedAndLoggedIn} />
			</Provider>
		);
		await waitFor(() => expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({ loaded: true, loggedIn: false }));
	});

	test("should load and render with saved token and user", async () => {
		(loadToken as jest.MockedFunction<typeof loadToken>).mockImplementation(() => Promise.resolve("myMockToken"));
		(AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockImplementation(() =>
			Promise.resolve(
				JSON.stringify({
					id: 22,
					e_mail: "email@test.com",
					username: "testUsername",
					image_url: "testImageUrl",
					is_admin: false,
					is_member: false,
				})
			)
		);
		render(
			<Provider store={store}>
				<AppLoading navigation={navigation} route={route} setLoadedAndLoggedIn={mockSetLoadedAndLoggedIn} />
			</Provider>
		);
		await waitFor(() => expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({ loaded: true, loggedIn: true }));
	});
});
