import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
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
      // borderColor: 'black',
      width: '100%',
      justifyContent: 'center',
      marginLeft: '0%',
      marginRight: '0%',
      marginTop: '1%',
      borderRadius: 5,
      backgroundColor: 'white',
      // backgroundColor: '#fff59b',
      // opacity: 0.9,
    },
    detailsImageWrapper: {
      borderStyle: 'solid',
      borderWidth: 1,
      // borderColor: 'black',
      width: '100%',
      marginLeft: '0%',
      marginRight: '0%',
      marginTop: '1%',
      marginBottom: '1%',
      // justifyContent: 'center',
      // alignItems: 'center',
      // borderRadius: 5,
      // overflow: 'hidden',
    },
    detailsIngredients: {
      borderStyle: 'solid',
      borderWidth: 1,
      // borderColor: 'black',
      width: '100%',
      marginLeft: '0%',
      marginRight: '0%',
      // marginTop: '1%',
      borderRadius: 5,
      backgroundColor: 'white',
      // opacity: 0.9,
    },
    detailsInstructions: {
      borderStyle: 'solid',
      borderWidth: 1,
      // borderColor: 'black',
      width: '100%',
      marginLeft: '0%',
      marginRight: '0%',
      marginTop: '1%',
      borderRadius: 5,
      backgroundColor: 'white',
      // opacity: 0.9,
      marginBottom: '1%',
    },
    detailsMakePicsContainer: {
      borderStyle: 'solid',
      borderWidth: 1,
      // borderColor: 'black',
      // width: '100%',
      // marginLeft: '0%',
      // marginRight: '0%',
      marginTop: '1%',
      borderRadius: 5,
      backgroundColor: 'white',
      // opacity: 0.9,
      marginBottom: '1%',
      // height: 250
    },
    detailsLikes: {
      borderStyle: 'solid',
      borderWidth: 1,
      // borderColor: 'black',
      width: '100%',
      marginLeft: '0%',
      marginRight: '0%',
      marginTop: '1%',
      borderRadius: 5,
      backgroundColor: 'white',
      // opacity: 0.9,
      flex: 1,
      flexDirection: 'row'
    },
    detailsMakePics: {
      borderStyle: 'solid',
      borderWidth: 1,
      // borderColor: 'black',
      width: '100%',
      marginLeft: '0%',
      marginRight: '0%',
      marginTop: '1%',
      flexDirection: 'row',
      borderRadius: 5,
      backgroundColor: 'white',
      // opacity: 0.9,
    },
    detailsHeaderTextBox: {
      marginLeft: '1%',
      marginRight: '1%',
      // marginTop: '1%',
      // marginBottom: '1%',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      color: "#505050",
      // color: "#104e01",
    },
    detailsSubHeadings: {
      marginLeft: '3%',
      marginRight: '3%',
      // marginTop: '1%',
      // marginBottom: '1%',
      // textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      color: "#505050",
    },
    detailsContents: {
      marginLeft: '3%',
      marginRight: '3%',
      // marginTop: '1%',
      // marginBottom: '1%',
      // textAlign: 'center',
      // fontWeight: 'bold',
      fontSize: 16,
      color: "#505050",
    },
    detailsContentsHeader: {
      marginLeft: '3%',
      marginRight: '3%',
      // marginTop: '1%',
      // marginBottom: '1%',
      // textAlign: 'center',
      fontStyle: 'italic',
      fontSize: 16,
      color: "#505050",
    },
    detailsLikesAndMakesContents: {
      marginLeft: '3%',
      marginRight: '3%',
      // marginTop: '1%',
      // marginBottom: '1%',
      // textAlign: 'center',
      // fontWeight: 'bold',
      fontSize: 16,
      color: "#505050",
      textAlign: 'center',
      flex:1
    },
    detailsImage:{
      borderRadius: 5,
    },
    ingredientsTable:{
      flexDirection: 'row',
      overflow: 'hidden',
      // marginLeft: '1%'
    },
    ingredientName:{
      flex: 1,
      textAlign: 'left',
    },
    ingredientQuantity:{
      flex: 0.25,
      textAlign: 'left',
    },
    ingredientUnit:{
      flex: 0.75,
      textAlign: 'left',
    },
    detailsLikesAndMakes:{
      // flexDirection: 'row'
    },
    detailsComments: {
      borderStyle: 'solid',
      borderWidth: 1,
      // borderColor: 'black',
      // height: 500,
      width: '100%',
      marginLeft: '0%',
      marginRight: '0%',
      marginTop: '1%',
      borderRadius: 5,
      backgroundColor: 'white',
      // opacity: 0.9,
    },
    commentContainer: {
      flexDirection: 'row',
      marginTop: '1%',
      // marginBottom: '2%'
    },
    commentLeftContainer: {
      // flexDirection: 'row'
      flex: 2,
      borderStyle: 'solid',
      borderWidth: 1,
    },
    commentRightContainer: {
      // flexDirection: 'row'
      borderStyle: 'solid',
      borderWidth: 1,
      flex: 8
    },
    makepicScrollView:{
      // position: 'absolute',
      borderStyle: 'solid',
      borderWidth: 2,
      // height: 115,
      // width: 115
    },
    avatarThumbnail:{
      height: 60,
      width: '96%',
      marginRight: '4%',
      borderRadius: 5,
    }
  });