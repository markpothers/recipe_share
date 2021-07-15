import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions' //eslint-disable-line no-unused-vars

export const shortTestRecipe = {
	alertPopUpShowing: false,
	errors: [],
	newRecipeDetails: {
		recipeId: null,
		name: "My test short recipe",
		instructions: [
			'step 1', 'step 2', 'step 3', 'step 4', 'step 5', 'step 6'
		],
		instructionImages: [
			"",//"file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/9e1a154e-78a5-43b4-be24-44a76d2bc1cd.jpg",
			"",
			"",
			"",//"file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/1b283d05-c6db-47ac-87fc-d90f5b9e7f3b.jpg",
			"",//"file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/4e975761-8632-48eb-834d-8eac1c7a726f.jpg",
			"",//"file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/ce5af60e-7f85-4b67-bc17-95450cbda5b0.jpg"
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
			{ uri: '' }
			// {
			// 	"cancelled": false,
			// 	"height": 2250,
			// 	"type": "image",
			// 	"uri": "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/0219c735-ea10-4437-aba0-8de39d4121e9.jpg",
			// 	"width": 3000,
			// },
			// {
			// 	"cancelled": false,
			// 	"height": 2250,
			// 	"type": "image",
			// 	"uri": "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540pothers%252Frecipe-share/ImagePicker/9f82b809-276c-40bb-8a7e-55a9b650a49d.jpg",
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
	},
	instructionHeights: [
		responsiveHeight(6.5),
		responsiveHeight(6.5),
		responsiveHeight(6.5),
		responsiveHeight(6.5),
		responsiveHeight(6.5),
		responsiveHeight(6.5)
	],
	averageInstructionHeight: responsiveHeight(6.5),
}
