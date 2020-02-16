import { createStore, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import reducer from './reducer'

const initialState = {
  loggedInChef: {
    id: "",
    username: "",
    auth_token: "",
    imageURL: "",
    is_admin: false
  },
  recipes: {
    all: [],
    chef: [],
    chef_feed: [],
    chef_liked: [],
    chef_made: [],
    global_ranks: [],
    most_liked: [],
    most_made: []
  },
  recipes_details: {

  },
  newRecipeDetails: {
    name: "",
    instructions: ['test', 'test2'],
    ingredients: {
      ingredient1 :{
        name:"",
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
    imageURL: "",
    profile_text: ""
  },
  loginUserDetails: {
    e_mail: "markpothers@hotmail.com",
    password: "123456"
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
  cuisine: "Any",
  serves: "Any",
  stayLoggedIn: false,
}

  const middleware = compose(
    applyMiddleware(ReduxThunk)
  )

  export const store = createStore(reducer, initialState, middleware)
