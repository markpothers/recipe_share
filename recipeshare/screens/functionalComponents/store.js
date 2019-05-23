import { createStore, compose, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import reducer from './reducer'

const initialState = {
  recipeSearch: {
    chefID: 1
  },
  loggedInChef: {
    id: "",
    username: ""
  },
  global_ranking: "liked",
  recipes: {
    all: [],
    chef: [],
    chef_liked: [],
    chef_made: [],
    global_ranks: []
  },
  recipes_details: {
    all: [],
    chef: [],
    chef_liked: [],
    chef_made: [],
    global_ranks: []
  },
  newRecipeDetails: {
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
  },
  newUserDetails: {
    first_name: "",
    last_name: "",
    username: "",
    e_mail: "",
    password: "",
    password_confirmation: "",
    country: "United States",
    imageURL: ""
  },
  loginUserDetails: {
    e_mail: "",
    password: ""
  }
}

  const middleware = compose(
    applyMiddleware(ReduxThunk)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  export const store = createStore(reducer, initialState, middleware)
