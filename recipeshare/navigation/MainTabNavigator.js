import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BrowseRecipesScreen from '../screens/BrowseRecipes';
import MyRecipeBookScreen from '../screens/MyRecipeBook';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailsScreen from '../screens/recipeDetails'
import NewRecipeScreen from '../screens/tabs/newRecipe'

const BrowseRecipesStack = createStackNavigator({
  BrowseRecipes: BrowseRecipesScreen,
  RecipeDetails: RecipeDetailsScreen,
  NewRecipe: NewRecipeScreen
});

BrowseRecipesStack.navigationOptions = {
  tabBarLabel: 'Browse recipes',
  tabBarIcon: ({ focused }) => (
    <Icon size={25} color="#8d8d8d"
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'food-variant'
      }
    />
  ),
};

const MyRecipeBookStack = createStackNavigator({
  MyRecipeBook: MyRecipeBookScreen,
  RecipeDetails: RecipeDetailsScreen,
  NewRecipe: NewRecipeScreen
});

MyRecipeBookStack.navigationOptions = {
  tabBarLabel: 'My recipe book',
  tabBarIcon: ({ focused }) => (
    <Icon size={25} color="#8d8d8d"
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'book-open-page-variant'
      }
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <Icon  size={25} color="#8d8d8d"
    focused={focused}
    name={
      Platform.OS === 'ios'
        ? `ios-information-circle${focused ? '' : '-outline'}`
        : 'account'
    }
    />
  ),
};

export default createBottomTabNavigator({
  BrowseRecipes: BrowseRecipesStack,
  MyRecipeBook: MyRecipeBookStack,
  // Profile: ProfileStack,
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
