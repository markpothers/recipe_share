import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	dynamicMenuOuterContainer: {
		height: responsiveHeight(100),
		width: responsiveWidth(100),
		alignItems: 'flex-end'
	},
	dynamicMenuContainer: {
		right: 10,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#104e01',
		borderRadius: 5
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: responsiveHeight(7),
	},
	buttonIcon: {
		marginHorizontal: responsiveWidth(2),
		color: '#104e01',
	},
	buttonText: {
		fontSize: responsiveFontSize(2.25),
		marginRight: responsiveWidth(4),
		color: "#505050"
	}
});
