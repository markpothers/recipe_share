const reducer = (currentState, action) => {
	switch (action.type) {
		case 'UPDATE_SINGLE_RECIPE_LIST':
			return { ...currentState, allRecipeLists: { ...currentState.allRecipeLists, [action.listKey]: action.recipeList}}
		case 'UPDATE_ALL_RECIPE_LISTS':
			return { ...currentState, allRecipeLists: action.allRecipeLists}
		case 'UPDATE_SINGLE_CHEF_LIST':
			return { ...currentState, allChefLists: { ...currentState.allChefLists, [action.listKey]: action.chefList}}
		case 'UPDATE_ALL_CHEF_LISTS':
			return { ...currentState, allChefLists: action.allChefLists}
		case 'STORE_RECIPE_DETAILS':
			return { ...currentState, recipe_details: action.recipe_details }
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
		case 'ADD_MAKE_PIC_CHEF':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, make_pics_chefs: [action.makePicChef, ...currentState.recipe_details.make_pics_chefs] } }
		case 'SAVE_REMAINING_MAKE_PICS':
			return { ...currentState, recipe_details: { ...currentState.recipe_details, make_pics: action.makePics } }
		case 'REMOVE_RECIPE_LIKES':
			return { ...currentState, recipes_details: { ...currentState.recipes_details, [action.listType]: { ...currentState.recipes_details[action.listType], recipe_likes: action.recipe_likes } } }
		case 'STORE_NEW_FOLLOWERS':
			return { ...currentState, chefs_details: { ...currentState.chefs_details, [action.chefID]: { ...currentState.chefs_details[action.chefID], followers: action.followers, chef_followed: !currentState.chefs_details[action.chefID].chef_followed } } }
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
					e_mail: action.e_mail,
					username: action.username,
					auth_token: action.auth_token,
					image_url: action.image_url,
					is_admin: action.is_admin
				}
			}
		case 'STORE_CHEF_LIST':
			return { ...currentState, chefs: { ...currentState.chefs, [action.chefType]: action.chefList } }
		case 'CLEAR_LISTED_CHEFS':
			return { ...currentState, chefs: { ...currentState.chefs, [action.chefType]: [] } }
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
			// return { ...currentState, cuisine: action.cuisine }
			return { ...currentState, filterCuisines: { ...currentState.filterCuisines, [action.listChoice]: action.cuisine } }
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
