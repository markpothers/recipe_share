import React from "react";
import type { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import RecipesList from "../recipeLists/RecipesList";
import ChefList from "../chefLists/ChefList";

type ChefDetailsTabParamList = {
	"My Feed": undefined;
	"My Recipes": undefined;
	"Recipes I like": undefined;
	"Recipes I've made": undefined;
	"Chefs I Follow": undefined;
	"Chefs Following Me": undefined;
};

type OwnProps = {
	queryChefID: number;
	fetchChefDetails?: () => Promise<void> | void;
} & MaterialTopTabScreenProps<ChefDetailsTabParamList, keyof ChefDetailsTabParamList>;

export const ChefFeedScreen = (props: OwnProps) => {
	return <RecipesList listChoice={"chef_feed"} {...props} queryChefID={props.queryChefID} />;
};

export const MyRecipesScreen = (props: OwnProps) => {
	return <RecipesList listChoice={"chef"} {...props} queryChefID={props.queryChefID} />;
};

export const MyLikedRecipesScreen = (props: OwnProps) => {
	return <RecipesList listChoice={"chef_liked"} {...props} queryChefID={props.queryChefID} />;
};

export const MyMadeRecipesScreen = (props: OwnProps) => {
	return <RecipesList listChoice={"chef_made"} {...props} queryChefID={props.queryChefID} />;
};

export const ChefsFollowedScreen = (props: OwnProps) => {
	return <ChefList listChoice={"chef_followees"} {...props} queryChefID={props.queryChefID} />;
};

export const ChefsFollowingScreen = (props: OwnProps) => {
	return (
		<ChefList
			listChoice={"chef_followers"}
			{...props}
			queryChefID={props.queryChefID}
		/>
	);
};
