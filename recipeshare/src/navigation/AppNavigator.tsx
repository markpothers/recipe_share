import React from "react";
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";

import AppLoading from "../users/appLoading";
import CreateChef from "../users/createChef";
import LoginScreen from "../users/login";
import MainDrawerNavigator from "./MainDrawerNavigator";
import { getAuthLoaded, getAuthLoggedIn } from "../redux/selectors";
import { useAppSelector } from "../redux";

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
	const loaded = useAppSelector(getAuthLoaded);
	const loggedIn = useAppSelector(getAuthLoggedIn);

	if (loaded == true && loggedIn == true) {
		return (
			<AppNavigatorStack.Navigator initialRouteName="Home" id={undefined}>
				<HomeStack.Screen name="Home" options={{ headerShown: false }} component={MainDrawerNavigator} />
			</AppNavigatorStack.Navigator>
		);
	} else if (loaded == true && loggedIn == false) {
		return (
			<AppNavigatorStack.Navigator initialRouteName="Login" id={undefined}>
				<LoginStack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
				<LoginStack.Screen name="CreateChef" options={{ headerShown: false }} component={CreateChef} />
			</AppNavigatorStack.Navigator>
		);
	} else {
		return (
			<AppNavigatorStack.Navigator initialRouteName="AppLoadingStack" id={undefined}>
				<AppNavigatorStack.Screen name="AppLoadingStack" options={{ headerShown: false }}>
					{() => (
						<AppLoadingStack.Navigator id={undefined}>
							<AppLoadingStack.Screen name="AppLoading" options={{ headerShown: false }} component={AppLoading} />
						</AppLoadingStack.Navigator>
					)}
				</AppNavigatorStack.Screen>
			</AppNavigatorStack.Navigator>
		);
	}
};

export default AppNavigator;
