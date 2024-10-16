import { StyleSheet } from "react-native";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	mainPageContainer: {
		flex: 1,
	},
	background: {
		width: "100%",
		height: "100%",
		flex: 1
	},
	backgroundImageStyle: {

	},
	chefCard: {
		marginTop: 2,
		marginBottom: 1,
		width: "100%",
		borderStyle: "solid",
		borderRadius:responsiveWidth(1.5),
		borderWidth: 1,
		borderColor: "#104e01",
		backgroundColor: "white"
	},
	chefCardTopPostedByContainer: {
		// borderBottomStyle: 'solid 0.5',
		borderBottomWidth: 0.5,
		height: 25,
		width: "96.4%",
		marginLeft: "1.6%",
		marginRight: "2%",
		paddingBottom: "1%",
		paddingTop: "1%",
		flexDirection: "row"
	},
	chefCardTopContainer: {
		flexDirection: "row",
		// borderStyle: 'solid',
		// borderWidth: 1,
		// height: responsiveWidth(30),
		width: "100%",
		alignItems: "center",
		marginTop: responsiveHeight(0.5),
		marginBottom: responsiveHeight(0.5)
	},
	chefCardTopLeftContainer: {
		// flex: 7,
		width: responsiveWidth(74),
		// borderStyle: 'solid',
		// borderWidth: 1,
	},
	chefCardTopRightContainer: {
		// flex: 4,
		width: responsiveWidth(25),
		height: responsiveWidth(25),
		// borderStyle: 'solid',
		// borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		// paddingBottom: '4%'
	},
	avatarThumbnail: {
		// position: 'absolute',
		height: "96%",
		width: "96%",
		// marginRight: '4%',
		borderRadius:responsiveWidth(1.5),
	},
	chefCardTopLeftUpperContainer: {
		// borderStyle: 'solid',
		// borderWidth: 1,
		width: "96%",
		// marginTop: '1%',
		// marginBottom: '1%',
		marginLeft: "2%",
		marginRight: "2%"
	},
	chefCardTopLeftMiddleContainer: {
		// borderStyle: 'solid',
		// borderWidth: 1,
		width: "96%",
		// marginTop: '1%',
		// marginBottom: '1%',
		marginLeft: "2%",
		marginRight: "2%",
		flexDirection: "row"
	},
	chefCardTopLeftLowerContainer: {
		// flexDirection: 'row',
		// borderStyle: 'solid',
		// borderWidth: 1,
		width: "96%",
		// justifyContent: 'center',
		// alignItems: 'center',
		// marginTop: '1%',
		// marginBottom: '2%',
		marginLeft: "2%",
		marginRight: "2%"
	},
	// chefCardImageContainer: {
	//   // borderStyle: 'solid',
	//   // borderWidth: 2,
	//   height: 250,
	//   width: '100%',
	//   marginBottom: '2%'
	// },
	thumbnail: {
		position: "absolute",
		height: "100%",
		width: "100%",
		borderRadius:responsiveWidth(1.5),
	},
	chefCardBottomContainer: {
		flexDirection: "row",
		marginTop: "1%",
		marginBottom: "1%",
		height: 25,
		// borderStyle: 'solid',
		borderWidth: 1,
	},
	chefCardHighlighted: {
		fontWeight: "bold",
		fontSize: responsiveFontSize(2),
		color: "#505050",
		textAlign: "center"
	},
	chefCardTopOther: {
		fontSize: responsiveFontSize(1.8),
		color: "#505050",
		flex: 1
	},
	chefCardTopItalic: {
		fontSize: responsiveFontSize(1.8),
		color: "#505050",
		fontStyle: "italic"
	},
	chefCardBottomOther: {
		marginLeft: "5%",
		fontSize: 16,
		fontWeight: "bold",
		color: "#505050",
		textAlign: "center"
	},
	recipeBookContainer: {
		flex: 1,
		// borderStyle: 'solid',
		// borderWidth: 5,
		// borderColor: 'yellow',
		height: responsiveHeight(87.5)
	},
	chefDetailsStats: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#104e01",
		width: "100%",
		marginLeft: "0%",
		marginRight: "0%",
		marginTop: 1,
		marginBottom: 1,
		borderRadius:responsiveWidth(1.5),
		backgroundColor: "white",
		// opacity: 0.9,
		flexDirection: "row",
		// paddingTop: '0.5%',
		// paddingBottom: '0.5%',
		// height: 30,
		justifyContent: "space-around",
		alignItems: "center",
		// flexWrap: 'wrap',
		// flex: 1,
		//paddingVertical: responsiveHeight(0.1),

	},
	chefDetailsColumnHeaders: {
		// flex: 4,
		fontSize: responsiveFontSize(2.2),
		marginTop: responsiveHeight(0.5),
		marginBottom: responsiveHeight(0.5),
		color: "#505050",
		fontWeight: "bold",
		// width: '100%',
		// marginRight: '10%',
		// top: '0.3%',
		// textAlign: 'right',
		// borderWidth: 1
	},
	icon: {
		color: "#505050",
		// borderWidth: 1,
		// width: responsiveWidth(10),
		marginLeft: "3%",
		marginRight: "3%"
	},
	chefDetailsRowTitle: {
		// flex: 4,
		fontSize: responsiveFontSize(2.2),
		marginTop: responsiveHeight(0.5),
		marginBottom: responsiveHeight(0.5),
		color: "#505050",
		// textAlign: 'center',
		minWidth: "35%",
		width: "50%",
		maxWidth: "55%",
		// height: 100,
		// marginLeft: '5%',
		// top: '0.3%',
		flexWrap: "wrap",
		// borderWidth: 1
	},
	chefDetailsRowContents: {
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
		textAlign: "center",
		// borderWidth: 1,
		// flex: 3
		width: "19%",
		// marginRight: '5%',
		// top: '0.3%'
	},
	chefRecipesRowContents: {
		fontSize: responsiveFontSize(2.2),
		color: "#505050",
		fontWeight: "bold",
		marginTop: responsiveHeight(0.5),
		marginBottom: responsiveHeight(0.5),
		// flex: 3
		// width: '45%',
		marginRight: responsiveWidth(5),
		// top: '0.3%'
	},
	chefRecipesFollowContainer: {
		flexDirection: "row",
		// borderStyle: 'solid',
		// borderWidth: 2,
		marginLeft: "5%",
		justifyContent: "center",
		alignItems: "center"
	},
	chefDetailsRecipesFollowNumber: {
		fontSize: 16,
		color: "#505050",
		textAlign: "center",
		fontWeight: "bold",
		// flex: 3
		// width: '10%',
		marginLeft: "3%",
		// top: '0.3%'
	},
	nameContainer: {
		flexDirection: "row",
		alignItems: "center",
		// justifyContent: 'center'
	},
	editButton: {
		marginRight: "15%",
		marginLeft: "7%",
	},
});
