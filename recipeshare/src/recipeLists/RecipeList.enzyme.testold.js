/**
 * @jest-environment jsdom
 */

import RecipesList, { RecipesList as NamedRecipesList } from "./RecipesList.js";
import { TextInput, TouchableOpacity } from "react-native";
import { applyMiddleware, compose, createStore } from "redux";
import { configure, mount, shallow } from "enzyme";

import { Provider } from "react-redux";
import React from "react";
import RecipeCard from "./RecipeCard";
import ReduxThunk from "redux-thunk";
import SearchBar from "../searchBar/SearchBar.js";
import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { getRecipeList } from "../fetches/.js";
import { mockRecipeList } from "../../__mocks__/mockRecipeList";
import reducer from "../redux/reducer";
import { store } from "../redux/store";

//create an empty mockStore if required (most tests are using the real one)
const middlewares = [ReduxThunk];
const mockStoreCreator = configureStore(middlewares);
let mockStore = mockStoreCreator({
	recipes: {
		all: [],
		// chef: [mockRecipeList[0]],
		// chef_feed: [mockRecipeList[0]],
		// chef_liked: [mockRecipeList[0]],
		// chef_made: [mockRecipeList[0]],
		// global_ranks: [mockRecipeList[0]],
		// most_liked: [mockRecipeList[0]],
		// most_made: [mockRecipeList[0]]
	},
	recipes_details: {},
	loggedInChef: {},
	global_ranking: "",
	filter_settings: {},
	cuisine: "Any",
	serves: "Any",
});

//manual mocks
jest.mock("../fetches/getRecipeList.js");

