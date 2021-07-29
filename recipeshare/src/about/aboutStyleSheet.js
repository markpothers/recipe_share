import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
	viewButtonContainer: {
		width: responsiveWidth(100),
		// marginLeft: responsiveWidth(5),
		// marginRight: responsiveWidth(5),
	},
	viewButton: {
		maxWidth: '100%',
		width: '100%',
		height: responsiveHeight(6),
		justifyContent: 'flex-start',
		paddingLeft: responsiveWidth(2)
	},
	text: {
		fontSize: responsiveFontSize(2.2),
		padding: responsiveWidth(2),
	}
});
