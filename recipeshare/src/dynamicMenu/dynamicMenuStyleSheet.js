import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	dynamicMenuOuterContainer: {
		height: responsiveHeight(100),
		width: responsiveWidth(100),
		alignItems: 'flex-end',
		// borderWidth: 1,
		// borderColor: 'red'
	},
	dynamicMenuContainer: {
		// right: 10,
		// top: 100,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#104e01',
		borderRadius:responsiveWidth(1.5)
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: responsiveHeight(7),
	},
	buttonIcon: {
		marginHorizontal: responsiveWidth(2),
		color: '#104e01',
		bottom: responsiveHeight(0.25)
	},
	buttonText: {
		fontSize: responsiveFontSize(2.25),
		marginRight: responsiveWidth(4),
		color: "#505050",
		bottom: responsiveHeight(0.25)
	}
});
