import React from "react";
import { View, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { centralStyles } from "../src/centralStyleSheet"; //eslint-disable-line no-unused-vars
import { styles } from "./navigationStyleSheet";
import { responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

type OwnProps = {
	buttonAction: (setDynamicMenuShowing: boolean) => void;
};

export default function AppHeaderRight({ buttonAction }: OwnProps) {
	return (
		<View style={styles.headerEnd}>
			<TouchableHighlight
				underlayColor={"#fff59b30"}
				style={styles.headerActionButton}
				activeOpacity={1}
				onPress={() => buttonAction(true)}
			>
				<Icon name="dots-vertical" style={centralStyles.dynamicMenuIcon} size={responsiveWidth(9)} />
			</TouchableHighlight>
		</View>
	);
}
