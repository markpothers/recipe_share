import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
    scrollTabHeader: {
      opacity: 1,
    },
    tabStyle: {
      backgroundColor: '#104e01',
      opacity: 0.8,
    },
    scrollUnderline: {
      backgroundColor: '#f8e858f8',
    },
    activeTabHeadingText: {
      fontWeight: 'bold',
      color: "#f8e858f8",
    },
    inactiveTabHeadingText: {
      fontWeight: 'normal',
      color: "#fff59b",
    },

    background: {
      width: '100%',
      height: '100%',
      flex: 1
      // opacity: '20%'
    },
    backgroundImageStyle: {
      // opacity: 0.8
    },
    chefCard: {
      // height: 319,
      marginTop: 2,
      marginBottom: 2,
      width: '100%',
      borderStyle: 'solid',
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: 'white'
    },
    chefCardTopPostedByContainer: {
      // borderBottomStyle: 'solid 0.5',
      borderBottomWidth: 0.5,
      height: 25,
      width: '96.4%',
      marginLeft: '1.6%',
      marginRight: '2%',
      paddingBottom: '1%',
      paddingTop: '1%',
      flexDirection: 'row'
    },
    chefCardTopContainer: {
      flexDirection: 'row',
      // borderStyle: 'solid',
      // borderWidth: 2,
      height: 100,
      width: '100%',
      marginTop: '1%',
      marginBottom: '1%'
    },
    chefCardTopLeftContainer: {
      flex: 7,
      // borderStyle: 'solid',
      // borderWidth: 2,
    },
    chefCardTopRightContainer: {
      flex: 4,
      // borderStyle: 'solid',
      // borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    avatarThumbnail: {
      // position: 'absolute',
      height: '96%',
      width: '96%',
      marginRight: '4%',
      borderRadius: 5,
    },
    chefCardTopLeftUpperContainer:{
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      // marginTop: '1%',
      // marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    chefCardTopLeftMiddleContainer:{
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      // marginTop: '1%',
      // marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%',
      flexDirection: 'row'
    },
    chefCardTopLeftLowerContainer:{
      // flexDirection: 'row',
      // borderStyle: 'solid',
      // borderWidth: 2,
      width: '96%',
      // justifyContent: 'center',
      // alignItems: 'center',
      // marginTop: '1%',
      // marginBottom: '1%',
      marginLeft: '2%',
      marginRight: '2%'
    },
    chefCardImageContainer: {
      // borderStyle: 'solid',
      // borderWidth: 2,
      height: 250,
      width: '100%'
    },
    thumbnail: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      borderRadius: 5
    },
    chefCardBottomContainer: {
      flexDirection: 'row',
      marginTop: '1%',
      marginBottom: '1%',
      height: 25,
      // borderStyle: 'solid',
      // borderWidth: 2,
    },
    chefCardBottomSubContainers: {
      flexDirection: 'row',
      flex: 1,
      // borderStyle: 'solid',
      // borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      color: '#505050',
      alignSelf: 'center',
      marginRight: '10%'
    },
    chefCardHighlighted: {
      fontWeight: 'bold',
      fontSize: 16,
      color: "#505050",
      textAlign: 'center'
    },
    chefCardTopOther: {
      fontSize: 13,
      color: "#505050",
      flex: 1
    },
    chefCardTopItalic:{
      fontSize: 13,
      color: "#505050",
      fontStyle: 'italic'
    },
    chefCardBottomOther: {
      marginLeft: '5%',
      fontSize: 16,
      fontWeight: 'bold',
      color: "#505050",
      textAlign: 'center'
    }
  });