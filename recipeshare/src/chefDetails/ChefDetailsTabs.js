import React from 'react';
import { ImageBackground } from 'react-native';
import RecipesList from '../recipeLists/RecipesList'
import ChefList from '../chefLists/ChefList'
import { styles } from '../../navigation/navigationStyleSheet'

export class ChefFeedScreen extends React.Component {
  render (){
    return (
          <RecipesList listChoice={"chef_feed"}
            {...this.props}
            parentNavigator={this.props.parentNavigator}
            queryChefID={this.props.queryChefID}
            fetchChefDetails={this.props.fetchChefDetails}
          />
    )
  }
}

export class MyRecipesScreen extends React.Component {
  render (){
    return (
          <RecipesList
            listChoice={"chef"}
            {...this.props}
              parentNavigator={this.props.parentNavigator}
            queryChefID={this.props.queryChefID}
            fetchChefDetails={this.props.fetchChefDetails}
          />
    )
  }
}

export class MyLikedRecipesScreen extends React.Component {
  render (){
    return (
          <RecipesList listChoice={"chef_liked"}
            {...this.props}
            parentNavigator={this.props.parentNavigator}
            queryChefID={this.props.queryChefID}
            fetchChefDetails={this.props.fetchChefDetails}
          />
    )
  }
}

export class MyMadeRecipesScreen extends React.Component {
  render (){
    return (
          <RecipesList listChoice={"chef_made"}
            {...this.props}
            parentNavigator={this.props.parentNavigator}
            queryChefID={this.props.queryChefID}
            fetchChefDetails={this.props.fetchChefDetails}
          />
    )
  }
}

export class ChefsFollowedScreen extends React.Component {
  render (){
    return (
          <ChefList listChoice={"chef_followees"}
            {...this.props}
            parentNavigator={this.props.parentNavigator}
            queryChefID={this.props.queryChefID}
            fetchChefDetails={this.props.fetchChefDetails}
          />
    )
  }
}

export class ChefsFollowingScreen extends React.Component {
  render (){
    // console.log(this.props)
    return (
          <ChefList listChoice={"chef_followers"}
            {...this.props}
            parentNavigator={this.props.parentNavigator}
            queryChefID={this.props.queryChefID}
            fetchChefDetails={this.props.fetchChefDetails}
            listKey={"chef_followers"}
          />
    )
  }
}