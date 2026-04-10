import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../redux";
import AppLoading from "./appLoading";
import { restorePersistedSession } from "../auxFunctions/authSessionStorage";

// manual mocks
jest.mock("../auxFunctions/authSessionStorage");

describe("appLoading page", () => {
	let store;

	beforeEach(async () => {
		store = configureStore({
			reducer: {
				root: rootReducer,
			},
		});
		(restorePersistedSession as jest.MockedFunction<typeof restorePersistedSession>).mockResolvedValue({
			loggedIn: false,
			chef: null,
		});
	});

	afterEach(() => {
		(restorePersistedSession as jest.MockedFunction<typeof restorePersistedSession>).mockClear();
	});

	test("should load and render with no saved login", async () => {
		const { toJSON } = render(
			<Provider store={store}>
				<AppLoading />
			</Provider>
		);
		await waitFor(() => expect(toJSON()).toMatchSnapshot());
		await waitFor(() => expect(store.getState().root.authLoaded).toBe(true));
		expect(store.getState().root.authLoggedIn).toBe(false);
	});

	test("should load and render with saved token but no user", async () => {
		(restorePersistedSession as jest.MockedFunction<typeof restorePersistedSession>).mockResolvedValue({
			loggedIn: false,
			chef: null,
		});
		render(
			<Provider store={store}>
				<AppLoading />
			</Provider>
		);
		await waitFor(() => expect(store.getState().root.authLoaded).toBe(true));
		expect(store.getState().root.authLoggedIn).toBe(false);
	});

	test("should load and render with saved token and user", async () => {
		(restorePersistedSession as jest.MockedFunction<typeof restorePersistedSession>).mockResolvedValue({
			loggedIn: true,
			chef: {
				id: 22,
				e_mail: "email@test.com",
				username: "testUsername",
				auth_token: "myMockToken",
				image_url: "testImageUrl",
				is_admin: false,
				is_member: false,
				country: "",
				created_at: "",
				deactivated: false,
				first_name: null,
				hex: "",
				last_name: null,
				password_is_auto: false,
				profile_text: false,
			},
		});
		render(
			<Provider store={store}>
				<AppLoading />
			</Provider>
		);
		await waitFor(() => expect(store.getState().root.authLoaded).toBe(true));
		expect(store.getState().root.authLoggedIn).toBe(true);
	});

	test("should recover to logged out when stored chef JSON is corrupt", async () => {
		(restorePersistedSession as jest.MockedFunction<typeof restorePersistedSession>).mockResolvedValue({
			loggedIn: false,
			chef: null,
		});
		render(
			<Provider store={store}>
				<AppLoading />
			</Provider>
		);
		await waitFor(() => expect(store.getState().root.authLoaded).toBe(true));
		expect(store.getState().root.authLoggedIn).toBe(false);
	});
});
