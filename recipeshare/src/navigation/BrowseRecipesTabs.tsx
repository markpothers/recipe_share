import { NewestChefsTabProps, NewestRecipesTabProps, TopChefsTabProps, TopRecipesTabProps } from "./types";

import ChefList from "../chefLists/ChefList";
import React from "react";
import RecipesList from "../recipeLists/RecipesList";

export const NewestRecipesScreen = (props: NewestRecipesTabProps) => {
	return <RecipesList {...props} listChoice={"all"} />;
};

export const MostLikedRecipesScreen = (props: TopRecipesTabProps) => {
	return <RecipesList {...props} listChoice={"most_liked"} />;
};

// export const MostMadeRecipesScreen = (props) => {
// return <RecipesList {...props} listChoice={"most_made"} />;
// };

export const NewestChefsScreen = (props: NewestChefsTabProps) => {
	return <ChefList {...props} listChoice={"all_chefs"} />;
};

export const MostLikedChefsScreen = (props: TopChefsTabProps) => {
	return <ChefList {...props} listChoice={"most_liked_chefs"} />;
};

// export const MostMadeChefsScreen = (props) => {
// return <ChefList {...props} listChoice={"most_made_chefs"} />;
// };
