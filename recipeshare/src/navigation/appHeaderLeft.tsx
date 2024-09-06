import {
	AboutRouteProps,
	BrowseRecipesRouteProps,
	ChefDetailsRouteProps,
	MyRecipeBookCoverProps,
	MyRecipeBookRouteProps,
	NewRecipeRouteProps,
	ProfileRouteProps,
	RecipeDetailsRouteProps,
} from "./types";
import { TouchableHighlight, View } from "react-native";

import type { HeaderBackButtonProps } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars
import { styles } from "./navigationStyleSheet";
import { useNavigation } from "@react-navigation/native";

type OwnProps = {
	route:
		| MyRecipeBookRouteProps
		| NewRecipeRouteProps
		| RecipeDetailsRouteProps
		| ChefDetailsRouteProps
		| BrowseRecipesRouteProps
		| ProfileRouteProps
		| AboutRouteProps;
};

const AppHeaderLeft = (props: OwnProps & HeaderBackButtonProps) => {
	const navigation = useNavigation<MyRecipeBookCoverProps["navigation"]>();

	const renderDrawerButton = () => {
		return (
			<TouchableHighlight
				underlayColor={"#fff59b30"}
				style={styles.headerActionButton}
				activeOpacity={1}
				onPress={() => navigation.toggleDrawer()}
			>
				<Icon name="menu" style={styles.headerIcon} size={responsiveWidth(9)} />
			</TouchableHighlight>
		);
	};

	const renderBackButton = () => {
		return (
			<TouchableHighlight
				underlayColor={"#fff59b30"}
				style={styles.headerActionButton}
				activeOpacity={1}
				onPress={() => navigation.goBack()}
			>
				<Icon name="arrow-left" style={styles.headerIcon} size={responsiveWidth(9)} />
			</TouchableHighlight>
		);
	};

	return (
		<View style={styles.headerEnd}>
			{!["ChefDetails", "NewRecipe", "RecipeDetails", "About"].includes(props.route.name)
				? renderDrawerButton()
				: renderBackButton()}
		</View>
	);
};

export default AppHeaderLeft;
