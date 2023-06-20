import React from "react";
import { View, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { centralStyles } from "../src/centralStyleSheet"; //eslint-disable-line no-unused-vars
import { styles } from "./navigationStyleSheet";
import { responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

type OwnProps = {
	buttonAction: (setDynamicMenuShowing: boolean) => void;
	accessibilityLabel: string;
};

export default function AppHeaderRight({ buttonAction, accessibilityLabel }: OwnProps) {
	return (
		<View style={styles.headerEnd}>
			<TouchableHighlight
				underlayColor={"#fff59b30"}
				style={styles.headerActionButton}
				activeOpacity={1}
				onPress={() => buttonAction(true)}
				accessibilityLabel={accessibilityLabel}
			>
				<Icon name="dots-vertical" style={centralStyles.dynamicMenuIcon} size={responsiveWidth(9)} />
			</TouchableHighlight>
		</View>
	);
}
