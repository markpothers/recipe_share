import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import BrowseRecipesScreen from '../screens/BrowseRecipes';
// import MyRecipeBookScreen from '../screens/MyRecipeBook';
// import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailsScreen from '../screens/recipeDetails'
import ChefDetailsScreen from '../screens/chefDetails'
import NewRecipeScreen from '../screens/tabs/newRecipe'
import { MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen} from './MyRecipeBookTabs'

const MyRecipeBookTabs = createMaterialTopTabNavigator({
  MyRecipes: MyRecipesScreen,
  MyLikedRecipes: MyLikedRecipesScreen,
  MyMadeRecipes: MyMadeRecipesScreen,
  ChefsFollowed: ChefsFollowedScreen,
  ChefsFollowing: ChefsFollowingScreen
});

const MyRecipeBookStack = createStackNavigator({
  MyRecipeBook: MyRecipeBookTabs,
  RecipeDetails: RecipeDetailsScreen,
  NewRecipe: NewRecipeScreen,
  ChefDetails: ChefDetailsScreen
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