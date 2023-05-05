import { NewRecipe } from "../../centralTypes"

export const shortTestRecipe = {
		recipeId: null,
		name: "My test short recipe",
		instructions: [
			"step 1", "step 2", "step 3", "step 4", "step 5", "step 6"
		],
		instructionImages: [
			"", "", "", "", "", ""
			// "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/1a15978f-0614-44c8-960c-0987bd52a612.jpg",
			// "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/f23dd50c-2b64-4e4c-8567-550142d66d60.jpg",
			// "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/3869756f-3ae0-490d-8b98-e6d78b6a0667.jpg",
			// "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/1a15978f-0614-44c8-960c-0987bd52a612.jpg",
			// "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/f23dd50c-2b64-4e4c-8567-550142d66d60.jpg",
			// "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/3869756f-3ae0-490d-8b98-e6d78b6a0667.jpg",
		],
		ingredients: [
			{
				name: "Chicken",
				quantity: "1",
				unit: "Oz"
			},
			{
				name: "Brown rice",
				quantity: "1",
				unit: "cup"
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
				"uri": "",
			},
			// {
			// 	"canceled": false,
			// 	"height": 2209,
			// 	"type": "image",
			// 	"uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/1a15978f-0614-44c8-960c-0987bd52a612.jpg",
			// 	"width": 2945,
			// },
			// {
			// 	"canceled": false,
			// 	"height": 1970,
			// 	"type": "image",
			// 	"uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/f23dd50c-2b64-4e4c-8567-550142d66d60.jpg",
			// 	"width": 2626,
			// },
			// {
			// 	"canceled": false,
			// 	"height": 2250,
			// 	"type": "image",
			// 	"uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/3869756f-3ae0-490d-8b98-e6d78b6a0667.jpg",
			// 	"width": 3000,
			// }
		],
		filter_settings: {
			"Breakfast": false,
			"Lunch": true,
			"Dinner": false,
			"Chicken": true,
			"Red meat": false,
			"Seafood": false,
			"Vegetarian": false,
			"Salad": false,
			"Vegan": false,
			"Soup": true,
			"Dessert": false,
			"Side": true,
			"Whole 30": false,
			"Paleo": true,
			"Freezer meal": false,
			"Keto": false,
			"Weeknight": false,
			"Weekend": true,
			"Gluten free": false,
			"Bread": true,
			"Dairy free": false,
			"White meat": false,
		},
		cuisine: "American",
		serves: "3",
		acknowledgement: "The food lab",
		acknowledgementLink: "https://www.amazon.com/Food-Lab-Cooking-Through-Science/dp/0393081087/ref=sr_1_2?dchild=1&keywords=the+food+lab&qid=1618170711&sr=8-2",
		description: "I love this recipe",
		showBlogPreview: false
	} as NewRecipe
