import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { AlertPopUp } from './alertPopUp.js'
import { TouchableOpacity } from 'react-native';

describe('AlertPopUp', () => {

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

	test('renders with 2 buttons and customizable text', () => {
		let mockClose = jest.fn()
		let mockYes = jest.fn()
		act(() => {
			component = renderer.create(
				<AlertPopUp
				close={mockClose}
				title={"Here is a mock alert qusetion that's being asked"}
				onYes={mockYes}
				yesText={"Yes button text"}
			/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(2)
	})

});
