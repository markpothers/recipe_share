import React from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import RecipesList from '../recipeLists/RecipesList'
import ChefList from '../chefLists/ChefList'
import { styles } from '../../navigation/navigationStyleSheet'
import { ChefFeedScreen, MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen} from './ChefDetailsTabs'
import RecipeDetailsScreen from '../recipeDetails/recipeDetails'
// import ChefDetailsScreen from '../chefDetails/chefDetails'

const MyRecipeBookTabs = createMaterialTopTabNavigator({
  // ChefFeed: {
  //   screen: ChefFeedScreen,
  //   navigationOptions: {
  //     tabBarLabel: 'My Feed',
  //   }
  // },
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
  MyMadeRecipes: {
  screen: MyMadeRecipesScreen,
    navigationOptions: {
      tabBarLabel: "Recipes I've made",
    }
  },
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
      // width: 100,
      height: 55,
    },
    style: {
      backgroundColor: '#104e01',
      // borderStyle: 'solid',
      // borderWidth: 2,
    },
  }
})

// const ChefDetailsRecipeBookStack = createStackNavigator({
//   MyRecipeBook: MyRecipeBookTabs,
//   RecipeDetails: RecipeDetailsScreen,
//   // ChefDetails: ChefDetailsScreen
// },{
//   defaultNavigationOptions: {
//     header: null
// }
// });

export const MyRecipeBookTabsContainer = createAppContainer(MyRecipeBookTabs)