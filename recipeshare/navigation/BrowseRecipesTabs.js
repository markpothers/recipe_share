import React from 'react';
import { Platform, Text, View, Button } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { styles } from './navigationStyleSheet'
import RecipesList from '../src/recipeLists/RecipesList'
import ChefList from '../src/chefLists/ChefList'

export class NewestRecipesScreen extends React.Component {
  render (){
    return (
        <RecipesList listChoice={"all"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class MostLikedRecipesScreen extends React.Component {
  render (){
    return (
      <RecipesList listChoice={"most_liked"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class MostMadeRecipesScreen extends React.Component {
  render (){
    return (
        <RecipesList listChoice={"most_made"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class NewestChefsScreen extends React.Component {
  render (){
    return (
        <ChefList listChoice={"all_chefs"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class MostLikedChefsScreen extends React.Component {
  render (){
    return (
        <ChefList listChoice={"most_liked_chefs"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class MostMadeChefsScreen extends React.Component {
  render (){
    return (
        <ChefList listChoice={"most_made_chefs"} respondToListScroll={this.props.screenProps}/>
    )
  }
}