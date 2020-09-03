import React from 'react';
import RecipesList from '../recipeLists/RecipesList'
import ChefList from '../chefLists/ChefList'

export class ChefFeedScreen extends React.Component {
	render() {
		return (
			<RecipesList listChoice={"chef_feed"}
				{...this.props}
				queryChefID={this.props.queryChefID}
			/>
		)
	}
}

export class MyRecipesScreen extends React.Component {
	render() {
		return (
			<RecipesList
				listChoice={"chef"}
				{...this.props}
				queryChefID={this.props.queryChefID}
			/>
		)
	}
}

export class MyLikedRecipesScreen extends React.Component {
	render() {
		return (
			<RecipesList listChoice={"chef_liked"}
				{...this.props}
				queryChefID={this.props.queryChefID}
			/>
		)
	}
}

export class MyMadeRecipesScreen extends React.Component {
	render() {
		return (
			<RecipesList listChoice={"chef_made"}
				{...this.props}
				queryChefID={this.props.queryChefID}
			/>
		)
	}
}

export class ChefsFollowedScreen extends React.Component {
	render() {
		return (
			<ChefList listChoice={"chef_followees"}
				{...this.props}
				queryChefID={this.props.queryChefID}
			/>
		)
	}
}

export class ChefsFollowingScreen extends React.Component {
	render() {
		// console.log(this.props)
		return (
			<ChefList listChoice={"chef_followers"}
				{...this.props}
				queryChefID={this.props.queryChefID}
				listKey={"chef_followers"}
			/>
		)
	}
}
