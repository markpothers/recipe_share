import React from "react"
import { View, ActivityIndicator, Platform, StyleSheet } from "react-native"
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions" //eslint-disable-line no-unused-vars

export default function StyledActivityIndicator() {
	return (
		<View style={styles.activityIndicatorContainer}>
			<ActivityIndicator
				style={(Platform.OS === "ios" ? styles.activityIndicator : {})}
				size="large"
				color="#104e01"
				testID="activityIndicator"
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	activityIndicator: {
		left: 1.25,
		top: 1.7
	},
	activityIndicatorContainer: {
		position: "absolute",
		top: "10%",
		left: "50%",
		marginLeft: -25,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: responsiveWidth(1.5),
		backgroundColor: "#fff59b",
		borderColor: "#104e01",
		borderWidth: 1,
		width: 50,
		height: 50,
		zIndex: 5
	}
})
