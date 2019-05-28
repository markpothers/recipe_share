import React from 'react'

const reducer = (currentState, action) => {
    switch(action.type){
        case 'STORE_ALL_RECIPES':
            // console.log("saving recipes list")
            return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: action.recipeList}}
        case 'STORE_RECIPES_DETAILS':
            // console.log("saving recipes details")
            return {...currentState, recipes_details: {...currentState.recipes_details, [action.recipeType]: action.recipesDetailsList}}
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
        case 'ADD_RECIPE_LIKE':
                return {...currentState, recipes_details: {...currentState.recipes_details, [action.listType]: {...currentState.recipes_details[action.listType], recipe_likes: [...currentState.recipes_details[action.listType].recipe_likes, action.like]}}}
        case 'LOG_IN_CHEF':
            console.log("logging in chef")
            return {...currentState, loggedInChef: {
                id: action.id,
                username: action.username
            }
            }
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
        default:
            return currentState
    }
}

export default reducer