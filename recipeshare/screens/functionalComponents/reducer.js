import React from 'react'

const reducer = (currentState, action) => {
    switch(action.type){
        case 'STORE_ALL_RECIPES':
            console.log("saving recipes list")
            return {...currentState, recipes: {...currentState.recipes, [action.recipeType]: action.recipeList}}
        case 'STORE_RECIPES_DETAILS':
            console.log("saving recipes details")
            return {...currentState, recipes_details: {...currentState.recipes_details, [action.recipeType]: action.recipesDetailsList}}
        case 'UPDATE_NEW_USER_DETAILS':
            return {...currentState, newUserDetails: {...currentState.newUserDetails, [action.parameter]: action.content}}
        case 'CLEAR_NEW_USER_DETAILS':
            console.log("clearing new user details")
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
            console.log("clearing login details")
            return {...currentState, loginUserDetails: {
                e_mail: "",
                password: "",
                }}
        default:
            return currentState
    }
}

export default reducer