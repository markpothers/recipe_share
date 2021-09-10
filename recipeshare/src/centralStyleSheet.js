import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

const inDevelopment = false

export const centralStyles = StyleSheet.create({
	spinachFullBackground: {
		width: responsiveWidth(100),
		height: responsiveHeight(100),
		borderWidth: inDevelopment ? 1 : 0,
		borderColor: 'black',
		position: 'absolute',
	},
	fullPageSafeAreaView: {
		flex: 1,
		borderWidth: inDevelopment ? 1 : 0,
		borderColor: 'blue',
	},
	fullPageKeyboardAvoidingView: {
		flex: 1,
		borderWidth: inDevelopment ? 1 : 0,
		borderColor: 'red',
		alignItems: 'center'
	},
	fullPageScrollView: {
		flex: 1,
		borderWidth: inDevelopment ? 1 : 0,
		borderColor: 'yellow',
	},
	formContainer: {
		width: responsiveWidth(80),
		marginLeft: responsiveWidth(10),
		marginRight: responsiveWidth(10),
		borderWidth: inDevelopment ? 1 : 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	formTitle: {
		width: '100%',
		height: '100%',
		borderRadius: responsiveWidth(1.5),
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: responsiveHeight(2.5),
		color: "#505050",
		// backgroundColor: 'white',
		// borderWidth: 1,
		// borderColor: '#104e01',
		paddingHorizontal: responsiveWidth(2),
		paddingVertical: responsiveWidth(1),
		overflow: 'hidden',
	},
	formSection: {
		width: '100%',
		borderWidth: inDevelopment ? 1 : 0,
		borderColor: 'red',
		overflow: 'hidden',
	},
	formSectionSeparatorContainer: {
		borderWidth: 1,
		borderColor: '#104e01',
		marginTop: responsiveHeight(1),
		marginBottom: responsiveHeight(0.5)
	},
	formSectionSeparator: {
		borderBottomWidth: responsiveHeight(0.66),
		borderBottomColor: '#fff59b',
		width: responsiveWidth(80)
	},
	formInputContainer: {
		flexDirection: 'row',
		marginTop: responsiveHeight(0.5),
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius:responsiveWidth(1.5),
		overflow: 'hidden',
		flexWrap: 'wrap',
		minHeight: responsiveHeight(6),
		borderWidth: inDevelopment ? 1 : 0,
		borderColor: 'purple',
		// backgroundColor: 'white'
	},
	formInputWhiteBackground: {
		flexDirection: 'row',
		backgroundColor: 'white',
		height: '100%',
		width: '100%',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#104e01',
		overflow: 'hidden',
		borderRadius: responsiveWidth(1.5),
	},
	formInput: {
		// minHeight: responsiveHeight(6),
		width: '100%',
		// backgroundColor: 'white',
		textAlign: 'left',
		textAlignVertical: 'center',
		// borderRadius: responsiveHeight(100),
		// borderWidth: 1,
		// borderColor: '#104e01',
		paddingLeft: responsiveWidth(2),
		fontSize: responsiveFontSize(2),
		paddingVertical: responsiveHeight(0.5)
	},
	formTextBoxContainer: {
		minHeight: responsiveHeight(6),
		height: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#104e01',
		borderRadius:responsiveWidth(1.5)
	},
	formTextBox: {
		width: '100%',
		textAlign: 'left',
		textAlignVertical: 'center',
		borderRadius:responsiveWidth(1.5),
		paddingLeft: responsiveWidth(2),
		fontSize: responsiveFontSize(2)
	},
	formErrorView: {
		marginTop: responsiveHeight(0.5),
		// height: responsiveHeight(3),
		width: '100%',
		backgroundColor: 'white',
		justifyContent: 'center',
		// alignItems: 'center',
		borderRadius:responsiveWidth(1.5),
		borderWidth: 1,
		borderColor: '#104e01'
	},
	formErrorText: {
		color: "#9e0000f8",
		fontSize: responsiveFontSize(2),
		paddingLeft: responsiveWidth(2),
		paddingRight: responsiveWidth(2),
		paddingTop: responsiveHeight(0.25),
		paddingBottom: responsiveHeight(0.25)
	},
	yellowRectangleButton: {
		justifyContent: 'space-evenly',
		// alignContent: 'center',
		alignItems: 'center',
		minWidth: responsiveWidth(38),
		maxWidth: '50%',
		minHeight: responsiveHeight(6),
		height: '100%',
		flexDirection: 'row',
		borderRadius: responsiveWidth(1.5),
		backgroundColor: '#fff59b',
		borderWidth: 1,
		borderColor: '#104e01',
		// flexGrow: 1
		// flexWrap: 'wrap',
	},
	greenRectangleButton: {
		justifyContent: 'space-evenly',
		alignItems: 'center',
		minWidth: responsiveWidth(38),
		maxWidth: '50%',
		minHeight: responsiveHeight(6),
		height: '100%',
		flexDirection: 'row',
		borderRadius: responsiveWidth(1.5),
		backgroundColor: '#104e01',
		borderWidth: 1,
		borderColor: '#fff59b',
	},
	greenButtonIcon: {
		color: '#104e01',
		// borderWidth: 1
	},
	yellowButtonIcon: {
		color: '#fff59b',
		// borderWidth: 1
	},
	greenButtonText: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#104e01',
		fontSize: responsiveFontSize(1.8),
		paddingHorizontal: responsiveWidth(1)
	},
	yellowButtonText: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#fff59b',
		fontSize: responsiveFontSize(1.8),
		paddingHorizontal: responsiveWidth(1)
	},
	helpButton: {
		alignSelf: 'flex-start',
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		height: responsiveHeight(4),
		width: responsiveHeight(4),
		borderRadius: responsiveWidth(1.5),
		backgroundColor: '#fff59b',
		borderWidth: 1,
		borderColor: '#104e01',
	},
	pickerContainer: {
		backgroundColor: 'white',
		height: responsiveHeight(6),
		width: '100%',
		justifyContent: 'center',
		borderRadius: responsiveWidth(1.5),
		borderWidth: 1,
		borderColor: '#104e01',
		overflow: 'hidden',
		// backgroundColor: 'yellow',
	},
	dynamicMenuButtonContainer: {
		width: responsiveWidth(15),
		justifyContent: 'center',
		alignItems: 'center',
		//backgroundColor: '#fff59b30',

	},
	dynamicMenuButton: {
		height: '105%',
		width: '105%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#104e01',
		borderRadius:responsiveWidth(1.5),
	},
	dynamicMenuIcon: {
		color: '#fff59b'
	},
	headerButtonContainer: {
		backgroundColor: '#fff59b',
		width: '90%',
		height: '90%',
		borderRadius:responsiveWidth(1.5),
		overflow: 'visible',
		justifyContent: 'center',
		alignItems: 'center',
	},
	hiddenToggle: {
		position: 'absolute',
		right: responsiveWidth(0),
		// borderWidth: 1,
		// backgroundColor: 'red',
		height: '100%',
		width: responsiveWidth(15),
		justifyContent: 'center',
		alignItems:'center',
		zIndex: 0
	},
	hiddenToggleIcon: {
		color: '#50505055'
	}
});
