import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider } from 'react-redux'
import { store } from '../redux/store'

import CreateChef from './createChef.js'
import { TouchableOpacity, TextInput } from 'react-native';


describe('CreateChef', () => {

	let component
	let route

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')

		route = {
			params: {
				successfulLogin: false
			}
		}
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('renders; has 5 TextInputs and 9 TouchableOpacities', () => {
		act(() => {
			component = renderer.create(
				<Provider
					store={store}
				>
					<CreateChef
						route={route}
					/>
				</Provider>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const inputs = root.findAllByType(TextInput)
		expect(inputs.length).toEqual(5)
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(10)
	})

});
