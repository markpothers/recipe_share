import React from 'react';
import { Platform, Button, Text, Dimensions } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BrowseRecipesScreen from '../screens/BrowseRecipes';
import MyRecipeBookScreen from '../screens/MyRecipeBook';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailsScreen from '../screens/recipeDetails'
import ChefDetailsScreen from '../screens/chefDetails'
import NewRecipeScreen from '../screens/tabs/newRecipe'
import { ChefFeedScreen, NewestRecipesScreen, MostLikedRecipesScreen, MostMadeRecipesScreen, NewestChefsScreen, MostLikedChefsScreen, MostMadeChefsScreen} from './BrowseRecipesTabs'
import { styles } from '../screens/functionalComponents/RSStyleSheet'
import BrowseRecipesHeader from '../screens/functionalComponents/BrowseRecipesHeader'

const BrowseRecipesTabs = createMaterialTopTabNavigator({
  ChefFeed: {
    screen: ChefFeedScreen,
    navigationOptions: {
      tabBarLabel: 'My Feed',
    }
  },
  NewestRecipes:  {
    screen: NewestRecipesScreen,
    navigationOptions: {
      tabBarLabel: 'Newest Recipes',
    }
  },
  MostLikedRecipes:  {
    screen: MostLikedRecipesScreen,
    navigationOptions: {
      tabBarLabel: 'Most Liked Recipes',
    }
  },
  MostMadeRecipes:  {
    screen: MostMadeRecipesScreen,
    navigationOptions: {
      tabBarLabel: 'Most Made Recipes',
    }
  },
  NewestChefs:  {
    screen: NewestChefsScreen,
    navigationOptions: {
      tabBarLabel: 'Newest Chefs',
    },
  },
  MostLikedChefs: {
    screen: MostLikedChefsScreen,
    navigationOptions: {
      tabBarLabel: 'Most Liked Chefs',
    },
  },
  MostMadeChefs:  {
    screen: MostMadeChefsScreen,
    navigationOptions: {
      tabBarLabel: 'Most Made Chefs',
    },
  }
}, {
  initialLayout: {
    height: 50,
    width: Dimensions.get('window').width
  },
  tabBarOptions:{
    upperCaseLabel: false,
    scrollEnabled: true,
    labelStyle: {
      // fontSize: 14,
    },
    tabStyle: {
      // width: 150,
    },
    style: {
      // backgroundColor: 'green',
    },
  }
})

const BrowseRecipesStack = createStackNavigator({
  NewRecipe: NewRecipeScreen,
  BrowseRecipes: BrowseRecipesTabs,
  RecipeDetails: RecipeDetailsScreen,
  NewRecipe: NewRecipeScreen,
  ChefDetails: ChefDetailsScreen
},{
  defaultNavigationOptions: {
    headerTitle: <BrowseRecipesHeader/>,
    headerStyle: {    //styles possibly needed if app-wide styling doesn't work
      backgroundColor: '#104e01',
      opacity: 0.8
    },
    headerTintColor: '#fff59b',
    headerTitleStyle: {
      fontWeight: 'bold',
    },

}
}
);

// BrowseRecipesStack.navigationOptions = {
//   tabBarLabel: 'Browse recipes',
//   tabBarIcon: ({ focused }) => (
//     <Icon size={25} color="#8d8d8d"
//       focused={focused}
//       name={
//         Platform.OS === 'ios'
//           ? `ios-information-circle${focused ? '' : '-outline'}`
//           : 'food-variant'
//       }
//     />
//   ),
// };

export default BrowseRecipesStack