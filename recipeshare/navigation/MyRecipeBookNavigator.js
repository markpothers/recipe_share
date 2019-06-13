import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import BrowseRecipesScreen from '../screens/BrowseRecipes';
// import MyRecipeBookScreen from '../screens/MyRecipeBook';
// import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailsScreen from '../src/recipeDetails/recipeDetails'
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen} from './MyRecipeBookTabs'
import BrowseRecipesHeader from './BrowseRecipesHeader'

const MyRecipeBookTabs = createMaterialTopTabNavigator({
  MyRecipes: MyRecipesScreen,
  MyLikedRecipes: MyLikedRecipesScreen,
  MyMadeRecipes: MyMadeRecipesScreen,
  ChefsFollowed: ChefsFollowedScreen,
  ChefsFollowing: ChefsFollowingScreen
}, {
  initialLayout: {
    height: 50,
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
      height: 60,
    },
    style: {
      backgroundColor: '#104e01',
      borderStyle: 'solid',
      borderWidth: 2,
    },
  }
});

const MyRecipeBookStack = createStackNavigator({
  MyRecipeBook: MyRecipeBookTabs,
  RecipeDetails: RecipeDetailsScreen,
  NewRecipe: NewRecipeScreen,
  ChefDetails: ChefDetailsScreen
},{
  defaultNavigationOptions: {
    headerTitle: <BrowseRecipesHeader/>,
    headerStyle: {    //styles possibly needed if app-wide styling doesn't work
      backgroundColor: '#104e01',
      // opacity: 0.8,
      borderStyle: 'solid',
      borderWidth: 2,
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