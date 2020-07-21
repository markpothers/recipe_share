import React from 'react';
import { MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen } from './ChefDetailsTabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

const Tab = createMaterialTopTabNavigator()

export const MyRecipeBookTabs = (props) => {
	const fwdProps = props
	return (
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
			{/* <Tab.Screen
				name="ChefFeed"
				component={ChefFeedScreen}
				fetchChefDetails={fwdProps.fetchChefDetails}
				parentNavigator={fwdProps.parentNavigator}
				queryChefId={fwdProps.queryChefId}
			/> */}
			<Tab.Screen
				name="My Recipes"
				component={MyRecipesScreen}
				fetchChefDetails={fwdProps.fetchChefDetails}
				parentNavigator={fwdProps.parentNavigator}
				queryChefId={fwdProps.queryChefId}
			/>
			<Tab.Screen
				name="Recipes I like"
				component={MyLikedRecipesScreen}
				fetchChefDetails={fwdProps.fetchChefDetails}
				parentNavigator={fwdProps.parentNavigator}
				queryChefId={fwdProps.queryChefId}
			/>
			{/* <Tab.Screen
				name="MyMadeRecipes"
				component={MyMadeRecipesScreen}
				fetchChefDetails={fwdProps.fetchChefDetails}
				parentNavigator={fwdProps.parentNavigator}
				queryChefId={fwdProps.queryChefId}
			/> */}
			<Tab.Screen
				name="Chefs I Follow"
				component={ChefsFollowedScreen}
				fetchChefDetails={fwdProps.fetchChefDetails}
				parentNavigator={fwdProps.parentNavigator}
				queryChefId={fwdProps.queryChefId}
			/>
			<Tab.Screen
				name="Chefs Following Me"
				component={ChefsFollowingScreen}
				fetchChefDetails={fwdProps.fetchChefDetails}
				parentNavigator={fwdProps.parentNavigator}
				queryChefId={fwdProps.queryChefId}
			/>
			{/* <Tab.Screen
				name="MostMadeChefs"
				component={MostMadeChefsScreen}
				fetchChefDetails={fwdProps.fetchChefDetails}
				parentNavigator={fwdProps.parentNavigator}
				queryChefId={fwdProps.queryChefId}
			/> */}
		</Tab.Navigator>
	)
}
