import React from 'react';
import RecipeDetailsScreen from '../src/recipeDetails/recipeDetails'
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { NewestRecipesScreen, MostLikedRecipesScreen, MostMadeRecipesScreen, NewestChefsScreen, MostLikedChefsScreen, MostMadeChefsScreen} from './BrowseRecipesTabs'
import AppHeader from './appHeader'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createMaterialTopTabNavigator()

const BrowseRecipesTabs = () => {
  return (
    <Tab.Navigator
      // lazy={true}
      tabBarOptions={{
        style: {
          backgroundColor:'#104e01'
        },
        labelStyle: {
          textTransform: 'none',
          fontSize: responsiveFontSize(2)
        },
        activeTintColor: '#fff59b',
        inactiveTintColor: '#fff59b',
        tabStyle: {
          width: responsiveWidth(35),
          height: responsiveHeight(9),
          paddingTop: 0,
          paddingBottom: 0,
        },
        indicatorStyle: {
          backgroundColor: '#fff59b',
        },
        scrollEnabled: true,
        showIcon: false,
        allowFontScaling: false
      }}
    >
      <Tab.Screen 
        name="Newest Recipes" 
        options={
          {headerTitle: props => <AppHeader {...props} text={"Browse Recipes"}/>}
        }
        component={NewestRecipesScreen}
      />
      <Tab.Screen 
        name="Top Recipes" 
        options={
          {headerTitle: props => <AppHeader {...props} text={"Browse Recipes"}/>}
        }
        component={MostLikedRecipesScreen}
      />
      <Tab.Screen 
        name="Newest Chefs" 
        options={
          {headerTitle: props => <AppHeader {...props} text={"Browse Recipes"}/>}
        }
        component={NewestChefsScreen}
      />
      <Tab.Screen 
        name="Top Chefs" 
        options={
          {headerTitle: props => <AppHeader {...props} text={"Browse Recipes"}/>}
        }
        component={MostLikedChefsScreen}
      />
      {/* <Tab.Screen name="MostMadeRecipes" component={MostMadeRecipesScreen}/> */}
      {/* <Tab.Screen name="MostMadeChefs" component={MostMadeChefsScreen}/> */}
    </Tab.Navigator>
  )
}


// const BrowseRecipesTabs = createMaterialTopTabNavigator({
//   NewestRecipes:  {
//     screen: NewestRecipesScreen,
//     navigationOptions: {
//       tabBarLabel: 'Newest Recipes',
//     }
//   },
//   MostLikedRecipes:  {
//     screen: MostLikedRecipesScreen,
//     navigationOptions: {
//       tabBarLabel: 'Most Liked Recipes',
//     }
//   },
//   // MostMadeRecipes:  {
//   //   screen: MostMadeRecipesScreen,
//   //   navigationOptions: {
//   //     tabBarLabel: 'Most Made Recipes',
//   //   }
//   // },
//   NewestChefs:  {
//     screen: NewestChefsScreen,
//     navigationOptions: {
//       tabBarLabel: 'Newest Chefs',
//     },
//   },
//   MostLikedChefs: {
//     screen: MostLikedChefsScreen,
//     navigationOptions: {
//       tabBarLabel: 'Most Liked Chefs',
//     },
//   },
//   // MostMadeChefs:  {
//   //   screen: MostMadeChefsScreen,
//   //   navigationOptions: {
//   //     tabBarLabel: 'Most Made Chefs',
//   //   },
//   // }
// }, {
//   initialLayout: {
//     height: responsiveHeight(8),
//     width: responsiveWidth(100)
//   },
//   lazy: true,
//   tabBarOptions:{
//     upperCaseLabel: false,
//     scrollEnabled: true,
//     allowFontScaling: false,
//     // maxFontSizeMultiplier: 1,
//     labelStyle: {
//       fontSize: responsiveFontSize(2),
//       color: '#fff59b'
//     },
//     tabStyle: {
//       // width: 200,
//       height: responsiveHeight(8),
//       paddingTop: 0,
//       paddingBottom: 0
//     },
//     style: {
//       backgroundColor: '#104e01',
//       // borderStyle: 'solid',
//       // borderWidth: 2,
//     },
//     indicatorStyle: {
//       backgroundColor: '#fff59b'
//     }
//   }
// })

const Stack = createStackNavigator()

const BrowseRecipesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="BrowseRecipes"
      headerMode="screen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#104e01',
          height: responsiveHeight(9),
        },
        headerTitleStyle: {
          marginHorizontal: 0
        },
        headerTitleContainerStyle: {
          position: 'relative',
          left: 0,
          right: 0,
        }
      }}
    >
    <Stack.Screen
      name="BrowseRecipes"
      options={{
        headerLeft: props => null,
        headerTitle: props => <AppHeader {...props} text={"Browse Recipes"}/>
      }}
      component={BrowseRecipesTabs}
    />
    <Stack.Screen
      name="RecipeDetails"
      options={{
        headerLeft: props => null,
        headerTitle: props => <AppHeader {...props} text={"Recipe Details"}/>
      }}
      component={RecipeDetailsScreen}
    />
    <Stack.Screen
      name="NewRecipe"
      options={{
        headerLeft: props => null,
        headerTitle: props => <AppHeader {...props} text={"New Recipe"}/>
      }}
      component={NewRecipeScreen}
    />
    <Stack.Screen
      name="ChefDetails"
      options={{
        headerLeft: props => null,
        headerTitle: props => <AppHeader {...props} text={"Chef Details"}/>
      }}
      component={ChefDetailsScreen}
    />
  </Stack.Navigator>
  )
}


// const BrowseRecipesStack = createStackNavigator({
//   // NewRecipe: NewRecipeScreen,
//   BrowseRecipes: BrowseRecipesTabs,
//   RecipeDetails: RecipeDetailsScreen,
//   NewRecipe: NewRecipeScreen,
//   ChefDetails: ChefDetailsScreen
// },{
//   defaultNavigationOptions: {
//     headerTitle: <AppHeader text={"Browse Recipes"}/>,
//     // headerRight: null,
//     headerStyle: {    //styles possibly needed if app-wide styling doesn't work
//       backgroundColor: '#104e01',
//       // borderStyle: 'solid',
//       // borderWidth: 2,
//       height: 50,  // cannot be less than 24 as includes space for the notification bar
//     },
//     headerTintColor: '#fff59b',
//     // headerTitleStyle: {
//     //   fontWeight: 'bold',
//     // },

// }
// });

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
