import React from "react";
import { View, TouchableHighlight, Text } from "react-native";
import { styles } from "./navigationStyleSheet";
// import { centralStyles } from "../src/centralStyleSheet"; //eslint-disable-line no-unused-vars
// import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

type OwnProps = {
	buttonAction?: () => void;
	text: string;
}

const AppHeader = ({buttonAction, text}: OwnProps) => {
	return (
		<View style={styles.headerMiddle}>
			<TouchableHighlight
				underlayColor={buttonAction ? "#fff59b30" : null}
				style={[styles.headerActionButton, { width: "100%" }]}
				activeOpacity={1}
				onPress={buttonAction ? buttonAction : null}
			>
				<Text style={styles.headerText} maxFontSizeMultiplier={1}>
					{text}
				</Text>
			</TouchableHighlight>
		</View>
	);
};

export default AppHeader;
