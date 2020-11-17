import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	mainPageContainer: {
		// borderStyle: 'solid',
		// borderWidth: 1,
		// borderColor: '#9e0000f8',
		// overflow: 'scroll'
		flex: 1,
		// flexDirection: 'column'
	},
	background: {
		width: '100%',
		height: '100%',
		flex: 1
		// opacity: '20%'
	},
	backgroundImageStyle: {
	},
	detailsHeader: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: '0%',
		marginRight: '0%',
		marginTop: responsiveHeight(0.5),
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'white',
		// flexDirection: 'row'
		// backgroundColor: '#fff59b',
		// opacity: 0.9,
	},
	detailsIngredients: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		width: '100%',
		marginLeft: '0%',
		marginRight: '0%',
		marginTop: responsiveHeight(0.5),
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'white',
		// opacity: 0.9,
		paddingTop: '1%',
		// paddingBottom: '1%'
	},
	detailsInstructionContainer: {
		flexDirection: 'row',
		width: '100%',
		// borderWidth: 1,
	},
	instructionImageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
		marginRight: responsiveWidth(2)
	},
	detailsInstructions: {
		paddingTop: responsiveHeight(0.5),
		paddingBottom: responsiveHeight(0.5),
		// justifyContent: 'center'
	},
	detailsInstructionsSeparator: {
		width: responsiveWidth(96),
		marginLeft: responsiveWidth(2),
		marginRight: responsiveWidth(2),
		marginTop: responsiveHeight(0.5),
		marginBottom: responsiveHeight(0.5),
		borderBottomWidth: 0.5,
		borderColor: '#104e01',
	},
	detailsIngredientsSeparator: {
		width: responsiveWidth(96),
		marginLeft: responsiveWidth(2),
		marginRight: responsiveWidth(2),
		// marginTop: responsiveHeight(0.5),
		// marginBottom: responsiveHeight(0.5),
		borderBottomWidth: 0.5,
		borderColor: '#104e01',
	},
	detailsContainer: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		width: '100%',
		marginLeft: '0%',
		marginRight: '0%',
		marginTop: responsiveHeight(0.5),
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'white',
		paddingTop: responsiveHeight(0.5),
		paddingBottom: responsiveHeight(0.5)
	},
	detailsMakePicsContainer: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		// width: '100%',
		// marginLeft: '0%',
		// marginRight: '0%',
		marginTop: responsiveHeight(0.5),
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'white',
		// opacity: 0.9,
		// marginBottom: '1%',
		paddingTop: '1%',
		// height: 250
		// flex: 1
	},
	detailsLikesAndMakes: {
		// flexDirection: 'row'
		// justifyContent: 'center',
		// borderWidth: 1,
		// borderColor: 'teal',
	},
	detailsLikes: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		width: '100%',
		marginLeft: '0%',
		marginRight: '0%',
		marginTop: responsiveHeight(0.5),
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'white',
		// opacity: 0.9,
		flex: 1,
		flexDirection: 'row',
		paddingTop: '0.5%',
		paddingBottom: '0.5%',
		// height: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonAndText: {
		flexDirection: 'row',
		// position: 'absolute'
		// bottom: '10%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// alignSelf: 'center',
		// borderStyle: 'solid',
		// borderWidth: 1,
	},
	icon: {
		color: "#505050",
		bottom: responsiveHeight(0.2)
	},
	addIcon: {
		color: "#505050",
	},
	detailsMakePics: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		width: '100%',
		marginLeft: '0%',
		marginRight: '0%',
		marginTop: 3,
		flexDirection: 'row',
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'white',
	},
	headerTextView: {
		// marginLeft: '2%',
		width: responsiveWidth(98),
		flexDirection: 'row',
		// borderWidth: 1,
		justifyContent: 'center'
	},
	detailsHeaderTopRow: {
		flexDirection: 'row',
		// alignItems: 'flex-end'
	},
	detailsHeaderTextBox: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: responsiveFontSize(2.8),
		color: "#505050",
		// borderWidth: 1
		// width: '100%',
	},
	detailsChefTextBox: {
		textAlign: 'right',
		fontWeight: 'normal',
		fontStyle: 'italic',
		fontSize: responsiveFontSize(2.5),
		borderWidth: 1,
		alignSelf: 'flex-end',
		// width: '100%',
	},
	usernameContainer: {
		width: '100%',
		marginRight: '5%'
	},
	detailsHeaderButtonsContainer: {
		flexDirection: 'row',
		width: '20%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	detailsHeaderUsername: {
		marginLeft: '1%',
		marginRight: '1%',
		textAlign: 'right',
		fontSize: 14,
		color: "#505050",
		width: '100%'
	},
	detailsSubHeadings: {
		marginLeft: '3%',
		marginRight: '3%',
		fontWeight: 'bold',
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
		width: '80%'
	},
	detailsContents: {
		marginLeft: '3%',
		marginRight: '3%',
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
		paddingLeft: responsiveWidth(2),
		// borderWidth: 1,
	},
	detailsContentsHeader: {
		marginLeft: '3%',
		marginRight: '3%',
		fontStyle: 'italic',
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
		// width: '100%',
		// borderWidth: 1,
		// backgroundColor: 'red'
	},
	detailsLikesAndMakesUpperContents: {
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
		textAlign: 'center',
		marginLeft: '5%',
		bottom: responsiveHeight(0.2)
	},
	detailsLikesAndMakesLowerContents: {
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
		textAlign: 'center',
		flex: 1,
		bottom: responsiveHeight(0.2),
	},
	detailsImage: {
		borderRadius:responsiveWidth(1.5),
	},
	ingredientsTable: {
		flexDirection: 'row',
		overflow: 'hidden',
		width: '96%',
		marginLeft: '2%',
		marginRight: '2%',
		// borderBottomColor: '#104e01',
		// borderBottomWidth: 0.5,
		paddingBottom: '0.25%',
		paddingTop: '0.25%',
		// justifyContent: 'center',
		// alignItems: 'center',
	},
	ingredientsTableLeft: {
		flex: 1,
	},
	ingredientsTableRight: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	ingredientName: {
		flex: 1,
		textAlign: 'left',
		fontWeight: 'normal',
		marginLeft: '4%',
		color: "#505050",
		flexWrap: 'wrap',
		// borderWidth: 1,
	},
	ingredientQuantity: {
		flex: 0.34,
		textAlign: 'left',
		color: "#505050",
	},
	ingredientUnit: {
		flex: 0.6,
		textAlign: 'left',
		color: "#505050",
	},
	detailsComments: {
		borderStyle: 'solid',
		borderWidth: 1,
		paddingTop: '1%',
		borderColor: '#104e01',
		// height: 500,
		width: '100%',
		marginLeft: '0%',
		marginRight: '0%',
		marginTop: responsiveHeight(0.5),
		marginBottom: responsiveHeight(0.5),
		borderRadius:responsiveWidth(1.5),
		backgroundColor: 'white',
		// opacity: 0.9,
	},
	commentContainer: {
		flexDirection: 'row',
		marginTop: 3,
		// marginBottom: '2%'
		width: '96%',
		marginLeft: '2%',
		marginRight: '2%',
		borderBottomColor: '#104e01',
		borderBottomWidth: 0.5,
		paddingBottom: '1%'
	},
	commentLeftContainer: {
		// flexDirection: 'row'
		flex: 2,
		// borderStyle: 'solid',
		// borderWidth: 1,
	},
	commentRightContainer: {
		// flexDirection: 'row'
		// borderStyle: 'solid',
		// borderWidth: 1,
		flex: 8
	},
	commentRightTopContainer: {
		flexDirection: 'row',
		width: '93%',
		justifyContent:'space-between',
		// borderWidth: 1
	},
	makePicScrollView: {
		// height: 120,
		borderRadius:responsiveWidth(1.5),
		marginTop: responsiveHeight(0.5),
		paddingBottom: responsiveHeight(0.5),
		// flex: 1  // DO NOT USE THIS IT BREAKS EVERYTHING
	},
	avatarThumbnail: {
		height: 60,
		width: '96%',
		marginRight: '4%',
		borderRadius:responsiveWidth(1.5),
	},
	makePicContainer: {
		height: 115,
		width: 115,
		borderRadius:responsiveWidth(1.5),
		overflow: 'hidden'
	},
	// makePic: {
	//   position: 'absolute',
	//   height: 115
	// },
	makePicTrashCanButton: {
		zIndex: 1,
		position: 'absolute',
		top: 85,
		left: 85,
	},
	makePicTrashCan: {
		color: '#ffffff'
	},
	commentTrashCanButton: {
		zIndex: 1,
	},
	commentTrashCan: {
		color: '#505050'
	},
	headerButton: {
		marginRight: '4%'
	},
	headerIcon: {
		color: '#505050'
	},
	createRecipeFormButton: {
		marginLeft: '5%',
		marginRight: '5%',
		justifyContent: 'center',
		alignItems: 'center',
		width: '35%',
		height: 44,
		flexDirection: 'row',
		borderRadius:responsiveWidth(1.5),
		backgroundColor: '#fff59b',
		borderStyle: 'solid',
		borderWidth: 1,
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
	instructionImagePopupModalCover: {
		height: responsiveHeight(100),
		width: responsiveWidth(100),
		backgroundColor: 'rgba(0,0,0,0.75)',
	},
	instructionImagePopupContainer: {
		// height: responsiveWidth(90),
		marginTop: responsiveHeight(15),
		width: responsiveWidth(90),
		marginLeft: responsiveWidth(5),
		marginRight: responsiveWidth(5),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(256,256,256,1)',
		borderRadius:responsiveWidth(1.5),
		overflow: 'hidden'
	},
	instructionPopupImage: {
		marginVertical: responsiveWidth(2.5),
		height: responsiveWidth(85),
		width: responsiveWidth(85),
		borderRadius:responsiveWidth(1.5),
	},
	primaryImagesScrollView: {
		width: '100%',
		height: 250,
		borderWidth: 5,
		borderColor: 'red'
	},
	detailsImageWrapper: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		backgroundColor: 'white',
		width: '100%',
		marginLeft: '0%',
		marginRight: '0%',
		marginTop: responsiveHeight(0.5),
		// marginBottom: '1%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius:responsiveWidth(1.5),
		overflow: 'hidden',
	},
	// primaryImageWrapper: {
	// 	borderWidth: 1,
	// 	borderColor: 'red'
	// },
	primaryImageFlatList: {
		// borderWidth:1,
		// borderColor: 'yellow',
		width: responsiveWidth(100)-2,
		height: responsiveWidth(75),
		// left: 100
		borderRadius:responsiveWidth(1.5),
		overflow: 'hidden'
	},
	primaryImageBlobsContainer: {
		// borderWidth: 1,
		// borderColor: 'red',
		position: 'absolute',
		alignSelf: 'center',
		bottom: 0,
		// width: 100,
		// height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	primaryImageBlob: {
		color: '#fff59b',
		// color: '#104e01',
		marginHorizontal: responsiveWidth(1),
		opacity: 0.75
	},
	chefContainer: {
		flexDirection: 'row',
		// borderBottomWidth: 1,
		width: responsiveWidth(85),
		borderRadius:responsiveWidth(1.5),
		justifyContent: 'space-between',
		// borderColor: '#104e01',
		marginTop: responsiveWidth(2.5),
		paddingBottom: responsiveWidth(2.5)
	},
	chefLeftContainer: {
		// justifyContent: 'space-between',
		// borderWidth: 1,
		width: responsiveWidth(65)
	},
	popupSeparator: {
		width: responsiveWidth(85),
		borderBottomWidth: 1,
		borderColor: '#104e01'
	},
	thumbnail: {
		// position: 'absolute',
		height: responsiveWidth(17.5),
		width: responsiveWidth(17.5),
		borderRadius:responsiveWidth(1.5)
	},
	chefUsername: {
		fontSize: responsiveFontSize(2.25),
		fontWeight: 'bold',
		width: '100%',
		color: '#505050'
		// textAlign: 'center'
	}
});
