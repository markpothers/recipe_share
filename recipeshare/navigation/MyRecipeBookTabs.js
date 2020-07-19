import React from 'react';
import { Platform, Text, View, ImageBackground } from 'react-native';
// import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import RecipesList from '../src/recipeLists/RecipesList'
import ChefList from '../src/chefLists/ChefList'
import { styles } from './navigationStyleSheet'

export class ChefFeedScreen extends React.Component {
  render (){
    // console.log(this.props)
    return (
        <RecipesList {...this.props} listChoice={"chef_feed"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class MyRecipesScreen extends React.Component {
  render (){
    return (
        <RecipesList {...this.props} listChoice={"chef"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class MyLikedRecipesScreen extends React.Component {
  render (){
    return (
        <RecipesList {...this.props} listChoice={"chef_liked"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class MyMadeRecipesScreen extends React.Component {
  render (){
    return (
        <RecipesList {...this.props} listChoice={"chef_made"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class ChefsFollowedScreen extends React.Component {
  render (){
    return (
        <ChefList {...this.props} listChoice={"chef_followees"} respondToListScroll={this.props.screenProps}/>
    )
  }
}

export class ChefsFollowingScreen extends React.Component {
  render (){
    return (
        <ChefList {...this.props} listChoice={"chef_followers"} respondToListScroll={this.props.screenProps}/>
    )
  }
}