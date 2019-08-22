import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalFullScreenContainer:{
    // flex: 1,
  },
  contentsContainer:{
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    backgroundColor: '#fff59b',
    width: '80%',
    marginTop: '12%',
    marginLeft: '10%',
    borderRadius: 5,
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    marginTop: '4%',
    height: 27,
  },
  title: {
    color: '#104e01',
    fontSize: 16,
    fontWeight: 'bold'
  },
  editChefInputBox: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    height: 44,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  formRow: {
    marginTop: '1.5%',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  editChefTextBox: {
    marginLeft: '3%',
    marginRight: '3%',
  },
  editChefInputAreaBox: {
    marginTop: '0%',
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    height: 88,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  countryPicker: {
    height: 44,
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#104e01',
    borderWidth: 1,
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
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 38,
    width: '80%',
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
  clearFiltersButton:{
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 44,
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#fff59b',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
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
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 44,
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
  }
  });