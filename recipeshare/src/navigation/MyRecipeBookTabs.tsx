import {
	ChefsFollowingMeTabProps,
	ChefsIFollowTabProps,
	MyFeedTabProps,
	MyRecipesTabProps,
	RecipesILikeTabProps,
} from "./types";

import ChefList from "../chefLists/ChefList";
import React from "react";
import RecipesList from "../recipeLists/RecipesList";

export const ChefFeedScreen = (props: MyFeedTabProps) => {
	return <RecipesList {...props} listChoice={"chef_feed"} />;
};

export const MyRecipesScreen = (props: MyRecipesTabProps) => {
	return <RecipesList {...props} listChoice={"chef"} />;
};

export const MyLikedRecipesScreen = (props: RecipesILikeTabProps) => {
	return <RecipesList {...props} listChoice={"chef_liked"} />;
};

// export const MyMadeRecipesScreen = (props: RecipesIMadeTabProps) => {
// return <RecipesList {...props} listChoice={"chef_made"} />;
// };

export const ChefsFollowedScreen = (props: ChefsIFollowTabProps) => {
	return <ChefList {...props} listChoice={"chef_followees"} />;
};

export const ChefsFollowingScreen = (props: ChefsFollowingMeTabProps) => {
	return <ChefList {...props} listChoice={"chef_followers"} />;
};
