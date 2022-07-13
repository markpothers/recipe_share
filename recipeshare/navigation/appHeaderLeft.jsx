import React from "react";
import { View, TouchableHighlight } from "react-native";
import { styles } from "./navigationStyleSheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { withNavigation } from "@react-navigation/compat";
// import { centralStyles } from "../src/centralStyleSheet"; //eslint-disable-line no-unused-vars
import { responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

const AppHeaderLeft = (props) => {
	const renderDrawerButton = () => {
		return (
			<TouchableHighlight
				underlayColor={"#fff59b30"}
				style={styles.headerActionButton}
				activeOpacity={1}
				onPress={() => props.navigation.toggleDrawer()}
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
				onPress={() => props.navigation.goBack()}
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

export default withNavigation(AppHeaderLeft);
