import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
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
    marginBottom: 1,
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
    paddingBottom: '4%'
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
  // chefCardImageContainer: {
  //   // borderStyle: 'solid',
  //   // borderWidth: 2,
  //   height: 250,
  //   width: '100%',
  //   marginBottom: '2%'
  // },
  thumbnail: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 5,
  },
  chefCardBottomContainer: {
    flexDirection: 'row',
    marginTop: '1%',
    marginBottom: '1%',
    height: 25,
    // borderStyle: 'solid',
    // borderWidth: 2,
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
  },
  recipeBookContainer: {
    flex: 1,
    // borderStyle: 'solid',
    // borderWidth: 5,
    // borderColor: 'yellow',
    height: 555
  },
  chefDetailsStats: {
    borderStyle: 'solid',
    borderWidth: 1,
    // borderColor: 'black',
    width: '100%',
    marginLeft: '0%',
    marginRight: '0%',
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    // opacity: 0.9,
    flexDirection: 'row',
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
    height: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  chefDetailsColumnHeaders: {
    // flex: 4,
    fontSize: 16,
    color: "#505050",
    fontWeight: 'bold',
    // width: '37%',
    marginLeft: '62%',
    top: '0.3%'
  },
  icon: {
    color: "#505050",
    marginLeft: '5%'
  },
  chefDetailsRowTitle: {
    // flex: 4,
    fontSize: 16,
    color: "#505050",
    // textAlign: 'center',
    width: '37%',
    marginLeft: '5%',
    top: '0.3%'
  },
  chefDetailsRowContents: {
    fontSize: 16,
    color: "#505050",
    textAlign: 'center',
    // flex: 3
    width: '10%',
    marginLeft: '5%',
    top: '0.3%'
  },
  chefRecipesRowContents: {
    fontSize: 16,
    color: "#505050",
    fontWeight: 'bold',
    // flex: 3
    width: '45%',
    marginLeft: '5%',
    top: '0.3%'
  },
  chefRecipesFollowContainer: {
    flexDirection: 'row',
    // borderStyle: 'solid',
    // borderWidth: 2,
    marginLeft: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chefDetailsRecipesFollowNumber: {
    fontSize: 16,
    color: "#505050",
    textAlign: 'center',
    fontWeight: 'bold',
    // flex: 3
    // width: '10%',
    marginLeft: '3%',
    top: '0.3%'
  },
  });