import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	modalFullScreenContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: responsiveHeight(100),
		width: responsiveWidth(100)
	},
	contentsContainer: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		backgroundColor: '#fff59b',
		width: '95%',
		borderRadius: 5,
		// alignItems: 'center',
		// justifyContent: 'space-between',
		maxHeight: '95%',
		overflow: 'hidden'
	},
	titleContainer: {
		justifyContent: 'center',
		paddingTop: responsiveHeight(1),
		paddingBottom: responsiveHeight(1),
		// height: 27 ,
		alignItems: 'center',
		width: '100%',
		// borderWidth: 1,
		borderRadius: 5,
	},
	title: {
		color: '#104e01',
		fontSize: responsiveFontSize(2.2),
		fontWeight: 'bold',
		textAlign: 'center'
	},
	filterButton: {
		position: 'absolute',
		backgroundColor: '#104e01',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#fff59b',
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		top: '85.3%',
		left: '80.2%',
		borderRadius: 100,
		zIndex: 1
	},
	filterIcon: {
		color: '#fff59b',
	},
	categoriesScrollView: {
		// height: responsiveHeight(75),
		width: '100%',
	},
	columnsContainer: {
		flexDirection: 'row',
		// flex: 1,
		// height: responsiveHeight(25),
		// maxHeight: '25%',
		// borderWidth: 1,
		// borderColor: 'red',
		flexWrap: 'wrap',
		width: '98%',
		marginLeft: '1%'
	},
	column: {
		flex: 1,
		marginLeft: responsiveWidth(2),
		// borderWidth: 1,
	},
	filterItemContainer: {
		flexDirection: 'row',
		// justifyContent: 'center',
		// alignItems: 'center',
		// borderWidth: 1,
		minWidth: '48%',
	},
	columnRow: {
		flexDirection: 'row',
		// borderWidth: 1,
	},
	switchContainer: {
		// flex: 2,
		// width: '20%',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: responsiveWidth(2),
		marginRight: responsiveWidth(1),
		// borderWidth: 1,
	},
	categoryContainer: {
		// marginLeft: '4%',
		// width: '80%',
		// flex: 8,
		justifyContent: 'center',
		minHeight: 1,
		flexWrap: 'wrap',
		// borderWidth: 1
	},
	categoryText: {
		color: '#104e01',
		flexWrap: 'wrap'
	},
	bottomContainer: {
		alignItems: 'center',
		justifyContent: 'space-between',
		// borderWidth: 1,
		borderRadius: 5,
	},
	bottomTopContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// marginRight: '5%',
		marginTop: responsiveHeight(1),
		// borderWidth: 1,
		width: '100%',
	},
	picker: {
		height: responsiveHeight(6),
		marginLeft: '3%',
		backgroundColor: 'white',
		width: '57%',
		borderRadius: 5,
		justifyContent: 'center',
		borderStyle: 'solid',
		borderColor: '#104e01',
		borderWidth: 1,
		// marginTop: '2%'
	},
	clearFiltersButtonContainer: {
		// height: 53,
		width: '100%',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		// marginTop: '2%',
		paddingTop: responsiveHeight(1),
		paddingBottom: responsiveHeight(1),
		// borderWidth: 1
	},
	clearFiltersButton: {
		// marginLeft: '5%',
		// marginRight: '5%',
		justifyContent: 'center',
		alignItems: 'center',
		width: '40%',
		minHeight: responsiveHeight(6),
		flexDirection: 'row',
		borderRadius: 5,
		backgroundColor: '#fff59b',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01'
	},
	clearFiltersButtonText: {
		marginLeft: '5%',
		marginRight: '5%',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		color: '#104e01',
	},
	clearFiltersIcon: {
		color: '#104e01',
	},
	applyFiltersButton: {
		// marginLeft: '5%',
		// marginRight: '5%',
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: '40%',
		maxWidth: '60%',
		minHeight: responsiveHeight(6),
		flexDirection: 'row',
		borderRadius: 5,
		backgroundColor: '#104e01',
	},
	applyFiltersButtonText: {
		marginLeft: '5%',
		marginRight: '5%',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		color: '#fff59b',
	},
	applyFiltersIcon: {
		color: '#fff59b',
	},
	IOSPickerText: {
		marginLeft: '5%',
		fontSize: 18,
		bottom: 3,
	},
});
