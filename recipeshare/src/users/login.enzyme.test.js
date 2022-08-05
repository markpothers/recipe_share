/**
 * @jest-environment jsdom
 */

// stock imports always required for enzyme testing
import React from "react";
import { mount } from "enzyme"
import { act } from "react-dom/test-utils";
import { createSerializer } from "enzyme-to-json";
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));
import toJson from "enzyme-to-json";
import { findByTestID } from "../auxTestFunctions/findByTestId"

// suite-specific imports
// import { createStore } from "redux";
import { Provider } from "react-redux"
// import { initialState, middleware } from "../redux/store"
// import reducer from "../redux/reducer.js"
import LoginScreen from "./login"
import { TouchableOpacity, TextInput, Text } from "react-native"
import SwitchSized from "../customComponents/switchSized/switchSized"
import { AlertPopup } from "../alertPopup/alertPopup"
import AsyncStorage from "@react-native-async-storage/async-storage"
import OfflineMessage from "../offlineMessage/offlineMessage";
import { apiCall } from "../auxFunctions/apiCall"
import * as SecureStore from "expo-secure-store";
import { saveToken } from "../auxFunctions/saveLoadToken"
import { configureStore } from "@reduxjs/toolkit"
import { rootReducer, updateNewUserDetails } from "../redux"

// manual mocks
jest.mock("../auxFunctions/apiCall")
jest.mock("../auxFunctions/saveLoadToken.ts")

