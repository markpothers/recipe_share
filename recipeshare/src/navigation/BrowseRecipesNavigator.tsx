import type { BrowseRecipesStackParamList, BrowseRecipesTabsParamList } from "./types";
import {
	MostLikedChefsScreen,
	MostLikedRecipesScreen,
	NewestChefsScreen,
	NewestRecipesScreen,
} from "./BrowseRecipesTabs";
import React, { useEffect, useState } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import AppHeader from "./appHeader";
import AppHeaderLeft from "./appHeaderLeft";
import AppHeaderRight from "./appHeaderRight";
import ChefDetailsScreen from "../chefDetails/chefDetails";
import DynamicMenu from "../dynamicMenu/DynamicMenu";
import NewRecipeScreen from "../newRecipe/newRecipe";
import RecipeDetailsScreen from "../recipeDetails/recipeDetails";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";

//eslint-disable-line no-unused-vars

const Tab = createMaterialTopTabNavigator<BrowseRecipesTabsParamList>();

const BrowseRecipesTabs = (props) => {
	const [dynamicMenuShowing, setDynamicMenuShowing] = useState(false);
	const [headerButtons] = useState([
		{
			icon: "food",
			text: "Create new recipe",
			action: () => {
				setDynamicMenuShowing(false);
				props.navigation.navigate("NewRecipe");
			},
		},
	]);

	const addDynamicMenuButtonsToHeader = () => {
		props.navigation.setOptions({
			headerRight: Object.assign(
				() => <AppHeaderRight buttonAction={setDynamicMenuShowing} accessibilityLabel={"Open action menu"} />,
				{ displayName: "HeaderRight" }
			),
		});
	};

	useEffect(() => {
		addDynamicMenuButtonsToHeader();
	});

	const renderDynamicMenu = () => {
		return <DynamicMenu buttons={headerButtons} closeDynamicMenu={() => setDynamicMenuShowing(false)} />;
	};

	return (
		<React.Fragment>
			{dynamicMenuShowing && renderDynamicMenu()}
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
				<Tab.Screen name="Newest Recipes" component={NewestRecipesScreen} />
				<Tab.Screen name="Top Recipes" component={MostLikedRecipesScreen} />
				<Tab.Screen name="Newest Chefs" component={NewestChefsScreen} />
				<Tab.Screen name="Top Chefs" component={MostLikedChefsScreen} />
				{/* <Tab.Screen name="MostMadeRecipes" component={MostMadeRecipesScreen}/> */}
				{/* <Tab.Screen name="MostMadeChefs" component={MostMadeChefsScreen}/> */}
			</Tab.Navigator>
		</React.Fragment>
	);
};

const Stack = createStackNavigator<BrowseRecipesStackParamList>();

const BrowseRecipesStack = () => {
	return (
		<Stack.Navigator
			initialRouteName="BrowseRecipes"
			screenOptions={{
				headerMode: "screen",
				headerStyle: {
					backgroundColor: "#104e01",
					height: responsiveHeight(8),
				},
				headerTitleContainerStyle: {
					marginLeft: 0,
					marginRight: 0,
				},
				headerStatusBarHeight: 0,
				headerBackTitleVisible: false,
			}}
		>
			<Stack.Screen
				name="BrowseRecipes"
				initialParams={{ title: "Browse Recipes" }}
				options={({ route }) => ({
					headerLeft: (props) => <AppHeaderLeft {...props} route={route} />,
					headerTitleAlign: "center",
					headerTitle: (props) => <AppHeader {...props} text={"Browse Recipes"} />,
				})}
				component={BrowseRecipesTabs}
			/>
			<Stack.Screen
				name="RecipeDetails"
				initialParams={{ title: "Recipe Details" }}
				options={({ route }) => ({
					headerLeft: (props) => <AppHeaderLeft {...props} route={route} />,
					headerTitleAlign: "center",
					headerTitle: (props) => <AppHeader {...props} text={"Recipe Details"} />,
				})}
				component={RecipeDetailsScreen}
			/>
			<Stack.Screen
				name="NewRecipe"
				initialParams={{ title: "Create a New Recipe" }}
				options={({ route }) => ({
					gestureEnabled: false,
					headerLeft: (props) => <AppHeaderLeft {...props} route={route} />,
					headerTitleAlign: "center",
					headerTitle: (props) => <AppHeader {...props} text={"Create a New Recipe"} />,
				})}
				component={NewRecipeScreen}
			/>
			<Stack.Screen
				name="ChefDetails"
				initialParams={{ title: "Chef Details" }}
				options={({ route }) => ({
					headerLeft: (props) => <AppHeaderLeft {...props} route={route} />,
					headerTitleAlign: "center",
					headerTitle: (props) => <AppHeader {...props} text={"Chef Details"} />,
				})}
				component={ChefDetailsScreen}
			/>
		</Stack.Navigator>
	);
};

export default BrowseRecipesStack;
