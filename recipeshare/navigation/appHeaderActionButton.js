import React from "react";
import { View, TouchableHighlight, Text } from "react-native";
import { styles } from "./navigationStyleSheet";

export default function AppHeaderActionButton(props) {
	return (
		<TouchableHighlight
			underlayColor={"#fff59b30"}
			style={styles.headerActionButton}
			activeOpacity={1}
			onPress={props.buttonAction}
		>
			<Text style={styles.headerText}>{props.text}</Text>
		</TouchableHighlight>
	);
}
