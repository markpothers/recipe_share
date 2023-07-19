import renderer, { act } from "react-test-renderer";

import React from "react";
import RecipeNewComment from "./recipeNewComment";
import { TextInput } from "react-native";

describe("RecipeNewComment", () => {
	let component;
	let mockScrollToLocation;
	let mockHandleCommentTextInput;

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	});

	beforeEach(() => {
		// console.log('runs before every test')
		mockScrollToLocation = jest.fn();
		mockHandleCommentTextInput = jest.fn();
	});

	afterEach(() => {
		// console.log('runs after each test')
	});

	afterAll(() => {
		// console.log('runs after all tests have completed')
	});

	test("renders with some text and a confirm button", () => {
		act(() => {
			component = renderer.create(
				<RecipeNewComment
					scrollToLocation={mockScrollToLocation}
					username={"pothers"}
					image_url={"https://robohash.org/utautnemo.png?size=300x300&set=set1"}
					commentText={"Here is my test comment text"}
					handleCommentTextInput={mockHandleCommentTextInput}
				/>
			);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const input = root.findAllByType(TextInput);
		expect(input.length).toEqual(1);
	});

	test("renders without an image_url", () => {
		act(() => {
			component = renderer.create(
				<RecipeNewComment
					scrollToLocation={mockScrollToLocation}
					username={"pothers"}
					image_url={""}
					commentText={"Here is my test comment text"}
					handleCommentTextInput={mockHandleCommentTextInput}
				/>
			);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
	});

	test("the text box can be typed in and calles handleCommentTextInput", () => {
		act(() => {
			component = renderer.create(
				<RecipeNewComment
					scrollToLocation={mockScrollToLocation}
					username={"pothers"}
					image_url={"https://robohash.org/utautnemo.png?size=300x300&set=set1"}
					commentText={"Here is my test comment text"}
					handleCommentTextInput={mockHandleCommentTextInput}
				/>
			);
		});
		let root = component.root;
		const input = root.findAllByType(TextInput);
		expect(input.length).toEqual(1);
		input[0].props.onChangeText("Great recipe");
		expect(mockHandleCommentTextInput).toHaveBeenCalled();
		expect(mockHandleCommentTextInput).toHaveBeenCalledWith("Great recipe");
	});
});
