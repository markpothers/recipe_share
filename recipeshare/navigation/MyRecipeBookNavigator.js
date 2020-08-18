import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
// import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator } from 'react-navigation';
import RecipeDetailsScreen from '../src/recipeDetails/recipeDetails'
import ChefDetailsScreen from '../src/chefDetails/chefDetails'
import NewRecipeScreen from '../src/newRecipe/newRecipe'
import { ChefFeedScreen, MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen } from './MyRecipeBookTabs'
import AppHeader from './appHeader'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { centralStyles } from '../src/centralStyleSheet' //eslint-disable-line no-unused-vars
import DynamicMenu from '../src/dynamicMenu/DynamicMenu.js'

const Tab = createMaterialTopTabNavigator()

const MyRecipeBookTabs = (props) => {
	const [dynamicMenuShowing, setDynamicMenuShowing] = useState(false)
	const [headerButtons, setHeaderButtons] = useState(
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
		// console.log(this.props.route)
		props.navigation.setOptions({
			headerRight: () => (
				<View style={centralStyles.dynamicMenuButtonContainer}>
					<TouchableOpacity style={centralStyles.dynamicMenuButton} activeOpacity={0.7} onPress={() => setDynamicMenuShowing(true)} >
						<Icon name='dots-vertical' style={centralStyles.dynamicMenuIcon} size={33} />
					</TouchableOpacity>
				</View>
			),
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
						backgroundColor: '#104e01'
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
				},
			}}
			headerBackTitleVisible={false}
		>
			<Stack.Screen
				name="MyRecipeBook"
				options={({ route }) => ({
					headerLeft: props => null,
					headerTitle: props => <AppHeader {...props} text={"My Recipe Book"} route={route} />
				})}
				component={MyRecipeBookTabs}
			/>
			<Stack.Screen
				name="RecipeDetails"
				options={({ route }) => ({
					headerLeft: props => null,
					headerTitle: props => <AppHeader {...props} text={"Recipe Details"} route={route} />
				})}
				component={RecipeDetailsScreen}
			/>
			<Stack.Screen
				name="NewRecipe"
				options={({ route }) => ({
					headerLeft: props => null,
					headerTitle: props => <AppHeader {...props} text={"Create a New Recipe"} route={route} />
				})}
				component={NewRecipeScreen}
			/>
			<Stack.Screen
				name="ChefDetails"
				options={({ route }) => ({
					headerLeft: props => null,
					headerTitle: props => <AppHeader {...props} text={"Chef Details"} route={route} />
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
