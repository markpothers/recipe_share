import { RootStateType } from "./types";

//exported ONLY for unit testing
export const initialRootState: RootStateType = {
	loggedInChef: {
		id: 0,
		e_mail: "",
		username: "",
		auth_token: "",
		image_url: "",
		is_admin: false,
		is_member: false,
	},
	allRecipeLists: {},
	allChefLists: {},
	recipe_details: {
		chef_id: 0,
		chef_username: "",
		comments: [],
		ingredient_uses: [],
		ingredients: [],
		instructions: [],
		instruction_images: [],
		likeable: true,
		make_pics: [],
		make_pics_chefs: [],
		makeable: true,
		re_shares: 0,
		recipe: {
			acknowledgement: null,
			acknowledgement_link: null,
			chef_id: 0,
			cook_time: 0,
			created_at: "",
			cuisine: "Any",
			description: "",
			difficulty: 0,
			hidden: false,
			id: 0,
			name: "",
			prep_time: 0,
			serves: "Any",
			show_blog_preview: false,
			time: 0,
			total_time: 0,
			updated_at: "",
			Breakfast: false,
			Lunch: false,
			Dinner: false,
			Chicken: false,
			"Red meat": false,
			Seafood: false,
			Vegetarian: false,
			Salad: false,
			Vegan: false,
			Soup: false,
			Dessert: false,
			Side: false,
			"Whole 30": false,
			Paleo: false,
			"Freezer meal": false,
			Keto: false,
			Weeknight: false,
			Weekend: false,
			"Gluten free": false,
			Bread: false,
			"Dairy free": false,
			"White meat": false,
		},
		recipe_images: [],
		recipe_likes: 0,
		recipe_makes: 0,
		shareable: true,
	},
	newRecipeDetails: {
		name: "",
		instructions: ["", "", "", ""],
		instructionImages: [],
		ingredients: {
			ingredient1: {
				name: "",
				quantity: "",
				unit: "Oz",
			},
		},
		difficulty: "0",
		time: "00:15",
		imageBase64: "",
		filter_settings: {
			Breakfast: false,
			Lunch: false,
			Dinner: false,
			Chicken: false,
			"Red meat": false,
			Seafood: false,
			Vegetarian: false,
			Salad: false,
			Vegan: false,
			Soup: false,
			Dessert: false,
			Side: false,
			"Whole 30": false,
			Paleo: false,
			"Freezer meal": false,
			Keto: false,
			Weeknight: false,
			Weekend: false,
			"Gluten free": false,
			Bread: false,
			"Dairy free": false,
			"White meat": false,
		},
		cuisine: "Any",
		serves: "Any",
		acknowledgement: "",
	},
	newUserDetails: {
		first_name: "",
		last_name: "",
		username: "",
		e_mail: "",
		password: "",
		password_confirmation: "",
		country: "United States",
		image_url: "",
		profile_text: "",
	},
	loginUserDetails: {
		e_mail: "",
		password: "",
	},
	chef_details: {},
	filter_settings: {
		Breakfast: false,
		Lunch: false,
		Dinner: false,
		Chicken: false,
		"Red meat": false,
		Seafood: false,
		Vegetarian: false,
		Salad: false,
		Vegan: false,
		Soup: false,
		Dessert: false,
		Side: false,
		"Whole 30": false,
		Paleo: false,
		"Freezer meal": false,
		Keto: false,
		Weeknight: false,
		Weekend: false,
		"Gluten free": false,
		Bread: false,
		"Dairy free": false,
		"White meat": false,
	},
	// filterCuisines: {
	// 	all: "Any",
	// 	chef: "Any",
	// 	chef_feed: "Any",
	// 	chef_liked: "Any",
	// 	chef_made: "Any",
	// 	global_ranks: "Any",
	// 	most_liked: "Any",
	// 	most_made: "Any"
	// },
	// serves: "Any",
	stayLoggedIn: false,
};
