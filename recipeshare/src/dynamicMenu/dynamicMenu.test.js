import React from 'react';
import renderer, { act } from 'react-test-renderer';

import DynamicMenu from './DynamicMenu.js'
import { TouchableOpacity } from 'react-native';

describe('DynamicMenu', () => {

	let component
	let mockCloseDynamicMenu
	let mockCallback
	let buttons

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
		jest.useFakeTimers()
		mockCloseDynamicMenu = jest.fn()
		mockCallback = jest.fn()
		buttons = [
			{
				"action": mockCallback,
				"icon": "share-off",
				"text": "Remove share",
			},
			{
				"action": mockCallback,
				"icon": "heart-outline",
				"text": "Like recipe",
			},
			{
				"action": mockCallback,
				"icon": "image-plus",
				"text": "Add picture",
			},
			{
				"action": mockCallback,
				"icon": "comment-plus",
				"text": "Add a comment",
			},
			{
				"action": mockCallback,
				"icon": "playlist-edit",
				"text": "Edit recipe",
			},
			{
				"action": mockCallback,
				"icon": "trash-can-outline",
				"text": "Delete recipe",
			},
			{
				"action": mockCallback,
				"icon": "food",
				"text": "Create new recipe",
			},
		]
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('renders with an outer close container and as many buttons as in list', () => {
		act(() => {
			component = renderer.create(
				<DynamicMenu
					buttons={buttons}
					closeDynamicMenu={mockCloseDynamicMenu}
				/>
			)
		})
		const image = component.toJSON()
		expect(image).toMatchSnapshot()
		let root = component.root
		const renderedButtons = root.findAllByType(TouchableOpacity)
		expect(renderedButtons.length).toEqual(buttons.length+1)
	})

});
