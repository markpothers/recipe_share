/**
 * @jest-environment jsdom
 */

// stock imports always required for enzyme testing
import React from 'react';
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils';
import { createSerializer } from 'enzyme-to-json';
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));
import toJson from 'enzyme-to-json';
import { findByTestID } from '../auxTestFunctions/findByTestId'

// suite-specific imports
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { initialState, middleware } from '../redux/store'
import reducer from '../redux/reducer.js'
import CreateChef from './createChef.js'
import { TouchableOpacity, TextInput, Text, Linking } from 'react-native'
import SwitchSized from '../customComponents/switchSized/switchSized'
import { TextPopUp } from '../textPopUp/textPopUp'
import OfflineMessage from '../offlineMessage/offlineMessage'
import { termsAndConditions } from '../dataComponents/termsAndConditions'
import { privacyPolicy } from '../dataComponents/privacyPolicy'
import PicSourceChooser from '../picSourceChooser/picSourceChooser'
import DualOSPicker from '../dualOSPicker/DualOSPicker'
import { apiCall } from '../auxFunctions/apiCall'
import { postChef } from '../fetches/postChef'


// manual mocks
jest.mock('../auxFunctions/apiCall')
jest.mock('../fetches/postChef')

describe('CreateChef', () => {

	let component
	let navigation
	let route
	let instance
	let mockNavigate
	let store
	let mockSetLoadedAndLoggedIn

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(async () => {
		// console.log('runs before every test')
		store = createStore(reducer, initialState, middleware)
		mockNavigate = jest.fn()
		mockSetLoadedAndLoggedIn = jest.fn()

		navigation = {
			navigate: mockNavigate
		}

		route = {
			params: {}
		}

		await act(async () => {
			component = await mount(
				<CreateChef
					navigation={navigation}
					route={route}
					setLoadedAndLoggedIn={mockSetLoadedAndLoggedIn}
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
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	describe('rendering', () => {

		test('renders fully; has 5 TextInputs and 10 TouchableOpacities', async () => {
			let json = toJson(component)
			expect(json).toMatchSnapshot()
			let inputs = component.find(TextInput)
			expect(inputs.length).toEqual(5)
			const buttons = component.find(TouchableOpacity)
			expect(buttons.length).toEqual(10)
		})

		test('renders fully; with t and c agreed; has 5 TextInputs and 10 TouchableOpacities', async () => {
			instance.setState({ tAndCAgreed: true })
			component.update()
			let json = toJson(component)
			expect(json).toMatchSnapshot()
		})

		test('renders fully; with t and c and privacy policy agreed; has 5 TextInputs and 10 TouchableOpacities', async () => {
			instance.setState({
				tAndCAgreed: true,
				privacyPolicyAgreed: true
			})
			component.update()
			let json = toJson(component)
			expect(json).toMatchSnapshot()
		})

		test('renders with errors', async () => {
			let errors = ['E mail must be unique.', 'Passwords do not match', 'Username must be unique']
			instance.setState({ errors: errors })
			component.update()
			let emailError = findByTestID(component, Text, 'emailError')
			let usernameError = findByTestID(component, Text, 'usernameError')
			let passwordError = findByTestID(component, Text, 'passwordError')
			expect(emailError).toBeTruthy()
			expect(usernameError).toBeTruthy()
			expect(passwordError).toBeTruthy()
			let json = toJson(component)
			expect(json).toMatchSnapshot()
		})

	})

	describe('inputs', () => {

		test('email can be typed in and is updated', async () => {
			let targetBefore = findByTestID(component, TextInput, 'emailInput')
			expect(instance.props.e_mail).toEqual('') //value starts empty in redux
			expect(targetBefore.value).toEqual('') //value starts empty in the field
			act(() => targetBefore.onChangeText('username@email.com'))
			component.update()
			let targetAfter = findByTestID(component, TextInput, 'emailInput')
			expect(instance.props.e_mail).toEqual('username@email.com') //value is updated in redux
			expect(targetAfter.value).toEqual('username@email.com') //value is updated in the field
		})

		test('username can be typed in and is updated', async () => {
			let targetBefore = findByTestID(component, TextInput, 'usernameInput')
			expect(instance.props.username).toEqual('') //value starts empty in redux
			expect(targetBefore.value).toEqual('') //value starts empty in the field
			act(() => targetBefore.onChangeText('my test username'))
			component.update()
			let targetAfter = findByTestID(component, TextInput, 'usernameInput')
			expect(instance.props.username).toEqual('my test username') //value is updated in redux
			expect(targetAfter.value).toEqual('my test username') //value is updated in the field
		})

		test('country picker can be selected and returns country of choice', async () => {
			let targetBefore = findByTestID(component, DualOSPicker, 'countryPicker')
			expect(instance.props.country).toEqual('United States') //value starts with united states
			expect(targetBefore.selectedChoice).toEqual(instance.props.country) //value starts with the same
			act(() => targetBefore.onChoiceChange('Vietnam'))
			component.update()
			let targetAfter = findByTestID(component, DualOSPicker, 'countryPicker')
			expect(instance.props.country).toEqual('Vietnam') //value is updated in redux
			expect(targetAfter.selectedChoice).toEqual('Vietnam') //value is updated in the field
		})

		test('profile can be typed in and is updated', async () => {
			let targetBefore = findByTestID(component, TextInput, 'profileInput')
			expect(instance.props.profile_text).toEqual('') //value starts empty in redux
			expect(targetBefore.value).toEqual('') //value starts empty in the field
			act(() => targetBefore.onChangeText('This is my test profile about me'))
			component.update()
			let targetAfter = findByTestID(component, TextInput, 'profileInput')
			expect(instance.props.profile_text).toEqual('This is my test profile about me') //value is updated in redux
			expect(targetAfter.value).toEqual('This is my test profile about me') //value is updated in the field
		})

		test('password can be typed in and is updated', async () => {
			let targetBefore = findByTestID(component, TextInput, 'passwordInput')
			expect(instance.props.password).toEqual('') //value starts empty in redux
			expect(targetBefore.value).toEqual('') //value starts empty in the field
			act(() => targetBefore.onChangeText('Te5tPa55word'))
			component.update()
			let targetAfter = findByTestID(component, TextInput, 'passwordInput')
			expect(instance.props.password).toEqual('Te5tPa55word') //value is updated in redux
			expect(targetAfter.value).toEqual('Te5tPa55word') //value is updated in the field
		})

		test('password confirmation can be typed in and is updated', async () => {
			let targetBefore = findByTestID(component, TextInput, 'passwordConfirmationInput')
			expect(instance.props.password_confirmation).toEqual('') //value starts empty in redux
			expect(targetBefore.value).toEqual('') //value starts empty in the field
			act(() => targetBefore.onChangeText('Te5tPa55word'))
			component.update()
			let targetAfter = findByTestID(component, TextInput, 'passwordConfirmationInput')
			expect(instance.props.password_confirmation).toEqual('Te5tPa55word') //value is updated in redux
			expect(targetAfter.value).toEqual('Te5tPa55word') //value is updated in the field
		})

	})

	describe('buttons', () => {

		test('terms and conditions toggle can be toggled', async () => {
			let targetBefore = findByTestID(component, SwitchSized, 'tAndCAgreedToggle')
			expect(targetBefore.value).toEqual(instance.state.tAndCAgreed)
			act(() => targetBefore.onValueChange(true))
			component.update()
			let targetAfter = findByTestID(component, SwitchSized, 'tAndCAgreedToggle')
			expect(instance.state.tAndCAgreed).toEqual(true)
			expect(targetAfter.value).toEqual(instance.state.tAndCAgreed)
		})

		test('t and c button can be pressed to toggle switch', async () => {
			let targetBefore = findByTestID(component, TouchableOpacity, 'tAndCAgreedButton')
			let toggleBefore = findByTestID(component, SwitchSized, 'tAndCAgreedToggle')
			expect(instance.state.tAndCAgreed).toEqual(false)
			expect(toggleBefore.value).toEqual(instance.state.tAndCAgreed)
			act(() => targetBefore.onPress())
			component.update()
			let toggleAfter = findByTestID(component, SwitchSized, 'tAndCAgreedToggle')
			expect(instance.state.tAndCAgreed).toEqual(true)
			expect(toggleAfter.value).toEqual(instance.state.tAndCAgreed)
		})

		test('view terms and conditions button brings up the textPopup and then close it', async () => {
			let targetBefore = findByTestID(component, TouchableOpacity, 'viewTAndCButton')
			expect(instance.state.viewingTermsAndConditions).toEqual(false)
			act(() => targetBefore.onPress())
			component.update()
			let popup = component.find(TextPopUp)
			expect(popup.length).toEqual(1)
			expect(popup.props().text).toEqual(termsAndConditions)
			let json = toJson(component)
			expect(json).toMatchSnapshot()
			act(() => popup.props().close())
			component.update()
			popup = component.find(TextPopUp)
			expect(popup.length).toEqual(0)
		})

		test('email button works when viewing view terms and conditions', async () => {
			const spy = jest.spyOn(Linking, 'openURL')
			let targetBefore = findByTestID(component, TouchableOpacity, 'viewTAndCButton')
			act(() => targetBefore.onPress())
			component.update()
			let emailButton = findByTestID(component, TouchableOpacity, 'emailTAndCButton')
			act(() => emailButton.onPress())
			expect(spy).toHaveBeenCalled()
		})

		test('privacy policy toggle can be toggled', async () => {
			let targetBefore = findByTestID(component, SwitchSized, 'privacyPolicyAgreedToggle')
			expect(targetBefore.value).toEqual(instance.state.privacyPolicyAgreed)
			act(() => targetBefore.onValueChange(true))
			component.update()
			let targetAfter = findByTestID(component, SwitchSized, 'privacyPolicyAgreedToggle')
			expect(instance.state.privacyPolicyAgreed).toEqual(true)
			expect(targetAfter.value).toEqual(instance.state.privacyPolicyAgreed)
		})

		test('privacy policy button can be pressed to toggle switch', async () => {
			let targetBefore = findByTestID(component, TouchableOpacity, 'privacyPolicyAgreedButton')
			let toggleBefore = findByTestID(component, SwitchSized, 'privacyPolicyAgreedToggle')
			expect(instance.state.privacyPolicyAgreed).toEqual(false)
			expect(toggleBefore.value).toEqual(instance.state.privacyPolicyAgreed)
			act(() => targetBefore.onPress())
			component.update()
			let toggleAfter = findByTestID(component, SwitchSized, 'privacyPolicyAgreedToggle')
			expect(instance.state.privacyPolicyAgreed).toEqual(true)
			expect(toggleAfter.value).toEqual(instance.state.privacyPolicyAgreed)
		})

		test('view privacy policy button brings up the textPopup and then close it', async () => {
			let targetBefore = findByTestID(component, TouchableOpacity, 'viewPrivacyPolicyButton')
			expect(instance.state.viewingPrivacyPolicy).toEqual(false)
			act(() => targetBefore.onPress())
			component.update()
			let popup = component.find(TextPopUp)
			expect(popup.length).toEqual(1)
			expect(popup.props().text).toEqual(privacyPolicy)
			let json = toJson(component)
			expect(json).toMatchSnapshot()
			act(() => popup.props().close())
			component.update()
			popup = component.find(TextPopUp)
			expect(popup.length).toEqual(0)
		})

		test('email button works when viewing privacyPolicy', async () => {
			const spy = jest.spyOn(Linking, 'openURL')
			let targetBefore = findByTestID(component, TouchableOpacity, 'viewPrivacyPolicyButton')
			act(() => targetBefore.onPress())
			component.update()
			let emailButton = findByTestID(component, TouchableOpacity, 'emailPrivacyPolicyButton')
			act(() => emailButton.onPress())
			expect(spy).toHaveBeenCalled()
		})

		test('show password toggles password visible', async () => {
			let targetBefore = findByTestID(component, TextInput, 'passwordInput')
			let visibilityButton = findByTestID(component, TouchableOpacity, 'visibilityButton')
			expect(instance.state.passwordVisible).toEqual(false)
			expect(targetBefore.secureTextEntry).not.toEqual(instance.state.passwordVisible)
			act(() => visibilityButton.onPress())
			component.update()
			let targetAfter = findByTestID(component, TextInput, 'passwordInput')
			expect(instance.state.passwordVisible).toEqual(true)
			expect(targetAfter.secureTextEntry).not.toEqual(instance.state.passwordVisible)
		})

		test('the return to login button navigates to createChef page', async () => {
			let target = findByTestID(component, TouchableOpacity, 'loginButton')
			act(() => target.onPress())
			expect(mockNavigate).toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith('Login')
			expect(mockNavigate).toHaveBeenCalledTimes(1)
		})

	})

	describe('logging in', () => {

		test('logs in if told to from the log in screen in componentDidMount', async () => {
			await act(async () => {
				component = await mount(
					<CreateChef
						navigation={navigation}
						route={{
							params: {
								successfulLogin: true
							}
						}}
						setLoadedAndLoggedIn={mockSetLoadedAndLoggedIn}
					/>,
					{
						wrappingComponent: Provider,
						wrappingComponentProps: {
							store: store
						}
					}
				)
			})
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalled()
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({ loaded: true, loggedIn: true })
		})

		test('logs in if told to from the log in screen in componentDidUpdate', () => {
			component.setProps({
				route: {
					params: {
						successfulLogin: true
					}
				}
			})
			component.update()
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalled()
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({ loaded: true, loggedIn: true })
		})
	})

	describe('choosing a picture', () => {

		let chooser

		beforeEach(() => {
			let targetBefore = findByTestID(component, TouchableOpacity, 'pictureButton')
			expect(instance.state.choosingPicture).toEqual(false)
			act(() => targetBefore.onPress())
			component.update()
			chooser = component.find(PicSourceChooser)
		})

		test('add profile pic button brings up the pic chooser', async () => {
			expect(instance.state.choosingPicture).toEqual(true)
			expect(chooser.length).toEqual(1)
			let json = toJson(component)
			expect(json).toMatchSnapshot()
		})

		test('pic chooser can save an image', async () => {
			expect(instance.props.image_url).toEqual('')
			await act(async () => await chooser.props().saveImage({
				cancelled: false,
				uri: "file address for file"
			}))
			component.update()
			expect(instance.props.image_url).toEqual('file address for file')
		})

		test('pic chooser can cancel saving an image', async () => {
			expect(instance.props.image_url).toEqual('')
			await act(async () => await chooser.props().saveImage({
				cancelled: true,
				uri: "file address for file"
			}))
			component.update()
			expect(instance.props.image_url).toEqual('')
		})

		test('pic chooser can close itself', async () => {
			expect(instance.state.choosingPicture).toEqual(true)
			await act(async () => await chooser.props().sourceChosen())
			component.update()
			expect(instance.state.choosingPicture).toEqual(false)
		})

		test('pic chooser can cancel itself', async () => {
			expect(instance.props.image_url).toEqual('')
			await act(async () => await chooser.props().saveImage({
				cancelled: false,
				uri: "old file address for file"
			}))
			component.update()
			expect(instance.props.image_url).toEqual('old file address for file')
			await act(async () => await chooser.props().cancelChooseImage('new file address for file'))
			expect(instance.props.image_url).toEqual('new file address for file')
		})

	})

	describe('createChef function', () => {

		let submitButton
		// let loginResponse

		beforeEach(async () => {
			// fill in the form as a user would
			await act(async () => await instance.handleTextInput('test@email.com', 'e_mail'))
			await act(async () => await instance.handleTextInput('testUsername', 'username'))
			await act(async () => await instance.handleTextInput('United Kingdom', 'country'))
			await act(async () => await instance.handleTextInput('words about me for testing', 'profile_text'))
			await act(async () => await instance.handleTextInput('myTestPa$$word', 'password'))
			await act(async () => await instance.handleTextInput('myTestPa$$word', 'password_confirmation'))
			let tAndCToggle = findByTestID(component, SwitchSized, 'tAndCAgreedToggle')
			act(() => tAndCToggle.onValueChange(true))
			let privacyPolicyToggle = findByTestID(component, SwitchSized, 'privacyPolicyAgreedToggle')
			act(() => privacyPolicyToggle.onValueChange(true))
			component.update()
			submitButton = findByTestID(component, TouchableOpacity, 'submitButton')
		})

		test('creates chef successfully and navigates to login', async () => {
			apiCall.mockImplementation(() => new Promise.resolve(true))
			await act(async () => await submitButton.onPress())
			component.update()
			expect(mockNavigate).toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith('Login', { successfulRegistration: true })
		})

		test('create chef fails with network call and navigates to login', async () => {
			// jest.useFakeTimers('modern')
			apiCall.mockImplementation(() => new Promise.resolve({fail: true}))
			await act(async () => await submitButton.onPress())
			component.update()
			let offlineMessage = component.find(OfflineMessage)
			expect(offlineMessage.length).toEqual(1)
			expect(mockNavigate).not.toHaveBeenCalled()
			expect(instance.state.renderOfflineMessage).toEqual(true)
			// setTimeout(() => { expect(instance.state.renderOfflineMessage).toEqual(false) }, 6000)
			// jest.runAllTimers()
		})

		test('create chef gets some kin of error', async () => {
			apiCall.mockImplementation(() => new Promise.resolve({
				error: true,
				messages: ['Passwords do not match']
			}))
			await act(async () => await submitButton.onPress())
			component.update()
			expect(mockNavigate).not.toHaveBeenCalled()
			let passwordError = findByTestID(component, Text, 'passwordError')
			expect(passwordError).toBeTruthy()
			let json = toJson(component)
			expect(json).toMatchSnapshot()
		})

	})

})
