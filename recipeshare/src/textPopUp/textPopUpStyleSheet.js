import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	modalFullScreenContainer: {
		// flex: 1,
	},
	contentsContainer: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		backgroundColor: '#fff59b',
		width: '80%',
		height: responsiveHeight(85),
		marginTop: '7.5%',
		marginBottom: '7.5%',
		marginLeft: '10%',
		marginRight: '10%',
		borderRadius:responsiveWidth(1.5),
		alignItems: 'center',
	},
	titleContainer: {
		justifyContent: 'center',
		// marginTop: '4%',
		paddingTop: responsiveHeight(1),
		paddingBottom: responsiveHeight(1),
		height: responsiveHeight(6),
	},
	title: {
		color: '#104e01',
		fontSize: responsiveFontSize(2.2),
		fontWeight: 'bold'
	},
	formRow: {
		marginTop: '3%',
		flexDirection: 'row',
		// justifyContent: 'center',
		justifyContent: 'flex-end',
		borderRadius:responsiveWidth(1.5),
		width: '90%',
		// borderWidth: 1
	},
	editChefInputAreaBox: {
		// marginTop: '0%',
		marginLeft: '5%',
		marginRight: '5%',
		backgroundColor: 'white',
		// height: '86%',
		width: '90%',
		// justifyContent: 'center',
		borderRadius:responsiveWidth(1.5),
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		overflow: 'hidden'
	},
	tAndCText: {
		margin: '2%'
	},
	buttonPlaceholder: {
		marginLeft: '5%',
		marginRight: '5%',
		justifyContent: 'center',
		alignItems: 'center',
		width: '40%',
		height: 44,
		flexDirection: 'row',
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'transparent',
	},
	closeButton: {
		// marginLeft: '5%',
		// marginRight: '5%',
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: '40%',
		minHeight: responsiveHeight(6),
		flexDirection: 'row',
		borderRadius:responsiveWidth(1.5),
		backgroundColor: '#104e01',
	},
	closeButtonText: {
		marginLeft: '5%',
		marginRight: '5%',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		color: '#fff59b',
	},
	closeIcon: {
		color: '#fff59b',
	},
});
