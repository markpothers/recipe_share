import React from 'react';
import { ImageBackground } from 'react-native';
import RecipesList from '../recipeLists/RecipesList'
import ChefList from '../chefLists/ChefList'
import { styles } from '../../navigation/navigationStyleSheet'

export class ChefFeedScreen extends React.Component {
  render (){
    return (
          <RecipesList listChoice={"chef_feed"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}
            fetchChefDetails={this.props.screenProps.fetchChefDetails}
          />
    )
  }
}

export class MyRecipesScreen extends React.Component {
  render (){
    return (
          <RecipesList
            listChoice={"chef"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}
            fetchChefDetails={this.props.screenProps.fetchChefDetails}
          />
    )
  }
}

export class MyLikedRecipesScreen extends React.Component {
  render (){
    return (
          <RecipesList listChoice={"chef_liked"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}
            fetchChefDetails={this.props.screenProps.fetchChefDetails}
          />
    )
  }
}

export class MyMadeRecipesScreen extends React.Component {
  render (){
    return (
          <RecipesList listChoice={"chef_made"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}
            fetchChefDetails={this.props.screenProps.fetchChefDetails}
          />
    )
  }
}

export class ChefsFollowedScreen extends React.Component {
  render (){
    return (
          <ChefList listChoice={"chef_followees"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}
            fetchChefDetails={this.props.screenProps.fetchChefDetails}
          />
    )
  }
}

export class ChefsFollowingScreen extends React.Component {
  render (){
    // console.log(this.props.screenProps)
    return (
          <ChefList listChoice={"chef_followers"}
            parentNavigator={this.props.screenProps.parentNavigator}
            queryChefID={this.props.screenProps.queryChefID}
            fetchChefDetails={this.props.screenProps.fetchChefDetails}
          />
    )
  }
}