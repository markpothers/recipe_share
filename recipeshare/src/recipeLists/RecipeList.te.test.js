import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import {
	changeTextAndWait,
	commentOnRecipeAndWait,
	expectApiCall,
	expectApiCallCount,
	expectChefNavigation,
	expectCountChange,
	expectElementCount,
	expectElementExists,
	expectElementProp,
	expectLogoutNavigation,
	expectNavigation,
	expectNoNavigation,
	expectRecipeNavigation,
	expectStorageCall,
	expectStorageSet,
	likeRecipeAndWait,
	openFiltersAndWait,
	openPickerAndSelect,
	pressAndExpectClosing,
	pressAndExpectNavigation,
	pressAndExpectOfflineMessage,
	pressAndWait,
	pressAndWaitForResults,
	runTimersAndWait,
	searchAndWaitForResults,
	selectFilterAndWait,
	shareRecipeAndWait,
	triggerEventAndWait,
	waitForLoadingToComplete,
} from "../auxTestFunctions/testUtils";
import {
	destroyReShare,
	destroyRecipeLike,
	getAvailableFilters,
	getChefDetails,
	getRecipeDetails,
	getRecipeList,
	postReShare,
	postRecipeLike,
} from "../fetches";
import { loadLocalRecipeLists, saveRecipeListsLocally } from "../auxFunctions/saveRecipeListsLocally";
import { rootReducer, updateLoggedInChef } from "../redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Provider } from "react-redux";
import React from "react";
import RecipesList from "./RecipesList";
import { chefDetails } from "../../__mocks__/data/chefDetails";
import { clearedFilters } from "../../__mocks__/data/clearedFilters";
import { configureStore } from "@reduxjs/toolkit";
import { cuisines } from "../constants/cuisines";
import { filters } from "../../__mocks__/data/filters";
import { recipeDetails } from "../../__mocks__/data/recipeDetails";
import { recipeList } from "../../__mocks__/data/recipeList";
import { serves } from "../constants/serves";

// manual mocks
jest.mock("../auxFunctions/apiCall");
jest.mock("../fetches/getAvailableFilters");
jest.mock("../fetches/getRecipeList");
jest.mock("../fetches/getRecipeDetails");
jest.mock("../fetches/getChefDetails");
jest.mock("../fetches/postRecipeLike");
jest.mock("../fetches/postReShare");
jest.mock("../fetches/postRecipeMake");
jest.mock("../fetches/destroyRecipeLike");
jest.mock("../fetches/destroyReShare");
jest.mock("../auxFunctions/saveRecipeListsLocally", () => {
	const originalModule = jest.requireActual("../auxFunctions/saveRecipeListsLocally");
	return {
		__esModule: true,
		...originalModule,
		saveRecipeListsLocally: jest.fn(),
		loadLocalRecipeLists: jest.fn(),
	};
});

