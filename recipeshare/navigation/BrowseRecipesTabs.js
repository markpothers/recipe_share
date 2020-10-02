import React from 'react';
// import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import RecipesList from '../src/recipeLists/RecipesList'
import ChefList from '../src/chefLists/ChefList'

export class NewestRecipesScreen extends React.Component {
	render() {
		return (
			<RecipesList {...this.props} listChoice={"all"} respondToListScroll={this.props.screenProps} />
		)
	}
}

export class MostLikedRecipesScreen extends React.Component {
	render() {
		return (
			<RecipesList {...this.props} listChoice={"most_liked"} respondToListScroll={this.props.screenProps} />
		)
	}
}

export class MostMadeRecipesScreen extends React.Component {
	render() {
		return (
			<RecipesList {...this.props} listChoice={"most_made"} respondToListScroll={this.props.screenProps} />
		)
	}
}

export class NewestChefsScreen extends React.Component {
	render() {
		return (
			<ChefList {...this.props} listChoice={"all_chefs"} respondToListScroll={this.props.screenProps} />
		)
	}
}

export class MostLikedChefsScreen extends React.Component {
	render() {
		return (
			<ChefList {...this.props} listChoice={"most_liked_chefs"} respondToListScroll={this.props.screenProps} />
		)
	}
}

export class MostMadeChefsScreen extends React.Component {
	render() {
		return (
			<ChefList {...this.props} listChoice={"most_made_chefs"} respondToListScroll={this.props.screenProps} />
		)
	}
}
