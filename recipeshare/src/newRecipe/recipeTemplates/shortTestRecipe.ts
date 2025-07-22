import uuid from "react-native-uuid";
import { NewRecipe } from "../../centralTypes";

export const shortTestRecipe = {
	recipeId: null,
	name: "My test short recipe",
	instructions: [
		{ id: uuid.v4() as string, text: "step 1", image: "" },
		{ id: uuid.v4() as string, text: "step 2", image: "" },
		{ id: uuid.v4() as string, text: "step 3", image: "" },
		{ id: uuid.v4() as string, text: "step 4", image: "" },
		{ id: uuid.v4() as string, text: "step 5", image: "" },
		{ id: uuid.v4() as string, text: "step 6", image: "" },
	],
	ingredients: [
		{
			name: "Chicken",
			quantity: "1",
			unit: "Oz",
		},
		{
			name: "Brown rice",
			quantity: "1",
			unit: "cup",
		},
		{
			name: "Pasta",
			quantity: "1",
			unit: "Cup",
		},
		{
			name: "Carrots",
			quantity: "4",
			unit: "Oz",
		},
		{
			name: "Parsley",
			quantity: "0.5",
			unit: "tsp",
		},
		{
			name: "Chocolate",
			quantity: "5",
			unit: "ml",
		},
	],
	difficulty: "4",
	times: {
		prepTime: 15,
		cookTime: 75,
		totalTime: 90,
	},
	primaryImages: [
		{
			uri: "",
		},
	],
	filter_settings: {
		Breakfast: false,
		Lunch: true,
		Dinner: false,
		Chicken: true,
		"Red meat": false,
		Seafood: false,
		Vegetarian: false,
		Salad: false,
		Vegan: false,
		Soup: true,
		Dessert: false,
		Side: true,
		"Whole 30": false,
		Paleo: true,
		"Freezer meal": false,
		Keto: false,
		Weeknight: false,
		Weekend: true,
		"Gluten free": false,
		Bread: true,
		"Dairy free": false,
		"White meat": false,
	},
	cuisine: "American",
	serves: "3",
	acknowledgement: "The food lab",
	acknowledgementLink:
		"https://www.amazon.com/Food-Lab-Cooking-Through-Science/dp/0393081087/ref=sr_1_2?dchild=1&keywords=the+food+lab&qid=1618170711&sr=8-2",
	description: "I love this recipe",
	showBlogPreview: false,
} as NewRecipe;
