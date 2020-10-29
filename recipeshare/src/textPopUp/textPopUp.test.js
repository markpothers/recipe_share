import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { TextPopUp } from './textPopUp.js'
import { TouchableOpacity } from 'react-native';
import { termsAndConditions } from '../dataComponents/termsAndConditions'

describe('TextPopUp', () => {

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

	test('renders with some mock props', () => {
		let mockCallback = jest.fn
		act(() => {
			component = renderer.create(
				<TextPopUp
					title={'Terms & Conditions'}
					text={termsAndConditions}
					close={mockCallback}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(1)
	})

});
