import React, { useState, useEffect } from "react";
import RecipeDetailsScreen from "../src/recipeDetails/recipeDetails";
import ChefDetailsScreen from "../src/chefDetails/chefDetails";
import NewRecipeScreen from "../src/newRecipe/newRecipe";
import {
	ChefFeedScreen,
	MyRecipesScreen,
	MyLikedRecipesScreen,
	ChefsFollowedScreen,
	ChefsFollowingScreen,
} from "./MyRecipeBookTabs";
import AppHeader from "./appHeader";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
// import { centralStyles } from "../src/centralStyleSheet"; //eslint-disable-line no-unused-vars
import DynamicMenu from "../src/dynamicMenu/DynamicMenu";
import AppHeaderRight from "./appHeaderRight";
import AppHeaderLeft from "./appHeaderLeft";

const Tab = createMaterialTopTabNavigator();

const MyRecipeBookTabs = (props) => {
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
			headerRight: Object.assign(() => <AppHeaderRight buttonAction={setDynamicMenuShowing} accessibilityLabel={"Open action menu"} />, {
				displayName: "HeaderRight",
			}),
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
					lazy: true
				})}
			>
				<Tab.Screen name="My Feed" component={ChefFeedScreen} />
				<Tab.Screen name="My Recipes" component={MyRecipesScreen} />
				<Tab.Screen name="Recipes I Like" component={MyLikedRecipesScreen} />
				{/* <Tab.Screen
					name="MyMadeRecipes"
					component={MyMadeRecipesScreen}
				/> */}
				<Tab.Screen name="Chefs I Follow" component={ChefsFollowedScreen} />
				<Tab.Screen name="Chefs Following Me" component={ChefsFollowingScreen} />
				{/* <Tab.Screen name="MostMadeChefs" component={MostMadeChefsScreen}/> */}
			</Tab.Navigator>
		</React.Fragment>
	);
};

const Stack = createStackNavigator();

const MyRecipeBookStack = () => {
	return (
		<Stack.Navigator
			initialRouteName="MyRecipeBook"
			// initialRouteName="NewRecipe"
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
				headerBackTitleVisible: false
			}}
		>
			<Stack.Screen
				name="MyRecipeBook"
				initialParams={{ title: "My Recipe Book" }}
				options={({ route }) => ({
					headerLeft: (props) => <AppHeaderLeft {...props} route={route} />,
					headerTitleAlign: "center",
					headerTitle: (props) => <AppHeader {...props} text={"My Recipe Book"} />,
				})}
				component={MyRecipeBookTabs}
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

export default MyRecipeBookStack;
