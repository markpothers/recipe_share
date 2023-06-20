import React from "react";
import BrowseRecipesStack from "./BrowseRecipesNavigator";
import MyRecipeBookStack from "./MyRecipeBookNavigator";
import ProfileStack from "./ProfileNavigator";
import CustomDrawer from "./Drawer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MainDrawerParamList } from "./types";

const Drawer = createDrawerNavigator<MainDrawerParamList>();

type OwnProps = {
	setLoadedAndLoggedIn: (args: {loaded: boolean, loggedIn: boolean}) => void;
};

export default function MainDrawerNavigator(props: OwnProps) {
	const { setLoadedAndLoggedIn } = props;

	return (
		<Drawer.Navigator
			initialRouteName="MyRecipeBookCover"
			drawerContent={(props) => <CustomDrawer {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
		>
			<Drawer.Screen name="MyRecipeBookCover" options={{ headerShown: false }} component={MyRecipeBookStack} />
			<Drawer.Screen name="BrowseRecipesCover" options={{ headerShown: false }} component={BrowseRecipesStack} />
			<Drawer.Screen name="ProfileCover" options={{ headerShown: false }}>
				{(props) => <ProfileStack {...props} setLoadedAndLoggedIn={setLoadedAndLoggedIn} />}
			</Drawer.Screen>
		</Drawer.Navigator>
	);
}
