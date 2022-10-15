import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { recipeList } from "../../__mocks__/data/recipeList";
import { recipeDetails } from "../../__mocks__/data/recipeDetails";
import { chefDetails } from "../../__mocks__/data/chefDetails";
import RecipesList from "./RecipesList";
import { getAvailableFilters } from "../fetches/getAvailableFilters";
import { getRecipeList } from "../fetches/getRecipeList";
import { postRecipeLike } from "../fetches/postRecipeLike";
import { postReShare } from "../fetches/postReShare";
import { destroyRecipeLike } from "../fetches/destroyRecipeLike";
import { destroyReShare } from "../fetches/destroyReShare";
import { getRecipeDetails } from "../fetches/getRecipeDetails";
import { getChefDetails } from "../fetches/getChefDetails";
import { cuisines } from "../dataComponents/cuisines";
import { serves } from "../dataComponents/serves";
import NetInfo from "@react-native-community/netinfo";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, updateLoggedInChef } from "../redux";
import { clearedFilters } from "../../__mocks__/data/clearedFilters";
import { saveRecipeListsLocally, loadLocalRecipeLists } from "../auxFunctions/saveRecipeListsLocally";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { filters } from "../../__mocks__/data/filters";
import { act } from "react-dom/test-utils";

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
	};
});

