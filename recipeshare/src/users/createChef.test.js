import {
	changeTextAndWait,
	expectElementCount,
	expectElementExists,
	expectNavigation,
	openPickerAndSelect,
	pressAndWait,
	runTimersAndWait,
	waitForLoadingToComplete,
} from "../auxTestFunctions/testUtils";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import CreateChef from "./createChef";
import NetInfo from "@react-native-community/netinfo";
import { Provider } from "react-redux";
import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { postChef } from "../fetches";
import { rootReducer } from "../redux";

// manual mocks
jest.mock("../fetches/postChef");

describe("create chef page", () => {
	describe("logging in to save username to Keychain", () => {
		// this behaviour is required to have a navigate event which triggers keychain to
		// offer to save usernames and passwords
		test("when passed successful login flag, sets auth bootstrap state", async () => {
			const store = configureStore({
				reducer: {
					root: rootReducer,
				},
			});
			render(
				<Provider store={store}>
					<CreateChef
						navigation={{
							navigate: jest.fn(),
						}}
						route={{ params: { successfulLogin: true } }}
					/>
					,
				</Provider>
			);
			await waitFor(() => expect(store.getState().root.authLoaded).toBe(true));
			expect(store.getState().root.authLoggedIn).toBe(true);
		});
	});

	describe("createChef functions", () => {
		let store,
			mockNavigate,
			navigation,
			route,
			getByTestId,
			queryAllByTestId,
			getByPlaceholderText,
			getByText,
			queryAllByText,
			// getAllByRole,
			// findByText,
			// findByTestId,
			getByLabelText,
			toJSON;

		beforeEach(async () => {
			jest.useFakeTimers();
			store = configureStore({
				reducer: {
					root: rootReducer,
				},
			});

			mockNavigate = jest.fn();

			navigation = {
				navigate: mockNavigate,
			};

			route = {};

			// eslint-disable-next-line no-unused-vars
			// NetInfo as typeof NetInfo & { setReturnValue: (isConnected: boolean) => void }
			NetInfo.setReturnValue(true);

			const rendered = render(
				<Provider store={store}>
					<CreateChef navigation={navigation} route={route} />
				</Provider>
			);

			getByTestId = rendered.getByTestId;
			queryAllByTestId = rendered.queryAllByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			getByText = rendered.getByText;
			queryAllByText = rendered.queryAllByText;
			getByLabelText = rendered.getByLabelText;
			toJSON = rendered.toJSON;
			// getAllByRole = rendered.getAllByRole;
			// findByText = rendered.findByText;
			// findByTestId = rendered.findByTestId;
		});

		// afterEach(async () =>	});

		test("should load and render", async () => {
			// optionally wait for the activity indicator to disappear, indicating mount complete
			// await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0))
			expect(toJSON()).toMatchSnapshot();
		});

		test("should accept text in email input", async () => {
			// arrange

			// act
			await changeTextAndWait(getByPlaceholderText("e-mail"), "username@email.com", () => {
				expect(getByPlaceholderText("e-mail").props.value).toStrictEqual("username@email.com");
			});

			// assert
		});

		test("should accept text in username input", async () => {
			// arrange

			// act
			await changeTextAndWait(getByPlaceholderText("username"), "myUsername", () => {
				expect(getByPlaceholderText("username").props.value).toStrictEqual("myUsername");
			});

			// assert
		});

		test("should accept a change in country", async () => {
			// arrange

			// act
			await openPickerAndSelect(getByLabelText("country picker"), getByTestId, "iosPicker", "United Kingdom");

			// assert
			expect(queryAllByTestId("iosPicker").length).toEqual(0); // wait till the picker disappears
			expect(getByText("United Kingdom")).toBeTruthy();
		});

		test("should accept text in profile input", async () => {
			// arrange

			// act
			await changeTextAndWait(getByPlaceholderText("about me"), "I like to cook", () => {
				expect(getByPlaceholderText("about me").props.value).toStrictEqual("I like to cook");
			});

			// assert
		});

		test("should accept text in password input", async () => {
			// arrange

			// act
			await changeTextAndWait(getByPlaceholderText("password"), "testPassword", () => {
				expect(getByPlaceholderText("password").props.value).toStrictEqual("testPassword");
			});

			// assert
		});

		test("should press to display/hide password", async () => {
			expect(getByPlaceholderText("password").props.secureTextEntry).toStrictEqual(true);
			await pressAndWait(getByTestId("visibilityButton"), () => {
				expect(getByPlaceholderText("password").props.secureTextEntry).toStrictEqual(false);
			});
		});

		test("should accept text in password confirmation input", async () => {
			// arrange

			// act
			await changeTextAndWait(getByPlaceholderText("password confirmation"), "testPassword", () => {
				expect(getByPlaceholderText("password confirmation").props.value).toStrictEqual("testPassword");
			});

			// assert
		});

		test("can view and close terms and conditions", async () => {
			await pressAndWait(getByLabelText("view terms and conditions"), () => {
				expect(getByText("Terms and Conditions")).toBeTruthy();
			});
			expect(toJSON).toMatchSnapshot();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Privacy Policy").length).toEqual(0);
		});

		test("should accept toggle to accept terms and conditions", async () => {
			expect(getByLabelText("agree terms and conditions toggle").props.value).toStrictEqual(false);
			fireEvent.press(getByLabelText("agree terms and conditions")); // works through the button
			fireEvent.press(getByLabelText("agree terms and conditions toggle")); // works through the toggle
			await pressAndWait(getByLabelText("agree terms and conditions"), () => {
				expect(getByLabelText("agree terms and conditions toggle").props.value).toStrictEqual(true);
			});
		});

		test("can view and close privacy policy", async () => {
			await pressAndWait(getByLabelText("view privacy policy"), () => {
				expect(getByText("Privacy Policy")).toBeTruthy();
			});
			expect(toJSON).toMatchSnapshot();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Privacy Policy").length).toEqual(0);
		});

		test("should accept toggle to accept privacy policy", async () => {
			expect(getByLabelText("agree terms and conditions toggle").props.value).toStrictEqual(false);
			fireEvent.press(getByLabelText("agree privacy policy")); // works through the button
			fireEvent.press(getByLabelText("agree privacy policy toggle")); // works through the toggle
			await pressAndWait(getByLabelText("agree privacy policy"), () => {
				expect(getByLabelText("agree privacy policy toggle").props.value).toStrictEqual(true);
			});
		});

		test("should be able to navigate to login page", async () => {
			fireEvent.press(getByText("Return to login screen"));
			expect(mockNavigate).toBeCalledWith("Login");
		});

		test("submit button should request t&c acceptance initially", async () => {
			expectElementExists(getByText("Please accept T&C"));
			expect(getByTestId("submitButton").props.accessibilityState.disabled).toEqual(true);
		});

		test("submit button should request privacy policy acceptance after t&c accepted", async () => {
			postChef.mockImplementation(() => Promise.resolve({ error: true, messages: [] }));
			await pressAndWait(getByLabelText("agree terms and conditions"), () => {
				expectElementExists(getByText("Please accept privacy policy"));
			});
			expect(getByTestId("submitButton").props.accessibilityState.disabled).toEqual(true);
		});

		test("submit should enable submission after pp and t&c accepted", async () => {
			postChef.mockImplementation(() => Promise.resolve({ error: true, messages: [] }));
			fireEvent.press(getByLabelText("agree terms and conditions"));
			await pressAndWait(getByLabelText("agree privacy policy"), () => {
				expectElementExists(getByText("Submit & go to log in"));
			});
			fireEvent.press(getByTestId("submitButton"));
			expect(postChef).toHaveBeenCalled();
		});

		test("should navigate to Login after successfully submitting a new chef", async () => {
			//arrange
			postChef.mockImplementation(() => Promise.resolve(true));
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("username"), "myTestUsername");
			fireEvent.changeText(getByPlaceholderText("about me"), "Some things about me");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.changeText(getByPlaceholderText("password confirmation"), "myTestPassword");
			fireEvent.press(getByLabelText("agree terms and conditions toggle"));
			fireEvent.press(getByLabelText("agree privacy policy toggle"));

			// act
			fireEvent.press(getByTestId("submitButton"));

			// assert
			await waitFor(() => expectNavigation(mockNavigate, "Login", { successfulRegistration: true }));
			// expect the email field in login to be populated
			expect(getByPlaceholderText("e-mail").props.value).toStrictEqual("username@email.com");
		});

		test("should display errors after submitting a bad new chef", async () => {
			//arrange
			const errors = [
				"E mail must be included",
				"E mail is invalid",
				"Username must be included",
				"Username must be at least 3 characters.",
				"Password can't be blank",
				"Password must be at least 6 characters.",
			];
			postChef.mockImplementation(() =>
				Promise.resolve({
					error: true,
					messages: errors,
				})
			);
			fireEvent.press(getByLabelText("agree terms and conditions toggle"));
			fireEvent.press(getByLabelText("agree privacy policy toggle"));

			// act
			fireEvent.press(getByTestId("submitButton"));

			// assert
			await waitForLoadingToComplete(queryAllByTestId);
			errors.forEach((error) => expectElementExists(getByText(error)));
			expect(toJSON()).toMatchSnapshot();
		});

		test("should display offline message if offline", async () => {
			// arrange
			postChef.mockImplementation(() => Promise.reject({ error: "something went wrong" }));
			fireEvent.press(getByLabelText("agree terms and conditions toggle"));
			fireEvent.press(getByLabelText("agree privacy policy toggle"));

			// act
			fireEvent.press(getByTestId("submitButton"));

			// assert
			await waitFor(() => expectElementExists(getByTestId("offlineMessage")));
			await runTimersAndWait();
			expectElementCount(queryAllByTestId("offlineMessage"), 0);
		});
	});
});
