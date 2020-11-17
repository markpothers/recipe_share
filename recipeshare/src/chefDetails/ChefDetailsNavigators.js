import React from 'react';
import { MyRecipesScreen, MyLikedRecipesScreen, MyMadeRecipesScreen, ChefsFollowedScreen, ChefsFollowingScreen } from './ChefDetailsTabs'//eslint-disable-line no-unused-vars
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

const Tab = createMaterialTopTabNavigator()

export const ChefRecipeBookTabs = (props) => {
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
					height: responsiveHeight(8),
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
				name="My Feed"
			>
				{props => <ChefFeedScreen {...props} queryChefID={fwdProps.queryChefID} />}
			</Tab.Screen> */}
			<Tab.Screen
				name="My Recipes"
			>
				{props => <MyRecipesScreen {...props} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
			<Tab.Screen
				name="Recipes I like"
			>
				{props => <MyLikedRecipesScreen {...props} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
			{/* <Tab.Screen
				name="Recipes I've made"
			>
				{props => <MyMadeRecipesScreen {...props} queryChefID={fwdProps.queryChefID} />}
			</Tab.Screen> */}
			<Tab.Screen
				name="Chefs I Follow"
			>
				{props => <ChefsFollowedScreen {...props} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
			<Tab.Screen
				name="Chefs Following Me"
			>
				{props => <ChefsFollowingScreen {...props} queryChefID={fwdProps.queryChefID} fetchChefDetails={fwdProps.fetchChefDetails} />}
			</Tab.Screen>
		</Tab.Navigator>
	)
}
