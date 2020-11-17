import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'; //eslint-disable-line no-unused-vars

export const styles = StyleSheet.create({
	recipeCard: {
		marginTop: responsiveHeight(0.2),
		marginBottom: responsiveHeight(0.2),
		width: '100%',
		borderStyle: 'solid',
		borderColor: '#104e01',
		borderRadius:responsiveWidth(1.5),
		borderWidth: 1,
		backgroundColor: 'white'
	},
	recipeCardTopPostedByContainer: {
		borderBottomWidth: 0.5,
		borderBottomColor: '#104e01',
		// height: 25,
		width: '96.4%',
		marginLeft: '1.6%',
		marginRight: '2%',
		paddingBottom: responsiveHeight(0.5),
		paddingTop: responsiveHeight(0.5),
		flexDirection: 'row',
		alignItems: 'center',
		// borderWidth: 1,
		// flexWrap: 'wrap'
	},
	recipeCardTopPostedByTouchable: {
		// borderWidth: 1,
		maxWidth: responsiveWidth(60)
	},
	recipeCardTopContainer: {
		flexDirection: 'row',
		width: '100%',
		marginTop: '1%',
		marginBottom: '1%'
	},
	recipeCardTopLeftContainer: {
		flex: 8,
		justifyContent: 'center',
		// borderWidth: 1,
	},
	recipeCardTopRightContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		// borderWidth: 1,
	},
	avatarThumbnail: {
		height: responsiveHeight(9),
		width: responsiveHeight(9),
		marginRight: '4%',
		borderRadius:responsiveWidth(1.5),
	},
	recipeCardTopLeftUpperContainer: {
		width: '96%',
		marginLeft: '2%',
		marginRight: '2%'
	},
	recipeCardTopLeftMiddleContainer: {
		width: '96%',
		marginLeft: '2%',
		marginRight: '2%',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	recipeCardTopLeftLowerContainer: {
		flexDirection: 'row',
		width: '96%',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: '2%',
		marginRight: '2%'
	},
	recipeCardImageContainer: {
		height: responsiveHeight(37.5),
		width: responsiveWidth(100),
		alignItems:'center',
		alignSelf: 'center'
	},
	thumbnail: {
		position: 'absolute',
		height: '100%',
		width: responsiveWidth(100)-4,
		borderRadius:responsiveWidth(1.5)
	},
	recipeCardBottomContainer: {
		flexDirection: 'row',
		marginTop: '1%',
		marginBottom: '1%',
		// height: 25,
	},
	recipeCardBottomSubContainers: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		color: '#505050',
		alignSelf: 'center',
		marginRight: '10%'
	},
	recipeCardHighlighted: {
		fontWeight: 'bold',
		fontSize: responsiveFontSize(2.1),
		color: "#505050",
		textAlign: 'left'
	},
	recipeCardTopOther: {
		fontSize: responsiveFontSize(1.9),
		color: "#505050",
		flex: 1,
	},
	recipeCardTopItalic: {
		fontSize: responsiveFontSize(1.9),
		color: "#505050",
		fontStyle: 'italic',
	},
	recipeCardBottomOther: {
		marginLeft: '5%',
		fontSize: responsiveFontSize(2.1),
		fontWeight: 'bold',
		color: "#505050",
		textAlign: 'center'
	},
	filterButton: {
		position: 'absolute',
		backgroundColor: '#fff59b',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#104e01',
		width: responsiveHeight(8),
		height: responsiveHeight(8),
		justifyContent: 'center',
		alignItems: 'center',
		bottom: responsiveHeight(4),
		right: responsiveHeight(4),
		borderRadius:responsiveWidth(1.5),
		zIndex: 1
	},
	filterIcon: {
		color: '#104e01',
	},
	cantNavigateMessageContainer: {
		borderRadius:responsiveWidth(1.5),
		position: 'absolute',
		alignSelf: 'center',
		top: '35%',
		zIndex: 2,
		backgroundColor: '#104e01',
		borderWidth: 1,
		borderColor: '#fff59b',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cantNavigateMessageText: {
		color: '#fff59b',
		paddingHorizontal: responsiveWidth(2),
		paddingVertical: responsiveHeight(1),
		textAlign: 'center',
		fontSize: responsiveFontSize(2)
	},
	reSharedIcon: {
		color: '#505050',
		// alignSelf: 'center',
		marginRight: responsiveWidth(2)
	},
});
