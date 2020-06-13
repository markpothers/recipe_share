import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import BrowseRecipesStack from './BrowseRecipesNavigator'
import MyRecipeBookStack from './MyRecipeBookNavigator'
import ProfileStack from './ProfileNavigator'
import Drawer from './Drawer'
import BrowseRecipesCoverStack from './BrowseRecipesCover'

export default MainDrawerNavigator = createDrawerNavigator({
  // OldBrowseRecipes: BrowseRecipesStack,
  BrowseRecipes: BrowseRecipesStack,  //BrowseRecipesCoverStack to include the cover page instead
  MyRecipeBook: MyRecipeBookStack,
  Profile: ProfileStack,
  },
  {
    initialRouteName: "Profile",
    contentComponent: Drawer
  },
  {
    tabBarOptions: {
      activeTintColor: '8d8d8d',
      inactiveTintColor: '8d8d8d',
    },
  },

);
