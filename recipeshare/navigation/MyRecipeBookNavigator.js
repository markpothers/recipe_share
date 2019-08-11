import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import BrowseRecipesScreen from '../screens/BrowseRecipes';
// import MyRecipeBookScreen from '../screens/MyRecipeBook';
import RecipeDetailsScreen from '../src/recipeDetails/recipeDetails'
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { ChefFeedScreen, MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen} from './MyRecipeBookTabs'
import AppHeader from './appHeader'

const MyRecipeBookTabs = createMaterialTopTabNavigator({
  ChefFeed: {
    screen: ChefFeedScreen,
    navigationOptions: {
      tabBarLabel: 'My Feed',
    }
  },
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
      // width: 200,
      height: 55,
    },
    style: {
      backgroundColor: '#104e01',
      // borderStyle: 'solid',
      // borderWidth: 2,
    },
  }
})

const MyRecipeBookStack = createStackNavigator({
  MyRecipeBook: MyRecipeBookTabs,
  RecipeDetails: RecipeDetailsScreen,
  NewRecipe: NewRecipeScreen,
  ChefDetails: ChefDetailsScreen
},{
  defaultNavigationOptions: {
    headerTitle: <AppHeader text={"My Recipe Book"}/>,
    headerStyle: {    //styles possibly needed if app-wide styling doesn't work
      backgroundColor: '#104e01',
      // borderStyle: 'solid',
      // borderWidth: 2,
      height: 60,  // cannot be less than 24 as includes space for the notification bar
    },
    headerTintColor: '#fff59b',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },

}
});

// MyRecipeBookStack.navigationOptions = {
//   tabBarLabel: 'My recipe book',
//   tabBarIcon: ({ focused }) => (
//     <Icon size={25} color="#8d8d8d"
//       focused={focused}
//       name={
//         Platform.OS === 'ios'
//           ? `ios-information-circle${focused ? '' : '-outline'}`
//           : 'book-open-page-variant'
//       }
//     />
//   ),
// };

export default MyRecipeBookStack