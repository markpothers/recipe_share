import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../redux";
import NetInfo from "@react-native-community/netinfo";
import Login from "./login";
import { saveToken } from "../auxFunctions/saveLoadToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postLoginChef } from "../fetches/loginChef";
import { getNewPassword } from "../fetches/getNewPassword";

// manual mocks
jest.mock("../fetches/loginChef");
jest.mock("../fetches/getNewPassword");
jest.mock("../auxFunctions/saveLoadToken");

// type MockedNetInfo = typeof NetInfo & { setReturnValue: ({ isConnected }) => void };

describe("login page", () => {
	let store, mockListener, mockListenerRemove, mockNavigate, navigation, route;

	beforeEach(async () => {
		store = configureStore({
			reducer: {
				root: rootReducer,
			},
		});

		mockListener = jest.fn();
		mockNavigate = jest.fn();
		mockListenerRemove = jest.fn();

		navigation = {
			addListener: mockListener,
			removeListener: mockListenerRemove,
			navigate: mockNavigate,
		};

		route = {};

		// eslint-disable-next-line no-unused-vars
		(NetInfo as typeof NetInfo & { setReturnValue: (isConnected: boolean) => void }).setReturnValue(true)
	});

	afterEach(async () => {
		(AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>).mockClear(); //forget calls to this method between tests
		(AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockClear();
		AsyncStorage.clear(); //clear out the contents of AsyncStorage between tests
	});

	test("should load and render", async () => {
		const { toJSON } = render(
			<Provider store={store}>
				<Login navigation={navigation} route={route} />
			</Provider>
		);
		await waitFor(() => expect(toJSON()).toMatchSnapshot());
		expect(mockListener).toHaveBeenCalledTimes(2);
		expect(mockListener).toHaveBeenNthCalledWith(1, "focus", expect.any(Function));
		expect(mockListener).toHaveBeenNthCalledWith(2, "blur", expect.any(Function));
	});

	test("should accept text in username input", async () => {
		const { getByPlaceholderText } = render(
			<Provider store={store}>
				<Login navigation={navigation} route={route} />
			</Provider>
		);
		fireEvent.changeText(getByPlaceholderText("e-mail"), "myEmail@test.com");
		await waitFor(() =>
			expect(getByPlaceholderText("e-mail").props.value).toStrictEqual("myEmail@test.com")
		);
	});

	test("should accept text in password input", async () => {
		const { getByPlaceholderText } = render(
			<Provider store={store}>
				<Login navigation={navigation} route={route} />
			</Provider>
		);
		fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
		await waitFor(() =>
			expect(getByPlaceholderText("password").props.value).toStrictEqual("myTestPassword")
		);
	});

	test("should press to display/hide password", async () => {
		const { getByTestId, getByPlaceholderText } = render(
			<Provider store={store}>
				<Login navigation={navigation} route={route} />
			</Provider>
		);
		expect(getByPlaceholderText("password").props.secureTextEntry).toStrictEqual(true);
		fireEvent.press(getByTestId("visibilityButton"));
		await waitFor(() =>
			expect(getByPlaceholderText("password").props.secureTextEntry).toStrictEqual(false)
		);
	});

	test("should accept toggle to remember username", async () => {
		const { getByTestId } = render(
			<Provider store={store}>
				<Login navigation={navigation} route={route} />
			</Provider>
		);
		expect(getByTestId("rememberEmailToggle").props.value).toStrictEqual(false);
		fireEvent.press(getByTestId("rememberEmailButton")); // works through the button
		fireEvent.press(getByTestId("rememberEmailToggle")); // works through the toggle
		fireEvent.press(getByTestId("rememberEmailButton"));
		await waitFor(() =>
			expect(getByTestId("rememberEmailToggle").props.value).toStrictEqual(true)
		);
	});

	test("should accept toggle to stay logged in", async () => {
		const { getByTestId } = render(
			<Provider store={store}>
				<Login navigation={navigation} route={route} />
			</Provider>
		);
		expect(getByTestId("stayLoggedInToggle").props.value).toStrictEqual(false);
		fireEvent.press(getByTestId("stayLoggedInButton")); // works through the button
		fireEvent.press(getByTestId("stayLoggedInToggle")); // works through the toggle
		fireEvent.press(getByTestId("stayLoggedInButton"));
		await waitFor(() =>
			expect(getByTestId("stayLoggedInToggle").props.value).toStrictEqual(true)
		);
	});

	test("should be able to navigate to registration page", async () => {
		const { getByTestId } = render(
			<Provider store={store}>
				<Login navigation={navigation} route={route} />
			</Provider>
		);
		fireEvent.press(getByTestId("registerButton"));
		await waitFor(() => expect(mockNavigate).toBeCalledWith("CreateChef"));
	});

	test("renders with thanks for registering popup", async () => {
		(
			AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>
		).mockResolvedValueOnce(JSON.stringify("test@email.com"));
		const { getByText } = render(
			<Provider store={store}>
				<Login
					navigation={navigation}
					route={{
						params: {
							successfulRegistration: true,
						},
						key: "key",
						name: "testLogin",
					}}
				/>
			</Provider>
		);
		await waitFor(() =>
			expect(
				getByText(
					"Thanks so much for registering. Please confirm your e-mail address by clicking the link in your welcome e-mail and log in."
				)
			).toBeTruthy()
		);
	});

	describe("logging in under different conditions", () => {
		let loginResponse, getByTestId, getByPlaceholderText, getByText, toJSON;

		beforeEach(() => {
			loginResponse = {
				auth_token: "testAuthToken",
				country: "United States",
				created_at: "2020-11-16T22:50:15.986Z",
				deactivated: false,
				e_mail: "test@email.com",
				first_name: null,
				hex: "",
				id: 22,
				image_url: "http://www.image.url",
				is_admin: true,
				is_member: false,
				last_name: null,
				password_is_auto: false,
				profile_text: "mock profile text",
				username: "my test username",
			};

			const rendered = render(
				<Provider store={store}>
					<Login navigation={navigation} route={route} />
				</Provider>
			);
			getByTestId = rendered.getByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			getByText = rendered.getByText;
			toJSON = rendered.toJSON;
		});

		test("logs in successfully and remembers email address", async () => {
			// arrange
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve(loginResponse)
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByTestId("rememberEmailToggle"));
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() =>
				expect(mockNavigate).toBeCalledWith("CreateChef", {
					successfulLogin: true,
				})
			);
		});

		test("logs in successfully and doesn't remember email address", async () => {
			// arrange
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve(loginResponse)
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() => expect(AsyncStorage.removeItem).toBeCalledWith("rememberedEmail"));
		});

		test("logs in successfully staying logged in", async () => {
			// arrange
			const originalLoginResponse = { ...loginResponse }; // copied because it gets modified in the actual method
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve(loginResponse)
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByTestId("stayLoggedInToggle"));
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() =>
				expect(getByPlaceholderText("e-mail").props.value).toStrictEqual("")
			); // value is updated in redux by clearLoginUserDetails
			expect(getByPlaceholderText("password").props.value).toStrictEqual(""); //value is updated in redux
			const loginResponseWithoutAuth = { ...originalLoginResponse };
			delete loginResponseWithoutAuth.auth_token;
			expect(AsyncStorage.setItem).toBeCalledWith(
				"chef",
				JSON.stringify(loginResponseWithoutAuth),
				expect.any(Function)
			);
			expect(saveToken).toHaveBeenCalledWith(originalLoginResponse.auth_token);
			expect(store.getState().root.loggedInChef).toStrictEqual({
				id: originalLoginResponse.id,
				e_mail: originalLoginResponse.e_mail,
				username: originalLoginResponse.username,
				auth_token: originalLoginResponse.auth_token,
				image_url: originalLoginResponse.image_url,
				is_admin: originalLoginResponse.is_admin,
				is_member: originalLoginResponse.is_member,
			}); //value is updated in redux by UpdateLoggedInChefInState
			expect(mockNavigate).toHaveBeenCalledWith("CreateChef", {
				successfulLogin: true,
			});
		});

		test("logs in successfully and not staying logged in", async () => {
			// arrange
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve(loginResponse)
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() =>
				expect(getByPlaceholderText("e-mail").props.value).toStrictEqual("")
			); // value is updated in redux by clearLoginUserDetails
			expect(getByPlaceholderText("password").props.value).toStrictEqual(""); //value is updated in redux
			expect(AsyncStorage.setItem).not.toBeCalled();
			expect(store.getState().root.loggedInChef).toStrictEqual({
				id: loginResponse.id,
				e_mail: loginResponse.e_mail,
				username: loginResponse.username,
				auth_token: loginResponse.auth_token,
				image_url: loginResponse.image_url,
				is_admin: loginResponse.is_admin,
				is_member: loginResponse.is_member,
			}); //value is updated in redux by UpdateLoggedInChefInState
			expect(saveToken).not.toHaveBeenCalledWith();
			expect(mockNavigate).toHaveBeenCalledWith("CreateChef", {
				successfulLogin: true,
			});
		});

		test("should password reset message after reset", async () => {
			// arrange
			(getNewPassword as jest.MockedFunction<typeof getNewPassword>).mockImplementation(() =>
				Promise.resolve({ error: true, message: "forgotPassword" })
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.press(getByTestId("forgotPasswordButton"));

			// assert
			await waitFor(() =>
				expect(
					getByText(
						"Thanks. If this e-mail address has an account we'll send you a new password. Please check your e-mail."
					)
				).toBeTruthy()
			);
			expect(toJSON()).toMatchSnapshot();
		});

		test("should instruct how to reset password if email is empty", async () => {
			// arrange

			// act
			fireEvent.press(getByTestId("forgotPasswordButton"));

			// assert
			await waitFor(() =>
				expect(
					getByText(
						"Please enter your e-mail and hit the 'Forgot Password' button again."
					)
				).toBeTruthy()
			);
			expect(toJSON()).toMatchSnapshot();
		});

		test("should display invalid credentials message from a bad login", async () => {
			// arrange
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve({ error: true, message: "invalid" })
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() =>
				expect(getByText("e-mail and password combination not recognized")).toBeTruthy()
			);
			expect(toJSON()).toMatchSnapshot();
		});

		test("should display password expired message if temp password has expired", async () => {
			// arrange
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve({ error: true, message: "password_expired" })
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() =>
				expect(
					getByText(
						"Automatically generated password has expired. Please reset your password."
					)
				).toBeTruthy()
			);
			expect(toJSON()).toMatchSnapshot();
		});

		test("should display activation required message if account is not activated", async () => {
			// arrange
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve({ error: true, message: "activation" })
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() =>
				expect(
					getByText(
						"Account not yet activated. Please click the link in your confirmation e-mail. (Don't forget to check spam!)"
					)
				).toBeTruthy()
			);
			expect(toJSON()).toMatchSnapshot();
		});

		test("should display deactivated message if account was deactivated", async () => {
			// arrange
			(postLoginChef as jest.MockedFunction<typeof postLoginChef>).mockImplementation(() =>
				Promise.resolve({ error: true, message: "deactivated" })
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.changeText(getByPlaceholderText("password"), "myTestPassword");
			fireEvent.press(getByText("Login"));

			// assert
			await waitFor(() =>
				expect(
					getByText(
						"This account was deactivated. Reset your password to reactivate your account."
					)
				).toBeTruthy()
			);
			expect(toJSON()).toMatchSnapshot();
		});

		test("should display reactivated message if account was reactivated", async () => {
			// arrange
			(getNewPassword as jest.MockedFunction<typeof getNewPassword>).mockImplementation(() =>
				Promise.resolve({ error: true, message: "reactivate" })
			);

			// act
			fireEvent.changeText(getByPlaceholderText("e-mail"), "username@email.com");
			fireEvent.press(getByTestId("forgotPasswordButton"));

			// assert
			await waitFor(() =>
				expect(
					getByText("We've e-mailed you a link to re-activate your account.")
				).toBeTruthy()
			);
			expect(toJSON()).toMatchSnapshot();
		});
	});
});
