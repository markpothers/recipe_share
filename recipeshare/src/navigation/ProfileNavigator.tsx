import { ProfileCoverProps, ProfileStackParamList } from "./types";

import About from "../about/about";
import AppHeader from "./appHeader";
import AppHeaderLeft from "./appHeaderLeft";
import NewRecipeScreen from "../newRecipe/newRecipe";
import Profile from "../profile/profile";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { responsiveHeight } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

const Stack = createStackNavigator<ProfileStackParamList>();

type OwnProps = {
	setLoadedAndLoggedIn: (args: { loaded: boolean; loggedIn: boolean }) => void;
};

const ProfileStack = (props: ProfileCoverProps & OwnProps) => {
	const fwdProps = props;
	return (
		<Stack.Navigator
			initialRouteName="Profile"
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
				name="Profile"
				initialParams={{ title: "Profile" }}
				options={({ route }) => ({
					headerLeft: (props) => <AppHeaderLeft {...props} route={route} />,
					headerTitleAlign: "center",
					headerTitle: (props) => <AppHeader {...props} text={"Profile"} />,
				})}
			>
				{(props) => <Profile {...props} setLoadedAndLoggedIn={fwdProps.setLoadedAndLoggedIn} />}
			</Stack.Screen>
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
				name="About"
				initialParams={{ title: "About" }}
				options={({ route }) => ({
					headerLeft: (props) => <AppHeaderLeft {...props} route={route} />,
					headerTitleAlign: "center",
					headerTitle: (props) => <AppHeader {...props} text={"About"} />,
				})}
				component={About}
			/>
		</Stack.Navigator>
	);
};

export default ProfileStack;
