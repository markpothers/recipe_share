import React, { useRef } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles } from "../newRecipeStyleSheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { centralStyles } from "../../centralStyleSheet"; //eslint-disable-line no-unused-vars
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

type OwnProps = {

};

export const InstructionRow = ({

}: OwnProps) => {

	return (
		<View style={centralStyles.formSection}>
		<View
			style={[
				centralStyles.formInputContainer,
				{ justifyContent: "center", marginTop: responsiveHeight(1) },
			]}
		>
			<View style={[styles.timeAndDifficultyTitleItem, styles.sectionTitle]}>
				<Text
					maxFontSizeMultiplier={1.7}
					style={[styles.timeAndDifficultyTitle, { fontWeight: "bold" }]}
				>
					Recipe Name
				</Text>
			</View>
			<TouchableOpacity
				style={[centralStyles.helpButton, { right: responsiveWidth(10) }]}
				activeOpacity={0.7}
				onPress={() =>
					this.setState({ helpShowing: true, helpText: helpTexts.recipeName })
				}
				accessibilityLabel={"recipe name help"}
			>
				<Icon
					style={centralStyles.greenButtonIcon}
					size={responsiveHeight(3)}
					name="help"
				></Icon>
			</TouchableOpacity>
		</View>
		<View style={centralStyles.formInputContainer}>
			<View style={centralStyles.formInputWhiteBackground}>
				<TextInput
					multiline={true}
					maxFontSizeMultiplier={2}
					style={centralStyles.formInput}
					value={this.state.newRecipeDetails.name}
					placeholder="Recipe name"
					onChangeText={(t) => this.handleInput(t, "name")}
				/>
			</View>
		</View>
	</View>
	);
};
