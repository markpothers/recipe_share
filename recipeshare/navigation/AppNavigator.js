import React, { useState } from 'react';
// import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import LoginScreen from '../src/users/login'
import CreateChef from '../src/users/createChef'
import AppLoading from '../src/users/appLoading'
// import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//basically shows the loading screen which refers to Home or login.  Can move back and forth between login and new user.
//New user logs straight in as we
import MainDrawerNavigatorContainer from './MainDrawerNavigatorContainer'
// const LoginStack = createStackNavigator({Login: LoginScreen})
// const CreateChefStack = createStackNavigator({CreateChef: CreateChef})
// const AppLoadingStack = createStackNavigator({AppLoading: AppLoading})

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


// export default createAppContainer(createSwitchNavigator(
//   {
//     Login: LoginStack,
//     Home: MainDrawerNavigatorContainer,
//     CreateChef: CreateChefStack,
//     AppLoading: AppLoadingStack
//   },
//   {
//     initialRouteName: 'AppLoading'
//   }
// ))

// Read more at https://reactnavigation.org/docs/en/auth-flow.html
