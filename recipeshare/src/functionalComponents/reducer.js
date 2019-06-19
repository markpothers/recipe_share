import React from 'react'

const reducer = (currentState, action) => {
    switch(action.type){
        case 'STORE_RECIPE_LISTS':
            // console.log("saving recipes list")
            return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: action.recipeList}}
        case 'CLEAR_LISTED_RECIPES':
            // console.log("clearing listed recipes")
            return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: []}}
        case 'STORE_RECIPE_DETAILS':
            // console.log(action.recipe_details)
            return {...currentState, recipe_details: action.recipe_details}
        case 'APPEND_TO_RECIPE_LISTS':
            // console.log(currentState.recipes[action.recipeType])
            return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: [...currentState.recipes[action.recipeType], ...action.recipeList]}}
        case 'APPEND_TO_RECIPES_DETAILS':
            // console.log("appending recipes details")
            // console.log(currentState.recipes_details[action.recipeType].comments)
            // console.log(action.recipesDetailsList)
            return {...currentState, recipes_details: {
                ...currentState.recipes_details, [action.recipeType]: {
                    comments: [...currentState.recipes_details[action.recipeType].comments, ...action.recipesDetailsList.comments],
                    ingredient_uses: [...currentState.recipes_details[action.recipeType].ingredient_uses, ...action.recipesDetailsList.ingredient_uses],
                    ingredients: [...currentState.recipes_details[action.recipeType].ingredients, ...action.recipesDetailsList.ingredients],
                    make_pics: [...currentState.recipes_details[action.recipeType].make_pics, ...action.recipesDetailsList.make_pics],
                    recipe_images: [...currentState.recipes_details[action.recipeType].recipe_images, ...action.recipesDetailsList.recipe_images],
                    recipe_likes: [...currentState.recipes_details[action.recipeType].recipe_likes, ...action.recipesDetailsList.recipe_likes],
                    recipe_makes: [...currentState.recipes_details[action.recipeType].recipe_makes, ...action.recipesDetailsList.recipe_makes],
                    recipes: [...currentState.recipes_details[action.recipeType].recipes, ...action.recipesDetailsList.recipes],
                }}}
        case 'UPDATE_NEW_USER_DETAILS':
            return {...currentState, newUserDetails: {...currentState.newUserDetails, [action.parameter]: action.content}}
        case 'CLEAR_NEW_USER_DETAILS':
            // console.log("clearing new user details")
            return {...currentState, newUserDetails: {
                first_name: "",
                last_name: "",
                username: "",
                e_mail: "",
                password: "",
                password_confirmation: "",
                country: "United States",
                imageURL: ""
              }}
        case 'UPDATE_LOGIN_USER_DETAILS':
            return {...currentState, loginUserDetails: {...currentState.loginUserDetails, [action.parameter]: action.content}}
        case 'CLEAR_LOGIN_USER_DETAILS':
            // console.log("clearing login details")
            return {...currentState, loginUserDetails: {
                e_mail: "",
                password: "",
                }}
        case 'UPDATE_NEW_RECIPE_DETAILS':
            return {...currentState, newRecipeDetails: {...currentState.newRecipeDetails, [action.parameter]: action.content}}
        case 'UPDATE_RECIPE_INGREDIENTS':
            return {...currentState, newRecipeDetails: {...currentState.newRecipeDetails, ingredients: {...currentState.newRecipeDetails.ingredients, [action.ingredientIndex]: {
                name: action.ingredientName,
                quantity: action.ingredientQuantity,
                unit: action.ingredientUnit
            }}}}
        case 'CLEAR_NEW_RECIPE_DETAILS':
            // console.log("clearing new recipe details")
            return {...currentState, newRecipeDetails: {
                name: "",
                instructions: "",
                ingredients: {
                  ingredient1 :{
                    name:"",
                    quantity: "",
                    unit: "Oz"
                  }
                },
                difficulty: "0",
                time: "00:15",
                imageBase64: ""
                }}
        case 'LIKE_RECIPE':
                currentState.recipes[action.listType].find( recipe => recipe.id === recipeID)
            return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: {...currentState.recipes[action.listType], }}}
        case 'ADD_RECIPE_LIKE':
            return {...currentState, recipe_details: {...currentState.recipe_details, recipe_likes: currentState.recipe_details.recipe_likes+1}}
        case 'REMOVE_RECIPE_LIKE':
            return {...currentState, recipe_details: {...currentState.recipe_details, recipe_likes: currentState.recipe_details.recipe_likes-1}}
        case 'ADD_RECIPE_MAKE':
            return {...currentState, recipe_details: {...currentState.recipe_details, recipe_makes: currentState.recipe_details.recipe_makes+1}}
        case 'REMOVE_RECIPE_LIKES':
            return {...currentState, recipes_details: {...currentState.recipes_details, [action.listType]: {...currentState.recipes_details[action.listType], recipe_likes: action.recipe_likes}}}
        case 'LOG_IN_CHEF':
            console.log("logging in chef")
            return {...currentState, loggedInChef: {
                id: action.id,
                username: action.username
            }}
        case 'UPDATE_LOGGED_IN_CHEF':
            // console.log("updating logged in chef")
            return {...currentState, loggedInChef: {
                id: action.id,
                username: action.username,
                auth_token: action.auth_token
                }}
        case 'CHANGE_GLOBAL_RANKING':
                // console.log("switching ranking")
                const newValue = currentState.global_ranking == "liked" ? "made" : "liked"
                return {...currentState, global_ranking: newValue}
        case 'STORE_CHEF_LIST':
            // console.log("saving chefs list")
            return {...currentState, chefs: {...currentState.chefs, [action.chefType]: action.chefList}}
        case 'CLEAR_LISTED_CHEFS':
            // console.log("clearing listed chefs")
            return {...currentState, chefs: {...currentState.chefs, [action.chefType]: []}}
        case 'STORE_CHEFS_DETAILS':
            // console.log(action.chefsDetailsList)
            return {...currentState, chefs_details: {...currentState.chefs_details, [action.chefType]: action.chefsDetailsList}}
        case 'APPEND_TO_CHEF_LISTS':
            // console.log(currentState.chefs[action.chefType])
            return {...currentState, chefs: {...currentState.chefs, [action.chefType]: [...currentState.chefs[action.chefType], ...action.chefList]}}
        case 'APPEND_TO_CHEFS_DETAILS':
            // console.log("appending chefs details")
            // console.log(currentState.chefs_details[action.chefType].comments)
            // console.log(action.chefsDetailsList)
            return {...currentState, chefs_details: {
                ...currentState.chefs_details, [action.chefType]: {
                    comments: [...currentState.chefs_details[action.chefType].comments, ...action.chefsDetailsList.comments],
                    ingredient_uses: [...currentState.chefs_details[action.chefType].ingredient_uses, ...action.chefsDetailsList.ingredient_uses],
                    ingredients: [...currentState.chefs_details[action.chefType].ingredients, ...action.chefsDetailsList.ingredients],
                    make_pics: [...currentState.chefs_details[action.chefType].make_pics, ...action.chefsDetailsList.make_pics],
                    chef_images: [...currentState.chefs_details[action.chefType].chef_images, ...action.chefsDetailsList.chef_images],
                    chef_likes: [...currentState.chefs_details[action.chefType].chef_likes, ...action.chefsDetailsList.chef_likes],
                    chef_makes: [...currentState.chefs_details[action.chefType].chef_makes, ...action.chefsDetailsList.chef_makes],
                    chefs: [...currentState.chefs_details[action.chefType].chefs, ...action.chefsDetailsList.chefs],
                }}}
                 default:
            return currentState
    }
}

export default reducer