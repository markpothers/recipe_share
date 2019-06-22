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
      borderRadius: 5,
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
      paddingTop: '1%',
      // paddingBottom: '1%'
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
      // marginBottom: '1%',
      paddingTop: '1%',
      paddingBottom: '1%'
    },
    detailsMakePicsContainer: {
      borderStyle: 'solid',
      borderWidth: 0.5,
      // borderColor: 'black',
      // width: '100%',
      // marginLeft: '0%',
      // marginRight: '0%',
      marginTop: '1%',
      borderRadius: 5,
      backgroundColor: 'white',
      // opacity: 0.9,
      // marginBottom: '1%',
      paddingTop: '1%',
      // height: 250
    },
    detailsLikesAndMakes:{
      // flexDirection: 'row'
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
      flexDirection: 'row',
      paddingTop: '0.5%',
      paddingBottom: '0.5%',
      height: 30,
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    buttonAndText: {
      flexDirection: 'row',
      // position: 'absolute'
      bottom: '10%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // alignSelf: 'center',
      // borderStyle: 'solid',
      // borderWidth: 1,
    },
    icon: {
      color: "#505050"
    },
    addIcon: {
      color: "#505050",
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
      fontWeight: 'bold',
      fontSize: 16,
      color: "#505050",
      width: '80%'
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
    detailsLikesAndMakesUpperContents: {
      fontSize: 16,
      color: "#505050",
      textAlign: 'center',
      marginLeft: '5%'
    },
    detailsLikesAndMakesLowerContents: {
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
      width: '96%',
      marginLeft: '2%',
      marginRight: '2%',
      borderBottomColor: '#505050',
      borderBottomWidth: 0.5,
      paddingBottom: '0.25%',
      paddingTop: '0.25%'

    },
    ingredientName:{
      flex: 1,
      textAlign: 'left',
      // fontStyle: 'italic',
      fontWeight: 'normal',
      marginLeft: '6%',
      color: "#505050",
    },
    ingredientQuantity:{
      flex: 0.25,
      textAlign: 'left',
      color: "#505050",
    },
    ingredientUnit:{
      flex: 0.75,
      textAlign: 'left',
      color: "#505050",
    },
    detailsComments: {
      borderStyle: 'solid',
      borderWidth: 1,
      paddingTop: '1%',
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
      width: '96%',
      marginLeft: '2%',
      marginRight: '2%',
      borderBottomColor: '#505050',
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
    makePicScrollView:{
      // position: 'absolute',
      borderStyle: 'solid',
      borderWidth: 1,
      // height: 115,
      // width: 115
      marginTop: '1%',
    },
    avatarThumbnail:{
      height: 60,
      width: '96%',
      marginRight: '4%',
      borderRadius: 5,
    },
    makePicContainer: {
      height: 115,
      width: 115
    },
    makePic: {
      position: 'absolute'
    },
    makePicTrashCanButton: {
      zIndex: 1,
      position: 'absolute',
      top: 75,
      left: 85,
    },
    makePicTrashCan: {
      color: '#ffffff'
    }
  });