import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	messageContainer: {
		borderRadius:responsiveWidth(1.5),
		position: 'absolute',
		alignSelf: 'center',
		top: '25%',
		zIndex: 2,
		backgroundColor: '#104e01',
		borderWidth: 1,
		borderColor: '#fff59b',
		justifyContent: 'center',
		alignItems: 'center'
	},
	messageText: {
		color: '#fff59b',
		paddingHorizontal: responsiveWidth(2),
		paddingVertical: responsiveHeight(1),
		textAlign: 'center',
		fontSize: responsiveFontSize(2)
	}
});
