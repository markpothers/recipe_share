import * as ImagePicker from "expo-image-picker";

export type Filters =
	| "Bread"
	| "Breakfast"
	| "Chicken"
	| "Dairy free"
	| "Dessert"
	| "Dinner"
	| "Freezer meal"
	| "Gluten free"
	| "Keto"
	| "Lunch"
	| "Paleo"
	| "Red meat"
	| "Salad"
	| "Seafood"
	| "Side"
	| "Soup"
	| "Vegan"
	| "Vegetarian"
	| "Weekend"
	| "Weeknight"
	| "White meat"
	| "Whole 30"

export type FilterSettings = {
	Bread: boolean;
	Breakfast: boolean;
	Chicken: boolean;
	"Dairy free": boolean;
	Dessert: boolean;
	Dinner: boolean;
	"Freezer meal": boolean;
	"Gluten free": boolean;
	Keto: boolean;
	Lunch: boolean;
	Paleo: boolean;
	"Red meat": boolean;
	Salad: boolean;
	Seafood: boolean;
	Side: boolean;
	Soup: boolean;
	Vegan: boolean;
	Vegetarian: boolean;
	Weekend: boolean;
	Weeknight: boolean;
	"White meat": boolean;
	"Whole 30": boolean;
}

export type Cuisine =
	| "Any"
	| "American"
	| "Brazilian"
	| "British"
	| "Cajun"
	| "Caribbean"
	| "Chinese"
	| "Cuban"
	| "Egyptian"
	| "French"
	| "German"
	| "Greek"
	| "Indian"
	| "Italian"
	| "Japanese"
	| "Korean"
	| "Mediterranean"
	| "Mexican"
	| "Moroccan"
	| "Peruvian"
	| "Polish"
	| "Portuguese"
	| "Spanish"
	| "Swedish"
	| "Thai"
	| "Turkish"
	| "Vietnamese"

export type Serves = "Any" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"

export type Difficulty = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"

export type Comment = {
	chef_id: number;
	comment: string;
	created_at: string;
	hidden: boolean;
	id: number;
	image_url: string | null;
	recipe_id: number;
	updated_at: string;
	username: string;
}

export type Instruction = {
	created_at: string;
	hidden: boolean;
	id: number;
	instruction: string;
	recipe_id: number;
	step: number;
	updated_at: string;
}

export type Ingredient = {
	created_at: string;
	hidden: boolean;
	id: number;
	name: string;
	updated_at: string;
}

export type AvailableFilters = {
	filters: Filters[];
	serves: Serves[];
	cuisines: Cuisine[];
}

export type ListChef = {
	comments_given: number;
	comments_received: number;
	country: string;
	created_at: string;
	followers: number;
	id: number;
	image_url: string | null;
	profile_text: string | null;
	recipe_count: number;
	recipe_likes_given: number;
	recipe_likes_received: number;
	recipe_makes_given: number;
	recipe_makes_received: number;
	user_chef_following: number;
	username: string;
}

export type Chef = {
	chef: {
		country: string;
		created_at: string;
		id: number;
		image_url: string | null;
		profile_text: string;
		username: string;
	},
	chef_commented: boolean;
	chef_followed: boolean;
	chef_liked: boolean;
	chef_made: boolean;
	chef_make_piced: boolean;
	chef_shared: boolean;
	comments: number;
	comments_received: number;
	followers: number;
	following: number;
	make_pics: number;
	make_pics_received: number;
	re_shares: number;
	re_shares_received: number;
	recipe_likes: number;
	recipe_likes_received: number;
	recipes: number;
}

export type IngredientUse = {
	created_at: string;
	hidden: boolean;
	id: number;
	index: number;
	ingredient_id: number;
	quantity: string;
	recipe_id: number;
	unit: string;
	updated_at: string;
}

