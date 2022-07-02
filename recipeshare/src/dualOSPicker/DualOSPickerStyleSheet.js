import { StyleSheet } from "react-native"
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions" //eslint-disable-line no-unused-vars

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
		borderRadius:responsiveWidth(1.5),
		justifyContent: "center",
		alignItems: "center",
	},
	choicesPicker: {
		width: "100%",
		height: "100%",
		// top: 15,
		zIndex: 2,
		// borderWidth: 1,
		// borderColor: 'blue'
	},
	androidPicker: {
		height: "100%",
		width: "100%",
		justifyContent: "flex-end",
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
		// borderColor: 'red',
		borderRadius:responsiveWidth(1.5),
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
		color: "#104e01"
	},
	pickerText: {
		color: "#104e01",
		// borderWidth: 1
	},
	iosPickerText: {
		fontSize: responsiveFontSize(2),
		// color: '#104e01',
		// borderWidth: 1,
		height: "100%",
		// borderColor: 'red'
	}
})
