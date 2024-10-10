import { destroyComment, destroyRecipeLike, postComment, postRecipeLike } from "../fetches";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { rootReducer, storeRecipeDetails, updateLoggedInChef, updateSingleRecipeList } from "../redux";

import NetInfo from "@react-native-community/netinfo";
import { Provider } from "react-redux";
import React from "react";
import RecipeDetails from "./recipeDetails";
import { chefDetails } from "../../__mocks__/data/chefDetails";
import { configureStore } from "@reduxjs/toolkit";
import { databaseURL } from "../constants/databaseURL";
import { recipeDetails } from "../../__mocks__/data/recipeDetails";
import { recipeList } from "../../__mocks__/data/recipeList";

// import { getChefDetails } from "../fetches";






// manual mocks
jest.mock("../auxFunctions/apiCall");
jest.mock("../fetches/getAvailableFilters");
jest.mock("../fetches/getRecipeList");
jest.mock("../fetches/getRecipeDetails");
// jest.mock("../fetches/getChefDetails");
jest.mock("../fetches/postRecipeLike");
jest.mock("../fetches/postReShare");
jest.mock("../fetches/postComment");
jest.mock("../fetches/destroyComment");
jest.mock("../fetches/postRecipeMake");
jest.mock("../fetches/destroyRecipeLike");
jest.mock("../fetches/destroyReShare");
jest.mock("../auxFunctions/saveRecipeListsLocally", () => {
	const originalModule = jest.requireActual("../auxFunctions/saveRecipeListsLocally");
	return {
		__esModule: true,
		...originalModule,
		saveRecipeListsLocally: jest.fn(),
	};
});

