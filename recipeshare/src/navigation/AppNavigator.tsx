import React, { useState } from "react";
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";

import AppLoading from "../users/appLoading";
import CreateChef from "../users/createChef";
import LoginScreen from "../users/login";
import MainDrawerNavigator from "./MainDrawerNavigator";

// import MainDrawerNavigatorContainer from "./MainDrawerNavigatorContainer";

//AppNavigator
export type AppNavigatorParamList = {
	Home: undefined;
	Login: undefined;
	AppLoadingStack: undefined;
};

export type HomeStackParamList = {
	Home: undefined;
};

export type LoginStackParamList = {
	Login: { successfulRegistration?: boolean };
	CreateChef: { successfulLogin?: boolean };
};

export type LoginProps = StackScreenProps<LoginStackParamList, "Login">;
export type LoginNavigationProps = LoginProps["navigation"];
export type LoginRouteProps = LoginProps["route"];

export type AppLoadingStackParamList = {
	AppLoading: undefined;
};

export type AppLoadingProps = StackScreenProps<AppLoadingStackParamList, "AppLoading">;
export type AppLoadingNavigationProps = AppLoadingProps["navigation"];
export type AppLoadingRouteProps = AppLoadingProps["route"];

const AppNavigatorStack = createStackNavigator<AppNavigatorParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const LoginStack = createStackNavigator<LoginStackParamList>();
const AppLoadingStack = createStackNavigator<AppLoadingStackParamList>();

const AppNavigator = () => {
	const [loadedAndLoggedIn, setLoadedAndLoggedIn] = useState({ loaded: false, loggedIn: false });

	if (loadedAndLoggedIn.loaded == true && loadedAndLoggedIn.loggedIn == true) {
		return (
			<AppNavigatorStack.Navigator initialRouteName="Home">
				<HomeStack.Screen name="Home" options={{ headerShown: false }}>
					{(props) => <MainDrawerNavigator {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
				</HomeStack.Screen>
			</AppNavigatorStack.Navigator>
		);
	} else if (loadedAndLoggedIn.loaded == true && loadedAndLoggedIn.loggedIn == false) {
		return (
			<AppNavigatorStack.Navigator initialRouteName="Login">
				<LoginStack.Screen
					name="Login"
					options={{ headerShown: false }}
					// setLoadedAndLoggedIn={setLoadedAndLoggedIn}
				>
					{(props) => <LoginScreen {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
				</LoginStack.Screen>
				<LoginStack.Screen
					name="CreateChef"
					options={{ headerShown: false }}
					// setLoadedAndLoggedIn={setLoadedAndLoggedIn}
				>
					{(props) => <CreateChef {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
				</LoginStack.Screen>
			</AppNavigatorStack.Navigator>
		);
	} else {
		return (
			<AppNavigatorStack.Navigator initialRouteName="AppLoadingStack">
				<AppLoadingStack.Screen name="AppLoading" options={{ headerShown: false }}>
					{(props) => <AppLoading {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
				</AppLoadingStack.Screen>
			</AppNavigatorStack.Navigator>
		);
	}
};

export default AppNavigator;
