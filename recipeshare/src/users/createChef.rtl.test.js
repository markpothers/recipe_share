import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../redux";
import NetInfo from "@react-native-community/netinfo";
import CreateChef from "./createChef";
import { postChef } from "../fetches/postChef";
import { act } from "react-dom/test-utils";

// manual mocks
jest.mock("../fetches/postChef");

describe("create chef page", () => {
	describe("logging in to save username to Keychain", () => {
		// this behaviour is required to have a navigate event which triggers keychain to
		// offer to save usernames and passwords
		test("when passed successful login flag, calls setLoadedAndLoggedIn", () => {
			const mockSetLoadedAndLoggedIn = jest.fn();
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
						setLoadedAndLoggedIn={mockSetLoadedAndLoggedIn}
					/>
					,
				</Provider>
			);
			waitFor(() =>
				expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({
					loaded: true,
					loggedIn: true,
				})
			);
		});
	});

	describe("createChef functions", () => {
		let store,
			mockNavigate,
			navigation,
			route,
			mockSetLoadedAndLoggedIn,
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
			mockSetLoadedAndLoggedIn = jest.fn();

			navigation = {
				navigate: mockNavigate,
			};

			route = {};

			// eslint-disable-next-line no-unused-vars
			// NetInfo as typeof NetInfo & { setReturnValue: (isConnected: boolean) => void }
			NetInfo.setReturnValue(true);

			const rendered = render(
				<Provider store={store}>
					<CreateChef navigation={navigation} route={route} setLoadedAndLoggedIn={mockSetLoadedAndLoggedIn} />
				</Provider>
			);

			getByTestId = rendered.getByTestId;
			queryAllByTestId = rendered.queryAllByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			getByText = rendered.getByText;
			queryAllByText = rendered.queryAllByText;
			getByLabelText = rendered.getByLabelText
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
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");

			// assert
			await waitFor(() => expect(getByPlaceholderText("e-mail").props.value).toStrictEqual("username@email.com"));
		});

		test("should accept text in username input", async () => {
			// arrange

			// act
			fireEvent.changeText(getByPlaceholderText("username"), "myUsername");

			// assert
			await waitFor(() => expect(getByPlaceholderText("username").props.value).toStrictEqual("myUsername"));
		});

		test("should accept a change in country", async () => {
			// arrange

			// act
			fireEvent.press(getByLabelText("country picker")); // open the picker
			await waitFor(() => expect(getByTestId("iosPicker")).toBeTruthy()); // see the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "United Kingdom"); // change the value
			await act(async () => await jest.runAllTimers());

			// assert
			expect(queryAllByTestId("iosPicker").length).toEqual(0); // wait till the picker disappears
			expect(getByText("United Kingdom")).toBeTruthy();
		});

		test("should accept text in profile input", async () => {
			// arrange

			// act
			fireEvent.changeText(getByPlaceholderText("about me"), "I like to cook");

			// assert
			await waitFor(() => expect(getByPlaceholderText("about me").props.value).toStrictEqual("I like to cook"));
		});

		test("should accept text in password input", async () => {
			// arrange

			// act
			fireEvent.changeText(getByPlaceholderText("password"), "testPassword");

			// assert
			await waitFor(() => expect(getByPlaceholderText("password").props.value).toStrictEqual("testPassword"));
		});

		test("should press to display/hide password", async () => {
			expect(getByPlaceholderText("password").props.secureTextEntry).toStrictEqual(true);
			fireEvent.press(getByTestId("visibilityButton"));
			await waitFor(() => expect(getByPlaceholderText("password").props.secureTextEntry).toStrictEqual(false));
		});

		test("should accept text in password confirmation input", async () => {
			// arrange

			// act
			fireEvent.changeText(getByPlaceholderText("password confirmation"), "testPassword");

			// assert
			await waitFor(() =>
				expect(getByPlaceholderText("password confirmation").props.value).toStrictEqual("testPassword")
			);
		});

		test("can view and close terms and conditions", async () => {
			fireEvent.press(getByLabelText("view terms and conditions"));
			await waitFor(() => expect(getByText("Terms and Conditions")).toBeTruthy);
			expect(toJSON).toMatchSnapshot();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Privacy Policy").length).toEqual(0);
		});

		test("should accept toggle to accept terms and conditions", async () => {
			expect(getByLabelText("agree terms and conditions toggle").props.value).toStrictEqual(false);
			fireEvent.press(getByLabelText("agree terms and conditions")); // works through the button
			fireEvent.press(getByLabelText("agree terms and conditions toggle")); // works through the toggle
			fireEvent.press(getByLabelText("agree terms and conditions"));
			await waitFor(() => expect(getByLabelText("agree terms and conditions toggle").props.value).toStrictEqual(true));
		});

		test("can view and close privacy policy", async () => {
			fireEvent.press(getByLabelText("view privacy policy"));
			await waitFor(() => expect(getByText("Privacy Policy")).toBeTruthy());
			expect(toJSON).toMatchSnapshot();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Privacy Policy").length).toEqual(0);
		});

		test("should accept toggle to accept privacy policy", async () => {
			expect(getByLabelText("agree terms and conditions toggle").props.value).toStrictEqual(false);
			fireEvent.press(getByLabelText("agree privacy policy")); // works through the button
			fireEvent.press(getByLabelText("agree privacy policy toggle")); // works through the toggle
			fireEvent.press(getByLabelText("agree privacy policy"));
			await waitFor(() => expect(getByLabelText("agree privacy policy toggle").props.value).toStrictEqual(true));
		});

		test("should be able to navigate to login page", async () => {
			fireEvent.press(getByText("Return to login screen"));
			expect(mockNavigate).toBeCalledWith("Login");
		});

		test("submit button should request t&c acceptance initially", async () => {
			expect(getByText("Please accept T&C")).toBeTruthy();
			expect(getByTestId("submitButton").props.accessibilityState.disabled).toEqual(true);
		});

		test("submit button should request privacy policy acceptance after t&c accepted", async () => {
			postChef.mockImplementation(() => Promise.resolve({ error: true, messages: [] }));
			fireEvent.press(getByLabelText("agree terms and conditions")); // works through the button
			await waitFor(() => expect(getByText("Please accept privacy policy")).toBeTruthy());
			expect(getByTestId("submitButton").props.accessibilityState.disabled).toEqual(true);
		});

		test("submit should enable submission after pp and t&c accepted", async () => {
			postChef.mockImplementation(() => Promise.resolve({ error: true, messages: [] }));
			fireEvent.press(getByLabelText("agree terms and conditions"));
			fireEvent.press(getByLabelText("agree privacy policy"));
			await waitFor(() => expect(getByText("Submit & go to log in")).toBeTruthy());
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
			await waitFor(() => expect(mockNavigate).toBeCalledWith("Login", { successfulRegistration: true }));
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
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
			errors.forEach((error) => expect(getByText(error)).toBeTruthy());
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
			await waitFor(() => expect(getByTestId("offlineMessage")).toBeTruthy());
			await act(async () => await jest.runAllTimers());
			expect(queryAllByTestId("offlineMessage").length).toEqual(0);
		});
	});
});
