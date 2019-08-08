import React from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import { MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen} from './ChefDetailsTabs'

export const MyRecipeBookTabs = createMaterialTopTabNavigator({
  MyRecipes: {
    screen: MyRecipesScreen,
    navigationOptions: {
      tabBarLabel: 'My Recipes',
    }
  },
  MyLikedRecipes: {
    screen: MyLikedRecipesScreen,
    navigationOptions: {
      tabBarLabel: "Recipes I've liked",
    }
  },
  // MyMadeRecipes: {
  // screen: MyMadeRecipesScreen,
  //   navigationOptions: {
  //     tabBarLabel: "Recipes I've made",
  //   }
  // },
  ChefsFollowed: {
    screen: ChefsFollowedScreen,
    navigationOptions: {
      tabBarLabel: 'Chefs I follow',
    }
  },
  ChefsFollowing: {
    screen: ChefsFollowingScreen,
    navigationOptions: {
      tabBarLabel: 'Chefs following me',
    }
  }}, {
  initialLayout: {
    height: 55,
    width: Dimensions.get('window').width
  },
  lazy: true,
  tabBarOptions:{
    upperCaseLabel: false,
    scrollEnabled: true,
    labelStyle: {
      fontSize: 14,
      color: '#fff59b',
    },
    tabStyle: {
      height: 55,
    },
    style: {
      backgroundColor: '#104e01',
    },
  }
})

export const MyRecipeBookTabsContainer = createAppContainer(MyRecipeBookTabs)