import BrowseRecipesStack from "./BrowseRecipesNavigator";
import CustomDrawer from "./Drawer";
import { MainDrawerParamList } from "./types";
import MyRecipeBookStack from "./MyRecipeBookNavigator";
import ProfileStack from "./ProfileNavigator";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export default function MainDrawerNavigator() {
	return (
		<Drawer.Navigator
			initialRouteName="MyRecipeBookCover"
			drawerContent={(props) => <CustomDrawer {...props} />}
		>
			<Drawer.Screen name="MyRecipeBookCover" options={{ headerShown: false }} component={MyRecipeBookStack} />
			<Drawer.Screen name="BrowseRecipesCover" options={{ headerShown: false }} component={BrowseRecipesStack} />
			<Drawer.Screen name="ProfileCover" options={{ headerShown: false }} component={ProfileStack} />
		</Drawer.Navigator>
	);
}
