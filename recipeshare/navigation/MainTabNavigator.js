import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BrowseRecipesStack from './BrowseRecipesNavigator'
import MyRecipeBookStack from './MyRecipeBookNavigator'
import ProfileStack from './ProfileNavigator'
import BrowseRecipesCoverStack from './BrowseRecipesCover'

export default createDrawerNavigator({
  BrowseRecipes: BrowseRecipesCoverStack,
  MyRecipeBook: MyRecipeBookStack,
  Profile: ProfileStack,
  },
  {
    initialRouteName: "BrowseRecipes",  //not sure why the default values don't work.  maybe explore later
      // defaultNavigationOptions: {
      //   headerStyle: {
      //     backgroundColor: '#f4511e',
      //   },
      //   headerTintColor: '#fff',
      //   headerTitleStyle: {
      //       fontWeight: 'bold',
      //   }
      // }
  },
  {
    tabBarOptions: {
      activeTintColor: '8d8d8d',
      inactiveTintColor: '8d8d8d',
    },
  }
);
