import React, { useState } from "react";
import LoginScreen from "../src/users/login"
import CreateChef from "../src/users/createChef"
import AppLoading from "../src/users/appLoading"
import { createStackNavigator } from "@react-navigation/stack";
import MainDrawerNavigatorContainer from "./MainDrawerNavigatorContainer"

const Stack = createStackNavigator()

const AppNavigator = () => {
	const [loadedAndLoggedIn, setLoadedAndLoggedIn] = useState({ loaded: false, loggedIn: false })

	if (loadedAndLoggedIn.loaded == true && loadedAndLoggedIn.loggedIn == true) {
		return (
			<Stack.Navigator
				initialRouteName="Home"
			>
				<Stack.Screen
					name="Home"
					options={
						{ headerShown: false }
					}
				>
					{props => <MainDrawerNavigatorContainer {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
				</Stack.Screen>
			</Stack.Navigator>
		)
	} else if (loadedAndLoggedIn.loaded == true && loadedAndLoggedIn.loggedIn == false) {
		return (
			<Stack.Navigator
				initialRouteName="Login"
			>
				<Stack.Screen
					name="Login"
					options={
						{ headerShown: false }
					}
					setLoadedAndLoggedIn={setLoadedAndLoggedIn}
				>
					{props => <LoginScreen {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}

				</Stack.Screen>
				<Stack.Screen
					name="CreateChef"
					options={
						{ headerShown: false }
					}
					setLoadedAndLoggedIn={setLoadedAndLoggedIn}
				>
					{props => <CreateChef {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
				</Stack.Screen>
			</Stack.Navigator>
		)
	} else {
		return (
			<Stack.Navigator
				initialRouteName="AppLoadingStack"
			>
				<Stack.Screen
					name="AppLoading"
					options={
						{ headerShown: false }
					}
				>
					{props => <AppLoading {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
				</Stack.Screen>
			</Stack.Navigator>
		)
	}
}

export default AppNavigator
