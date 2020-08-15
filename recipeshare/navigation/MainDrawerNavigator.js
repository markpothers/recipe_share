import React from 'react';
import BrowseRecipesStack from './BrowseRecipesNavigator'
import MyRecipeBookStack from './MyRecipeBookNavigator'
import ProfileStack from './ProfileNavigator'
import CustomDrawer from './Drawer'
// import BrowseRecipesCoverStack from './BrowseRecipesCover'
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator()

export default MainDrawerNavigator = (props) => {
	const setLoadedAndLoggedIn = props.setLoadedAndLoggedIn
	return (
		<Drawer.Navigator
			initialRouteName="MyRecipeBook"
			drawerContent={(props) => <CustomDrawer {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
		>
			<Drawer.Screen
				name="MyRecipeBook"
				options={
					{ headerShown: false }
				}
				component={MyRecipeBookStack}
			/>
			<Drawer.Screen
				name="BrowseRecipes"
				options={
					{ headerShown: false }
				}
				component={BrowseRecipesStack}
			/>
			<Drawer.Screen
				name="Profile"
				options={
					{ headerShown: false }
				}
			>
				{props => <ProfileStack {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
			</Drawer.Screen>
		</Drawer.Navigator >
	)
}





// export default MainDrawerNavigator = createDrawerNavigator({
//   // OldBrowseRecipes: BrowseRecipesStack,
//   BrowseRecipes: BrowseRecipesStack,  //BrowseRecipesCoverStack to include the cover page instead
//   MyRecipeBook: MyRecipeBookStack,
//   Profile: ProfileStack,
//   },
//   {
//     initialRouteName: "MyRecipeBook",
//     contentComponent: Drawer
//   },
//   {
//     tabBarOptions: {
//       activeTintColor: '8d8d8d',
//       inactiveTintColor: '8d8d8d',
//     },
//   },

// );
