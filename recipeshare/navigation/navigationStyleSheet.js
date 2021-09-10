import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	mainPageContainer: {
		flex: 1,
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: responsiveWidth(100),
		// height: responsiveHeight(9),
		height: '100%',
		// marginTop: Platform.OS === 'ios' ? null : -responsiveHeight(1.9),
		// borderWidth: 1,
		// borderColor: 'red',
		// backgroundColor: '#104e01',
	},
	headerEnd: {
		width: responsiveWidth(15),
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		//borderWidth: 1,
		//backgroundColor: '#fff59b30',
	},
	headerMiddle: {
		// minWidth: responsiveWidth(70),
		height: '100%',
		justifyContent: 'center',
		// borderWidth: 1
	},
	headerDrawerButton: {
		// borderWidth: 1,
		height: '105%',
		width: '105%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#104e01',
		borderRadius:responsiveWidth(1.5)
	},
	headerIcon: {
		color: '#fff59b'
	},
	headerText: {
		fontSize: responsiveFontSize(3.5),
		color: '#fff59b',
		marginLeft: responsiveWidth(3)
	},
	background: {
		width: '100%',
		height: '100%',
	},
	headerActionButton: {
		//backgroundColor: '#fff59b30',
		//borderWidth: 1,
		//borderColor: 'blue',
		width: responsiveWidth(68),
		height: '80%',
		zIndex: 1,
		borderRadius:responsiveWidth(1.5),
		marginLeft: responsiveWidth(16)
	}
});
