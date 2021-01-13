import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { AlertPopUp } from './alertPopUp.js'
import { TouchableOpacity } from 'react-native';

describe('AlertPopUp', () => {

	let component
	let mockClose
	let mockYes

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
		mockClose = jest.fn()
		mockYes = jest.fn()
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('renders with 2 buttons and customizable text', () => {
		act(() => {
			component = renderer.create(
				<AlertPopUp
					close={mockClose}
					closeText={"mock text"}
					title={"Here is a mock alert qusetion that's being asked"}
					onYes={mockYes}
					yesText={"mock text"}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(2)
	})

	test('renders with 2 buttons and default text', () => {
		act(() => {
			component = renderer.create(
				<AlertPopUp
					close={mockClose}
					// closeText={"mock text"}
					title={"Here is a mock alert qusetion that's being asked"}
					onYes={mockYes}
				// yesText={"Yes button text"}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const buttons = root.findAllByType(TouchableOpacity)
		expect(buttons.length).toEqual(2)
	})

	test('renders with 1 button when no close button and customizable text', () => {
		act(() => {
			component = renderer.create(
				<AlertPopUp
					// close={mockClose}
					// closeText={"mock text"}
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
		expect(buttons.length).toEqual(1)
	})

	test('calls the yes function when button pressed', () => {
		act(() => {
			component = renderer.create(
				<AlertPopUp
					close={mockClose}
					closeText={"mock text"}
					title={"Here is a mock alert qusetion that's being asked"}
					onYes={mockYes}
					yesText={"Yes button text"}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		let button = root.findByProps({ testID: "yesButton" })
		button.props.onPress()
		expect(mockYes).toHaveBeenCalled()
		expect(mockYes).toHaveBeenCalledTimes(1)
	})

	test('calls the close function when button pressed', () => {
		act(() => {
			component = renderer.create(
				<AlertPopUp
					close={mockClose}
					closeText={"mock text"}
					title={"Here is a mock alert qusetion that's being asked"}
					onYes={mockYes}
					yesText={"Yes button text"}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		let button = root.findByProps({ testID: "closeButton" })
		button.props.onPress()
		expect(mockClose).toHaveBeenCalled()
		expect(mockClose).toHaveBeenCalledTimes(1)
	})

});