describe("Recipe Details", () => {
	let navigation, route, mockListener, mockListenerRemove, mockGetParent, mockIsFocused, mockNavigate, store;

	beforeAll(() => {
		// console.log('runs at the beginning of everything')
	});

	beforeEach(() => {
		// console.log('runs before every test')
		jest.useFakeTimers();
		fetch.resetMocks();

		store = configureStore({
			reducer: {
				root: rootReducer,
			},
		});

		store.dispatch(
			updateLoggedInChef({
				id: 22,
				e_mail: "test@email.com",
				username: "mockUsername",
				auth_token: "mockAuthToken",
				image_url: "",
				is_admin: false,
			})
		);
		store.dispatch(updateSingleRecipeList({ listKey: "list2", recipeList: recipeList }));
		store.dispatch(updateSingleRecipeList({ listKey: "list1", recipeList: recipeList }));
		store.dispatch(updateSingleRecipeList({ listKey: "listKey", recipeList: recipeList }));

		// allRecipeLists: state.root.allRecipeLists,
		// recipe_details: state.root.recipe_details,
		// filter_settings: state.root.filter_settings,

		mockListener = jest.fn();
		mockNavigate = jest.fn();
		mockListenerRemove = jest.fn();
		mockGetParent = () => ({
			getState: () => ({
				routes: [{ params: { title: "testRouteName" } }],
			}),
			setOptions: jest.fn(),
		});
		mockIsFocused = jest.fn().mockResolvedValue(true);

		navigation = {
			addListener: mockListener,
			removeListener: mockListenerRemove,
			navigate: mockNavigate,
			getParent: mockGetParent,
			isFocused: mockIsFocused,
			setOptions: jest.fn(),
		};

		route = {
			name: "All Recipes",
			params: {
				commenting: false,
			},
		};

		NetInfo.setReturnValue(true);
	});

	afterEach(() => {
		// console.log('runs after each test')
	});

	afterAll(() => {
		// console.log('runs after all tests have completed')
	});

	describe("rendering with different recipes", () => {
		test("can be rendered using typical props and matches its previous image - on a bunch of different recipes", async () => {
			await Promise.all(
				recipeDetails.map(async (rd) => {
					store.dispatch(storeRecipeDetails(rd));
					const { toJSON } = await waitFor(async () =>
						render(
							<Provider store={store}>
								<RecipeDetails navigation={navigation} route={route} />
							</Provider>
						)
					);
					expect(toJSON()).toMatchSnapshot();
				})
			);
		});
	});

	describe("on page interactions", () => {
		test("recipe can be liked via the heart icon", async () => {
			postRecipeLike.mockResolvedValue(true);
			store.dispatch(storeRecipeDetails(recipeDetails[0]));
			const { getByTestId, getByText } = await waitFor(
				async () =>
					await render(
						<Provider store={store}>
							<RecipeDetails navigation={navigation} route={route} />
						</Provider>
					)
			);
			const button = getByTestId("likeButton");
			expect(getByText("Likes", { exact: false }).props.children[1]).toEqual(0);
			await waitFor(() => fireEvent.press(button));
			expect(postRecipeLike).toHaveBeenCalledWith(113, 22, "mockAuthToken");
			expect(getByText("Likes", { exact: false }).props.children[1]).toEqual(1);
		});

		test("recipe can be un-liked via the heard icon", async () => {
			postRecipeLike.mockResolvedValue(true);
			destroyRecipeLike.mockResolvedValue(true);
			store.dispatch(storeRecipeDetails(recipeDetails[0]));
			const { getByLabelText, getByText } = await waitFor(
				async () =>
					await render(
						<Provider store={store}>
							<RecipeDetails navigation={navigation} route={route} />
						</Provider>
					)
			);
			const likeButton = getByLabelText("like recipe");
			expect(getByText("Likes", { exact: false }).props.children[1]).toEqual(0);
			await waitFor(() => fireEvent.press(likeButton));
			expect(postRecipeLike).toHaveBeenCalledWith(113, 22, "mockAuthToken");
			expect(getByText("Likes", { exact: false }).props.children[1]).toEqual(1);
			const unlikeButton = getByLabelText("unlike recipe");
			await waitFor(() => fireEvent.press(unlikeButton));
			expect(destroyRecipeLike).toHaveBeenCalledWith(113, 22, "mockAuthToken");
			expect(getByText("Likes", { exact: false }).props.children[1]).toEqual(0);
		});

		// test.only("can add an image", async () => {
		// 	const { toJSON, getByTestId, queryAllByLabelText, getByText, getByLabelText } = await waitFor(
		// 		async () =>
		// 			await render(
		// 				<Provider store={store}>
		// 					<RecipeDetails navigation={navigation} route={route} />
		// 				</Provider>
		// 			)
		// 	);
		// 	const button = getByLabelText("add your own image");
		// 	// console.log(button.props)
		// 	await waitFor(() => fireEvent.press(button));
		// 	// await waitFor(() => expect(getByText("Take photo")).toBeTruthy());
		// 	expect(getByText("Take photo")).toBeTruthy();
		// });

		// test.skip("can delete your image", async () => {});

		test("can add a comment", async () => {
			postComment.mockResolvedValue([
				{
					chef_id: 11,
					comment: "i like this recipe",
					created_at: "2020-10-02T19:36:17.825Z",
					hidden: false,
					id: 186,
					image_url: "https://robohash.org/autquiaut.png?size=300x300&set=set1",
					recipe_id: 113,
					updated_at: "2020-10-02T19:36:17.825Z",
					username: "Xinth",
				},
			]);
			store.dispatch(storeRecipeDetails(recipeDetails[0]));
			const { getByLabelText, getByText, getByPlaceholderText } = await waitFor(
				async () =>
					await render(
						<Provider store={store}>
							<RecipeDetails navigation={navigation} route={route} />
						</Provider>
					)
			);
			const button = getByLabelText("new comment");
			await waitFor(() => fireEvent.press(button));
			fireEvent.changeText(getByPlaceholderText("Type comment here..."), "i like this recipe");
			await waitFor(() => fireEvent.press(getByLabelText("save comment")));
			expect(postComment).toHaveBeenCalledWith(113, 22, "mockAuthToken", "i like this recipe");
			expect(getByText("i like this recipe")).toBeTruthy();
		});

		test("can delete your comment", async () => {
			destroyComment.mockResolvedValue(true);
			postComment.mockResolvedValue([
				{
					chef_id: 22,
					comment: "i like this recipe",
					created_at: "2020-10-02T19:36:17.825Z",
					hidden: false,
					id: 186,
					image_url: "https://robohash.org/autquiaut.png?size=300x300&set=set1",
					recipe_id: 113,
					updated_at: "2020-10-02T19:36:17.825Z",
					username: "Xinth",
				},
			]);
			store.dispatch(storeRecipeDetails(recipeDetails[0]));
			const { queryAllByText, getByLabelText, getByText, getByPlaceholderText } = await waitFor(
				async () =>
					await render(
						<Provider store={store}>
							<RecipeDetails navigation={navigation} route={route} />
						</Provider>
					)
			);
			const button = getByLabelText("new comment");
			await waitFor(() => fireEvent.press(button));
			fireEvent.changeText(getByPlaceholderText("Type comment here..."), "i like this recipe");
			await waitFor(() => fireEvent.press(getByLabelText("save comment")));
			expect(postComment).toHaveBeenCalledWith(113, 22, "mockAuthToken", "i like this recipe");
			expect(getByText("i like this recipe")).toBeTruthy();
			await waitFor(() => fireEvent.press(getByLabelText("delete comment")));
			expect(getByText("Are you sure you want to delete this comment?")).toBeTruthy();
			await waitFor(() => fireEvent.press(getByText("Yes")));
			expect(destroyComment).toHaveBeenCalledWith("mockAuthToken", 186);
			expect(queryAllByText("i like this recipe").length).toEqual(0);
		});

		test.only("can navigate to Chef", async () => {
			fetch.mockResolvedValue({ json: () => chefDetails[0] });
			store.dispatch(storeRecipeDetails(recipeDetails[0]));
			const { getByText } = await waitFor(
				async () =>
					await render(
						<Provider store={store}>
							<RecipeDetails navigation={navigation} route={route} />
						</Provider>
					)
			);
			const button = getByText("by Pothers");
			await waitFor(() => fireEvent.press(button));
			expect(fetch).toHaveBeenCalledWith(`${databaseURL}/chefs/1`, {
				headers: { Authorization: "Bearer mockAuthToken", "Content-Type": "application/json" },
				method: "GET",
			});
			await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("ChefDetails", { chefID: 1 }));
		});
	});
});
