import React from "react";
import RecipesList from "../src/recipeLists/RecipesList";
import ChefList from "../src/chefLists/ChefList";

export const ChefFeedScreen = (props) => {
	return <RecipesList {...props} listChoice={"chef_feed"} />;
};

export const MyRecipesScreen = (props) => {
	return <RecipesList {...props} listChoice={"chef"} />;
};

export const MyLikedRecipesScreen = (props) => {
	return <RecipesList {...props} listChoice={"chef_liked"} />;
};

export const MyMadeRecipesScreen = (props) => {
	return <RecipesList {...props} listChoice={"chef_made"} />;
};

export const ChefsFollowedScreen = (props) => {
	return <ChefList {...props} listChoice={"chef_followees"} />;
};

export const ChefsFollowingScreen = (props) => {
	return <ChefList {...props} listChoice={"chef_followers"} />;
};
