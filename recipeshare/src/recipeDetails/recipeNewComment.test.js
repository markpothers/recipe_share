import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider } from 'react-redux'
import { store } from '../redux/store'

import RecipeNewComment from './recipeNewComment.js'
import { TouchableOpacity, TextInput } from 'react-native';

describe('RecipeNewComment', () => {

	let component
	let mockScrollToLocation
	let mockHandleCommentTextInput
	let mockSaveComment


	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	})

	beforeEach(() => {
		// console.log('runs before every test')
		mockScrollToLocation = jest.fn()
		mockHandleCommentTextInput = jest.fn()
		mockSaveComment = jest.fn()
	})

	afterEach(() => {
		// console.log('runs after each test')
	})

	afterAll(() => {
		// console.log('runs after all tests have completed')
	})

	test('renders with some text and a confirm button', () => {
			act(() => {
				component = renderer.create(
					<RecipeNewComment 
					scrollToLocation={mockScrollToLocation} 
					username={"pothers"}
					image_url={"https://robohash.org/utautnemo.png?size=300x300&set=set1"}
					commentText={"Here is my test comment text"} 
					handleCommentTextInput={mockHandleCommentTextInput} 
					saveComment={mockSaveComment}
					/>
				)
			})
			const image = component.toJSON()
			expect(image).toMatchSnapshot()
			let root = component.root
			const input = root.findAllByType(TextInput)
			expect(input.length).toEqual(1)
	})

});
