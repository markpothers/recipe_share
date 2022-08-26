import React from "react";
import renderer, { act } from "react-test-renderer";

import RecipeComment from "./recipeComment.js";
import { TouchableOpacity } from "react-native";

describe("RecipeComment", () => {
	let component;
	let mockAskDeleteComment;
	let mockNavigateToChefDetails;
	let comments;

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	});

	beforeEach(() => {
		// console.log('runs before every test')
		mockAskDeleteComment = jest.fn();
		mockNavigateToChefDetails = jest.fn();
		comments = [
			{
				chef_id: 9,
				comment: "Beware the barrenness of a busy life.",
				created_at: "2020-10-02T19:37:07.664Z",
				hidden: false,
				id: 326,
				image_url: "https://robohash.org/autquiaut.png?size=300x300&set=set1",
				recipe_id: 234,
				updated_at: "2020-10-02T19:37:07.664Z",
				username: "Xinth",
			},
			{
				chef_id: 11,
				comment: "It's not what happens to you, but how you react to it that matters.",
				created_at: "2020-10-02T19:35:59.321Z",
				hidden: false,
				id: 134,
				image_url: "https://robohash.org/utautnemo.png?size=300x300&set=set1",
				recipe_id: 234,
				updated_at: "2020-10-02T19:35:59.321Z",
				username: "I have a very long username for ui testing purposes",
			},
			{
				chef_id: 4,
				comment: "The unexamined life is not worth living.",
				created_at: "2020-10-02T19:35:22.328Z",
				hidden: false,
				id: 30,
				image_url: "https://robohash.org/estperferendiseum.png?size=300x300&set=set1",
				recipe_id: 234,
				updated_at: "2020-10-02T19:35:22.328Z",
				username: "Zunzil Ligature",
			},
		];
	});

	afterEach(() => {
		// console.log('runs after each test')
	});

	afterAll(() => {
		// console.log('runs after all tests have completed')
	});

	test("render with different comments", () => {
		comments.forEach((comment) => {
			act(() => {
				component = renderer.create(
					<RecipeComment
						key={"comment key"}
						{...comment}
						loggedInChefID={22}
						is_admin={false}
						askDeleteComment={mockAskDeleteComment}
						navigateToChefDetails={mockNavigateToChefDetails}
					/>
				);
			});
			const image = component.toJSON();
			expect(image).toMatchSnapshot();
			let root = component.root;
			const buttons = root.findAllByType(TouchableOpacity);
			expect(buttons.length).toEqual(2);
		});
	});

	test("render with different comments and an extra button if logged in as admin", () => {
		comments.forEach((comment) => {
			act(() => {
				component = renderer.create(
					<RecipeComment
						key={"comment key"}
						{...comment}
						loggedInChefID={22}
						is_admin={true}
						askDeleteComment={mockAskDeleteComment}
						navigateToChefDetails={mockNavigateToChefDetails}
					/>
				);
			});
			const image = component.toJSON();
			expect(image).toMatchSnapshot();
			let root = component.root;
			const buttons = root.findAllByType(TouchableOpacity);
			expect(buttons.length).toEqual(3);
		});
	});

	test("render with the first comment with no image_url", () => {
		let comment = comments[0];
		comment.imageUrl = "";
		act(() => {
			component = renderer.create(
				<RecipeComment
					key={"comment key"}
					{...comment}
					loggedInChefID={22}
					is_admin={false}
					askDeleteComment={mockAskDeleteComment}
					navigateToChefDetails={mockNavigateToChefDetails}
				/>
			);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		const buttons = root.findAllByType(TouchableOpacity);
		expect(buttons.length).toEqual(2);
	});

	test("render first comment and navigate to chef from both buttons", () => {
		let comment = comments[0];
		comment.image_url = "";
		act(() => {
			component = renderer.create(
				<RecipeComment
					key={"comment key"}
					{...comment}
					loggedInChefID={22}
					is_admin={false}
					askDeleteComment={mockAskDeleteComment}
					navigateToChefDetails={mockNavigateToChefDetails}
				/>
			);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		let imageButton = root.findByProps({ testID: "navigateToChefImageButton" });
		imageButton.props.onPress();
		let usernameButton = root.findByProps({ testID: "navigateToChefUsernameButton" });
		usernameButton.props.onPress();
		expect(mockNavigateToChefDetails).toHaveBeenCalled();
		expect(mockNavigateToChefDetails).toHaveBeenCalledTimes(2);
	});

	test("render first comment and the delete comment button calls to delete the comment", () => {
		let comment = comments[0];
		act(() => {
			component = renderer.create(
				<RecipeComment
					key={"comment key"}
					{...comment}
					loggedInChefID={22}
					is_admin={true}
					askDeleteComment={mockAskDeleteComment}
					navigateToChefDetails={mockNavigateToChefDetails}
				/>
			);
		});
		const image = component.toJSON();
		expect(image).toMatchSnapshot();
		let root = component.root;
		let imageButton = root.findByProps({ testID: "deleteCommentButton" });
		imageButton.props.onPress();
		expect(mockAskDeleteComment).toHaveBeenCalled();
		expect(mockAskDeleteComment).toHaveBeenCalledTimes(1);
	});
});
