import React from 'react';
// import { Switch } from 'react-native'
import { create, act } from 'react-test-renderer';
import SwitchSized from './switchSized.js'

describe('SwitchSized', () => {

	let component
	let mockChangeFunction

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
		mockChangeFunction = jest.fn()
		act(() => {
			component = create(
				<SwitchSized
					value={true}
					onChange={mockChangeFunction}
				/>
			)
		})
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('can be rendered', () => {
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
	})

	// test('can be rendered and switched', () => {
	// 	let root = component.root
	// 	let testSwitch = root.findAllByType(Switch)
	// 	expect(testSwitch.length).toEqual(1)
	// 	testSwitch[0].props.onChange()
	// 	expect(mockChangeFunction).toHaveBeenCalled()
	// 	expect(mockChangeFunction).toHaveBeenCalledTimes(1)
	// })

});
