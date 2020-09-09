import { createStore, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import reducer from './reducer'

const initialState = {
  loggedInChef: {
    id: "",
    username: "",
    auth_token: "",
    image_url: "",
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
    instructions: [
      'Pre heat oven to 450F...',
      'Dice the chicken...',
      'Add the onion...',
      '',
    ],
    instructionImages: [],
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
    username: "pothers",
    e_mail: "markpothers@hotmail.com",
    password: "123456",
    password_confirmation: "123456",
    country: "United States",
    image_url: "",
    profile_text: "I like baking bread"
  },
  loginUserDetails: {
    e_mail: "marquis.wilderman@fisher.co",
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
