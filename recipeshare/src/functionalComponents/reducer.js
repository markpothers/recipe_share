const reducer = (currentState, action) => {
	switch (action.type) {
		case 'STORE_RECIPE_LISTS':
			// console.log("saving recipes list")
			return { ...currentState, recipes: { ...currentState.recipes, [action.recipeType]: action.recipeList } }
		// case 'CLEAR_LISTED_RECIPES':
		//     // console.log("clearing listed recipes")
		//     return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: []}}
		case 'STORE_RECIPE_DETAILS':
			// console.log(action.recipe_details)
			// console.log(action.recipe_details)
			return { ...currentState, recipe_details: action.recipe_details }
		case 'APPEND_TO_RECIPE_LISTS':
			// console.log(currentState.recipes[action.recipeType])
			return { ...currentState, recipes: { ...currentState.recipes, [action.recipeType]: [...currentState.recipes[action.recipeType], ...action.recipeList] } }
		case 'APPEND_TO_RECIPES_DETAILS':
			// console.log("appending recipes details")
			// console.log(currentState.recipes_details[action.recipeType].comments)
			// console.log(action.recipesDetailsList)
			return {
				...currentState, recipes_details: {
					...currentState.recipes_details, [action.recipeType]: {
						comments: [...currentState.recipes_details[action.recipeType].comments, ...action.recipesDetailsList.comments],
						ingredient_uses: [...currentState.recipes_details[action.recipeType].ingredient_uses, ...action.recipesDetailsList.ingredient_uses],
						ingredients: [...currentState.recipes_details[action.recipeType].ingredients, ...action.recipesDetailsList.ingredients],
						make_pics: [...currentState.recipes_details[action.recipeType].make_pics, ...action.recipesDetailsList.make_pics],
						recipe_images: [...currentState.recipes_details[action.recipeType].recipe_images, ...action.recipesDetailsList.recipe_images],
						recipe_likes: [...currentState.recipes_details[action.recipeType].recipe_likes, ...action.recipesDetailsList.recipe_likes],
						recipe_makes: [...currentState.recipes_details[action.recipeType].recipe_makes, ...action.recipesDetailsList.recipe_makes],
						recipes: [...currentState.recipes_details[action.recipeType].recipes, ...action.recipesDetailsList.recipes],
					}
				}
			}
		case 'UPDATE_NEW_USER_DETAILS':
			return { ...currentState, newUserDetails: { ...currentState.newUserDetails, [action.parameter]: action.content } }
		case 'CLEAR_NEW_USER_DETAILS':
			// console.log("clearing new user details")
			return {
				...currentState, newUserDetails: {
					first_name: "",
					last_name: "",
					username: "",
					e_mail: "",
					password: "",
					password_confirmation: "",
					profile_text: "",
					country: "United States",
					image_url: ""
				}
			}
		case 'UPDATE_LOGIN_USER_DETAILS':
			return { ...currentState, loginUserDetails: { ...currentState.loginUserDetails, [action.parameter]: action.content } }
		case 'CLEAR_LOGIN_USER_DETAILS':
			// console.log("clearing login details")
			return {
				...currentState, loginUserDetails: {
					e_mail: "",
					password: "",
				}
			}
		case 'UPDATE_NEW_RECIPE_DETAILS':
			return { ...currentState, newRecipeDetails: { ...currentState.newRecipeDetails, [action.parameter]: action.content } }
		case 'UPDATE_RECIPE_INGREDIENTS':
			return {
				...currentState, newRecipeDetails: {
					...currentState.newRecipeDetails, ingredients: {
						...currentState.newRecipeDetails.ingredients, [action.ingredientIndex]: {
							name: action.ingredientName,
							quantity: action.ingredientQuantity,
							unit: action.ingredientUnit
						}
					}
				}
			}
		case 'STORE_ALL_INGREDIENTS':
			// console.log(action.ingredients)
			return { ...currentState, newRecipeDetails: { ...currentState.newRecipeDetails, ingredients: action.ingredients } }
		case 'CLEAR_NEW_RECIPE_DETAILS':
			// console.log("clearing new recipe details")
			return {
				...currentState, newRecipeDetails: {
					name: "",
					instructions: [
						'Pre heat oven to 450F...',
						'Dice the chicken...',
						'Add the onion...',
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
				}
			}
		// case 'LIKE_RECIPE':
		//         currentState.recipes[action.listType].find( recipe => recipe.id === recipeID)
		//     return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: {...currentState.recipes[action.listType], }}}
		case 'ADD_RECIPE_LIKE':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, recipe_likes: currentState.recipe_details.recipe_likes + 1, likeable: false } }
		case 'UPDATE_COMMENTS':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, comments: action.comments } }
		case 'REMOVE_RECIPE_LIKE':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, recipe_likes: currentState.recipe_details.recipe_likes - 1, likeable: true } }
		case 'ADD_RECIPE_MAKE':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, recipe_makes: currentState.recipe_details.recipe_makes + 1, makeable: false } }
		case 'ADD_RECIPE_SHARE':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, recipe_shares: currentState.recipe_details.recipe_shares + 1, shareable: false } }
		case 'REMOVE_RECIPE_SHARE':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, recipe_shares: currentState.recipe_details.recipe_shares - 1, shareable: true } }
		case 'ADD_MAKE_PIC':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, make_pics: [action.makePic, ...currentState.recipe_details.make_pics] } }
		case 'SAVE_REMAINING_MAKE_PICS':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, make_pics: action.makePics } }
		case 'REMOVE_RECIPE_LIKES':
			return { ...currentState, recipes_details: { ...currentState.recipes_details, [action.listType]: { ...currentState.recipes_details[action.listType], recipe_likes: action.recipe_likes } } }
		case 'STORE_NEW_FOLLOWERS':
			return { ...currentState, chefs_details: { ...currentState.chefs_details, [action.chefID]: { ...currentState.chefs_details[action.chefID], followers: action.followers, chef_followed: !currentState.chefs_details[action.chefID].chef_followed } } }
		// case 'UPDATE_CHEF_IN_LIST':
		//     return {...currentState, chefs: {...currentState.chefs, [action.chefType]: action.chefList}}
		case 'LOG_IN_CHEF':
			// console.log("logging in chef")
			return {
				...currentState, loggedInChef: {
					id: action.id,
					username: action.username,
				}
			}
		case 'UPDATE_LOGGED_IN_CHEF':
			// console.log("updating logged in chef")
			return {
				...currentState, loggedInChef: {
					id: action.id,
					username: action.username,
					auth_token: action.auth_token,
					image_url: action.image_url,
					is_admin: action.is_admin
				}
			}
		// case 'CHANGE_GLOBAL_RANKING':
		//         // console.log("switching ranking")
		//         const newValue = currentState.global_ranking == "liked" ? "made" : "liked"
		//         return {...currentState, global_ranking: newValue}
		case 'STORE_CHEF_LIST':
			// console.log("saving chefs list")
			return { ...currentState, chefs: { ...currentState.chefs, [action.chefType]: action.chefList } }
		case 'CLEAR_LISTED_CHEFS':
			// console.log("clearing listed chefs")
			return { ...currentState, chefs: { ...currentState.chefs, [action.chefType]: [] } }
		// case 'STORE_CHEFS_DETAILS':
		//     // console.log(action.chefsDetailsList)
		//     return {...currentState, chefs_details: {...currentState.chefs_details, [action.chefType]: action.chefsDetailsList}}
		case 'APPEND_TO_CHEF_LISTS':
			// console.log(currentState.chefs[action.chefType])
			return { ...currentState, chefs: { ...currentState.chefs, [action.chefType]: [...currentState.chefs[action.chefType], ...action.chefList] } }
		case 'STORE_CHEF_DETAILS':
			// console.log(action.chef_details)
			return { ...currentState, chefs_details: { ...currentState.chefs_details, [action.chefID]: action.chef_details } }
		case 'CLEAR_CHEF_DETAILS':
			// console.log(action.chef_details)
			return { ...currentState, chef_details: {} }
		case 'TOGGLE_RECIPES_LIST_FILTER_CATEGORY':
			// console.log(action.chef_details)
			return { ...currentState, filter_settings: { ...currentState.filter_settings, [action.category]: action.value } }
		case 'CLEAR_RECIPES_LIST_FILTERS':
			return { ...currentState, filter_settings: action.clearedFilters, cuisine: "Any", serves: "Any" }
		case 'SET_RECIPES_LIST_CUISINE':
			return { ...currentState, cuisine: action.cuisine }
		case 'SET_RECIPES_LIST_SERVES':
			return { ...currentState, serves: action.serves }
		case 'TOGGLE_NEW_RECIPE_FILTER_CATEGORY':
			// console.log(action.chef_details)
			return { ...currentState, newRecipeDetails: { ...currentState.newRecipeDetails, filter_settings: { ...currentState.newRecipeDetails.filter_settings, [action.category]: action.value } } }
		case 'CLEAR_NEW_RECIPE_FILTERS':
			return { ...currentState, newRecipeDetails: { ...currentState.newRecipeDetails, filter_settings: action.clearedFilters, cuisine: "Any", serves: "Any" } }
		case 'SET_NEW_RECIPE_CUISINE':
			return { ...currentState, newRecipeDetails: { ...currentState.newRecipeDetails, cuisine: action.cuisine } }
		case 'SET_NEW_RECIPE_SERVES':
			return { ...currentState, newRecipeDetails: { ...currentState.newRecipeDetails, serves: action.serves } }
		case 'STAY_LOGGED_IN':
			return { ...currentState, stayLoggedIn: action.value }
		default:
			return currentState
	}
}

export default reducer
