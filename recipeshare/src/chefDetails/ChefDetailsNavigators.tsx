import React from "react";
import { MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen } from "./ChefDetailsTabs"; //eslint-disable-line no-unused-vars
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

type OwnProps = {
	queryChefID: number;
	fetchChefDetails: () => Promise<void> | void;
};

const Tab = createMaterialTopTabNavigator();

export const ChefRecipeBookTabs = (props: OwnProps) => {
	const fwdProps = props;
	return (
		<Tab.Navigator
			screenOptions={() => ({
				tabBarActiveTintColor: "#fff59b",
				tabBarInactiveTintColor: "#fff59b",
				tabBarIndicatorStyle: {
					backgroundColor: "#fff59b",
				},
				tabBarScrollEnabled: true,
				tabBarShowIcon: false,
				tabBarAllowFontScaling: false,
				tabBarStyle: {
					backgroundColor: "#104e01",
				},
				tabBarLabelStyle: {
					textTransform: "none",
					fontSize: responsiveFontSize(2),
				},
				tabBarItemStyle: {
					width: responsiveWidth(35),
					height: responsiveHeight(8),
				},
				lazy: true,
			})}
		>
			{/* <Tab.Screen
				name="My Feed"
			>
				{props => <ChefFeedScreen {...props} queryChefID={fwdProps.queryChefID} />}
			</Tab.Screen> */}
			<Tab.Screen
				name="My Recipes"
			>
				{(screenProps) => <MyRecipesScreen {...screenProps} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
			<Tab.Screen
				name="Recipes I like"
			>
				{(screenProps) => <MyLikedRecipesScreen {...screenProps} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
			{/* <Tab.Screen
				name="Recipes I've made"
			>
				{props => <MyMadeRecipesScreen {...props} queryChefID={fwdProps.queryChefID} />}
			</Tab.Screen> */}
			<Tab.Screen
				name="Chefs I Follow"
			>
				{(screenProps) => <ChefsFollowedScreen {...screenProps} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
			<Tab.Screen
				name="Chefs Following Me"
			>
				{(screenProps) => <ChefsFollowingScreen {...screenProps} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
};
