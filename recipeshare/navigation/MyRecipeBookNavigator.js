import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native'
// import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import RecipeDetailsScreen from '../src/recipeDetails/recipeDetails'
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { ChefFeedScreen, MyRecipesScreen, MyLikedRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen } from './MyRecipeBookTabs'
import AppHeader from './appHeader'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import { centralStyles } from '../src/centralStyleSheet' //eslint-disable-line no-unused-vars
import DynamicMenu from '../src/dynamicMenu/DynamicMenu.js'
import AppHeaderRight from './appHeaderRight'

const Tab = createMaterialTopTabNavigator()

const MyRecipeBookTabs = (props) => {
	const [dynamicMenuShowing, setDynamicMenuShowing] = useState(false)
	const [headerButtons] = useState(
		[
			{
				icon: "food",
				text: "Create new recipe",
				action: (() => {
					setDynamicMenuShowing(false)
					props.navigation.navigate('NewRecipe')
				})
			}
		]
	)

	const addDynamicMenuButtonsToHeader = () => {
		props.navigation.setOptions({
			headerRight: Object.assign(() => <AppHeaderRight buttonAction={setDynamicMenuShowing}/>, { displayName: 'HeaderRight' }),
		});
	}

	useEffect(() => {
		addDynamicMenuButtonsToHeader()
	})

	const renderDynamicMenu = () => {
		return (
			<DynamicMenu
				buttons={headerButtons}
				closeDynamicMenu={() => setDynamicMenuShowing(false)}
			/>
		)
	}

	return (
		<React.Fragment>
			{dynamicMenuShowing && renderDynamicMenu()}
			<Tab.Navigator
				lazy={true}
				tabBarOptions={{
					style: {
						backgroundColor: '#104e01',
						// marginTop: -headerHeight
					},
					labelStyle: {
						textTransform: 'none',
						fontSize: responsiveFontSize(2)
					},
					activeTintColor: '#fff59b',
					inactiveTintColor: '#fff59b',
					tabStyle: {
						width: responsiveWidth(35),
						height: responsiveHeight(8),
						paddingTop: 0,
						paddingBottom: 0,
						// borderWidth: 1,
						// borderColor: 'orange'
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
					name="My Feed"
					component={ChefFeedScreen}
				/>
				<Tab.Screen
					name="My Recipes"
					component={MyRecipesScreen}
				/>
				<Tab.Screen
					name="Recipes I Like"
					component={MyLikedRecipesScreen}
				/>
				{/* <Tab.Screen
					name="MyMadeRecipes"
					component={MyMadeRecipesScreen}
				/> */}
				<Tab.Screen
					name="Chefs I Follow"
					component={ChefsFollowedScreen}
				/>
				<Tab.Screen
					name="Chefs Following Me"
					component={ChefsFollowingScreen}
				/>
				{/* <Tab.Screen name="MostMadeChefs" component={MostMadeChefsScreen}/> */}
			</Tab.Navigator>
		</React.Fragment>
	)
}

// const MyRecipeBookTabs = createMaterialTopTabNavigator({
//   ChefFeed: {
//     screen: ChefFeedScreen,
//     navigationOptions: {
//       tabBarLabel: 'My Feed',
//     }
//   },
//   MyRecipes: {
//     screen: MyRecipesScreen,
//     navigationOptions: {
//       tabBarLabel: 'My Recipes',
//     }
//   },
//   MyLikedRecipes: {
//     screen: MyLikedRecipesScreen,
//     navigationOptions: {
//       tabBarLabel: "Recipes I've liked",
//     }
//   },
//   // MyMadeRecipes: {
//   // screen: MyMadeRecipesScreen,
//   //   navigationOptions: {
//   //     tabBarLabel: "Recipes I've made",
//   //   }
//   // },
//   ChefsFollowed: {
//     screen: ChefsFollowedScreen,
//     navigationOptions: {
//       tabBarLabel: 'Chefs I follow',
//     }
//   },
//   ChefsFollowing: {
//     screen: ChefsFollowingScreen,
//     navigationOptions: {
//       tabBarLabel: 'Chefs following me',
//     }
//   }}, {
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

const MyRecipeBookStack = () => {
	// console.log(MyRecipeBookTabs)
	//   const props = {}

	//   const screenOptions = {

	//   }

	return (
		<Stack.Navigator
		initialRouteName="MyRecipeBook"
		// initialRouteName="NewRecipe"
		headerMode="screen"
			screenOptions={{
				headerStyle: {
					backgroundColor: '#104e01',
					height: responsiveHeight(9),
					shadowOpacity: 0,
				},
				headerTitleContainerStyle: {
					left: 0,
					height: responsiveHeight(8),
					width: responsiveWidth(100),
					zIndex: Platform.OS == 'ios' ? -1 : null
					// borderWidth: 1,
					// borderColor: 'red'
				},
				headerStatusBarHeight: 0,
			}}
			headerBackTitleVisible={false}
		>
			<Stack.Screen
				name="MyRecipeBook"
				options={({ route }) => ({
					headerLeft: null,
					headerTitle: Object.assign((props) => <AppHeader {...props} text={"My Recipe Book"} route={route} />, { displayName: 'Header' })
				})}
				component={MyRecipeBookTabs}
			/>
			<Stack.Screen
				name="RecipeDetails"
				options={({ route }) => ({
					headerLeft: null,
					headerTitle: Object.assign((props) => <AppHeader {...props} text={"Recipe Details"} route={route} />, { displayName: 'Header' })
				})}
				component={RecipeDetailsScreen}
			/>
			<Stack.Screen
				name="NewRecipe"
				options={({ route }) => ({
					headerLeft: null,
					headerTitle: Object.assign((props) => <AppHeader {...props} text={"Create a New Recipe"} route={route} />, { displayName: 'Header' })
				})}
				component={NewRecipeScreen}
			/>
			<Stack.Screen
				name="ChefDetails"
				options={({ route }) => ({
					headerLeft: null,
					headerTitle: Object.assign((props) => <AppHeader {...props} text={"Chef Details"} route={route} />, { displayName: 'Header' })
				})}
				component={ChefDetailsScreen}
			/>
		</Stack.Navigator>
	)
}


// const MyRecipeBookStack = createStackNavigator({
//   // NewRecipe: NewRecipeScreen,
//   MyRecipeBook: MyRecipeBookTabs,
//   RecipeDetails: RecipeDetailsScreen,
//   NewRecipe: NewRecipeScreen,
//   ChefDetails: ChefDetailsScreen
// },{
//   defaultNavigationOptions: {
//     headerTitle: <AppHeader text={"My Recipe Book"}/>,
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

// MyRecipeBookStack.navigationOptions = {
//   tabBarLabel: 'My recipe book',
//   tabBarIcon: ({ focused }) => (
//     <Icon size={responsiveHeight(4)} color="#8d8d8d"
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
