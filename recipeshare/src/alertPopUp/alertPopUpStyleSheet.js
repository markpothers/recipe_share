import React from 'react'
import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  modalFullScreenContainer:{
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentsContainer:{
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    backgroundColor: '#fff59b',
    width: responsiveWidth(85),
    // height: res,
    // marginTop: '7.5%',
    // marginBottom: '7.5%',
    marginLeft: '7.5%',
    marginRight: '7.5%',
    borderRadius: 5,
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    width: '90%',
    // marginTop: '4%',
    paddingTop: responsiveHeight(1),
    // paddingBottom: responsiveHeight(1),
    // height: 27,
  },
  title: {
    color: '#104e01',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    // textAlign: 'center'
  },
  formRow: {
    marginTop: '3%',
    flexDirection:'row',
    // justifyContent: 'center',
    justifyContent: 'flex-end',
    borderRadius: 5,
    width: '90%',
    // borderWidth: 1
  },
  // spacer: {
    // marginTop: '0%',
    // marginLeft: '5%',
    // marginRight: '5%',
    // backgroundColor: 'white',
    // height: responsiveHeight(3),
    // width: '90%',
    // justifyContent: 'center',
    // borderRadius: 5,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#104e01',
    // overflow: 'hidden'
  // },
  tAndCText:{
    margin: '2%'
  },
  buttonPlaceholder: {
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 44,
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  closeButton:{
    // marginLeft: '5%',
    // marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '40%',
    minHeight: responsiveHeight(6),
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#104e01',
  },
  closeButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff59b',
  },
  closeIcon: {
    color: '#fff59b',
  },
  });