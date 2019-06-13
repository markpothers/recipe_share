import React from 'react'
import { StyleSheet } from 'react-native';
import { Row } from 'native-base';

export const styles = StyleSheet.create({
    recipeCard: {
      // flex: 1,
      marginTop: '1%',
      // marginLeft: '1%',
      // marginRight: '1%',
      // marginBottom: '0%',
      // flexDirection: 'row',
      width: '100%',
      // height: 250,
      borderStyle: 'solid',
      borderWidth: 2,
      // borderColor: '#505050',
      // overflow: 'hidden',
      // borderRadius: 20,
      backgroundColor: 'white',
      // opacity: 0.9,
      // padding: 0
    },
    recipeCardTopContainer: {
      // flex: 1,
      flexDirection: 'row',
      borderStyle: 'solid',
      borderWidth: 2,
      // height: 75,
      width: '100%'
    },
    recipeCardTopLeftContainer: {
      flex: 8,
      borderStyle: 'solid',
      borderWidth: 2,
    },
    recipeCardTopRightContainer: {
      flex: 2,
      borderStyle: 'solid',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    },
    avatarThumbnail: {
      position: 'absolute',
      height: 75,
      width: 75,
      // marginTop: '0%',
      // marginLeft: '0%',
      // marginBottom: '0%'
    },
    recipeCardTopLeftUpperContainer:{
      // position: 'absolute',
      borderStyle: 'solid',
      borderWidth: 2,
      width: '100%'
    },
    recipeCardTopLeftLowerContainer:{
      // position: 'absolute',
      flexDirection: 'row',
      borderStyle: 'solid',
      borderWidth: 2,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },

    recipeCardImageContainer: {
      // flex: 1,
      borderStyle: 'solid',
      borderWidth: 2,
      height: 275,
      width: '100%'
    },
    thumbnail: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      // marginTop: '0%',
      // marginLeft: '0%',
      // marginBottom: '0%'
    },
    recipeCardBottomContainer: {
      // flex: 1,
      borderStyle: 'solid',
      borderWidth: 2,
      height: 50,
    },
    recipeCardHighlighted: {
      // position: 'absolute',
      // bottom: '66%',
      fontWeight: 'bold',
      fontSize: 16,
      color: "#505050",
      // height: '100%',
      // width: '100%',
      // alignSelf: 'center',
      // marginTop: '0%',
      // marginLeft: '8%',
      // marginBottom: '0%'
      textAlign: 'left'
    },
    recipeCardOther: {
      // position: 'absolute',
      // bottom: '30%',
      fontSize: 16,
      color: "#505050",
      flex: 1
      // textAlign: 'center'
    },
    // recipeCardLeftContent: {
    //   // position: 'absolute',
    //   flex: 1,
    //   // left: '0%',
    //   // marginTop: '0%',
    //   // marginLeft: '0%',
    //   // marginRight: '0%',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   width: '50%',
    //   height: '100%',
    //   // borderStyle: 'solid',
    //   // borderWidth: 2,
    // },
    // recipeCardRightContent: {
    //   // position: 'absolute',
    //   flex: 1,
    //   // left: '50%',
    //   // marginTop: '0%',
    //   // marginLeft: '0%',
    //   // marginRight: '0%',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   width: '50%',
    //   height: '100%',
    //   // borderStyle: 'solid',
    //   // borderWidth: 2,
    // },

    // recipeCardChefName: {
    //   position: 'absolute',
    //   bottom: '40%',
    //   // fontWeight: 'bold',
    //   fontSize: 16,
    //   color: "#505050",
    //   // height: '100%',
    //   // width: '100%',
    //   // alignSelf: 'center',
    //   // marginTop: '0%',
    //   // marginLeft: '8%',
    //   // marginBottom: '0%'
    //   textAlign: 'center'
    // },

    // recipeCardOtherBottom: {
    //   position: 'absolute',
    //   bottom: '15%',
    //   fontSize: 16,
    //   color: "#505050",
    //   textAlign: 'center'
    // },

  });