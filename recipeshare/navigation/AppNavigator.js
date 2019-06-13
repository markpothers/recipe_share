import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import LoginScreen from '../src/users/login'
import CreateChef from '../src/users/createChef'
import AppLoading from '../src/users/appLoading'

//basically shows the loading screen which refers to Home or login.  Can move back and forth between login and new user.
//New user logs straight in as we
import MainTabNavigator from './MainTabNavigator'
const LoginStack = createStackNavigator({Login: LoginScreen})
const CreateChefStack = createStackNavigator({CreateChef: CreateChef})
const AppLoadingStack = createStackNavigator({AppLoading: AppLoading})

export default createAppContainer(createSwitchNavigator(
  {
    Login: LoginStack,
    Home: MainTabNavigator,
    CreateChef: CreateChefStack,
    AppLoading: AppLoadingStack
  },
  {
    initialRouteName: 'AppLoading'
  }
))

// Read more at https://reactnavigation.org/docs/en/auth-flow.html
