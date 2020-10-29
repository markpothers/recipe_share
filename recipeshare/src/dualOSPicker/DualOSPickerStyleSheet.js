import { StyleSheet } from 'react-native'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions' //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	contentsContainer: {
		position: 'absolute',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		backgroundColor: '#fff59b',
		bottom: 0,
		height: responsiveHeight(35),
		width: responsiveWidth(100),
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	choicesPicker: {
		width: '100%',
		height: '100%',
		top: 15,
		zIndex: 2,
		// borderWidth: 1,
		// borderColor: 'blue'
	},
	androidPicker: {
		height: '100%',
		width: '100%',
		justifyContent: 'center',
	},
	IOSPicker: {
		height: '100%',
		width: '100%',
		bottom: '8%',
		justifyContent: 'center',
	},
	IOSSelectedChoiceTextBox: {
		marginLeft: responsiveWidth(2),
	},
	pickerContainer: {
		height: '100%',
		width: '100%',
		// borderWidth: 1,
	},
	IOSSelectedChoiceContainer: {
		width: '100%',
		height: '100%',
		// justifyContent: 'space-evenly',
		flexDirection: 'row',
		alignItems: 'center',
		// borderWidth: 1
	},
	dropDownIcon: {
		color: '#505050',
		// marginLeft: '50%'
	},
	iosCloseButton: {
		position: 'absolute',
		top: 0,
		right: 0,
		marginTop: responsiveHeight(1),
		marginRight: responsiveWidth(3),
		zIndex: 3
	},
	iosCloseButtonText: {
		fontSize: responsiveFontSize(3),
		color: '#104e01'
	},
	pickerText: {
		color: '#104e01',
		borderWidth:1
	}
})