describe("Login", () => {

	let component
	let navigation
	let route
	let instance
	let mockListener
	let mockListenerRemove
	let mockNavigate
	let store

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(async () => {
		// console.log('runs before every test')
		store = configureStore({
			reducer: {
				root: rootReducer
			}
		})
		mockListener = jest.fn()
		mockNavigate = jest.fn()
		mockListenerRemove = jest.fn()

		navigation = {
			addListener: mockListener,
			removeListener: mockListenerRemove,
			navigate: mockNavigate
		}

		route = {
			params: {}
		}

		await act(async () => {
			component = await mount(
				<LoginScreen
					navigation={navigation}
					route={route}
				/>,
				{
					wrappingComponent: Provider,
					wrappingComponentProps: {
						store: store
					}
				}
			)
		})
		component.setProps({})
		instance = component.children().instance()
	})

	afterEach(async () => {
		// console.log('runs after each test')
		AsyncStorage.setItem.mockClear() //forget calls to this method between tests
		AsyncStorage.getItem.mockClear()
		AsyncStorage.clear() //clear out the contents of AsyncStorage between tests
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	describe("rendering", () => {

		test("this suite has been superceded", () => {
			expect(1).toEqual(1);
		})

	// 	test("renders fully; has 2 TextInputs and 7 TouchableOpacities", async () => {
	// 		let json = toJson(component)
	// 		expect(json).toMatchSnapshot()
	// 		let inputs = component.find(TextInput)
	// 		expect(inputs.length).toEqual(2)
	// 		const buttons = component.find(TouchableOpacity)
	// 		expect(buttons.length).toEqual(7)
	// 		expect(mockListener).toHaveBeenCalledTimes(2)
	// 		expect(mockListener).toHaveBeenNthCalledWith(1, "focus", expect.any(Function))
	// 		expect(mockListener).toHaveBeenNthCalledWith(2, "blur", expect.any(Function))
	// 	})

	// 	test("renders correctly with thanks for registering popup", async () => {
	// 		component.setProps({
	// 			route: {
	// 				params: {
	// 					successfulRegistration: true
	// 				}
	// 			}
	// 		})
	// 		component.update()
	// 		let json = toJson(component)
	// 		expect(json).toMatchSnapshot()
	// 		let popup = component.find(AlertPopup)
	// 		expect(popup.length).toEqual(1)
	// 		expect(popup.props().title).toEqual("Thanks so much for registering. Please confirm your e-mail address by clicking the link in your welcome e-mail and log in.")
	// 	})

	// 	test("renders correctly with an error message", async () => {
	// 		instance.setState({
	// 			loginError: true,
	// 			error: "invalid"
	// 		})
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "invalidErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		let json = toJson(component)
	// 		expect(json).toMatchSnapshot()
	// 	})

	// 	test("correctly handles things when AsyncStorage returns an email", async () => {
	// 		await AsyncStorage.getItem.mockResolvedValueOnce("test@test-email-address.com")
	// 		await act(async () => {
	// 			component = await mount(
	// 				<LoginScreen
	// 					navigation={navigation}
	// 					route={route}
	// 				/>,
	// 				{
	// 					wrappingComponent: Provider,
	// 					wrappingComponentProps: {
	// 						store: store
	// 					}
	// 				}
	// 			)
	// 		})
	// 		component.setProps({})
	// 		instance = component.children().instance()
	// 		expect(AsyncStorage.getItem).toBeCalledWith("rememberedEmail")
	// 		let targetAfter = findByTestID(component, TextInput, "usernameInput")
	// 		expect(instance.props.e_mail).toEqual("test@test-email-address.com") //value is updated in redux
	// 		expect(targetAfter.value).toEqual("test@test-email-address.com") //value is updated in the field
	// 	})

	// })

	// describe("inputs", () => {

	// 	test("username can be typed in and is updated", async () => {
	// 		let targetBefore = findByTestID(component, TextInput, "usernameInput")
	// 		expect(instance.props.e_mail).toEqual("") //value starts empty in redux
	// 		expect(targetBefore.value).toEqual("") //value starts empty in the field
	// 		act(() => targetBefore.onChangeText("username@email.com"))
	// 		component.update()
	// 		let targetAfter = findByTestID(component, TextInput, "usernameInput")
	// 		expect(instance.props.e_mail).toEqual("username@email.com") //value is updated in redux
	// 		expect(targetAfter.value).toEqual("username@email.com") //value is updated in the field
	// 	})

	// 	test("password can be typed in and is updated", async () => {
	// 		let targetBefore = findByTestID(component, TextInput, "passwordInput")
	// 		expect(instance.props.password).toEqual("") //value starts empty in redux
	// 		expect(targetBefore.value).toEqual("") //value starts empty in the field
	// 		act(() => targetBefore.onChangeText("MyTestPassword"))
	// 		component.update()
	// 		let targetAfter = findByTestID(component, TextInput, "passwordInput")
	// 		expect(instance.props.password).toEqual("MyTestPassword") //value is updated in redux
	// 		expect(targetAfter.value).toEqual("MyTestPassword") //value is updated in the field
	// 	})

	// })

	// describe("buttons", () => {

	// 	test("remember email can be toggled", async () => {
	// 		let targetBefore = findByTestID(component, SwitchSized, "rememberEmailToggle")
	// 		expect(targetBefore.value).toEqual(instance.state.rememberEmail)
	// 		act(() => targetBefore.onValueChange(true))
	// 		component.update()
	// 		let targetAfter = findByTestID(component, SwitchSized, "rememberEmailToggle")
	// 		expect(instance.state.rememberEmail).toEqual(true)
	// 		expect(targetAfter.value).toEqual(instance.state.rememberEmail)
	// 	})

	// 	test("remember email button can be pressed to toggle switch", async () => {
	// 		let targetBefore = findByTestID(component, TouchableOpacity, "rememberEmailButton")
	// 		let toggleBefore = findByTestID(component, SwitchSized, "rememberEmailToggle")
	// 		expect(instance.state.rememberEmail).toEqual(false)
	// 		expect(toggleBefore.value).toEqual(instance.state.rememberEmail)
	// 		act(() => targetBefore.onPress())
	// 		component.update()
	// 		let toggleAfter = findByTestID(component, SwitchSized, "rememberEmailToggle")
	// 		expect(instance.state.rememberEmail).toEqual(true)
	// 		expect(toggleAfter.value).toEqual(instance.state.rememberEmail)
	// 	})

	// 	test("stay logged in can be toggled", async () => {
	// 		let targetBefore = findByTestID(component, SwitchSized, "stayLoggedInToggle")
	// 		expect(instance.props.stayingLoggedIn).toEqual(false)
	// 		expect(targetBefore.value).toEqual(instance.props.stayingLoggedIn)
	// 		act(() => targetBefore.onValueChange(true))
	// 		component.update()
	// 		let targetAfter = findByTestID(component, SwitchSized, "stayLoggedInToggle")
	// 		expect(instance.props.stayingLoggedIn).toEqual(true)
	// 		expect(targetAfter.value).toEqual(instance.props.stayingLoggedIn)
	// 	})

	// 	test("stay logged in button can be pressed to toggle switch", async () => {
	// 		let targetBefore = findByTestID(component, TouchableOpacity, "stayLoggedInButton")
	// 		let toggleBefore = findByTestID(component, SwitchSized, "stayLoggedInToggle")
	// 		expect(instance.props.stayingLoggedIn).toEqual(false)
	// 		expect(toggleBefore.value).toEqual(instance.props.stayingLoggedIn)
	// 		act(() => targetBefore.onPress())
	// 		component.update()
	// 		let toggleAfter = findByTestID(component, SwitchSized, "stayLoggedInToggle")
	// 		expect(instance.props.stayingLoggedIn).toEqual(true)
	// 		expect(toggleAfter.value).toEqual(instance.props.stayingLoggedIn)
	// 	})

	// 	test("show password toggles password visible", async () => {
	// 		let targetBefore = findByTestID(component, TextInput, "passwordInput")
	// 		let visibilityButton = findByTestID(component, TouchableOpacity, "visibilityButton")
	// 		expect(instance.state.passwordVisible).toEqual(false)
	// 		expect(targetBefore.secureTextEntry).not.toEqual(instance.state.passwordVisible)
	// 		act(() => visibilityButton.onPress())
	// 		component.update()
	// 		let targetAfter = findByTestID(component, TextInput, "passwordInput")
	// 		expect(instance.state.passwordVisible).toEqual(true)
	// 		expect(targetAfter.secureTextEntry).not.toEqual(instance.state.passwordVisible)
	// 	})

	// 	test("the register button navigates to createChef page", async () => {
	// 		let target = findByTestID(component, TouchableOpacity, "registerButton")
	// 		act(() => target.onPress())
	// 		expect(mockNavigate).toHaveBeenCalled()
	// 		expect(mockNavigate).toHaveBeenCalledWith("CreateChef")
	// 		expect(mockNavigate).toHaveBeenCalledTimes(1)
	// 	})

	// 	test("renders correctly with thanks for registering popup and its yes button can be pressed", async () => {
	// 		component.setProps({
	// 			route: {
	// 				params: {
	// 					successfulRegistration: true
	// 				}
	// 			}
	// 		})
	// 		component.update()
	// 		let newUserDetails = store.getState().root.newUserDetails
	// 		expect(newUserDetails.e_mail).toEqual("")
	// 		// since I'm not mocking state here, manually put some details in and then see that they are removed
	// 		store.dispatch(updateNewUserDetails({ parameter: "e_mail", content: "test@email.com" }))
	// 		newUserDetails = store.getState().root.newUserDetails
	// 		expect(newUserDetails.e_mail).toEqual("test@email.com")
	// 		let popup = component.find(AlertPopup)
	// 		expect(popup.length).toEqual(1)
	// 		act(() => popup.props().onYes())
	// 		newUserDetails = store.getState().root.newUserDetails
	// 		expect(newUserDetails.e_mail).toEqual("")
	// 	})

	// })

	// describe("focus/blur listeners", () => {

	// 	test("focus listener", () => {
	// 		expect(instance.state.isFocused).toEqual(true)
	// 		act(() => instance.respondToBlur())
	// 		expect(instance.state.isFocused).toEqual(false)
	// 	})

	// 	test("blur listener", () => {
	// 		expect(instance.state.isFocused).toEqual(true)
	// 		instance.setState({ isFocused: false })
	// 		expect(instance.state.isFocused).toEqual(false)
	// 		act(() => instance.respondToFocus())
	// 		expect(instance.state.isFocused).toEqual(true)
	// 	})

	// 	test("unmounting unsubscribes listeners", () => {
	// 		component.unmount()
	// 		expect(mockListenerRemove).toHaveBeenCalled()
	// 		expect(mockListenerRemove).toHaveBeenCalledTimes(2)
	// 		expect(mockListenerRemove).toHaveBeenNthCalledWith(1, "focus", expect.any(Function))
	// 		expect(mockListenerRemove).toHaveBeenNthCalledWith(2, "blur", expect.any(Function))
	// 	})

	// })

	// describe("forgotPassword function", () => {

	// 	test("correctly handles the ForgotPassword button when it works", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: false,
	// 					message: "forgotPassword"
	// 				})
	// 			})
	// 		})
	// 		let input = findByTestID(component, TextInput, "usernameInput")
	// 		act(() => input.onChangeText("username@email.com"))
	// 		component.update()
	// 		let target = findByTestID(component, TouchableOpacity, "forgotPasswordButton")
	// 		await act(async () => await target.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "forgotPasswordErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		let json = toJson(component)
	// 		expect(json).toMatchSnapshot()
	// 	})

	// 	test("correctly handles the ForgotPassword button when theres no username", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: false,
	// 					message: "forgotPassword"
	// 				})
	// 			})
	// 		})
	// 		// let input = findByTestID(component, TextInput, 'usernameInput')
	// 		// act(() => input.onChangeText('username@email.com'))
	// 		// component.update()
	// 		let target = findByTestID(component, TouchableOpacity, "forgotPasswordButton")
	// 		await act(async () => await target.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "noUsernameForgotPasswordErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		let json = toJson(component)
	// 		expect(json).toMatchSnapshot()
	// 	})

	// 	test("correctly handles the ForgotPassword button with an error", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: true,
	// 					message: "forgotPassword"
	// 				})
	// 			})
	// 		})
	// 		let input = findByTestID(component, TextInput, "usernameInput")
	// 		act(() => input.onChangeText("username@email.com"))
	// 		component.update()
	// 		let target = findByTestID(component, TouchableOpacity, "forgotPasswordButton")
	// 		await act(async () => await target.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "forgotPasswordErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		let json = toJson(component)
	// 		expect(json).toMatchSnapshot()
	// 	})

	// 	test("correctly handles the ForgotPassword button with a call fail", async () => {
	// 		apiCall.mockImplementation(() => (new Promise.resolve({ fail: true })))
	// 		let input = findByTestID(component, TextInput, "usernameInput")
	// 		act(() => input.onChangeText("username@email.com"))
	// 		component.update()
	// 		let target = findByTestID(component, TouchableOpacity, "forgotPasswordButton")
	// 		await act(async () => await target.onPress())
	// 		component.update()
	// 		let offlineMessage = component.find(OfflineMessage)
	// 		expect(offlineMessage.length).toEqual(1)
	// 	})

	// })

	// describe("login function", () => {

	// 	let loginButton
	// 	let loginResponse

	// 	beforeEach(() => {
	// 		loginResponse = {
	// 			"auth_token": "testAuthToken",
	// 			"country": "United States",
	// 			"created_at": "2020-11-16T22:50:15.986Z",
	// 			"deactivated": false,
	// 			"e_mail": "test@email.com",
	// 			"first_name": null,
	// 			"hex": "",
	// 			"id": 22,
	// 			"image_url": "",
	// 			"is_admin": true,
	// 			"is_member": false,
	// 			"last_name": null,
	// 			"password_is_auto": false,
	// 			"profile_text": "mock profile text",
	// 			"username": "my test username",
	// 		}
	// 		let usernameInput = findByTestID(component, TextInput, "usernameInput")
	// 		act(() => usernameInput.onChangeText("username@email.com"))
	// 		let passwordInput = findByTestID(component, TextInput, "passwordInput")
	// 		act(() => passwordInput.onChangeText("MyTestPassword"))
	// 		component.update()
	// 		loginButton = findByTestID(component, TouchableOpacity, "loginButton")
	// 	})

	// 	test("logs in successfully and remembers email address", async () => {
	// 		apiCall.mockImplementation(() => new Promise.resolve(loginResponse))
	// 		let email = instance.props.e_mail
	// 		let rememberEmailToggle = findByTestID(component, SwitchSized, "rememberEmailToggle")
	// 		act(() => rememberEmailToggle.onValueChange(true))
	// 		component.update()
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		expect(instance.state.rememberEmail).toEqual(true)
	// 		expect(AsyncStorage.setItem).toBeCalledWith("rememberedEmail", email)
	// 		expect(instance.props.e_mail).toEqual("") //value is updated in reduxby clearLoginUserDetails
	// 		expect(instance.props.password).toEqual("") //value is updated in redux
	// 		expect(instance.props.loggedInChef).toEqual({
	// 			id: loginResponse.id,
	// 			e_mail: loginResponse.e_mail,
	// 			username: loginResponse.username,
	// 			auth_token: loginResponse.auth_token,
	// 			image_url: loginResponse.image_url,
	// 			is_admin: loginResponse.is_admin,
	// 			is_member: loginResponse.is_member
	// 		}) //value is updated in redux by UpdateLoggedInChefInState
	// 		expect(mockNavigate).toHaveBeenCalled()
	// 		expect(mockNavigate).toHaveBeenCalledWith("CreateChef", { successfulLogin: true })
	// 	})

	// 	test("logs in successfully and doesnt remember email address", async () => {
	// 		apiCall.mockImplementation(() => new Promise.resolve(loginResponse))
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		expect(AsyncStorage.removeItem).toBeCalledWith("rememberedEmail")
	// 		expect(instance.props.e_mail).toEqual("") //value is updated in reduxby clearLoginUserDetails
	// 		expect(instance.props.password).toEqual("") //value is updated in redux
	// 		expect(instance.props.loggedInChef).toEqual({
	// 			id: loginResponse.id,
	// 			e_mail: loginResponse.e_mail,
	// 			username: loginResponse.username,
	// 			auth_token: loginResponse.auth_token,
	// 			image_url: loginResponse.image_url,
	// 			is_admin: loginResponse.is_admin,
	// 			is_member: loginResponse.is_member
	// 		}) //value is updated in redux by UpdateLoggedInChefInState
	// 		expect(mockNavigate).toHaveBeenCalled()
	// 		expect(mockNavigate).toHaveBeenCalledWith("CreateChef", { successfulLogin: true })
	// 	})

	// 	test("logs in successfully staying logged in", async () => {
	// 		apiCall.mockImplementation(() => new Promise.resolve(loginResponse))
	// 		const originalLoginResponse = {...loginResponse} // copied because it gets modified in the actual method
	// 		let stayLoggedInToggle = findByTestID(component, SwitchSized, "stayLoggedInToggle")
	// 		act(() => stayLoggedInToggle.onValueChange(true))
	// 		component.update()
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		expect(instance.props.stayingLoggedIn).toEqual(true)
	// 		let loginResponseWithoutAuth = {...originalLoginResponse}
	// 		delete loginResponseWithoutAuth.auth_token
	// 		expect(AsyncStorage.setItem).toBeCalledWith("chef", JSON.stringify(loginResponseWithoutAuth), expect.any(Function))
	// 		expect(instance.props.e_mail).toEqual("") //value is updated in redux by clearLoginUserDetails
	// 		expect(instance.props.password).toEqual("") //value is updated in redux
	// 		expect(instance.props.loggedInChef).toEqual({
	// 			id: originalLoginResponse.id,
	// 			e_mail: originalLoginResponse.e_mail,
	// 			username: originalLoginResponse.username,
	// 			auth_token: originalLoginResponse.auth_token,
	// 			image_url: originalLoginResponse.image_url,
	// 			is_admin: originalLoginResponse.is_admin,
	// 			is_member: loginResponse.is_member
	// 		}) //value is updated in redux by UpdateLoggedInChefInState
	// 		expect(mockNavigate).toHaveBeenCalled()
	// 		expect(mockNavigate).toHaveBeenCalledWith("CreateChef", { successfulLogin: true })
	// 	})

	// 	test("logs in successfully and not staying logged in", async () => {
	// 		apiCall.mockImplementation(() => new Promise.resolve(loginResponse))
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		expect(instance.props.stayingLoggedIn).toEqual(false)
	// 		expect(AsyncStorage.setItem).not.toBeCalled()
	// 		expect(instance.props.e_mail).toEqual("") //value is updated in reduxby clearLoginUserDetails
	// 		expect(instance.props.password).toEqual("") //value is updated in redux
	// 		expect(instance.props.loggedInChef).toEqual({
	// 			id: loginResponse.id,
	// 			e_mail: loginResponse.e_mail,
	// 			username: loginResponse.username,
	// 			auth_token: loginResponse.auth_token,
	// 			image_url: loginResponse.image_url,
	// 			is_admin: loginResponse.is_admin,
	// 			is_member: loginResponse.is_member
	// 		}) //value is updated in redux by UpdateLoggedInChefInState
	// 		expect(mockNavigate).toHaveBeenCalled()
	// 		expect(mockNavigate).toHaveBeenCalledWith("CreateChef", { successfulLogin: true })
	// 	})

	// 	test("logs in attempt with invalid credentials (with error)", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: true,
	// 					message: "invalid"
	// 				})
	// 			})
	// 		})
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "invalidErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 	})

	// 	test("logs in attempt with connection or api error (fail) and the error clears after the default seconds", async () => {
	// 		// jest.useFakeTimers()
	// 		apiCall.mockImplementation(() => new Promise.resolve({ fail: true }))
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		let offlineMessage = component.find(OfflineMessage)
	// 		expect(offlineMessage.length).toEqual(1)
	// 		expect(mockNavigate).not.toHaveBeenCalled()
	// 		expect(instance.state.renderOfflineMessage).toEqual(true)
	// 		// setTimeout(() => { expect(instance.state.renderOfflineMessage).toEqual(false) }, 6000)
	// 		// jest.runAllTimers()
	// 	})

	// 	test("logs in attempt with expired password", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: true,
	// 					message: "password_expired"
	// 				})
	// 			})
	// 		})
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "passwordExpiredErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		expect(mockNavigate).not.toHaveBeenCalled()
	// 	})

	// 	test("logs in attempt on deactivated account", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: true,
	// 					message: "deactivated"
	// 				})
	// 			})
	// 		})
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "deactivatedErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		expect(mockNavigate).not.toHaveBeenCalled()
	// 	})

	// 	test("logs in attempt on not yet confirmed email", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: true,
	// 					message: "activation"
	// 				})
	// 			})
	// 		})
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "activationErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		expect(mockNavigate).not.toHaveBeenCalled()
	// 	})

	// 	test("logs in attempt on reactivation email sent", async () => {
	// 		apiCall.mockImplementation(() => {
	// 			return new Promise((resolve) => {
	// 				resolve({
	// 					error: true,
	// 					message: "reactivate"
	// 				})
	// 			})
	// 		})
	// 		await act(async () => await loginButton.onPress())
	// 		component.update()
	// 		let errorMessage = component.find(Text).filterWhere(c => c.props().testID === "reactivateErrorMessage")
	// 		expect(errorMessage.length).toEqual(1)
	// 		expect(mockNavigate).not.toHaveBeenCalled()
	// 	})

	})

})
