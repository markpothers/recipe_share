import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	contentsContainer: {
		position: "absolute",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#104e01",
		backgroundColor: "#fff59b",
		bottom: 0,
		height: responsiveHeight(25),
		width: responsiveWidth(100),
		borderRadius: responsiveWidth(1.5),
		justifyContent: "center",
		alignItems: "center",
	},
	choicesPicker: {
		width: "100%",
		height: "100%",
		zIndex: 2,
		backgroundColor: "white", // Ensure white background on iOS modal
		// borderWidth: 1,
		// borderColor: 'blue'
	},
	androidPicker: {
		// top: 0,
		// height: "90%",
		left: 5,
		height: "99%",
		paddingVertical: 1,
		borderRadius: 5,
		width: "100%",
		justifyContent: "flex-end",
		// overflow: "hidden",
		// borderWidth: 1,
		// borderColor: "red",
	},
	// IOSPicker: {
	// 	height: '100%',
	// 	width: '100%',
	// 	bottom: '8%',
	// 	justifyContent: 'center',
	// 	marginLeft: responsiveWidth(2),
	// 	fontSize: responsiveFontSize(2)
	// },
	IOSSelectedChoiceTextBox: {
		marginLeft: responsiveWidth(2),
		fontSize: responsiveFontSize(2),
	},
	pickerContainer: {
		height: "100%",
		width: "100%",
		// borderWidth: 1,
		// borderColor: "red",
		borderRadius: responsiveWidth(1.5),
	},
	IOSSelectedChoiceContainer: {
		width: "100%",
		height: "100%",
		// justifyContent: 'space-evenly',
		flexDirection: "row",
		alignItems: "center",
		// borderWidth: 1
	},
	dropDownIcon: {
		color: "#505050",
		// marginLeft: '50%'
	},
	iosCloseButton: {
		position: "absolute",
		top: 0,
		right: 0,
		marginTop: responsiveHeight(1),
		marginRight: responsiveWidth(3),
		paddingVertical: responsiveHeight(1),
		paddingHorizontal: responsiveWidth(3),
		zIndex: 3,
		// borderWidth: 1
	},
	iosCloseButtonText: {
		fontSize: responsiveFontSize(2),
		color: "#104e01",
	},
	pickerText: {
		color: "#104e01",
		backgroundColor: "white", // Ensure white background on Android
		marginTop: 50,
		// borderWidth: 1
	},
	iosPickerText: {
		fontSize: responsiveFontSize(2),
		// color: '#104e01',
		// borderWidth: 1,
		height: "100%",
		// borderColor: 'red'
	},
});