describe("Recipe List", () => {
	let navigation, route, mockListener, mockListenerRemove, mockNavigate, store;

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

		navigation = {
			addListener: mockListener,
			removeListener: mockListenerRemove,
			navigate: mockNavigate,
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
			const { toJSON, getByTestId, queryAllByTestId } = render(
				<Provider store={store}>
					<RecipesList navigation={navigation} route={route} listChoice={"all"} />
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));

			expect(getByTestId("filterButton")).toBeTruthy();
			expect(queryAllByTestId("recipeCard").length).toEqual(0);
			expect(mockListener).toHaveBeenCalledTimes(1);
			expect(mockListener).toHaveBeenNthCalledWith(1, "focus", expect.any(Function));
			// expect(mockListener).toHaveBeenNthCalledWith(2, "blur", expect.any(Function))
			expect(toJSON()).toMatchSnapshot();
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
			const { toJSON, queryAllByTestId, getByPlaceholderText } = render(
				<Provider store={store}>
					<RecipesList navigation={navigation} route={route} listChoice={"all"} />
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
			expect(getByPlaceholderText("Search for Recipes")).toBeTruthy();
			expect(queryAllByTestId("recipeCard").length).toEqual(recipeList.length);
			expect(toJSON()).toMatchSnapshot();
		});

		test("renders, fails to fetch logs out", async () => {
			getRecipeList.mockImplementation(() =>
				Promise.reject({
					name: "Logout",
				})
			);
			const { queryAllByTestId } = render(
				<Provider store={store}>
					<RecipesList navigation={navigation} route={route} listChoice={"all"} />
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));

			expect(mockNavigate).toHaveBeenCalledWith("ProfileCover", {
				screen: "Profile",
				params: { logout: true },
			});
		});

		test("renders, fetch times out, loads locally", async () => {
			getRecipeList.mockImplementation(() =>
				Promise.reject({
					name: "Timeout",
				})
			);
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(
					undefined,
					JSON.stringify({
						22: {
							all: { recipeList },
						},
					})
				);
			});
			const { queryAllByTestId } = render(
				<Provider store={store}>
					<RecipesList navigation={navigation} route={route} listChoice={"all"} />
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));

			expect(queryAllByTestId("recipeCard").length).toEqual(recipeList.length);
		});

		test("renders, fetch fails for unspecified reason, loads locally", async () => {
			getRecipeList.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(
					undefined,
					JSON.stringify({
						22: {
							all: { recipeList },
						},
					})
				);
			});
			const { queryAllByTestId } = render(
				<Provider store={store}>
					<RecipesList navigation={navigation} route={route} listChoice={"all"} />
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));

			expect(queryAllByTestId("recipeCard").length).toEqual(recipeList.length);
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
			const rendered = render(
				<Provider store={store}>
					<RecipesList navigation={navigation} route={route} listChoice={"all"} />
				</Provider>
			);

			getByTestId = rendered.getByTestId;
			queryAllByTestId = rendered.queryAllByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			queryAllByPlaceholderText = rendered.queryAllByPlaceholderText;
			queryAllByLabelText = rendered.queryAllByLabelText;
			getByText = rendered.getByText;
			queryAllByText = rendered.queryAllByText;
			toJSON = rendered.toJSON;
			// getAllByRole = rendered.getAllByRole;
			// findByText = rendered.findByText;
			// findByTestId = rendered.findByTestId;
			// getByDisplayValue = rendered.getByDisplayValue;
			getByLabelText = rendered.getByLabelText;

			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
		});

		test("should be able to navigate to recipe details page from title", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback([]);
			});
			await waitFor(() => fireEvent.press(getByText("Mini Baguettes")));
			expect(AsyncStorage.getItem).toHaveBeenCalledWith("localRecipeDetails", expect.any(Function));
			expect(AsyncStorage.setItem).toHaveBeenCalledWith(
				"localRecipeDetails",
				JSON.stringify([testRecipeDetails])
			);
			expect(mockNavigate).toHaveBeenCalledWith("RecipeDetails", {
				recipeID: 111,
				commenting: false,
			});
		});
		test("should be able to navigate to recipe details page from image", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback([]);
			});
			await waitFor(() => fireEvent.press(queryAllByLabelText("picture of recipe")[2]));
			expect(AsyncStorage.getItem).toHaveBeenCalledWith("localRecipeDetails", expect.any(Function));
			expect(AsyncStorage.setItem).toHaveBeenCalledWith(
				"localRecipeDetails",
				JSON.stringify([testRecipeDetails])
			);
			expect(mockNavigate).toHaveBeenCalledWith("RecipeDetails", {
				recipeID: 111,
				commenting: false,
			});
		});
		test("should be able to navigate to recipe details page from title using locally saved recipe if fetch fails", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(undefined, JSON.stringify([testRecipeDetails]));
			});
			await waitFor(() => fireEvent.press(getByText("Mini Baguettes")));
			expect(AsyncStorage.getItem).toHaveBeenCalledWith("localRecipeDetails", expect.any(Function));
			expect(mockNavigate).toHaveBeenCalledWith("RecipeDetails", {
				recipeID: 111,
				commenting: false,
			});
		});

		test("should fail to navigate to recipe details if fetch fails and not saved locally", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 111);
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(undefined, JSON.stringify([]));
			});
			await waitFor(() => fireEvent.press(getByText("Mini Baguettes")));
			expect(getByTestId("offlineMessage")).toBeTruthy();
			expect(mockNavigate).not.toHaveBeenCalledWith();
		});
		test("should be able to navigate to chef details page from chef name", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 110);
			const testChefDetails = chefDetails.find((d) => d.id === 1);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			getChefDetails.mockImplementation(() => Promise.resolve(testChefDetails));
			await waitFor(() => fireEvent.press(queryAllByText("Pothers")[1]));
			expect(mockNavigate).toHaveBeenCalledWith("ChefDetails", { chefID: 1 });
		});
		test("should be able to navigate to chef details page from chef image", async () => {
			const testRecipeDetails = recipeDetails.find((d) => d.id === 110);
			const testChefDetails = chefDetails.find((d) => d.id === 1);
			getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
			getChefDetails.mockImplementation(() => Promise.resolve(testChefDetails));
			await waitFor(() => fireEvent.press(queryAllByLabelText("picture of chef")[1]));
			expect(mockNavigate).toHaveBeenCalledWith("ChefDetails", { chefID: 1 });
		});
		test("should be able to navigate to chef details when loaded locally if api fails", async () => {
			const testChefDetails = chefDetails.find((d) => d.id === 1);
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			getChefDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(undefined, JSON.stringify([testChefDetails]));
			});
			await waitFor(() => fireEvent.press(queryAllByText("Pothers")[1]));
			expect(mockNavigate).toHaveBeenCalledWith("ChefDetails", { chefID: 1 });
		});
		test("should show offline message and not navigate to chef details if api fails and not stored locally", async () => {
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			getChefDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(undefined, JSON.stringify([]));
			});
			await waitFor(() => fireEvent.press(queryAllByText("Pothers")[1]));
			expect(getByTestId("offlineMessage")).toBeTruthy();
			expect(mockNavigate).not.toHaveBeenCalledWith();
		});
		test("should show offline message and not navigate to chef details if api fails and no recipes are stored locally", async () => {
			getRecipeDetails.mockImplementation(() => Promise.reject({}));
			getChefDetails.mockImplementation(() => Promise.reject({}));
			AsyncStorage.getItem.mockImplementation((key, callback) => callback());
			await waitFor(() => fireEvent.press(queryAllByText("Pothers")[1]));
			expect(getByTestId("offlineMessage")).toBeTruthy();
			expect(mockNavigate).not.toHaveBeenCalledWith();
		});

		describe("resharing", () => {
			test("should be able to reshare recipe", async () => {
				postReShare.mockResolvedValue(true);
				expect(queryAllByLabelText("shares count")[0].props.children).toEqual(0);
				await waitFor(() => fireEvent.press(queryAllByLabelText("share recipe with followers")[0]));
				expect(postReShare).toHaveBeenCalledWith(113, 22, "mockAuthToken");
				expect(queryAllByLabelText("shares count")[0].props.children).toEqual(1);
			});
			test("api fail when sharing recipe should show offline message", async () => {
				postReShare.mockImplementation(() => Promise.reject({}));
				expect(queryAllByLabelText("shares count")[0].props.children).toEqual(0);
				await waitFor(() => fireEvent.press(queryAllByLabelText("share recipe with followers")[0]));
				expect(postReShare).toHaveBeenCalledWith(113, 22, "mockAuthToken");
				expect(queryAllByLabelText("shares count")[0].props.children).toEqual(0);
				expect(getByTestId("offlineMessage")).toBeTruthy();
			});
			test("should be able to un-reshare recipe", async () => {
				destroyReShare.mockResolvedValue(true);
				expect(queryAllByLabelText("shares count")[1].props.children).toEqual(1);
				await waitFor(() => fireEvent.press(queryAllByLabelText("remove share")[0]));
				expect(destroyReShare).toHaveBeenCalledWith(112, 22, "mockAuthToken");
				expect(queryAllByLabelText("shares count")[1].props.children).toEqual(0);
			});
			test("api fail when un-sharing recipe should show offline message", async () => {
				destroyReShare.mockImplementation(() => Promise.reject({}));
				expect(queryAllByLabelText("shares count")[1].props.children).toEqual(1);
				await waitFor(() => fireEvent.press(queryAllByLabelText("remove share")[0]));
				expect(destroyReShare).toHaveBeenCalledWith(112, 22, "mockAuthToken");
				expect(queryAllByLabelText("shares count")[1].props.children).toEqual(1);
				expect(getByTestId("offlineMessage")).toBeTruthy();
			});
		});

		describe("liking", () => {
			test("should be able to like recipe", async () => {
				postRecipeLike.mockResolvedValue(true);
				expect(queryAllByLabelText("likes count")[0].props.children).toEqual(0);
				await waitFor(() => fireEvent.press(queryAllByLabelText("like recipe")[0]));
				expect(postRecipeLike).toHaveBeenCalledWith(113, 22, "mockAuthToken");
				expect(queryAllByLabelText("likes count")[0].props.children).toEqual(1);
			});
			test("api fail when liking recipe should show offline message", async () => {
				postRecipeLike.mockImplementation(() => Promise.reject({}));
				expect(queryAllByLabelText("likes count")[0].props.children).toEqual(0);
				await waitFor(() => fireEvent.press(queryAllByLabelText("like recipe")[0]));
				expect(postRecipeLike).toHaveBeenCalledWith(113, 22, "mockAuthToken");
				expect(queryAllByLabelText("likes count")[0].props.children).toEqual(0);
				expect(getByTestId("offlineMessage")).toBeTruthy();
			});
			test("should be able to un-like recipe", async () => {
				destroyRecipeLike.mockResolvedValue(true);
				expect(queryAllByLabelText("likes count")[1].props.children).toEqual(1);
				await waitFor(() => fireEvent.press(queryAllByLabelText("unlike recipe")[0]));
				expect(destroyRecipeLike).toHaveBeenCalledWith(112, 22, "mockAuthToken");
				expect(queryAllByLabelText("likes count")[1].props.children).toEqual(0);
			});
			test("api fail when un-liking recipe should show offline message", async () => {
				destroyRecipeLike.mockImplementation(() => Promise.reject({}));
				expect(queryAllByLabelText("likes count")[1].props.children).toEqual(1);
				await waitFor(() => fireEvent.press(queryAllByLabelText("unlike recipe")[0]));
				expect(destroyRecipeLike).toHaveBeenCalledWith(112, 22, "mockAuthToken");
				expect(queryAllByLabelText("likes count")[1].props.children).toEqual(1);
				expect(getByTestId("offlineMessage")).toBeTruthy();
			});
		});
		describe("commenting", () => {
			test("commenting should navigate to recipe with commenting == true", async () => {
				const testRecipeDetails = recipeDetails.find((d) => d.id === 113);
				getRecipeDetails.mockImplementation(() => Promise.resolve(testRecipeDetails));
				AsyncStorage.getItem.mockImplementation((key, callback) => callback([]));
				await waitFor(() => fireEvent.press(queryAllByLabelText("comment on recipe")[0]));
				expect(AsyncStorage.getItem).toHaveBeenCalledWith("localRecipeDetails", expect.any(Function));
				expect(AsyncStorage.setItem).toHaveBeenCalledWith(
					"localRecipeDetails",
					JSON.stringify([testRecipeDetails])
				);
				expect(mockNavigate).toHaveBeenCalledWith("RecipeDetails", {
					recipeID: 113,
					commenting: true,
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
			const rendered = render(
				<Provider store={store}>
					<RecipesList navigation={navigation} route={route} listChoice={"all"} />
				</Provider>
			);

			getByTestId = rendered.getByTestId;
			queryAllByTestId = rendered.queryAllByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			queryAllByPlaceholderText = rendered.queryAllByPlaceholderText;
			queryAllByLabelText = rendered.queryAllByLabelText;
			getByText = rendered.getByText;
			queryAllByText = rendered.queryAllByText;
			toJSON = rendered.toJSON;
			// getAllByRole = rendered.getAllByRole;
			// findByText = rendered.findByText;
			// findByTestId = rendered.findByTestId;
			// getByDisplayValue = rendered.getByDisplayValue;
			getByLabelText = rendered.getByLabelText;

			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
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
			fireEvent.press(getByLabelText("display filter options"));
			expect(getByText("Apply filters to recipes list")).toBeTruthy();
			expect(getByTestId("Side-switch").props.value).toBeFalsy();
			expect(getByTestId("Dessert-switch").props.disabled).toBeFalsy();
			await waitFor(() => fireEvent.press(getByText("Side")));
			expect(getByTestId("Dessert-switch").props.disabled).toBeTruthy();
			expect(getByTestId("Side-switch").props.value).toBeTruthy();
			expect(getAvailableFilters).toHaveBeenCalled();
			expect(getAvailableFilters).toHaveBeenCalledWith(
				"all",
				22,
				10,
				0,
				undefined,
				"mockAuthToken",
				{
					Bread: false,
					Breakfast: false,
					Chicken: false,
					"Dairy free": false,
					Dessert: false,
					Dinner: false,
					"Freezer meal": false,
					"Gluten free": false,
					Keto: false,
					Lunch: false,
					Paleo: false,
					"Red meat": false,
					Salad: false,
					Seafood: false,
					Side: true,
					Soup: false,
					Vegan: false,
					Vegetarian: false,
					Weekend: false,
					Weeknight: false,
					"White meat": false,
					"Whole 30": false,
				},
				"Any",
				"Any",
				"",
				expect.any(Object)
			);
			fireEvent.press(getByText("Apply & Close"));
			expect(queryAllByText("Apply filters to recipes list").length).toEqual(0);
		});
		test("should be able to set Cuisine", async () => {
			getAvailableFilters.mockImplementation(() =>
				Promise.resolve({
					cuisines: cuisines,
					serves: serves,
					filters: filters.filter((f) => f !== "dessert"),
				})
			);
			fireEvent.press(getByLabelText("display filter options"));
			expect(getByText("Apply filters to recipes list")).toBeTruthy();
			expect(getByTestId("Dessert-switch").props.disabled).toBeFalsy();

			fireEvent.press(getByLabelText("cuisines picker")); // open the picker
			await waitFor(() => expect(getByTestId("iosPicker")).toBeTruthy()); // see the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "American"); // change the value
			await act(async () => await jest.runOnlyPendingTimers());

			expect(getByTestId("Dessert-switch").props.disabled).toBeTruthy();
			expect(getAvailableFilters).toHaveBeenCalled();
			expect(getAvailableFilters).toHaveBeenCalledWith(
				"all",
				22,
				10,
				0,
				undefined,
				"mockAuthToken",
				{
					Bread: false,
					Breakfast: false,
					Chicken: false,
					"Dairy free": false,
					Dessert: false,
					Dinner: false,
					"Freezer meal": false,
					"Gluten free": false,
					Keto: false,
					Lunch: false,
					Paleo: false,
					"Red meat": false,
					Salad: false,
					Seafood: false,
					Side: false,
					Soup: false,
					Vegan: false,
					Vegetarian: false,
					Weekend: false,
					Weeknight: false,
					"White meat": false,
					"Whole 30": false,
				},
				"American",
				"Any",
				"",
				expect.any(Object)
			);
			fireEvent.press(getByText("Apply & Close"));
			expect(queryAllByText("Apply filters to recipes list").length).toEqual(0);
		});
		test("should be able to set Serves", async () => {
			getAvailableFilters.mockImplementation(() =>
				Promise.resolve({
					cuisines: cuisines,
					serves: serves,
					filters: filters.filter((f) => f !== "dessert"),
				})
			);
			fireEvent.press(getByLabelText("display filter options"));
			expect(getByText("Apply filters to recipes list")).toBeTruthy();
			expect(getByTestId("Dessert-switch").props.disabled).toBeFalsy();

			fireEvent.press(getByLabelText("serves picker")); // open the picker
			await waitFor(() => expect(getByTestId("iosPicker")).toBeTruthy()); // see the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "6"); // change the value
			await act(async () => await jest.runOnlyPendingTimers());

			expect(getByTestId("Dessert-switch").props.disabled).toBeTruthy();
			expect(getAvailableFilters).toHaveBeenCalled();
			expect(getAvailableFilters).toHaveBeenCalledWith(
				"all",
				22,
				10,
				0,
				undefined,
				"mockAuthToken",
				{
					Bread: false,
					Breakfast: false,
					Chicken: false,
					"Dairy free": false,
					Dessert: false,
					Dinner: false,
					"Freezer meal": false,
					"Gluten free": false,
					Keto: false,
					Lunch: false,
					Paleo: false,
					"Red meat": false,
					Salad: false,
					Seafood: false,
					Side: false,
					Soup: false,
					Vegan: false,
					Vegetarian: false,
					Weekend: false,
					Weeknight: false,
					"White meat": false,
					"Whole 30": false,
				},
				"Any",
				"6",
				"",
				expect.any(Object)
			);
			fireEvent.press(getByText("Apply & Close"));
			expect(queryAllByText("Apply filters to recipes list").length).toEqual(0);
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
				const { queryAllByTestId, getByPlaceholderText } = render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				);
				await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
	
				// act
				fireEvent.changeText(getByPlaceholderText("Search for Recipes"), "chi")
	
				// assert
				await waitFor(() => expect(queryAllByTestId("recipeCard").length).toEqual(chiRecipes.length));
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
				const { queryAllByTestId, getByPlaceholderText, queryAllByLabelText } = render(
					<Provider store={store}>
						<RecipesList navigation={navigation} route={route} listChoice={"all"} />
					</Provider>
				);
				await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
				expect(getByPlaceholderText("Search for Recipes")).toBeTruthy();
				await waitFor(() => fireEvent.changeText(getByPlaceholderText("Search for Recipes"), "chi"));
				expect(getRecipeList).toHaveBeenCalledTimes(2);
				expect(queryAllByTestId("recipeCard").length).toEqual(chiRecipes.length);
	
				// act
				await waitFor(() => fireEvent.press(queryAllByLabelText("clear search text")[0]));
	
				// assert
				expect(getRecipeList).toHaveBeenCalledTimes(3);
				expect(queryAllByTestId("recipeCard").length).toEqual(recipeList.length);
			});
		});
});
