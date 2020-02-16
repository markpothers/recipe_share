import React from 'react'
import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

const inDevelopment = false

export const centralStyles = StyleSheet.create({
  activityIndicator:{
    left: 1.25,
    top: 1.32
  },
  activityIndicatorContainer:{
    position: 'absolute',
    top: '10%',
    left: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#fff59b',
    borderColor: '#104e01',
    borderWidth: 1,
    width: 47,
    height: 47,
    zIndex: 1
  },
  spinachFullBackground: {
    flex: 1,
    borderWidth: inDevelopment ? 1 : 0,
    borderColor: 'black'
  },
  fullPageSafeAreaView: {
    flex: 1,
    borderWidth: inDevelopment ? 1 : 0,
    borderColor: 'white'
  },
  fullPageKeyboardAvoidingView: {
    flex: 1,
    borderWidth: inDevelopment ? 1 : 0,
    borderColor: 'red'
  },
  fullPageScrollView: {
    flex: 1,
    borderWidth: inDevelopment ? 1 : 0,
    borderColor: 'yellow'
  },
  formContainer: {
    // height: 100,
    width: responsiveWidth(80),
    marginLeft: responsiveWidth(10),
    marginRight: responsiveWidth(10),
    borderWidth: inDevelopment ? 1 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle:{
    width: '100%',
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: responsiveHeight(2.5),
    color: "#505050",
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#104e01',
    paddingLeft: responsiveWidth(2),
    paddingRight: responsiveWidth(2),
  },
  formSection: {
    width: '100%',
    borderWidth: inDevelopment ? 1 : 0,
    borderColor: 'yellow',
  },
  formSectionSeparatorContainer:{
    borderWidth:1,
    borderColor: '#104e01',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(0.5),
  },
  formSectionSeparator: {
    borderBottomWidth: responsiveHeight(0.66),
    borderBottomColor: '#fff59b',
    // height: responsiveHeight(5),

    width: responsiveWidth(80),
  },
  // formSectionTitleContainer: {
  //   // height: responsiveHeight(6),
  //   borderRadius: 5,
  //   backgroundColor: '#104e01',
  //   // borderWidth: 1,
  //   // borderColor: '#fff59b',
  //   justifyContent: 'center',
  //   marginLeft: responsiveWidth(5),
  // },
  // formSectionTitle: {
  //   fontSize: responsiveFontSize(2.25),
  //   color: '#fff59b',
  //   marginLeft: responsiveWidth(2),
  //   marginRight: responsiveWidth(2),
  //   // fontWeight: 'bold',
  // },
  formInputContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(0.5),
    width: '100%',
    borderWidth: inDevelopment ? 1 : 0,
    borderColor: 'red',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    // height: responsiveHeight(6),
    // backgroundColor: 'red'
  },
  formInput: {
    height: responsiveHeight(6),
    width: '100%',
    backgroundColor: 'white',
    textAlign: 'left',
    textAlignVertical: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#104e01',
    paddingLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
  },
  formTextBoxContainer: {
    // marginTop: responsiveHeight(0.5),
    height: responsiveHeight(6),
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#104e01',
    borderRadius: 5,
  },
  formTextBox:{
    width: '100%',
    // backgroundColor: 'white',
    textAlign: 'left',
    textAlignVertical: 'center',
    borderRadius: 5,
    paddingLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
  },
  formErrorView: {
    marginTop: responsiveHeight(0.5),
    // height: responsiveHeight(3),
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#104e01'
  },
  formErrorText:{
    color: "#9e0000f8",
    fontSize: responsiveFontSize(1.5),
    paddingLeft: responsiveWidth(2),
    paddingRight: responsiveWidth(2),
    paddingTop: responsiveHeight(0.25),
    paddingBottom: responsiveHeight(0.25),
  },
  yellowRectangleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(38),
    height: responsiveHeight(6),
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#fff59b',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  greenButtonIcon: {
    color: '#104e01',
  },
  greenButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#104e01',
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(3)
  },
  pickerContainer: {
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#104e01',
    overflow: 'hidden',
  }

  });