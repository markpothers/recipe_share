import { StyleSheet } from "react-native";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions"; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	mainPageContainer: {
		// borderStyle: 'solid',
		// borderWidth: 2,
		// borderColor: '#9e0000f8',
		// overflow: 'scroll'
		flex: 1,
		// flexDirection: 'column'
	},
	background: {
		width: "100%",
		height: "100%",
		flex: 1
		// opacity: '20%'
	},
	backgroundImageStyle: {
		// opacity: 0.8
	},
	chefCard: {
		// height: 319,
		marginTop: responsiveHeight(0.5),
		marginBottom: responsiveHeight(0.5),
		// width: '100%',
		// borderStyle: 'solid',
		borderRadius:responsiveWidth(1.5),
		borderWidth: 1,
		borderColor: "#104e01",
		backgroundColor: "white",
		overflow: "hidden"
	},
	// chefCardTopPostedByContainer: {
	//   // borderBottomStyle: 'solid 0.5',
	//   borderBottomWidth: 0.5,
	//   height: 25,
	//   width: '96.4%',
	//   marginLeft: '1.6%',
	//   marginRight: '2%',
	//   paddingBottom: '1%',
	//   paddingTop: '1%',
	//   flexDirection: 'row'
	// },
	chefCardTopContainer: {
		flexDirection: "row",
		alignItems: "center",
		// borderStyle: 'solid',
		//borderWidth: 1,
		// height: 100,
		// width: '100%',
		// marginTop: '1%',
		// marginBottom: '1%'
	},
	chefCardTopLeftContainer: {
		// flex: 7,
		// borderStyle: 'solid',
		width: responsiveWidth(74),
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
		// overflow: 'hidden',
	},
	avatarThumbnail: {
		// position: 'absolute',
		height: "85%",
		width: "85%",
		// marginRight: '4%',
		borderRadius: 10,
	},
	chefCardTopLeftUpperContainer: {
		// borderStyle: 'solid',
		//borderWidth: 1,
		width: "96%",
		// marginTop: '1%',
		// marginBottom: '1%',
		paddingVertical: responsiveHeight(0.5),
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
		// marginBottom: '1%',
		marginLeft: "2%",
		marginRight: "2%"
	},
	chefCardImageContainer: {
		// borderStyle: 'solid',
		// borderWidth: 1,
		height: "100%",
		width: "100%"
	},
	thumbnail: {
		// position: 'absolute',
		height: "100%",
		width: "100%",
		borderRadius:responsiveWidth(1.5)
	},
	chefCardBottomContainer: {
		flexDirection: "row",
		marginTop: "1%",
		marginBottom: "1%",
		// height: 25,
		// borderStyle: 'solid',
		// borderWidth: 1,
	},
	chefCardBottomSubContainers: {
		flexDirection: "row",
		flex: 1,
		// borderStyle: 'solid',
		// borderWidth: 2,
		justifyContent: "center",
		alignItems: "center"
	},
	icon: {
		color: "#505050",
		alignSelf: "center",
		marginRight: "10%"
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
		fontSize: responsiveFontSize(2),
		fontWeight: "bold",
		color: "#505050",
		textAlign: "center"
	},
	cantGetChefMessageContainer: {
		borderRadius:responsiveWidth(1.5),
		position: "absolute",
		alignSelf: "center",
		top: "25%",
		zIndex: 2,
		backgroundColor: "#104e01",
		borderWidth: 1,
		borderColor: "#fff59b",
		justifyContent: "center",
		alignItems: "center"
	},
	cantGetChefMessageText: {
		color: "#fff59b",
		paddingHorizontal: responsiveWidth(2),
		paddingVertical: responsiveHeight(1),
		textAlign: "center",
		fontSize: responsiveFontSize(2)
	}
});
