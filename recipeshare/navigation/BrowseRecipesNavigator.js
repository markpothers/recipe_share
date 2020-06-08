import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import RecipeDetailsScreen from '../src/recipeDetails/recipeDetails'
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { NewestRecipesScreen, MostLikedRecipesScreen, MostMadeRecipesScreen, NewestChefsScreen, MostLikedChefsScreen, MostMadeChefsScreen} from './BrowseRecipesTabs'
import AppHeader from './appHeader'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

const BrowseRecipesTabs = createMaterialTopTabNavigator({
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
  // MostMadeRecipes:  {
  //   screen: MostMadeRecipesScreen,
  //   navigationOptions: {
  //     tabBarLabel: 'Most Made Recipes',
  //   }
  // },
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
  // MostMadeChefs:  {
  //   screen: MostMadeChefsScreen,
  //   navigationOptions: {
  //     tabBarLabel: 'Most Made Chefs',
  //   },
  // }
}, {
  initialLayout: {
    height: responsiveHeight(8),
    width: responsiveWidth(100)
  },
  lazy: true,
  tabBarOptions:{
    upperCaseLabel: false,
    scrollEnabled: true,
    allowFontScaling: false,
    // maxFontSizeMultiplier: 1,
    labelStyle: {
      fontSize: responsiveFontSize(2),
      color: '#fff59b'
    },
    tabStyle: {
      // width: 200,
      height: responsiveHeight(8),
      paddingTop: 0,
      paddingBottom: 0
    },
    style: {
      backgroundColor: '#104e01',
      // borderStyle: 'solid',
      // borderWidth: 2,
    },
    indicatorStyle: {
      backgroundColor: '#fff59b'
    }
  }
})

const BrowseRecipesStack = createStackNavigator({
  // NewRecipe: NewRecipeScreen,
  BrowseRecipes: BrowseRecipesTabs,
  RecipeDetails: RecipeDetailsScreen,
  NewRecipe: NewRecipeScreen,
  ChefDetails: ChefDetailsScreen
},{
  defaultNavigationOptions: {
    headerTitle: <AppHeader text={"Browse Recipes"}/>,
    // headerRight: null,
    headerStyle: {    //styles possibly needed if app-wide styling doesn't work
      backgroundColor: '#104e01',
      // borderStyle: 'solid',
      // borderWidth: 2,
      height: 50,  // cannot be less than 24 as includes space for the notification bar
    },
    headerTintColor: '#fff59b',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },

}
});

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