export type InstructionImage = {
	created_at: string;
	hex: string;
	hidden: boolean;
	id: number;
	image_url: string;
	instruction_id: number;
	name: string | null;
	updated_at: string;
}

export type MakePic = {
	chef_id: number;
	comment: string | null;
	created_at: string;
	hex: string;
	hidden: boolean;
	id: number;
	image_url: string;
	recipe_id: number;
	updated_at: string;
}

export type MakePicChef = {
	id: number;
	image_url: string | null;
	profile_text: number | null;
	username: string;
}

export type RecipeImage = {
	created_at: string;
	hex: string;
	hidden: boolean;
	id: number;
	image_url: string;
	index: number;
	name: string | null;
	recipe_id: number;
	updated_at: string;
}

export type ListRecipe = {
	acknowledgement: string;
	acknowledgement_link: string;
	chef_commented: number;
	chef_id: number;
	chef_liked: number;
	chef_made: number;
	chef_shared: number;
	chefimage_url: string;
	comments_count: number;
	cook_time: number;
	created_at: string;
	cuisine: Cuisine;
	description: string;
	difficulty: number;
	id: number;
	image_url: string;
	likes_count: number;
	makes_count: number;
	name: string;
	ordering_param: string;
	prep_time: number;
	serves: Serves;
	shared_id: number | null;
	sharer_id: number | null;
	sharer_username: string | null;
	shares_count: number;
	show_blog_preview: boolean;
	time: number | null;
	total_time: number;
	updated_at: string;
	username: string;
}

export type Recipe = {
	chef_id: number;
	chef_username: string;
	comments: Comment[];
	ingredient_uses: IngredientUse[];
	ingredients: Ingredient[];
	instructions: Instruction[];
	instruction_images: InstructionImage[];
	likeable: boolean;
	make_pics: MakePic[];
	make_pics_chefs: MakePicChef[];
	makeable: boolean;
	re_shares: number;
	recipe: {
		acknowledgement: string | null;
		acknowledgement_link: string | null;
		chef_id: number;
		cook_time: number;
		created_at: string;
		cuisine: Cuisine;
		description: string;
		difficulty: number;
		hidden: boolean;
		id: number;
		name: string;
		prep_time: number;
		serves: Serves;
		show_blog_preview: boolean;
		time: number | null;
		total_time: number;
		updated_at: string;
	} & FilterSettings;
	recipe_images: RecipeImage[];
	recipe_likes: number;
	recipe_makes: number;
	shareable: boolean;
}


export type NewRecipe = {
		recipeId: number|null,
		name: string,
		instructions: string[],
		instructionImages: (string|InstructionImage)[],
		ingredients: RecipeIngredient[],
		difficulty: Difficulty,
		times: {
			prepTime: number,
			cookTime: number,
			totalTime: number,
		},
		primaryImages: ImageSource[],
		filter_settings: FilterSettings,
		cuisine: Cuisine,
		serves: Serves,
		acknowledgement: string,
		acknowledgementLink: string,
		description: string,
		showBlogPreview: boolean
	}

export type LoginChef = {
	auth_token: string;
	country: string;
	created_at: string;
	deactivated: boolean;
	e_mail: string;
	first_name: string | null;
	hex: string;
	id: number;
	image_url: string;
	is_admin: boolean;
	is_member: boolean;
	last_name: string | null;
	password_is_auto: boolean;
	profile_text: boolean;
	username: string;
}

export type Unit =
	"Oz" |
	"lb" |
	"g" |
	"tsp" |
	"tbsp" |
	"fl oz" |
	"cup" |
	"ml" |
	"each"

export type RecipeIngredient = {
	name: string;
	quantity: string;
	unit: Unit;
}

export type Follow = {
	followee_id: number;
	follower_id: number;
	hidden: boolean;
	created_at: string;
	updated_at: string;
}

export type ApiError = {
	error: boolean;
	message: string;
}

export type ImageSource = RecipeImage | ImagePicker.ImagePickerAsset
