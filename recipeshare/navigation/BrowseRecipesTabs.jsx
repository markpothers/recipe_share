import React from "react";
import RecipesList from "../src/recipeLists/RecipesList";
import ChefList from "../src/chefLists/ChefList";

export const NewestRecipesScreen = (props) => {
	return <RecipesList {...props} listChoice={"all"} />;
};

export const MostLikedRecipesScreen = (props) => {
	return <RecipesList {...props} listChoice={"most_liked"} />;
};

export const MostMadeRecipesScreen = (props) => {
	return <RecipesList {...props} listChoice={"most_made"} />;
};

export const NewestChefsScreen = (props) => {
	return <ChefList {...props} listChoice={"all_chefs"} />;
};

export const MostLikedChefsScreen = (props) => {
	return <ChefList {...props} listChoice={"most_liked_chefs"} />;
};

export const MostMadeChefsScreen = (props) => {
	return <ChefList {...props} listChoice={"most_made_chefs"} />;
};
