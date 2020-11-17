import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider } from 'react-redux'
import { store } from '../redux/store'

import LoginScreen from './login.js'
import { TouchableOpacity, TextInput } from 'react-native';

describe('Login', () => {

	let component

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('renders; has 2 TextInputs and 5 TouchableOpacities', () => {
		act(() => {
			component = renderer.create(
				<Provider
					store={store}
				>
					<LoginScreen/>
				</Provider>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const inputs = root.findAllByType(TextInput)
		expect(inputs.length).toEqual(2)
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(7)
	})

});
