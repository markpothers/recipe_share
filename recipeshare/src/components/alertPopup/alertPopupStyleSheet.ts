import { StyleSheet } from "react-native"
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions" //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	modalFullScreenContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	contentsContainer: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#104e01",
		backgroundColor: "#fff59b",
		width: responsiveWidth(85),
		marginLeft: "7.5%",
		marginRight: "7.5%",
		borderRadius:responsiveWidth(1.5),
		alignItems: "center"
	},
	titleContainer: {
		justifyContent: "center",
		width: "90%",
		paddingTop: responsiveHeight(1)
	},
	title: {
		color: "#104e01",
		fontSize: responsiveFontSize(2.2),
		fontWeight: "bold"
	}
})
