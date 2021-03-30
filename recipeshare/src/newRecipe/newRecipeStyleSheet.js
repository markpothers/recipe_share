import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	mainPageContainer: {
		flex: 1,
	},
	background: {
		width: '100%',
		height: '100%',
		flex: 1
	},
	formRow: {
		flex: 1,
		marginTop: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderStyle: 'solid',
		borderWidth: 1,
		borderRadius: responsiveWidth(1.5),
		borderColor: '#104e01',
		width: '100%',
		backgroundColor: 'white',
	},
	transparentFormRow: {
		flex: 1,
		marginTop: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: responsiveWidth(1.5),
		width: '100%',
	},
	createRecipeInputBox: {
		height: 44,
		justifyContent: 'center',
		width: '96%',
		marginLeft: '2%',
		marginRight: '2%',
	},
	createRecipeTextAreaBox: {
		marginLeft: '2%',
		marginRight: '2%',
		backgroundColor: 'white',
		height: 140,
		width: '96%',
		justifyContent: 'center'
	},
	newRecipeTextCentering: {
		// position: 'absolute',
	},
	createRecipeTextAreaInput: {
		height: 130,
		marginTop: 4,
	},
	sectionTitle: {
		width: responsiveWidth(60),
		alignItems: 'center'
	},
	timeAndDifficultyWrapper: {
		borderStyle: 'solid',
		borderWidth: 2,
		borderColor: '#104e01',
		width: '100%',
		marginTop: 4,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	timeAndDifficultyTitleItem: {
		//  marginLeft: '5%',
		//  marginRight: '5%',
		backgroundColor: 'white',
		borderRadius: responsiveWidth(1.5),
		height: responsiveHeight(6),
		// minWidth: responsiveWidth(25),
		width: responsiveWidth(59),
		justifyContent: 'center',
		// alignItems: 'center',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		paddingHorizontal: responsiveWidth(2),
	},
	timeAndDifficultyTitle: {
		// marginLeft: '5%',
		// marginRight: '5%',
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
	},
	timeAndDifficulty: {
		// paddingLeft: responsiveWidth(8),
		// marginRight: '5%',
		backgroundColor: 'white',
		height: responsiveHeight(6),
		width: responsiveWidth(40.5),
		// marginRight: responsiveWidth(0.5),
		borderRadius: responsiveWidth(1.5),
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		justifyContent: 'center',
		// marginLeft: responsiveWidth(1)
	},
	// picker: {
	//   height: 44,
	//   borderStyle: 'solid',
	//   borderWidth: 1,
	//   borderColor: '#104e01',
	//   justifyContent: 'center',
	//   overflow: 'hidden'
	// },
	pickerText: {
		// textAlign: 'center'
	},
	createRecipeFormButton: {
		marginLeft: '5%',
		marginRight: '5%',
		justifyContent: 'center',
		alignItems: 'center',
		width: '35%',
		height: 44,
		flexDirection: 'row',
		borderRadius: responsiveWidth(1.5),
		backgroundColor: '#fff59b',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
	},
	unitPicker: {
		bottom: '2%',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	createRecipeFormButtonText: {
		marginLeft: '5%',
		marginRight: '5%',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		color: '#104e01',
	},
	standardIcon: {
		color: '#104e01',
	},
	addIngredientQuantityInputBox: {
		marginRight: responsiveWidth(1),
		backgroundColor: 'white',
		minHeight: responsiveHeight(6),
		width: responsiveWidth(46),
		borderStyle: 'solid',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#104e01',
		borderRadius: responsiveWidth(1.5),
	},
	addIngredientUnitInputBox: {
		backgroundColor: 'white',
		justifyContent: 'center',
		minHeight: responsiveHeight(6),
		width: responsiveWidth(30),
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		borderRadius: responsiveWidth(1.5),
		overflow: 'hidden'
	},
	ingredientTextAdjustment: {
		marginLeft: responsiveWidth(2),
		fontSize: responsiveFontSize(2),
	},
	autoCompleteRowContainer: {
		// flex: 1,
		// marginTop: responsiveHeight(0.5),
		flexDirection: 'row',
		width: responsiveWidth(100),
		// height: responsiveHeight(30),
		// borderWidth: 1,
		// borderColor: 'white',
		// justifyContent: 'space-between'
		// overflow: 'visible',
	},
	autoCompleteContainer: {
		position: 'absolute',
		width: '100%',
		borderRadius: responsiveWidth(1.5),
		// height: responsiveHeight(10),
		// justifyContent: 'center'
		// borderWidth: 1,
		// borderColor: 'yellow'
	},
	nameAndUnitsContainer: {
		// borderWidth: 1,
		// borderColor: 'red',
		width: responsiveWidth(77),
		marginLeft: responsiveWidth(1),
		marginRight: responsiveWidth(1),
	},
	quantityAndUnitContainer: {
		// marginLeft: '1%',
		width: '100%',
		// justifyContent: 'space-between',
		// left: '49%',
		flexDirection: 'row',
		// borderWidth: 1,
		// borderColor: 'red',
		top: responsiveHeight(6.5),
		height: responsiveHeight(6),
	},
	ingredientSortContainer: {
		height: responsiveHeight(12.5),
		width: responsiveWidth(12),
		borderRadius: responsiveWidth(1.5),
		borderStyle: 'solid',
		borderColor: '#104e01',
		borderWidth: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	deleteIngredientContainer: {
		// position: 'absolute',
		// marginLeft: '1%',
		width: responsiveWidth(9),
		height: responsiveHeight(12.5),
		// left: '90%',
		flexDirection: 'row',
		borderRadius: responsiveWidth(1.5),
		borderStyle: 'solid',
		borderColor: '#104e01',
		borderWidth: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	autoCompleteOuterContainerStyle: {
		borderRadius: responsiveWidth(1.5),
	},
	autoCompleteInputContainerStyle: {
		borderRadius: responsiveWidth(1.5),
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderColor: 'transparent',
		borderWidth: 0,
	},
	autoCompleteInput: {
		borderRadius: responsiveWidth(1.5),
		backgroundColor: 'white',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		minHeight: responsiveHeight(6),
		paddingLeft: responsiveWidth(2),
		fontSize: responsiveFontSize(2),
	},
	autoCompleteList: {
		borderRadius: responsiveWidth(1.5),
		height: responsiveHeight(23),
		width: '90%',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		marginLeft: '5%',
		marginRight: '5%',
		// zIndex: 10
	},
	ingredientDeleteTrashCanButton: {
		// zIndex: 1,
		// position: 'absolute',
		// top: 85,
		// left: 85,
	},
	ingredientTrashCan: {
		color: '#505050'
	},
	iOSdropDownIcon: {
		position: 'absolute',
		// height: 25,
		// width: 25,
		left: '80%',
		top: '36%',
		zIndex: 2,
		// borderStyle: 'solid',
		// borderWidth: 1,
		// borderColor: '#104e01',
		color: '#104e01',
	},
	IOSPickerText: {
		marginLeft: '10%'
	},
	deleteInstructionContainer: {
		// position: 'absolute',
		// marginLeft: '1%',
		// width: '8%',
		height: '100%',
		// left: '90%',
		flexDirection: 'row',
		borderRadius: responsiveWidth(1.5),
		borderStyle: 'solid',
		borderColor: '#104e01',
		borderWidth: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	instructionInput: {
		// height: '100%',
		width: '100%',
		backgroundColor: 'white',
		textAlign: 'left',
		textAlignVertical: 'center',
		borderRadius: responsiveWidth(1.5),
		// borderWidth: 1,
		// borderColor: '#104e01',
		paddingLeft: responsiveWidth(2),
		paddingRight: responsiveWidth(1),
		fontSize: responsiveFontSize(2),
		paddingTop: responsiveHeight(0.5),
		paddingBottom: responsiveHeight(0.5),
		// marginLeft: '0.5%',
		// marginRight: '0.5%',
	},
	autocompleteListText: {
		fontSize: responsiveFontSize(1.8)
	},
	addButton: {
		maxWidth: responsiveWidth(60),
		width: responsiveWidth(60),
		justifyContent: 'center'
	},
	plusButtonContainer: {
		marginTop: responsiveHeight(0.5),
		width: responsiveWidth(100),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		// borderWidth: 1,
		// borderColor: 'red'
	},
	plusButton: {
		backgroundColor: '#fff59b',
		borderRadius: responsiveWidth(1.5),
		borderColor: '#104e01',
		borderWidth: 1,
		width: responsiveWidth(60),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		minHeight: responsiveHeight(6),
	},
	switchContainer:{
		backgroundColor: '#fff59b',
		borderRadius: responsiveWidth(1.5),
		borderColor: '#104e01',
		borderWidth: 1,
		width: responsiveWidth(20),
		// marginHorizontal: responsiveWidth(10),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		minHeight: responsiveHeight(6),
		
	}
})
