import { createStore, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import reducer from './reducer'

// import { filters } from '../dataComponents/filters'

//exported ONLY for unit testing
export const initialState = {
	loggedInChef: {
		id: "",
		username: "",
		auth_token: "",
		image_url: "",
		is_admin: false
	},
	allRecipeLists: {},
	allChefLists: {},
	recipes_details: {

	},
	newRecipeDetails: {
		name: "",
		instructions: [
			'',
			'',
			'',
			'',
		],
		instructionImages: [],
		ingredients: {
			ingredient1: {
				name: "",
				quantity: "",
				unit: "Oz"
			}
		},
		difficulty: "0",
		time: "00:15",
		imageBase64: "",
		filter_settings: {
			"Breakfast": false,
			"Lunch": false,
			"Dinner": false,
			"Chicken": false,
			"Red meat": false,
			"Seafood": false,
			"Vegetarian": false,
			"Salad": false,
			"Vegan": false,
			"Soup": false,
			"Dessert": false,
			"Side": false,
			"Whole 30": false,
			"Paleo": false,
			"Freezer meal": false,
			"Keto": false,
			"Weeknight": false,
			"Weekend": false,
			"Gluten free": false,
			"Bread": false,
			"Dairy free": false,
			"White meat": false,
		},
		cuisine: "Any",
		serves: "Any",
		acknowledgement: ""
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
		profile_text: ""
	},
	loginUserDetails: {
		e_mail: "",
		password: ""
	},
	chefs: {
		all_chefs: [],
		followed: [],
		most_liked_chefs: [],
		most_made_chefs: [],
		chef_followees: [],
		chef_followers: []
	},
	chefs_details: {},
	filter_settings: {
		"Breakfast": false,
		"Lunch": false,
		"Dinner": false,
		"Chicken": false,
		"Red meat": false,
		"Seafood": false,
		"Vegetarian": false,
		"Salad": false,
		"Vegan": false,
		"Soup": false,
		"Dessert": false,
		"Side": false,
		"Whole 30": false,
		"Paleo": false,
		"Freezer meal": false,
		"Keto": false,
		"Weeknight": false,
		"Weekend": false,
		"Gluten free": false,
		"Bread": false,
		"Dairy free": false,
		"White meat": false,
	},
	filterCuisines: {
		all: "Any",
		chef: "Any",
		chef_feed: "Any",
		chef_liked: "Any",
		chef_made: "Any",
		global_ranks: "Any",
		most_liked: "Any",
		most_made: "Any"
	},
	serves: "Any",
	stayLoggedIn: false,
}

export const middleware = compose( //exported ONLY for unit testing
	applyMiddleware(ReduxThunk)
)

export const store = createStore(reducer, initialState, middleware)
