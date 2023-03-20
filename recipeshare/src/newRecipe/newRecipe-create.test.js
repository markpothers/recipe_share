import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, updateLoggedInChef } from "../redux";
import NetInfo from "@react-native-community/netinfo";
import NewRecipe from "./newRecipe";
import { postRecipe } from "../fetches/postRecipe";
import { postRecipeImage } from "../fetches/postRecipeImage";
import { postInstructionImage } from "../fetches/postInstructionImage";
// import { act } from "react-dom/test-utils";
import { fetchIngredients } from "../fetches/fetchIngredients";
import { ingredients } from "../../__mocks__/data/ingredients";
import AsyncStorage from "@react-native-async-storage/async-storage";

// manual mocks
jest.mock("../fetches/fetchIngredients");
jest.mock("../fetches/postRecipe");
jest.mock("../fetches/patchRecipe");
jest.mock("../fetches/postRecipeImage");
jest.mock("../fetches/postInstructionImage");

describe("New Recipe page", () => {
	describe("New Recipe creation and functions", () => {
		let store,
			mockNavigate,
			mockSetParams,
			mockSetOptions,
			navigation,
			route,
			getByTestId,
			queryAllByTestId,
			getByPlaceholderText,
			queryAllByPlaceholderText,
			getByText,
			queryAllByText,
			// getAllByRole,
			// findByText,
			// findByTestId,
			// getByDisplayValue,
			getByLabelText,
			toJSON;

		beforeEach(async () => {
			jest.useFakeTimers();

			fetchIngredients.mockImplementation(() => Promise.resolve(ingredients));
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				// new Promise((resolve, reject) => resolve({result: "YES!"}))
				callback();
			});

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

			mockNavigate = jest.fn();
			mockSetParams = jest.fn();
			mockSetOptions = jest.fn();

			navigation = {
				navigate: mockNavigate,
				setParams: mockSetParams,
				setOptions: mockSetOptions
			};

			route = {};

			// eslint-disable-next-line no-unused-vars
			// NetInfo as typeof NetInfo & { setReturnValue: (isConnected: boolean) => void }
			NetInfo.setReturnValue(true);

			const rendered = render(
				<Provider store={store}>
					<NewRecipe navigation={navigation} route={route} />
				</Provider>
			);

			getByTestId = rendered.getByTestId;
			queryAllByTestId = rendered.queryAllByTestId;
			getByPlaceholderText = rendered.getByPlaceholderText;
			queryAllByPlaceholderText = rendered.queryAllByPlaceholderText;
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

		afterEach(async () => {
			// (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockClear();
			AsyncStorage.getItem.mockClear();
			postRecipe.mockClear();
			postRecipeImage.mockClear();
			postInstructionImage.mockClear();
		});

		test("should load and render", async () => {
			// expect(getByText("Create a New Recipe")).toBeTruthy(); // no this is in the header which isn't rendered here.
			expect(toJSON()).toMatchSnapshot();
		});

		test("it should accept input in the recipe name field", async () => {
			fireEvent.changeText(getByPlaceholderText("Recipe name"), "testRecipeName");
			await waitFor(() =>
				expect(getByPlaceholderText("Recipe name").props.value).toStrictEqual("testRecipeName")
			);
		});
		test("it should accept input in the about field", async () => {
			fireEvent.changeText(
				getByPlaceholderText(
					"Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
				),
				"Interesting things about my recipe."
			);
			await waitFor(() =>
				expect(
					getByPlaceholderText(
						"Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
					).props.value
				).toStrictEqual("Interesting things about my recipe.")
			);
		});
		test("it should accept input in the acknowledgement field", async () => {
			fireEvent.changeText(
				getByPlaceholderText("Acknowledge your recipe's source (optional)"),
				"My mum taught me this recipe"
			);
			await waitFor(() =>
				expect(getByPlaceholderText("Acknowledge your recipe's source (optional)").props.value).toStrictEqual(
					"My mum taught me this recipe"
				)
			);
		});
		test("it should accept input in the acknowledgement link field", async () => {
			fireEvent.changeText(getByPlaceholderText("Link to the original book or blog (optional)"), "someWebLink");
			await waitFor(() =>
				expect(getByPlaceholderText("Link to the original book or blog (optional)").props.value).toStrictEqual(
					"someWebLink"
				)
			);
		});
		test("it should be possible to set the prep time", async () => {
			fireEvent.press(getByLabelText("prep time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "01:15"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("prep time picker").props.children).toEqual("01:15");
		});
		test("it should be possible to set the cook time", async () => {
			fireEvent.press(getByLabelText("cook time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "02:30"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("cook time picker").props.children).toEqual("02:30");
		});
		test("it should be possible to set the total time", async () => {
			fireEvent.press(getByLabelText("total time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "03:45"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("total time picker").props.children).toEqual("03:45");
		});
		test("total time should automatically be calculated when setting prep and cook time", async () => {
			expect(getByLabelText("total time picker").props.children).toEqual("00:00");
			fireEvent.press(getByLabelText("prep time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "01:15"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("total time picker").props.children).toEqual("01:15");
			fireEvent.press(getByLabelText("cook time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "02:30"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("total time picker").props.children).toEqual("03:45");
		});
		test("it should be possible to set the difficulty", async () => {
			fireEvent.press(getByLabelText("difficulty picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "7"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("difficulty picker").props.children).toEqual("7");
		});

		test("Recipe name help button should display help", async () => {
			fireEvent.press(getByLabelText("recipe name help"));
			expect(getByText("Help - Recipe Name")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Recipe Name").length).toEqual(0);
		});
		test("About help button should display help", async () => {
			fireEvent.press(getByLabelText("about help"));
			expect(getByText("Help - About")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - About").length).toEqual(0);
		});
		test("Cover pictures help button should display help", async () => {
			fireEvent.press(getByLabelText("cover pictures help"));
			expect(getByText("Help - Cover Pictures")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Cover Pictures").length).toEqual(0);
		});
		test("Timings help button should display help", async () => {
			fireEvent.press(getByLabelText("timings help"));
			expect(getByText("Help - Timings")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Timings").length).toEqual(0);
		});
		test("Difficulty help button should display help", async () => {
			fireEvent.press(getByLabelText("difficulty help"));
			expect(getByText("Help - Difficulty")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Difficulty").length).toEqual(0);
		});
		test("Filter Categories help button should display help", async () => {
			fireEvent.press(getByLabelText("filter categories help"));
			expect(getByText("Help - Filter Categories")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Filter Categories").length).toEqual(0);
		});
		test("Acknowledgement help button should display help", async () => {
			fireEvent.press(getByLabelText("acknowledgement help"));
			expect(getByText("Help - Acknowledgement")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Acknowledgement").length).toEqual(0);
		});
		test("Display as help button should display help", async () => {
			fireEvent.press(getByLabelText("display as help"));
			expect(getByText("Help - Show blog preview")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Show blog preview").length).toEqual(0);
		});
		test("Ingredients help button should display help", async () => {
			fireEvent.press(getByLabelText("ingredients help"));
			expect(getByText("Help - Ingredients")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Ingredients").length).toEqual(0);
		});
		test("Instructions help button should display help", async () => {
			fireEvent.press(getByLabelText("instructions help"));
			expect(getByText("Help - Instructions")).toBeTruthy();
			fireEvent.press(getByText("Close"));
			expect(queryAllByText("Help - Instructions").length).toEqual(0);
		});

		test("it should be possible to set some filter categories", async () => {
			fireEvent.press(getByText("Filter categories"));
			fireEvent.press(getByText("Keto"));
			fireEvent.press(getByText("Lunch"));
			fireEvent.press(getByText("Weeknight"));
			await waitFor(() => expect(getByTestId("Keto-switch").props.value).toEqual(true));
			expect(getByTestId("Lunch-switch").props.value).toEqual(true);
			expect(getByTestId("Weeknight-switch").props.value).toEqual(true);
			fireEvent.press(getByText("Save"));
			expect(queryAllByText("Select categories for your recipe").length).toEqual(0);
		});
		test("it should be possible to set the cuisine", async () => {
			fireEvent.press(getByText("Filter categories"));
			fireEvent.press(getByLabelText("cuisines picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "Cajun"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("cuisines picker").props.children).toEqual("Cajun");
			fireEvent.press(getByText("Save"));
			expect(queryAllByText("Select categories for your recipe").length).toEqual(0);
		});
		test("it should be possible to set the serves", async () => {
			fireEvent.press(getByText("Filter categories"));
			fireEvent.press(getByLabelText("serves picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "4"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByLabelText("serves picker").props.children).toEqual("4");
			fireEvent.press(getByText("Save"));
			expect(queryAllByText("Select categories for your recipe").length).toEqual(0);
		});
		test("if you set Full Recipe, ingredients and instructions sections should be present", async () => {
			expect(getByLabelText("show blog switch").props.value).toEqual(false);
			expect(getByText("Ingredients")).toBeTruthy();
			expect(getByText("Add ingredient")).toBeTruthy();
			expect(getByText("Instructions")).toBeTruthy();
			expect(getByText("Add instruction")).toBeTruthy();
			expect(toJSON()).toMatchSnapshot();
		});
		test("if you set Blog, ingredients and instructions sections should be absent", async () => {
			expect(getByLabelText("show blog switch").props.value).toEqual(false);
			fireEvent(getByLabelText("show blog switch"), "valueChange", true);
			await waitFor(() => expect(getByLabelText("show blog switch").props.value).toEqual(true));
			expect(queryAllByText("Ingredients").length).toEqual(0);
			expect(queryAllByText("Add ingredient").length).toEqual(0);
			expect(queryAllByText("Instructions").length).toEqual(0);
			expect(queryAllByText("Add instruction").length).toEqual(0);
			expect(toJSON()).toMatchSnapshot();
		});
		test("it should be possible to add an ingredient and set its name, quantity, and unit", async () => {
			fireEvent.press(getByText("Add ingredient"));
			fireEvent.changeText(getByPlaceholderText("Ingredient 1"), "Bacon rasher - thick cut");
			fireEvent.changeText(getByPlaceholderText("Qty"), "2");
			fireEvent.press(getByLabelText("ingredient1 unit picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "each"); // change the value
			await act(async () => await jest.runAllTimers());
			expect(getByPlaceholderText("Ingredient 1").props.value).toStrictEqual("Bacon rasher - thick cut");
			expect(getByPlaceholderText("Qty").props.value).toStrictEqual("2");
			expect(getByLabelText("ingredient1 unit picker").props.children).toEqual("each");
		});
		test("it should be possible to delete an ingredient", async () => {
			fireEvent.press(getByText("Add ingredient"));
			expect(getByPlaceholderText("Ingredient 1")).toBeTruthy();
			fireEvent.press(getByTestId("delete-ingredient1"));
			expect(queryAllByPlaceholderText("Ingredient 1").length).toEqual(0);
		});
		test("it should be possible to add an instruction", async () => {
			fireEvent.press(getByText("Add instruction"));
			fireEvent.changeText(getByPlaceholderText("Instructions: step 1"), "Fry the bacon");
			expect(getByPlaceholderText("Instructions: step 1").props.value).toStrictEqual("Fry the bacon");
		});
		test("it should be possible to delete an instruction", async () => {
			fireEvent.press(getByText("Add instruction"));
			expect(getByPlaceholderText("Instructions: step 1")).toBeTruthy();
			fireEvent.press(getByTestId("delete-instruction1"));
			expect(queryAllByPlaceholderText("Instructions: step 1").length).toEqual(0);
		});
		test("it should be possible to clear a recipe", async () => {
			fireEvent.changeText(getByPlaceholderText("Recipe name"), "testRecipeName");
			//about
			fireEvent.changeText(
				getByPlaceholderText(
					"Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
				),
				"Interesting things about my recipe."
			);
			// acknowledgement
			fireEvent.changeText(
				getByPlaceholderText("Acknowledge your recipe's source (optional)"),
				"My mum taught me this recipe"
			);
			// acknowledgement link
			fireEvent.changeText(getByPlaceholderText("Link to the original book or blog (optional)"), "someWebLink");
			// prep time
			fireEvent.press(getByLabelText("prep time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "01:15"); // change the value
			await act(async () => await jest.runAllTimers());
			// cook time
			fireEvent.press(getByLabelText("cook time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "02:30"); // change the value
			await act(async () => await jest.runAllTimers());
			// difficulty
			fireEvent.press(getByLabelText("difficulty picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "7"); // change the value
			await act(async () => await jest.runAllTimers());
			fireEvent.press(getByText("Add ingredient"));
			fireEvent.changeText(getByPlaceholderText("Ingredient 1"), "Bacon rasher - thick cut");
			fireEvent.changeText(getByPlaceholderText("Qty"), "2");
			fireEvent.press(getByLabelText("ingredient1 unit picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "each"); // change the value
			await act(async () => await jest.runAllTimers());
			fireEvent.press(getByText("Add instruction"));
			fireEvent.changeText(getByPlaceholderText("Instructions: step 1"), "Fry the bacon");
			await act(async () => fireEvent.press(getByText("Clear")));
			expect(getByText("Are you sure you want to clear this form and start a new recipe?")).toBeTruthy();
			await act(async () => fireEvent.press(getByText("Yes")));

			expect(getByPlaceholderText("Recipe name").props.value).toStrictEqual("");
			expect(
				getByPlaceholderText(
					"Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
				).props.value
			).toStrictEqual("");
			expect(getByPlaceholderText("Acknowledge your recipe's source (optional)").props.value).toStrictEqual("");
			expect(getByPlaceholderText("Link to the original book or blog (optional)").props.value).toStrictEqual("");
			expect(getByLabelText("prep time picker").props.children).toEqual("00:00");
			expect(getByLabelText("cook time picker").props.children).toEqual("00:00");
			expect(getByLabelText("total time picker").props.children).toEqual("00:00");
			expect(queryAllByText("Ingredient 1").length).toEqual(0);
			expect(queryAllByText("Instructions: step 1").length).toEqual(0);
		});

		test("canceling the reset menu closes it", async () => {
			await act(async () => fireEvent.press(getByText("Clear")));
			expect(getByText("Are you sure you want to clear this form and start a new recipe?")).toBeTruthy();
			await act(async () => fireEvent.press(getByText("Cancel")));
			expect(
				queryAllByText("Are you sure you want to clear this form and start a new recipe?").length
			).toStrictEqual(0);
		});

		test("it should be possible to submit a recipe with all params", async () => {
			postRecipe.mockImplementation(() => Promise.resolve({ recipe: { recipeId: 99 } }));
			postRecipeImage.mockImplementation(() => Promise.resolve(true));
			postInstructionImage.mockImplementation(() => Promise.resolve(true));
			// name
			fireEvent.changeText(getByPlaceholderText("Recipe name"), "testRecipeName");
			//about
			fireEvent.changeText(
				getByPlaceholderText(
					"Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
				),
				"Interesting things about my recipe."
			);
			// acknowledgement
			fireEvent.changeText(
				getByPlaceholderText("Acknowledge your recipe's source (optional)"),
				"My mum taught me this recipe"
			);
			// acknowledgement link
			fireEvent.changeText(getByPlaceholderText("Link to the original book or blog (optional)"), "someWebLink");
			// prep time
			fireEvent.press(getByLabelText("prep time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "01:15"); // change the value
			await act(async () => await jest.runAllTimers());
			// cook time
			fireEvent.press(getByLabelText("cook time picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "02:30"); // change the value
			await act(async () => await jest.runAllTimers());
			// difficulty
			fireEvent.press(getByLabelText("difficulty picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "7"); // change the value
			await act(async () => await jest.runAllTimers());
			// filters
			fireEvent.press(getByText("Filter categories"));
			fireEvent.press(getByText("Keto"));
			fireEvent.press(getByText("Lunch"));
			fireEvent.press(getByText("Weeknight"));
			// cuisines
			fireEvent.press(getByLabelText("cuisines picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "Cajun"); // change the value
			await act(async () => await jest.runAllTimers());
			// serves
			fireEvent.press(getByLabelText("serves picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "4"); // change the value
			await act(async () => await jest.runAllTimers());
			fireEvent.press(getByText("Save"));
			// ingredient 1
			fireEvent.press(getByText("Add ingredient"));
			fireEvent.changeText(getByPlaceholderText("Ingredient 1"), "Bacon rasher - thick cut");
			fireEvent.changeText(getByPlaceholderText("Qty"), "2");
			fireEvent.press(getByLabelText("ingredient1 unit picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "each"); // change the value
			await act(async () => await jest.runAllTimers());
			// ingredient 2
			fireEvent.press(getByText("Add ingredient"));
			fireEvent.changeText(getByPlaceholderText("Ingredient 2"), "Eggs");
			fireEvent.changeText(queryAllByPlaceholderText("Qty")[1], "7");
			fireEvent.press(getByLabelText("ingredient2 unit picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "fl oz"); // change the value
			await act(async () => await jest.runAllTimers());
			// ingredient 3
			fireEvent.press(getByText("Add ingredient"));
			fireEvent.changeText(getByPlaceholderText("Ingredient 3"), "Toast");
			fireEvent.changeText(queryAllByPlaceholderText("Qty")[2], "10");
			fireEvent.press(getByLabelText("ingredient3 unit picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "g"); // change the value
			await act(async () => await jest.runAllTimers());
			// instruction 1
			fireEvent.press(getByText("Add instruction"));
			fireEvent.changeText(getByPlaceholderText("Instructions: step 1"), "Fry the bacon");
			// instruction 2
			fireEvent.press(getByText("Add instruction"));
			fireEvent.changeText(getByPlaceholderText("Instructions: step 2"), "Poach the eggs");
			// instruction 3
			fireEvent.press(getByText("Add instruction"));
			fireEvent.changeText(getByPlaceholderText("Instructions: step 3"), "Toast the toast");
			// instruction 4
			fireEvent.press(getByText("Add instruction"));
			fireEvent.changeText(
				getByPlaceholderText("Instructions: step 4"),
				"Put the eggs on the toast and serve with the bacon"
			);
			// submit
			await act(async () => fireEvent.press(getByText("Submit")));
			expect(postRecipe).toHaveBeenCalledWith(
				22, // chefId
				"mockAuthToken",
				"testRecipeName",
				[
					{ name: "Bacon rasher - thick cut", quantity: "2", unit: "each" },
					{ name: "Eggs", quantity: "7", unit: "fl oz" },
					{ name: "Toast", quantity: "10", unit: "g" },
				],
				[
					"Fry the bacon",
					"Poach the eggs",
					"Toast the toast",
					"Put the eggs on the toast and serve with the bacon",
				],
				75, // cook time
				150, // prep time
				225, // total time is the 2 above added together
				"7", // difficulty
				{
					Bread: false,
					Breakfast: false,
					Chicken: false,
					"Dairy free": false,
					Dessert: false,
					Dinner: false,
					"Freezer meal": false,
					"Gluten free": false,
					Keto: true,
					Lunch: true,
					Paleo: false,
					"Red meat": false,
					Salad: false,
					Seafood: false,
					Side: false,
					Soup: false,
					Vegan: false,
					Vegetarian: false,
					Weekend: false,
					Weeknight: true,
					"White meat": false,
					"Whole 30": false,
				},
				"Cajun",
				"4", // serves
				"My mum taught me this recipe", // acknowledgement
				"someWebLink", // ack link
				"Interesting things about my recipe.",
				false // show blog preview
			);
			expect(mockNavigate).toHaveBeenCalledWith("MyRecipeBook", {
				screen: "My Recipes",
				params: { refresh: true },
			});
		});
	});

	describe("finishing a saved recipe recipe with images", () => {
		afterEach(async () => {
			// (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockClear();
			AsyncStorage.getItem.mockClear();
			postRecipe.mockClear();
			postRecipeImage.mockClear();
			postInstructionImage.mockClear();
		});

		test("an async stored recipe should populate the fields correctly and submit correctly", async () => {
			postRecipe.mockImplementation(() =>
				Promise.resolve({
					recipe: { id: 99 },
					instructions: [
						{ step: 1, id: 22, instruction: "step 1" },
						{ step: 2, id: 23, instruction: "step 2" },
						{ step: 3, id: 24, instruction: "step 3" },
						{ step: 4, id: 25, instruction: "step 4" },
						{ step: 5, id: 26, instruction: "step 5" },
						{ step: 6, id: 27, instruction: "step 6" },
					],
				})
			);
			postRecipeImage.mockImplementation(() => Promise.resolve(true));
			postInstructionImage.mockImplementation(() => Promise.resolve(true));
			fetchIngredients.mockImplementation(() => Promise.resolve(ingredients));
			const mockNavigate = jest.fn();
			const storedRecipe =
				'{"newRecipeDetails":{"recipeId":null,"instructions":["step 1","step 2","step 3","step 4","step 5","step 6"],"ingredients":[{"name":"Chicken","quantity":"1","unit":"Oz"},{"name":"Brown rice","quantity":"1","unit":"cup"}],"difficulty":"4","times":{"prepTime":15,"cookTime":75,"totalTime":90},"filter_settings":{"Breakfast":false,"Lunch":true,"Dinner":false,"Chicken":true,"Red meat":false,"Seafood":false,"Vegetarian":false,"Salad":false,"Vegan":false,"Soup":true,"Dessert":false,"Side":true,"Whole 30":false,"Paleo":true,"Freezer meal":false,"Keto":false,"Weeknight":false,"Weekend":true,"Gluten free":false,"Bread":true,"Dairy free":false,"White meat":false},"cuisine":"American","serves":"3","acknowledgement":"The food lab","acknowledgementLink":"https://www.amazon.com/Food-Lab-Cooking-Through-Science/dp/0393081087/ref=sr_1_2?dchild=1&keywords=the+food+lab&qid=1618170711&sr=8-2","description":"I love this recipe","showBlogPreview":false,"name":"My test short recipe","instructionImages":["","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/d138f30a-0b57-475c-a1ed-3c99307c58c7.jpg","","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/e0938290-655c-4361-96a1-c580bab2567d.jpg","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/7b2c7e95-0d7f-4aa6-843c-c95441d099b4.jpg",""],"primaryImages":[{"cancelled":false,"width":2108,"type":"image","uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/05436971-9a5c-463e-a922-b73b9ef1e849.jpg","height":1581},{"cancelled":false,"width":2772,"type":"image","uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/0a24dd3e-6cc7-47f2-9d4b-5ffa8b3d9ca6.jpg","height":2080}]},"instructionHeights":[54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355],"averageInstructionHeight":54.47714176722935}';
			AsyncStorage.getItem.mockImplementation((key, callback) => {
				callback(null, storedRecipe);
			});

			const store = configureStore({
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
			const { queryAllByTestId, getByText } = render(
				<Provider store={store}>
					<NewRecipe
						navigation={{
							navigate: mockNavigate,
							setParams: jest.fn(),
							setOptions: jest.fn()
						}}
						route={{}}
					/>
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
			// submit
			await act(async () => fireEvent.press(getByText("Submit")));
			expect(postRecipe).toHaveBeenCalledWith(
				22, // chefId
				"mockAuthToken",
				"My test short recipe",
				[
					{ name: "Chicken", quantity: "1", unit: "Oz" },
					{ name: "Brown rice", quantity: "1", unit: "cup" },
				],
				["step 1", "step 2", "step 3", "step 4", "step 5", "step 6"],
				15, // cook time
				75, // prep time
				90, // total time is the 2 above added together
				"4", // difficulty
				{
					Bread: true,
					Breakfast: false,
					Chicken: true,
					"Dairy free": false,
					Dessert: false,
					Dinner: false,
					"Freezer meal": false,
					"Gluten free": false,
					Keto: false,
					Lunch: true,
					Paleo: true,
					"Red meat": false,
					Salad: false,
					Seafood: false,
					Side: true,
					Soup: true,
					Vegan: false,
					Vegetarian: false,
					Weekend: true,
					Weeknight: false,
					"White meat": false,
					"Whole 30": false,
				},
				"American",
				"3", // serves
				"The food lab", // acknowledgement
				"https://www.amazon.com/Food-Lab-Cooking-Through-Science/dp/0393081087/ref=sr_1_2?dchild=1&keywords=the+food+lab&qid=1618170711&sr=8-2", // ack link
				"I love this recipe",
				false // show blog preview
			);
			expect(postRecipeImage).toHaveBeenCalledTimes(2);
			expect(postRecipeImage).toHaveBeenLastCalledWith(
				22, // chef id
				"mockAuthToken",
				99, // recipe id
				0, // image id
				1, // index
				"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/0a24dd3e-6cc7-47f2-9d4b-5ffa8b3d9ca6.jpg"
			);
			expect(postInstructionImage).toHaveBeenCalledTimes(3);
			expect(postInstructionImage).toHaveBeenLastCalledWith(
				22, // chef id
				"mockAuthToken",
				26, // instruction id
				0, // image id
				"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/7b2c7e95-0d7f-4aa6-843c-c95441d099b4.jpg"
			);
			expect(mockNavigate).toHaveBeenCalledWith("MyRecipeBook", {
				screen: "My Recipes",
				params: { refresh: true },
			});
		});

		// it's basically impossible to test these functions.  I'm just leacing them here as a reminder

		// the issue with this is RTL is causing some infinite loop when state is updated with non-memoized props.
		// I think the only way to avoid this is to convert to a functional component and memoize the call in some way but I
		// don't want to do that at the moment.
		test.skip("cover pictures should display/hide and pick a photo using the multiPicSourceChooser", async () => {
			// await act(async () => {
			// await waitFor(() => {
			// fireEvent.press(getByText("Cover Pictures"));
			// });
			// await waitFor(() =>
			// expect(getByText("Take photo")).toBeTruthy();
			// );
			// await act(async () => {
			// fireEvent.press(getByText("Take photo"));
			// });
			// fireEvent.press(getByText("Save & Close"));
			// expect(queryAllByText("Save & Close").length).toEqual(0);
		});
		test.skip("instruction photos should sort with instructions", async () => {});
		test.skip("it should be possible to sort the ingredients", async () => {});
		test.skip("it should be possible to sort the instructions", async () => {});
		test.skip("it should be possible to add a photo to an instruction", async () => {
			// fireEvent.press(getByText("Add instruction"));
			// fireEvent.press(getByTestId("photo-instruction1"));
			// await waitFor(() => expect(getByText("Choose photo")).toBeTruthy());
			// await act(async () => {
			// fireEvent.press(getByText("Choose photo"));
			// });
		});
	});
});