describe("Recipe List", () => {
	let navigation, route, mockListener, mockListenerRemove, mockGetParent, mockIsFocused, mockNavigate, store;

	beforeEach(async () => {
		jest.useFakeTimers();

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
		};

		route = {
			name: "All Recipes",
		};

		NetInfo.setReturnValue(true);
	});

	afterEach(async () => {
		AsyncStorage.setItem.mockClear(); //forget calls to this method between tests
		AsyncStorage.getItem.mockClear();
		AsyncStorage.clear(); //clear out the contents of AsyncStorage between tests
		getRecipeList.mockClear();
		loadLocalRecipeLists.mockClear();
		loadLocalRecipeLists.mockResolvedValue([]); // Default to empty
	});

	describe("loading and rendering with different fetch and async responses", () => {
		test("renders with no recipes", async () => {
			getRecipeList.mockImplementation(() =>
				Promise.resolve({
					recipes: [],
					cuisines,
					serves,
					filterOptions: clearedFilters,
				})
			);
			const { getByTestId, queryAllByTestId } = await waitFor(async () =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);

			await waitForLoadingToComplete(queryAllByTestId);

			expectElementExists(getByTestId("filterButton"));
			expectElementCount(queryAllByTestId("recipeCard"), 0);
			expectApiCallCount(mockListener, 1);
			expect(mockListener).toHaveBeenNthCalledWith(1, "focus", expect.any(Function));
		});

		test("renders with lots of recipes", async () => {
			getRecipeList.mockImplementation(() =>
				Promise.resolve({
					recipes: recipeList,
					cuisines,
					serves,
					filterOptions: clearedFilters,
				})
			);
			const { queryAllByTestId, getByPlaceholderText } = await waitFor(async () =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);
			await waitForLoadingToComplete(queryAllByTestId);
			expectApiCallCount(getRecipeList, 1);
			expectElementExists(getByPlaceholderText("Search for Recipes"));
			expectElementCount(queryAllByTestId("recipeCard"), recipeList.length);
		});

		test("renders, fails to fetch logs out", async () => {
			getRecipeList.mockImplementation(() =>
				Promise.reject({
					name: "Logout",
				})
			);
			const { queryAllByTestId } = await waitFor(async () =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);
			await waitForLoadingToComplete(queryAllByTestId);

			expectLogoutNavigation(mockNavigate);
		});

		test("renders, fetch times out, loads locally", async () => {
			getRecipeList.mockImplementation(() =>
				Promise.reject({
					name: "Timeout",
				})
			);
			loadLocalRecipeLists.mockResolvedValue(recipeList);
			const { queryAllByTestId } = await waitFor(() =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);
			await waitForLoadingToComplete(queryAllByTestId);

			expectElementCount(queryAllByTestId("recipeCard"), recipeList.length);
		});

		test("renders, fetch fails for unspecified reason, loads locally", async () => {
			getRecipeList.mockImplementation(() => Promise.reject({}));
			loadLocalRecipeLists.mockResolvedValue(recipeList);
			const { queryAllByTestId } = await waitFor(() =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);
			await waitForLoadingToComplete(queryAllByTestId);

			expectElementCount(queryAllByTestId("recipeCard"), recipeList.length);
		});
	});

	describe("interacting with recipe cards", () => {
		let getByTestId,
			queryAllByTestId,
			getByPlaceholderText,
			queryAllByPlaceholderText,
			queryAllByLabelText,
			getByText,
			queryAllByText,
			// getAllByRole,
			// findByText,
			// findByTestId,
			// getByDisplayValue,
			getByLabelText,
			toJSON;

		beforeEach(async () => {
			getRecipeList.mockImplementation(() =>
				Promise.resolve({
					recipes: recipeList,
					cuisines,
					serves,
					filterOptions: clearedFilters,
				})
			);
			const rendered = await waitFor(async () =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);

			getByTestId = rendered.getByTestId;
			queryAllByTestId = rendered.queryAllByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			queryAllByPlaceholderText = rendered.queryAllByPlaceholderText;
			queryAllByLabelText = rendered.queryAllByLabelText;
			getByText = rendered.getByText;
			queryAllByText = rendered.queryAllByText;
			toJSON = rendered.toJSON;
			getByLabelText = rendered.getByLabelText;

			await waitForLoadingToComplete(queryAllByTestId);
		});

		test("should be able to navigate to recipe details page from title", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));

			await pressAndExpectNavigation(getByText("Mini Baguettes"), mockNavigate, "RecipeDetails", {
				recipeID: 111,
				commenting: false,
			});

			expectStorageCall(AsyncStorage.getItem, "localRecipeDetails", false);
			expectStorageSet(AsyncStorage.setItem, "localRecipeDetails", [testRecipeDetails]);
		});

		test("should be able to navigate to recipe details page from image", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));

			await pressAndExpectNavigation(queryAllByLabelText("picture of recipe")[2], mockNavigate, "RecipeDetails", {
				recipeID: 111,
				commenting: false,
			});

			expectStorageCall(AsyncStorage.getItem, "localRecipeDetails", false);
			expectStorageSet(AsyncStorage.setItem, "localRecipeDetails", [testRecipeDetails]);
		});

		test("should be able to navigate to recipe details page from title using locally saved recipe if fetch fails", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(null, JSON.stringify([testRecipeDetails]));
			});

			await pressAndExpectNavigation(getByText("Mini Baguettes"), mockNavigate, "RecipeDetails", {
				recipeID: 111,
				commenting: false,
			});

			expectStorageCall(AsyncStorage.getItem, "localRecipeDetails", true);
		});

		test("should fail to navigate to recipe details if fetch fails and not saved locally", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(null, JSON.stringify([]));
			});

			await pressAndExpectOfflineMessage(getByText("Mini Baguettes"), getByTestId);
			expectNoNavigation(mockNavigate);
		});
		test("should be able to navigate to chef details page from chef name", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 110);
			const testChefDetails = chefDetails.find((d) => d.id === 1);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			getChefDetails.mockImplementation(() => Promise.resolve(testChefDetails));

			await pressAndExpectNavigation(queryAllByText("Pothers")[1], mockNavigate, "ChefDetails", { chefID: 1 });
		});

		test("should be able to navigate to chef details page from chef image", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 110);
			const testChefDetails = chefDetails.find((d) => d.id === 1);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			getChefDetails.mockImplementation(() => Promise.resolve(testChefDetails));

			await pressAndExpectNavigation(queryAllByLabelText("picture of chef")[1], mockNavigate, "ChefDetails", {
				chefID: 1,
			});
		});

		test("should be able to navigate to chef details when loaded locally if api fails", async () => {
			const testChefDetails = chefDetails.find((d) => d.id === 1);
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			getChefDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(undefined, JSON.stringify([testChefDetails]));
			});

			await pressAndExpectNavigation(queryAllByText("Pothers")[1], mockNavigate, "ChefDetails", { chefID: 1 });
		});

		test("should show offline message and not navigate to chef details if api fails and not stored locally", async () => {
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			getChefDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(undefined, JSON.stringify([]));
			});

			await pressAndExpectOfflineMessage(queryAllByText("Pothers")[1], getByTestId);
			expectNoNavigation(mockNavigate);
		});

		test("should show offline message and not navigate to chef details if api fails and no recipes are stored locally", async () => {
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			getChefDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => callback());

			await pressAndExpectOfflineMessage(queryAllByText("Pothers")[1], getByTestId);
			expectNoNavigation(mockNavigate);
		});

		describe("resharing", () => {
			test("should be able to reshare recipe", async () => {
				postReShare.mockResolvedValue(true);
				expectCountChange(queryAllByLabelText("shares count")[0], 0);

				await shareRecipeAndWait(queryAllByLabelText("share recipe with followers")[0], () =>
					expectCountChange(queryAllByLabelText("shares count")[0], 1)
				);

				expectApiCall(postReShare, 113, 22, "mockAuthToken");
			});

			test("api fail when sharing recipe should show offline message", async () => {
				postReShare.mockImplementation(() => Promise.reject({}));
				expectCountChange(queryAllByLabelText("shares count")[0], 0);

				await pressAndExpectOfflineMessage(queryAllByLabelText("share recipe with followers")[0], getByTestId);

				expectApiCall(postReShare, 113, 22, "mockAuthToken");
				expectCountChange(queryAllByLabelText("shares count")[0], 0);
			});

			test("should be able to un-reshare recipe", async () => {
				destroyReShare.mockResolvedValue(true);
				expectCountChange(queryAllByLabelText("shares count")[1], 1);

				await shareRecipeAndWait(queryAllByLabelText("remove share")[0], () =>
					expectCountChange(queryAllByLabelText("shares count")[1], 0)
				);

				expectApiCall(destroyReShare, 112, 22, "mockAuthToken");
			});

			test("api fail when un-sharing recipe should show offline message", async () => {
				destroyReShare.mockImplementation(() => Promise.reject({}));
				expectCountChange(queryAllByLabelText("shares count")[1], 1);

				await pressAndExpectOfflineMessage(queryAllByLabelText("remove share")[0], getByTestId);

				expectApiCall(destroyReShare, 112, 22, "mockAuthToken");
				expectCountChange(queryAllByLabelText("shares count")[1], 1);
			});
		});

		describe("liking", () => {
			test("should be able to like recipe", async () => {
				postRecipeLike.mockResolvedValue(true);
				expectCountChange(queryAllByLabelText("likes count")[0], 0);

				await likeRecipeAndWait(queryAllByLabelText("like recipe")[0], () =>
					expectCountChange(queryAllByLabelText("likes count")[0], 1)
				);

				expectApiCall(postRecipeLike, 113, 22, "mockAuthToken");
			});

			test("api fail when liking recipe should show offline message", async () => {
				postRecipeLike.mockImplementation(() => Promise.reject({}));
				expectCountChange(queryAllByLabelText("likes count")[0], 0);

				await pressAndExpectOfflineMessage(queryAllByLabelText("like recipe")[0], getByTestId);

				expectApiCall(postRecipeLike, 113, 22, "mockAuthToken");
				expectCountChange(queryAllByLabelText("likes count")[0], 0);
			});

			test("should be able to un-like recipe", async () => {
				destroyRecipeLike.mockResolvedValue(true);
				expectCountChange(queryAllByLabelText("likes count")[1], 1);

				await likeRecipeAndWait(queryAllByLabelText("unlike recipe")[0], () =>
					expectCountChange(queryAllByLabelText("likes count")[1], 0)
				);

				expectApiCall(destroyRecipeLike, 112, 22, "mockAuthToken");
			});

			test("api fail when un-liking recipe should show offline message", async () => {
				destroyRecipeLike.mockImplementation(() => Promise.reject({}));
				expectCountChange(queryAllByLabelText("likes count")[1], 1);

				await pressAndExpectOfflineMessage(queryAllByLabelText("unlike recipe")[0], getByTestId);

				expectApiCall(destroyRecipeLike, 112, 22, "mockAuthToken");
				expectCountChange(queryAllByLabelText("likes count")[1], 1);
			});
		});
		describe("commenting", () => {
			test("commenting should navigate to recipe with commenting == true", async () => {
				const testRecipeDetails = recipeDetails.find((d) => d.id === 113);
				getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
				AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));

				await commentOnRecipeAndWait(queryAllByLabelText("comment on recipe")[0], () => {
					expectStorageCall(AsyncStorage.getItem, "localRecipeDetails", false);
					expectStorageSet(AsyncStorage.setItem, "localRecipeDetails", [testRecipeDetails]);
					expectRecipeNavigation(mockNavigate, 113, true);
				});
			});
		});
	});

	describe("setting filters", () => {
		let getByTestId,
			queryAllByTestId,
			getByPlaceholderText,
			queryAllByPlaceholderText,
			queryAllByLabelText,
			getByText,
			queryAllByText,
			// getAllByRole,
			// findByText,
			// findByTestId,
			// getByDisplayValue,
			getByLabelText,
			toJSON;

		beforeEach(async () => {
			getRecipeList.mockImplementation(() =>
				Promise.resolve({
					recipes: recipeList,
					cuisines,
					serves,
					filters,
				})
			);
			const rendered = await waitFor(async () =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);

			getByTestId = rendered.getByTestId;
			queryAllByTestId = rendered.queryAllByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			queryAllByPlaceholderText = rendered.queryAllByPlaceholderText;
			queryAllByLabelText = rendered.queryAllByLabelText;
			getByText = rendered.getByText;
			queryAllByText = rendered.queryAllByText;
			toJSON = rendered.toJSON;
			getByLabelText = rendered.getByLabelText;

			await waitForLoadingToComplete(queryAllByTestId);
		});

		afterEach(() => {
			getAvailableFilters.mockReset();
		});
		test("should be able to set some filters", async () => {
			getAvailableFilters.mockImplementation(() =>
				Promise.resolve({
					cuisines: cuisines,
					serves: serves,
					filters: filters.filter((f) => f !== "dessert"),
				})
			);
			await openFiltersAndWait(
				getByLabelText("display filter options"),
				getByText,
				"Apply filters to recipes list"
			);
			expect(getByTestId("Side-switch").props.value).toBeFalsy();
			expect(getByTestId("Dessert-switch").props.disabled).toBeFalsy();

			await act(async () => {
				fireEvent.press(getByText("Side"));
			});

			await waitFor(() => {
				expect(getByTestId("Side-switch").props.value).toBeTruthy();
				expect(getByTestId("Dessert-switch").props.disabled).toBeTruthy();
			});

			await waitFor(() => {
				expect(getAvailableFilters).toHaveBeenCalled();
			});

			await pressAndExpectClosing(getByText("Apply & Close"), queryAllByText, "Apply filters to recipes list");
		});
		test("should be able to set Cuisine", async () => {
			getAvailableFilters.mockImplementation(() =>
				Promise.resolve({
					cuisines: cuisines,
					serves: serves,
					filters: filters.filter((f) => f !== "dessert"),
				})
			);
			await openFiltersAndWait(
				getByLabelText("display filter options"),
				getByText,
				"Apply filters to recipes list"
			);
			expect(getByTestId("Dessert-switch").props.disabled).toBeFalsy();

			await openPickerAndSelect(getByLabelText("cuisines picker"), getByTestId, "iosPicker", "American");

			await waitFor(() => {
				expect(getAvailableFilters).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(queryAllByText("Apply filters to recipes list").length).toEqual(1);
			});
		});
		test("should be able to set Serves", async () => {
			getAvailableFilters.mockImplementation(() =>
				Promise.resolve({
					cuisines: cuisines,
					serves: serves,
					filters: filters.filter((f) => f !== "dessert"),
				})
			);
			await openFiltersAndWait(
				getByLabelText("display filter options"),
				getByText,
				"Apply filters to recipes list"
			);
			expect(getByTestId("Dessert-switch").props.disabled).toBeFalsy();

			await openPickerAndSelect(getByLabelText("serves picker"), getByTestId, "iosPicker", "6");

			await waitFor(() => {
				expect(getAvailableFilters).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(queryAllByText("Apply filters to recipes list").length).toEqual(1);
			});
		});
	});

	describe("interacting with the list", () => {
		// 	test.skip("scrolling to the bottom should load more recipes", async () => {});
		// 	test.skip("pull to refresh should reload the list", async () => {});
		test("typing in the search box should reload the list", async () => {
			//arrange
			const chiRecipes = recipeList.filter((r) => r.name.toLowerCase().includes("chi"));
			getRecipeList
				.mockImplementationOnce(() =>
					Promise.resolve({
						recipes: recipeList,
						cuisines,
						serves,
						filterOptions: clearedFilters,
					})
				)
				.mockImplementationOnce(() =>
					Promise.resolve({
						recipes: chiRecipes,
						cuisines,
						serves,
						filterOptions: clearedFilters,
					})
				);
			const { queryAllByTestId, getByPlaceholderText } = await waitFor(async () =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);
			await waitForLoadingToComplete(queryAllByTestId);

			// act
			await searchAndWaitForResults(
				getByPlaceholderText("Search for Recipes"),
				"chi",
				queryAllByTestId,
				chiRecipes.length
			);

			// assert
			expect(getRecipeList).toHaveBeenCalledTimes(2);
		});
		test("clearing the search box should reload the list", async () => {
			//arrange
			const chiRecipes = recipeList.filter((r) => r.name.toLowerCase().includes("chi"));
			getRecipeList
				.mockResolvedValueOnce({
					recipes: recipeList,
					cuisines,
					serves,
					filterOptions: clearedFilters,
				})
				.mockResolvedValueOnce({
					recipes: chiRecipes,
					cuisines,
					serves,
					filterOptions: clearedFilters,
				})
				.mockResolvedValueOnce({
					recipes: recipeList,
					cuisines,
					serves,
					filterOptions: clearedFilters,
				});
			const { queryAllByTestId, getByPlaceholderText, queryAllByLabelText } = await waitFor(async () =>
				render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				)
			);
			await waitForLoadingToComplete(queryAllByTestId);
			expect(getByPlaceholderText("Search for Recipes")).toBeTruthy();

			// First, type "chi" to filter the results
			await searchAndWaitForResults(
				getByPlaceholderText("Search for Recipes"),
				"chi",
				queryAllByTestId,
				chiRecipes.length
			);

			expect(getRecipeList).toHaveBeenCalledTimes(2);

			// act - now clear the search
			await pressAndWaitForResults(
				queryAllByLabelText("clear search text")[0],
				queryAllByTestId,
				"recipeCard",
				recipeList.length
			);

			// assert - should reload with all recipes
			expect(getRecipeList).toHaveBeenCalledTimes(3);
		});
	});
});
