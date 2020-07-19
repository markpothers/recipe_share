import React from 'react'
import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(100),
    height: responsiveHeight(9),
    marginTop: -responsiveHeight(3.5),
    // borderWidth: 1,
    // borderColor: 'red',
    // backgroundColor: '#104e01',
  },
  headerEnd:{
    width: responsiveWidth(15),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMiddle:{
    minWidth: responsiveWidth(70),
    height: '100%',
    justifyContent: 'center'
  },
  headerDrawerButton: {
    marginLeft: responsiveWidth(4),
    marginRight: responsiveWidth(2),
  },
  headerNewButton: {

  },
  headerIcon:{
    color: '#fff59b'
  },
  headerText:{
    fontSize: responsiveFontSize(3.5),
    color: '#fff59b',
    marginLeft: responsiveWidth(2)
  },
  background: {
    width: '100%',
    height: '100%',
  },
});