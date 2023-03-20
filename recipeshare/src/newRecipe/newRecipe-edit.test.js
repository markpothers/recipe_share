import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, updateLoggedInChef } from "../redux";
import NewRecipe from "./newRecipe";
import { postRecipe } from "../fetches/postRecipe";
import { patchRecipe } from "../fetches/patchRecipe";
import { postRecipeImage } from "../fetches/postRecipeImage";
import { postInstructionImage } from "../fetches/postInstructionImage";
import { fetchIngredients } from "../fetches/fetchIngredients";
import { ingredients } from "../../__mocks__/data/ingredients";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { recipeDetails } from "../../__mocks__/data/recipeDetails";
import { getTimeStringFromMinutes } from "../auxFunctions/getTimeStringFromMinutes";

// manual mocks
jest.mock("../fetches/fetchIngredients");
jest.mock("../fetches/postRecipe");
jest.mock("../fetches/patchRecipe");
jest.mock("../fetches/postRecipeImage");
jest.mock("../fetches/postInstructionImage");

describe("New Recipe page", () => {
	describe("editing a recipe", () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(async () => {
			// (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockClear();
			AsyncStorage.getItem.mockClear();
			postRecipe.mockClear();
			postRecipeImage.mockClear();
			postInstructionImage.mockClear();
		});

		test("rendering with a recipe should populate all the fields correctly", async () => {
			patchRecipe.mockImplementation(() =>
				Promise.resolve({
					recipe: { id: 99 },
					instructions: [
						{ step: 1, id: 31, instruction: "Mix the ingredients in a blender pot" },
						{
							step: 2,
							id: 32,
							instruction: "Blitz! (for about a minute on max, or use your blender’s smoothie setting)",
						},
					],
				})
			);
			postRecipeImage.mockImplementation(() => Promise.resolve(true));
			postInstructionImage.mockImplementation(() => Promise.resolve(true));
			fetchIngredients.mockImplementation(() => Promise.resolve(ingredients));
			const mockNavigate = jest.fn();
			// AsyncStorage.getItem.mockImplementation((key, callback) => {
			// callback();
			// });
			AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

			// console.log(recipeDetails[0])
			const rte = recipeDetails[0]; // recipeToEdit

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
						route={{
							params: { recipe_details: rte },
						}}
					/>
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
			// submit
			await act(async () => fireEvent.press(getByText("Submit")));
			expect(patchRecipe).toHaveBeenCalledWith(
				22, // chefId
				"mockAuthToken",
				rte.recipe.name,
				[
					{
						ingredientId: 393,
						name: "Pea protein powder, scoop",
						quantity: "1",
						unit: "each",
					},
					{
						ingredientId: 394,
						name: "Ground flax meal",
						quantity: "1",
						unit: "tbsp",
					},
					{
						ingredientId: 73,
						name: "Oat milk",
						quantity: "1",
						unit: "cup",
					},
					{
						ingredientId: 395,
						name: "Almond yoghurt",
						quantity: "0.25",
						unit: "cup",
					},
					{
						ingredientId: 396,
						name: "Almond butter",
						quantity: "2",
						unit: "tbsp",
					},
					{
						ingredientId: 397,
						name: "Frozen banana",
						quantity: "0.5",
						unit: "each",
					},
					{
						ingredientId: 400,
						name: "Frozen blackberries or raspberries",
						quantity: "8",
						unit: "each",
					},
					{
						ingredientId: 399,
						name: "Ice",
						quantity: "0.5",
						unit: "cup",
					},
					{
						ingredientId: 68,
						name: "Water",
						quantity: "0.5...1",
						unit: "cup",
					},
				],
				[
					"Mix the ingredients in a blender pot",
					"Blitz! (for about a minute on max, or use your blender’s smoothie setting)",
				],
				15, // cook time
				0, // prep time
				15, // total time is the 2 above added together
				"1", // difficulty
				{
					Bread: false,
					Breakfast: true,
					Chicken: false,
					"Dairy free": true,
					Dessert: false,
					Dinner: false,
					"Freezer meal": false,
					"Gluten free": true,
					Keto: false,
					Lunch: false,
					Paleo: false,
					"Red meat": false,
					Salad: false,
					Seafood: false,
					Side: false,
					Soup: false,
					Vegan: true,
					Vegetarian: true,
					Weekend: false,
					Weeknight: false,
					"White meat": false,
					"Whole 30": false,
				},
				"American",
				"1", // serves
				113, // recipe Id
				"", // acknowledgement
				"", // ack link
				"This healthy protein shake contains none of the major allergens, like dairy and soy, but packs pea protein and other nutrients to fill and nourish you. Obviously it’s highly customizable. I prefer the chocolate flavor with blackberries. The almond butter adds a lot of thickness and depth of flavor, and the flax meal adds to the thickness as well.",
				false // show blog preview
			);
			expect(postRecipeImage).toHaveBeenCalledTimes(1);
			expect(postRecipeImage).toHaveBeenLastCalledWith(
				22, // chef id
				"mockAuthToken",
				99, // recipe id
				144, // image id
				0, // index
				undefined
			);
			expect(postInstructionImage).toHaveBeenCalledTimes(2);
			expect(postInstructionImage).toHaveBeenLastCalledWith(
				22, // chef id
				"mockAuthToken",
				32, // instruction id
				238, // image id
				{
					created_at: "2022-03-01T03:33:36.783Z",
					hex: "189a0cbaa86c7db6ad10f150832eb3dca99fb824-20220301_033336",
					hidden: false,
					id: 238,
					image_url:
						"https://storage.googleapis.com/test-images-be4d3e05-1e77-4efd-8571-364e22ea7c0d/recipe36.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=6468590196&Signature=cp7B9wSfQRdJW0OiG8%2Bdm4CikkYTp%2BS3lm5oVuJhmFjP4XQEu7F0%2BMLNbwQb8qLHw5BOgA6M6Kc6z8MJ9yInciftIFzVmU4VlnXnchCwH%2Fz3j8VgbeE9hpBAq1sp4sQ4NIz0o0Dkp4w15IdQ1XdAgbOEFi%2B%2Bf57Q24RRsGCu8KYw5l9CvwFStYfRRVqaKKcq41lDWIQYSah%2FyDCm5yduclP9DDPYgy%2F87Pawpz3imyA1lX579uXdaiKqhrmAU6TnG4CnMzAwiRXzkoZvwH02YkreIC9WiTZbKXSMhVP%2Bs8rDScGDciZifStKaOtxsT0TZELnSjZH4bOLDHjxh%2FhSNA%3D%3D",
					instruction_id: 719,
					name: null,
					updated_at: "2022-03-01T16:17:43.632Z",
				}
			);
			expect(mockNavigate).toHaveBeenCalledWith("MyRecipeBook", {
				screen: "My Recipes",
				params: { refresh: true },
			});
		});
		test("an async stored recipe should override fields for an edited recipe if they have the same id", async () => {
			fetchIngredients.mockImplementation(() => Promise.resolve(ingredients));
			const mockNavigate = jest.fn();
			const storedRecipe =
				'{"newRecipeDetails":{"recipeId":113,"instructions":["step 1","step 2","step 3","step 4","step 5","step 6"],"ingredients":[{"name":"Chicken","quantity":"1","unit":"Oz"},{"name":"Brown rice","quantity":"1","unit":"cup"}],"difficulty":"4","times":{"prepTime":15,"cookTime":75,"totalTime":90},"filter_settings":{"Breakfast":false,"Lunch":true,"Dinner":false,"Chicken":true,"Red meat":false,"Seafood":false,"Vegetarian":false,"Salad":false,"Vegan":false,"Soup":true,"Dessert":false,"Side":true,"Whole 30":false,"Paleo":true,"Freezer meal":false,"Keto":false,"Weeknight":false,"Weekend":true,"Gluten free":false,"Bread":true,"Dairy free":false,"White meat":false},"cuisine":"American","serves":"3","acknowledgement":"The food lab","acknowledgementLink":"https://www.amazon.com/Food-Lab-Cooking-Through-Science/dp/0393081087/ref=sr_1_2?dchild=1&keywords=the+food+lab&qid=1618170711&sr=8-2","description":"I love this recipe","showBlogPreview":false, "name":"My test short recipe","instructionImages":["","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/d138f30a-0b57-475c-a1ed-3c99307c58c7.jpg","","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/e0938290-655c-4361-96a1-c580bab2567d.jpg","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/7b2c7e95-0d7f-4aa6-843c-c95441d099b4.jpg",""],"primaryImages":[{"cancelled":false,"width":2108,"type":"image","uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/05436971-9a5c-463e-a922-b73b9ef1e849.jpg","height":1581},{"cancelled":false,"width":2772,"type":"image","uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/0a24dd3e-6cc7-47f2-9d4b-5ffa8b3d9ca6.jpg","height":2080}]},"instructionHeights":[54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355],"averageInstructionHeight":54.47714176722935}';
			AsyncStorage.getItem.mockImplementation(() => Promise.resolve(storedRecipe));
			const rte = recipeDetails[0]; // recipeToEdit

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
			const { queryAllByTestId, getByPlaceholderText } = render(
				<Provider store={store}>
					<NewRecipe
						navigation={{
							navigate: mockNavigate,
							setParams: jest.fn(),
							setOptions: jest.fn()
						}}
						route={{
							params: { recipe_details: rte },
						}}
					/>
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));

			// details from the recipe in params are overridden by the recipe in Asyncstorage if their Ids match
			expect(getByPlaceholderText("Recipe name").props.value).toStrictEqual("My test short recipe");
		});
		test("an async stored recipe should NOT override fields for an edited recipe if they have different id", async () => {
			fetchIngredients.mockImplementation(() => Promise.resolve(ingredients));
			const mockNavigate = jest.fn();

			const storedRecipe =
				'{"newRecipeDetails":{"recipeId":99,"instructions":["step 1","step 2","step 3","step 4","step 5","step 6"],"ingredients":[{"name":"Chicken","quantity":"1","unit":"Oz"},{"name":"Brown rice","quantity":"1","unit":"cup"}],"difficulty":"4","times":{"prepTime":15,"cookTime":75,"totalTime":90},"filter_settings":{"Breakfast":false,"Lunch":true,"Dinner":false,"Chicken":true,"Red meat":false,"Seafood":false,"Vegetarian":false,"Salad":false,"Vegan":false,"Soup":true,"Dessert":false,"Side":true,"Whole 30":false,"Paleo":true,"Freezer meal":false,"Keto":false,"Weeknight":false,"Weekend":true,"Gluten free":false,"Bread":true,"Dairy free":false,"White meat":false},"cuisine":"American","serves":"3","acknowledgement":"The food lab","acknowledgementLink":"https://www.amazon.com/Food-Lab-Cooking-Through-Science/dp/0393081087/ref=sr_1_2?dchild=1&keywords=the+food+lab&qid=1618170711&sr=8-2","description":"I love this recipe","showBlogPreview":false, "name":"My test short recipe","instructionImages":["","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/d138f30a-0b57-475c-a1ed-3c99307c58c7.jpg","","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/e0938290-655c-4361-96a1-c580bab2567d.jpg","file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/7b2c7e95-0d7f-4aa6-843c-c95441d099b4.jpg",""],"primaryImages":[{"cancelled":false,"width":2108,"type":"image","uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/05436971-9a5c-463e-a922-b73b9ef1e849.jpg","height":1581},{"cancelled":false,"width":2772,"type":"image","uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/0a24dd3e-6cc7-47f2-9d4b-5ffa8b3d9ca6.jpg","height":2080}]},"instructionHeights":[54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355,54.477141767229355],"averageInstructionHeight":54.47714176722935}';
			AsyncStorage.getItem.mockImplementation(() => Promise.resolve(storedRecipe));

			// console.log(recipeDetails[0])
			const rte = recipeDetails[0]; // recipeToEdit

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
			const { queryAllByTestId, getByPlaceholderText } = render(
				<Provider store={store}>
					<NewRecipe
						navigation={{
							navigate: mockNavigate,
							setParams: jest.fn(),
							setOptions: jest.fn()
						}}
						route={{
							params: { recipe_details: rte },
						}}
					/>
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));

			// details from the recipe in params are overridden by the recipe in Asyncstorage if their Id DON'T match
			expect(getByPlaceholderText("Recipe name").props.value).toStrictEqual(
				"Hypoallergenic Protein Shake - on the JSON testServer"
			);
		});

		test("it should be possible to reset an recipe being edited", async () => {
			patchRecipe.mockImplementation(() =>
				Promise.resolve({
					recipe: { id: 99 },
					instructions: [
						{ step: 1, id: 31, instruction: "Mix the ingredients in a blender pot" },
						{
							step: 2,
							id: 32,
							instruction: "Blitz! (for about a minute on max, or use your blender’s smoothie setting)",
						},
					],
				})
			);
			postRecipeImage.mockImplementation(() => Promise.resolve(true));
			postInstructionImage.mockImplementation(() => Promise.resolve(true));
			fetchIngredients.mockImplementation(() => Promise.resolve(ingredients));
			const mockNavigate = jest.fn();
			// AsyncStorage.getItem.mockImplementation((key, callback) => {
			// callback();
			// });
			AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

			// console.log(recipeDetails[0])
			const rte = recipeDetails[0]; // recipeToEdit

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
			const { queryAllByTestId, getByText, getByPlaceholderText, getByTestId, getByLabelText } = render(
				<Provider store={store}>
					<NewRecipe
						navigation={{
							navigate: mockNavigate,
							setParams: jest.fn(),
							setOptions: jest.fn()
						}}
						route={{
							params: { recipe_details: rte },
						}}
					/>
				</Provider>
			);
			await waitFor(() => expect(queryAllByTestId("activityIndicator").length).toEqual(0));
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
			fireEvent.press(getByLabelText("ingredient1 unit picker")); // open the picker
			fireEvent(getByTestId("iosPicker"), "onValueChange", "each"); // change the value
			await act(async () => await jest.runAllTimers());
			fireEvent.press(getByText("Add instruction"));
			fireEvent.changeText(getByPlaceholderText("Instructions: step 1"), "Fry the bacon");
			await act(async () => fireEvent.press(getByText("Reset")));
			expect(
				getByText("Are you sure you want to clear your changes and revert to the original recipe")
			).toBeTruthy();
			await act(async () => fireEvent.press(getByText("Yes")));

			expect(getByPlaceholderText("Recipe name").props.value).toStrictEqual(rte.recipe.name);
			expect(
				getByPlaceholderText(
					"Tell us about this recipe (optional; if you leave this section blank, it won't be displayed)"
				).props.value
			).toStrictEqual(rte.recipe.description);
			expect(getByPlaceholderText("Acknowledge your recipe's source (optional)").props.value).toStrictEqual(
				rte.recipe.acknowledgement
			);
			expect(getByPlaceholderText("Link to the original book or blog (optional)").props.value).toStrictEqual(
				rte.recipe.acknowledgement_link
			);

			expect(getByLabelText("prep time picker").props.children).toEqual(
				getTimeStringFromMinutes(rte.recipe.prep_time)
			);
			expect(getByLabelText("cook time picker").props.children).toEqual(
				getTimeStringFromMinutes(rte.recipe.cook_time)
			);
			expect(getByLabelText("total time picker").props.children).toEqual(
				getTimeStringFromMinutes(rte.recipe.total_time)
			);
		});
	});
});
