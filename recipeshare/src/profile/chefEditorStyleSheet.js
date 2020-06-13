import React from 'react'
import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  modalFullScreenContainer:{
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentsContainer:{
    // position: 'absolute',
    // left: '10%',
    // top: '12.5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    backgroundColor: '#fff59b',
    width: '95%',
    // marginTop: '12%',
    // marginLeft: '10%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    marginTop: responsiveHeight(1),
    // height: 27,
  },
  title: {
    color: '#104e01',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: responsiveWidth(1),
  },
  paragraph: {
    color: '#104e01',
    fontSize: responsiveFontSize(2.2),
  },
  editChefInputBox: {
    // marginLeft: '7.5%',
    // marginRight: '7.5%',
    backgroundColor: 'white',
    height: responsiveHeight(6),
    width: '90%',
    // justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  formRow: {
    marginTop: '2%',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  bottomSpacer: {
    height: responsiveHeight(2),
  },
  editChefTextBox: {
    marginLeft: '3%',
    marginRight: '3%',
  },
  editChefInputAreaBox: {
    marginTop: '0%',
    // marginLeft: '7.5%',
    // marginRight: '7.5%',
    backgroundColor: 'white',
    height: responsiveHeight(12),
    width: '90%',
    // justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  countryPicker: {
    height: responsiveHeight(6),
    // marginLeft: '5%',
    // marginRight: '7.5%',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#104e01',
    borderWidth: 1,
    marginTop: responsiveHeight(0.5),
  },
  picker: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerText: {
    // textAlign: 'center'
  },
  formError:{
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: responsiveHeight(5),
    width: '90%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  formErrorText:{
    color: "#9e0000f8",
    marginLeft: '2%',
    marginRight: '2%'
  },
  clearFiltersButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: '2%'
  },
  buttonPlaceholder:{
    marginLeft: '2.5%',
    marginRight: '2.5%',
    width: '40%',
    height: responsiveHeight(6),
  },
  clearFiltersButton:{
    marginLeft: '2.5%',
    marginRight: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '40%',
    minHeight: responsiveHeight(6),
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#fff59b',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    flexWrap: 'wrap'
  },
  clearFiltersButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#104e01',
  },
  clearFiltersIcon: {
    color: '#104e01',
  },
  applyFiltersButton:{
    marginLeft: '2.5%',
    marginRight: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '40%',
    minHeight: responsiveHeight(6),
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#104e01',
  },
  applyFiltersButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff59b',
  },
  applyFiltersIcon: {
    color: '#fff59b',
  },
  IOSCountryTextBox: {
    marginLeft: '3%'
  },
  deleteChefOptionTitleContainer:{
    justifyContent: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 5,
    marginBottom: 5,
  },
  deleteChefOptionContentsContainer:{
    position: 'absolute',
    left: '10%',
    top: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    backgroundColor: '#fff59b',
    width: '80%',
    // marginTop: '50%',
    // marginLeft: '12.5%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: '1%'
  }
  });