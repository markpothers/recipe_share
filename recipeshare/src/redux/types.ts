import { Chef, Cuisine, Difficulty, FilterSettings, ListChef, ListRecipe, Recipe, RecipeIngredient, Serves } from "../centralTypes";

export type ReduxStateType = {
	root: RootStateType;
}

export type RootStateType = {
	deviceType: number;
	loggedInChef: {
		id: number;
		e_mail: string;
		username: string;
		auth_token: string;
		image_url: string;
		is_admin: boolean;
		is_member: boolean;
	},
	allRecipeLists: Record<string, ListRecipe[]>;
	allChefLists: Record<string, ListChef[]>;
	// recipes_details: Recipe;
	recipe_details: Recipe;
	newRecipeDetails: {
		name: string;
		instructions: string[];
		instructionImages: [];
		ingredients: Record<string, RecipeIngredient>;
		difficulty: Difficulty;
		time: string;
		imageBase64: string;
		filter_settings: FilterSettings;
		cuisine: Cuisine;
		serves: Serves;
		acknowledgement: string;
	},
	newUserDetails: {
		first_name: string;
		last_name: string;
		username: string;
		e_mail: string;
		password: string;
		password_confirmation: string;
		country: string;
		image_url: string;
		profile_text: string;
	},
	loginUserDetails: {
		e_mail: string;
		password: string;
	},
	// chefs: {
	// 	all_chefs: [],
	// 	followed: [],
	// 	most_liked_chefs: [],
	// 	most_made_chefs: [],
	// 	chef_followees: [],
	// 	chef_followers: []
	// },
	chef_details: Record<string, Chef>;
	filter_settings: FilterSettings;
	// filterCuisines: {
	// 	all: Cuisine;
	// 	chef: Cuisine;
	// 	chef_feed: Cuisine;
	// 	chef_liked: Cuisine;
	// 	chef_made: Cuisine;
	// 	global_ranks: Cuisine;
	// 	most_liked: Cuisine;
	// 	most_made: Cuisine;
	// },
	// serves: Serves;
	stayLoggedIn: boolean;
}

export type ParameterContent = {
	parameter: string;
	content: string;
}

export type UpdateSingleRecipeList = {
	listKey: string;
	recipeList: ListRecipe[];
} ;


export type UpdateSingleChefList = {
	listKey: string;
	chefList: ListChef[];
}

export type StoreChefDetails = {
	chefID: number;
	chef_details: Chef;
}

export type StoreNewFollowers = {
	chefID: number;
	followers: number;
}
