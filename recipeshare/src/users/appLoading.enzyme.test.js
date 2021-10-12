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
import AppLoading from './appLoading.js'
import { Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { loadToken } from '../auxFunctions/saveLoadToken'

// manual mocks
// jest.mock('../auxFunctions/saveLoadToken')

describe('AppLoading', () => {

	let component
	let instance
	let store
	let mockSetLoadedAndLoggedIn

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(async () => {
		// console.log('runs before every test')
		store = createStore(reducer, initialState, middleware)
		mockSetLoadedAndLoggedIn = jest.fn()

		await act(async () => {
			component = await mount(
				<AppLoading
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
		AsyncStorage.setItem.mockClear() //forget calls to this method between tests
		AsyncStorage.getItem.mockClear()
		AsyncStorage.clear() //clear out the contents of AsyncStorage between tests
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	describe('rendering', () => {

		test('renders fully; has 1 logo', async () => {
			let json = toJson(component)
			expect(json).toMatchSnapshot()
			let logo = findByTestID(component, Image, 'yellowLogo')
			expect(logo).toBeTruthy()
		})

	})

	describe('mount-comes', () => {

		test('mounts with no chef saved', async () => {
			await AsyncStorage.getItem.mockResolvedValueOnce(null)
			expect(AsyncStorage.getItem).toHaveBeenCalled()
			expect(AsyncStorage.getItem).toHaveBeenCalledWith('chef')
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalled()
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({ loaded: true, loggedIn: false })
		})

		test('mounts with a chef saved', async () => {
			expect(instance.props.stayingLoggedIn).toEqual(false)
			expect(instance.props.loggedInChef).toEqual({
				id: "",
				username: "",
				auth_token: "",
				image_url: "",
				is_admin: false
			})
			let chef = {
				"auth_token": "testAuthToken",
				"country": "United States",
				"created_at": "2020-11-16T22:50:15.986Z",
				"deactivated": false,
				"e_mail": "test@email.com",
				"first_name": null,
				"hex": "",
				"id": 22,
				"image_url": "",
				"is_admin": true,
				"is_member": false,
				"last_name": null,
				"password_is_auto": false,
				"profile_text": "mock profile text",
				"username": "my test username",
			}
			await AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(chef))
			await act(async () => {
				component = await mount(
					<AppLoading
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
			component.update()
			expect(instance.props.stayingLoggedIn).toEqual(true) //because stay logged in was called
			expect(instance.props.loggedInChef).toEqual({
				id: chef.id,
				e_mail: chef.e_mail,
				username: chef.username,
				auth_token: chef.auth_token,
				image_url: chef.image_url,
				is_admin: chef.is_admin,
			}) // because update logged in chef in state was called
			expect(AsyncStorage.getItem).toHaveBeenCalled()
			expect(AsyncStorage.getItem).toHaveBeenCalledWith('chef')
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalled()
			expect(mockSetLoadedAndLoggedIn).toHaveBeenCalledWith({ loaded: true, loggedIn: true })
		})

	})

})