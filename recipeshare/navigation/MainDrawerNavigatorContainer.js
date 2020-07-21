import React from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, View, Platform, AsyncStorage, AppState } from 'react-native'
// import RecipeCard from './RecipeCard'
import { connect } from 'react-redux'
// import { getRecipeList } from '../fetches/getRecipeList'
// import { postRecipeLike } from '../fetches/postRecipeLike'
// import { postReShare } from '../fetches/postReShare'
// import { postRecipeMake } from '../fetches/postRecipeMake'
// import { destroyRecipeLike } from '../fetches/destroyRecipeLike'
// import { destroyReShare } from '../fetches/destroyReShare'
// import { NavigationEvents, withNavigation } from 'react-navigation'
// import { styles } from './recipeListStyleSheet'
// import { centralStyles } from '../centralStyleSheet'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import FilterMenu from '../functionalComponents/filterMenu'
// import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'
// import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
// import {createAppContainer, createStackNavigator } from 'react-navigation'
import MainDrawerNavigator from './MainDrawerNavigator'
import { runSavedActions } from '../src/functionalComponents/saveActionsLocallyForSync'

const mapStateToProps = (state) => ({
    all_Recipes: state.recipes.all,
    chef_Recipes: state.recipes.chef,
    chef_feed_Recipes: state.recipes.chef_feed,
    chef_liked_Recipes: state.recipes.chef_liked,
    chef_made_Recipes: state.recipes.chef_made,
    global_ranks_Recipes: state.recipes.global_ranks,
    most_liked_Recipes: state.recipes.most_liked,
    most_made_Recipes: state.recipes.most_made,
    recipes_details: state.recipes_details,
    loggedInChef: state.loggedInChef,
    global_ranking: state.global_ranking,
    filter_settings: state.filter_settings,
    cuisine: state.cuisine,
    serves: state.serves,
    all_chefs: state.chefs.all_chefs,
    followed_chefs: state.chefs.followed,
    loggedInChef: state.loggedInChef,
    chefs_details: state.chefs_details,
    most_liked_chefs: state.chefs.most_liked_chefs,
    most_made_chefs: state.chefs.most_made_chefs,
    chef_followees: state.chefs.chef_followees,
    chef_followers: state.chefs.chef_followers
  })

const mapDispatchToProps = {
  // changeRanking: () => {
  //   return dispatch => {
  //     dispatch({ type: 'CHANGE_GLOBAL_RANKING'})
  //   }
  // },
//   storeRecipeList: (listChoice, recipes) => {
//     return dispatch => {
//       dispatch({ type: 'STORE_RECIPE_LISTS', recipeType: listChoice, recipeList: recipes})
//       }
//   },
//   storeRecipeDetails: (listChoice, recipe_details) => {
//     return dispatch => {
//       dispatch({ type: 'STORE_RECIPES_DETAILS', recipeType: listChoice, recipesDetailsList: recipe_details})
//     }
//   },
//   appendToRecipeList: (listChoice, new_recipes) => {
//     return dispatch => {
//       dispatch({ type: 'APPEND_TO_RECIPE_LISTS', recipeType: listChoice, recipeList: new_recipes})
//       }
//   },
//   appendToRecipeDetails: (listChoice, new_recipe_details) => {
//     return dispatch => {
//       dispatch({ type: 'APPEND_TO_RECIPES_DETAILS', recipeType: listChoice, recipesDetailsList: new_recipe_details})
//     }
//   },
  // clearListedRecipes: (listChoice) => {
  //   return dispatch => {
  //     dispatch({ type: 'CLEAR_LISTED_RECIPES', recipeType: listChoice})
  //   }
  // },
}


export default connect(mapStateToProps, mapDispatchToProps)(
    class MainDrawerNavigatorContainer extends React.Component {
        static router = MainDrawerNavigator.router
        static navigationOptions = {
            header: null,
        };

        state = {

        }

        componentDidMount = async() => {
          // await runSavedActions()
          // console.log('Main Drawer Navigator mounted')
          AppState.addEventListener('change', this.handleAppStateChange)
        }

        componentWillUnmount = () => {
            // console.log('Main Drawer Navigator will unmount')
            AppState.removeEventListener('change')
        }

        handleAppStateChange = async(nextAppState) => {
          // AsyncStorage.removeItem('localRecipeDetails')
          // AsyncStorage.removeItem('localChefDetails')
          // AsyncStorage.removeItem('locallySavedListData')
          // console.log('handling app state change')
            // console.log(nextAppState)
            if (nextAppState === 'active'){
              // console.log('app coming into foreground')
            } else if (nextAppState === 'inactive' || nextAppState === 'background'){
              // console.log('app moving into background')
              // console.log(this.props.chef_Recipes)
              const dataToSave = {
                all_Recipes: this.props.all_Recipes,
                chef_Recipes: this.props.chef_Recipes,
                chef_feed_Recipes: this.props.chef_feed_Recipes,
                chef_liked_Recipes: this.props.chef_liked_Recipes,
                chef_made_Recipes: this.props.chef_made_Recipes,
                global_ranks_Recipes: this.props.global_ranks_Recipes,
                most_liked_Recipes: this.props.most_liked_Recipes,
                most_made_Recipes: this.props.most_made_Recipes,
                recipes_details: this.props.recipes_details,
                global_ranking: this.props.global_ranking,
                filter_settings: this.props.filter_settings,
                cuisine: this.props.cuisine,
                serves: this.props.serves,
                all_chefs: this.props.all_chefs,
                followed_chefs: this.props.followed,
                most_liked_chefs: this.props.most_liked_chefs,
                most_made_chefs: this.props.most_made_chefs,
                chef_followees: this.props.chef_followees,
                chef_followers: this.props.chef_followers
              }
              AsyncStorage.setItem('locallySavedListData', JSON.stringify(dataToSave), () => {
                // console.log('locallySavedListData saved')
              })
            }
          }


        render() {
            return (
                <MainDrawerNavigator navigation={this.props.navigation} setLoadedAndLoggedIn={this.props.setLoadedAndLoggedIn}/>
            )
        }
    }
)