//test containers
describe("RecipeList - Enzyme", () => {
	describe("An empty RecipeList", () => {
		let emptyComponent;
		let navigation;

		beforeEach(() => {
			navigation = {
				addListener: jest.fn(),
			};
		});

		test("can be rendered deeply with no RecipeCards if there is no re-render", async () => {
			await act(async () => {
				emptyComponent = await mount(
					<NamedRecipesList
						listChoice={"all"}
						route={{ name: "All Recipes" }}
						navigation={navigation}
						all_Recipes={[]}
					/>
				);
			});
			// NB. componentDidMount fails here while trying to save recipes it found back to the mockStore leaving us with an empty list
			const instance = emptyComponent.children().instance();
			const cards = emptyComponent.find(RecipeCard);
			expect(cards.length).toEqual(0);
		});
	});

	describe("A Recipe List with RecipeCards", () => {
		let component;
		let instance;
		let mockCallBack;
		let navigation;
		let buttonNames = [
			"reShareButton",
			"likeButton",
			"commentButton",
			"chefNameButton",
			"chefImageButton",
			"recipeNameButton",
			"recipeImageButton",
		];

		beforeAll(() => {
			// console.log('runs at the beginning of everything')
		});

		beforeEach(async () => {
			// console.log('runs before every test')

			mockCallBack = jest.fn();
			navigation = {
				addListener: jest.fn(),
			};

			await act(async () => {
				component = await mount(
					<RecipesList listChoice={"all"} route={{ name: "All Recipes" }} navigation={navigation} />,
					{
						wrappingComponent: Provider,
						wrappingComponentProps: {
							store: store,
						},
					}
				);
			});
			component.setProps({});
			instance = component.children().instance();
		});

		afterEach(() => {
			// console.log('runs after each test')
			// component.unmount()
		});

		afterAll(() => {
			// console.log('runs after all tests have completed')
		});

		test("can be rendered deeply with data and RecipeCards appear after re-render", async () => {
			const cards = component.find(RecipeCard);
			expect(cards.length).toEqual(5);
		});

		test("can be rendered deeply RecipeCards props match instance methods", async () => {
			const cards = component.find(RecipeCard);
			expect(cards.length).toEqual(5);
			const cardProps = cards.first().props();
			expect(cardProps.likeRecipe).toBe(instance.likeRecipe);
			expect(cardProps.unlikeRecipe).toBe(instance.unlikeRecipe);
			expect(cardProps.reShareRecipe).toBe(instance.reShareRecipe);
			expect(cardProps.unReShareRecipe).toBe(instance.unReShareRecipe);
			expect(cardProps.navigateToRecipeDetails).toBe(instance.navigateToRecipeDetails);
			expect(cardProps.navigateToChefDetails).toBe(instance.navigateToChefDetails);
		});

		test("spy attached to an instance method, which can then be called successfully", async () => {
			const spy = jest.spyOn(instance, "likeRecipe");
			instance.likeRecipe(132);
			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(132);
		});

		test("spy attached and called and called directly, and from the childs Touchable (experimental)", async () => {
			const spy = jest.spyOn(instance, "likeRecipe");
			instance.forceUpdate();
			instance.likeRecipe(); //call at the top level
			const cards = component.find(RecipeCard);
			// cards.first().props().likeRecipe() // call a recipeCard's props // this does not work because its reference is not updated to the spy method
			// this is a consequence of the wrapper and would work without it for some reason
			const likeButton = cards
				.first()
				.find(TouchableOpacity)
				.filterWhere((b) => b.props().testID === "likeButton");
			likeButton.props().onPress(); // press a recipeCard's likeButton //this actually does work, I think because it's an anonymous function
			expect(spy).toHaveBeenCalledTimes(2);
		});

		test("spy attached to likeRecipe and called by likeRecipeButton in RecipeCard", async () => {
			const spy = jest.spyOn(instance, "likeRecipe");
			instance.forceUpdate();
			const card = component
				.find(RecipeCard)
				.filterWhere((c) => c.props().chef_liked === 0)
				.first();
			const button = card.find(TouchableOpacity).filterWhere((b) => b.props().testID === "likeButton");
			button.props().onPress();
			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenCalledWith(card.props().id);
		});

		test("spy attached to unlikeRecipe and called by unlikeRecipeButton in RecipeCard", async () => {
			const spy = jest.spyOn(instance, "unlikeRecipe");
			instance.forceUpdate();
			const card = component
				.find(RecipeCard)
				.filterWhere((c) => c.props().chef_liked === 1)
				.first();
			const button = card.find(TouchableOpacity).filterWhere((b) => b.props().testID === "likeButton");
			button.props().onPress();
			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenCalledWith(card.props().id);
		});

		test("spy attached to reShareRecipe and called by reShareRecipeButton in RecipeCard", async () => {
			const spy = jest.spyOn(instance, "reShareRecipe");
			instance.forceUpdate();
			const card = component
				.find(RecipeCard)
				.filterWhere((c) => c.props().chef_shared === 0)
				.first();
			const button = card.find(TouchableOpacity).filterWhere((b) => b.props().testID === "reShareButton");
			button.props().onPress();
			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenCalledWith(card.props().id);
		});

		test("spy attached to unReShareRecipe and called by unReShareRecipeButton in RecipeCard", async () => {
			const spy = jest.spyOn(instance, "unReShareRecipe");
			instance.forceUpdate();
			const card = component
				.find(RecipeCard)
				.filterWhere((c) => c.props().chef_shared === 1)
				.first();
			const button = card.find(TouchableOpacity).filterWhere((b) => b.props().testID === "reShareButton");
			button.props().onPress();
			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenCalledWith(card.props().id);
		});

		test("spy attached to RecipeDetails links are all called to navigateToRecipe", async () => {
			const spy = jest.spyOn(instance, "navigateToRecipeDetails");
			instance.forceUpdate();
			const card = component.find(RecipeCard).first();
			buttonNames = ["recipeNameButton", "recipeImageButton"];
			let buttonCount = 0;
			buttonNames.forEach((name) => {
				buttonCount++;
				const button = card.find(TouchableOpacity).filterWhere((b) => b.props().testID === name);
				button.props().onPress();
				expect(spy).toHaveBeenCalledTimes(buttonCount);
				expect(spy).toHaveBeenLastCalledWith(card.props().id);
			});
			const commentButton = card.find(TouchableOpacity).filterWhere((b) => b.props().testID === "commentButton");
			buttonCount++;
			commentButton.props().onPress();
			expect(spy).toHaveBeenCalledTimes(buttonCount);
			expect(spy).toHaveBeenLastCalledWith(card.props().id, true);
		});

		test("spy attached to ChefDetails links are all called to navigateToChef", async () => {
			const spy = jest.spyOn(instance, "navigateToChefDetails");
			instance.forceUpdate();
			const card = component.find(RecipeCard).first();
			buttonNames = ["chefNameButton", "chefImageButton"];
			let buttonCount = 0;
			buttonNames.forEach((name) => {
				buttonCount++;
				const button = card.find(TouchableOpacity).filterWhere((b) => b.props().testID === name);
				button.props().onPress();
				expect(spy).toHaveBeenCalledTimes(buttonCount);
				expect(spy).toHaveBeenLastCalledWith(card.props().chef_id, card.props().id);
			});
		});

		test("typing in the searchBar updates state", () => {
			expect(instance.state.searchTerm).toEqual("");
			const input = component.find(SearchBar).props().searchBar.current; //slightly weird search because searchBar has a ref
			input.props.onChangeText("spaghetti");
			expect(instance.state.searchTerm).toEqual("spaghetti");
		});
	});
});
