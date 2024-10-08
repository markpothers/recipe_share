const ingredients = [
	{
		"created_at": "2020-09-18T01:53:00.658Z",
		"hidden": false,
		"id": 1,
		"name": "Egg",
		"updated_at": "2020-09-18T01:53:00.658Z",
	},
	{
		"created_at": "2020-09-18T01:53:00.697Z",
		"hidden": false,
		"id": 2,
		"name": "White bread, slice",
		"updated_at": "2020-09-18T01:53:00.697Z",
	},
	{
		"created_at": "2020-09-26T16:56:24.287Z",
		"hidden": false,
		"id": 3,
		"name": "Chicken breast",
		"updated_at": "2020-09-26T16:56:24.287Z",
	},
	{
		"created_at": "2020-09-26T16:56:24.334Z",
		"hidden": false,
		"id": 4,
		"name": "Broccoli",
		"updated_at": "2020-09-26T16:56:24.334Z",
	},
	{
		"created_at": "2020-09-26T16:56:24.358Z",
		"hidden": false,
		"id": 5,
		"name": "White potatoes",
		"updated_at": "2020-09-26T16:56:24.358Z",
	},
	{
		"created_at": "2020-09-26T16:56:24.376Z",
		"hidden": false,
		"id": 6,
		"name": "Butter",
		"updated_at": "2020-09-26T16:56:24.376Z",
	},
	{
		"created_at": "2020-10-03T18:56:55.145Z",
		"hidden": false,
		"id": 7,
		"name": "Seeded toast slice",
		"updated_at": "2020-10-03T18:56:55.145Z",
	},
	{
		"created_at": "2020-10-03T18:56:55.199Z",
		"hidden": false,
		"id": 8,
		"name": "Hot sauce",
		"updated_at": "2020-10-03T18:56:55.199Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.449Z",
		"hidden": false,
		"id": 9,
		"name": "Ground beef",
		"updated_at": "2020-10-04T03:56:42.449Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.466Z",
		"hidden": false,
		"id": 10,
		"name": "Onion, finely chopped",
		"updated_at": "2020-10-04T03:56:42.466Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.482Z",
		"hidden": false,
		"id": 11,
		"name": "Cooking oil",
		"updated_at": "2020-10-04T03:56:42.482Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.497Z",
		"hidden": false,
		"id": 12,
		"name": "Garlic, finely chopped",
		"updated_at": "2020-10-04T03:56:42.497Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.513Z",
		"hidden": false,
		"id": 13,
		"name": "Red pepper, diced ",
		"updated_at": "2020-10-04T03:56:42.513Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.531Z",
		"hidden": false,
		"id": 14,
		"name": "Green pepper, diced",
		"updated_at": "2020-10-04T03:56:42.531Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.546Z",
		"hidden": false,
		"id": 15,
		"name": "Kidney beans, 14 oz can",
		"updated_at": "2020-10-04T03:56:42.546Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.560Z",
		"hidden": false,
		"id": 16,
		"name": "Petite diced tomatoes, 14 oz can",
		"updated_at": "2020-10-04T03:56:42.560Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.574Z",
		"hidden": false,
		"id": 17,
		"name": "Chile spice mix",
		"updated_at": "2020-10-04T03:56:42.574Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.589Z",
		"hidden": false,
		"id": 18,
		"name": "Cayenne red pepper",
		"updated_at": "2020-10-04T03:56:42.589Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.605Z",
		"hidden": false,
		"id": 19,
		"name": "Tomato paste",
		"updated_at": "2020-10-04T03:56:42.605Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.620Z",
		"hidden": false,
		"id": 20,
		"name": "Beef stock",
		"updated_at": "2020-10-04T03:56:42.620Z",
	},
	{
		"created_at": "2020-10-04T03:56:42.637Z",
		"hidden": false,
		"id": 21,
		"name": "Corn starch",
		"updated_at": "2020-10-04T03:56:42.637Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.236Z",
		"hidden": false,
		"id": 22,
		"name": "Whole chicken, medium",
		"updated_at": "2020-10-06T03:38:08.236Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.256Z",
		"hidden": false,
		"id": 23,
		"name": "Parsley",
		"updated_at": "2020-10-06T03:38:08.256Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.271Z",
		"hidden": false,
		"id": 24,
		"name": "Thyme",
		"updated_at": "2020-10-06T03:38:08.271Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.286Z",
		"hidden": false,
		"id": 25,
		"name": "Salt",
		"updated_at": "2020-10-06T03:38:08.286Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.300Z",
		"hidden": false,
		"id": 26,
		"name": "Pepper",
		"updated_at": "2020-10-06T03:38:08.300Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.315Z",
		"hidden": false,
		"id": 27,
		"name": "Russet potato",
		"updated_at": "2020-10-06T03:38:08.315Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.331Z",
		"hidden": false,
		"id": 28,
		"name": "Carrots, large",
		"updated_at": "2020-10-06T03:38:08.331Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.345Z",
		"hidden": false,
		"id": 29,
		"name": "Parsnips",
		"updated_at": "2020-10-06T03:38:08.345Z",
	},
	{
		"created_at": "2020-10-06T03:38:08.359Z",
		"hidden": false,
		"id": 30,
		"name": "Peas",
		"updated_at": "2020-10-06T03:38:08.359Z",
	},
	{
		"created_at": "2020-10-06T03:53:14.776Z",
		"hidden": false,
		"id": 31,
		"name": "Breadcrumbs",
		"updated_at": "2020-10-06T03:53:14.776Z",
	},
	{
		"created_at": "2020-10-06T03:53:14.827Z",
		"hidden": false,
		"id": 32,
		"name": "Lemon juice",
		"updated_at": "2020-10-06T03:53:14.827Z",
	},
	{
		"created_at": "2020-10-08T03:16:37.941Z",
		"hidden": false,
		"id": 33,
		"name": "Broccoli or other green veggie (chopped)",
		"updated_at": "2020-10-08T03:16:37.941Z",
	},
	{
		"created_at": "2020-10-08T03:16:37.965Z",
		"hidden": false,
		"id": 34,
		"name": "Ginger, finely chopped",
		"updated_at": "2020-10-08T03:16:37.965Z",
	},
	{
		"created_at": "2020-10-08T03:16:37.978Z",
		"hidden": false,
		"id": 35,
		"name": "Zucchini",
		"updated_at": "2020-10-08T03:16:37.978Z",
	},
	{
		"created_at": "2020-10-08T03:16:37.992Z",
		"hidden": false,
		"id": 36,
		"name": "Red thai curry paste",
		"updated_at": "2020-10-08T03:16:37.992Z",
	},
	{
		"created_at": "2020-10-08T03:16:38.008Z",
		"hidden": false,
		"id": 37,
		"name": "Coconut milk",
		"updated_at": "2020-10-08T03:16:38.008Z",
	},
	{
		"created_at": "2020-10-08T03:16:38.022Z",
		"hidden": false,
		"id": 38,
		"name": "Fish sauce",
		"updated_at": "2020-10-08T03:16:38.022Z",
	},
	{
		"created_at": "2020-10-08T03:16:38.036Z",
		"hidden": false,
		"id": 39,
		"name": "Lime",
		"updated_at": "2020-10-08T03:16:38.036Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.175Z",
		"hidden": false,
		"id": 40,
		"name": "Sesame oil ",
		"updated_at": "2020-10-08T20:03:56.175Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.222Z",
		"hidden": false,
		"id": 41,
		"name": "Chilli to taste, finely chopped ",
		"updated_at": "2020-10-08T20:03:56.222Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.250Z",
		"hidden": false,
		"id": 42,
		"name": "Sweet pepper  one third",
		"updated_at": "2020-10-08T20:03:56.250Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.266Z",
		"hidden": false,
		"id": 43,
		"name": "Mushrooms ",
		"updated_at": "2020-10-08T20:03:56.266Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.282Z",
		"hidden": false,
		"id": 44,
		"name": "Savoy cabbage",
		"updated_at": "2020-10-08T20:03:56.282Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.298Z",
		"hidden": false,
		"id": 45,
		"name": "Beansprouts",
		"updated_at": "2020-10-08T20:03:56.298Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.325Z",
		"hidden": false,
		"id": 46,
		"name": "Soy sauce",
		"updated_at": "2020-10-08T20:03:56.325Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.344Z",
		"hidden": false,
		"id": 47,
		"name": "Hoisin sauce ",
		"updated_at": "2020-10-08T20:03:56.344Z",
	},
	{
		"created_at": "2020-10-08T20:03:56.361Z",
		"hidden": false,
		"id": 48,
		"name": "Rice noodles ",
		"updated_at": "2020-10-08T20:03:56.361Z",
	},
	{
		"created_at": "2020-10-08T20:50:46.017Z",
		"hidden": false,
		"id": 49,
		"name": "Sweet pepper ",
		"updated_at": "2020-10-08T20:50:46.017Z",
	},
	{
		"created_at": "2020-10-08T20:50:46.035Z",
		"hidden": false,
		"id": 50,
		"name": "Mushrooms chopped",
		"updated_at": "2020-10-08T20:50:46.035Z",
	},
	{
		"created_at": "2020-10-11T14:51:23.911Z",
		"hidden": false,
		"id": 51,
		"name": "Oats",
		"updated_at": "2020-10-11T14:51:23.911Z",
	},
	{
		"created_at": "2020-10-11T14:51:23.939Z",
		"hidden": false,
		"id": 52,
		"name": "Plain yoghurt",
		"updated_at": "2020-10-11T14:51:23.939Z",
	},
	{
		"created_at": "2020-10-11T14:51:23.955Z",
		"hidden": false,
		"id": 53,
		"name": "Chopped strawberries",
		"updated_at": "2020-10-11T14:51:23.955Z",
	},
	{
		"created_at": "2020-10-11T14:51:23.975Z",
		"hidden": false,
		"id": 54,
		"name": "Baking powder ",
		"updated_at": "2020-10-11T14:51:23.975Z",
	},
	{
		"created_at": "2020-10-11T14:51:23.990Z",
		"hidden": false,
		"id": 55,
		"name": "Sweetener ",
		"updated_at": "2020-10-11T14:51:23.990Z",
	},
	{
		"created_at": "2020-10-11T14:51:24.007Z",
		"hidden": false,
		"id": 56,
		"name": "Hot water",
		"updated_at": "2020-10-11T14:51:24.007Z",
	},
	{
		"created_at": "2020-10-15T03:42:37.801Z",
		"hidden": false,
		"id": 57,
		"name": "Mushrooms, chopped",
		"updated_at": "2020-10-15T03:42:37.801Z",
	}
]

module.exports = { ingredients }
