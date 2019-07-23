import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalFullScreenContainer:{
    // flex: 1,
      // borderColor: '#720000',
      // borderStyle: 'solid',
      // borderWidth: 1,
    // backgroundColor: '#fff59b',
    // top: '5%',
    // height: '60%', //'80.5%',
    // width: '60%',  //   '100%',
    // marginTop: '20%',
    // marginLeft: '8%',
    // marginRight: '20%',
    // marginBottom: '20%',
    // borderRadius: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  contentsContainer:{
    // flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    backgroundColor: '#fff59b',
    // top: '5%',
    height: '73%',
    width: '80%',
    marginTop: '12%',
    marginLeft: '10%',
    // marginRight: '20%',
    // marginBottom: '20%',
    borderRadius: 5,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    // flex: 1,
    justifyContent: 'center',
    marginTop: '4%',
    // alignItems: 'center'
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
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderColor: '#104e01'
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
    // flex: 1,
    height: 44,
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 5,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#104e01',
    borderWidth: 1,
    // marginTop: '2%',
  },
  picker: {
    height: '100%',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    marginLeft: '5%',
    // bottom: '7%',
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
    // alignItems: 'center',
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
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#fff59b'
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




  // picChooserModalContainer:{
  //   // position: 'absolute',
  //   // right: '12.5%',
  //   // top: '25%',
  //   borderStyle: 'solid',
  //   borderWidth: 1,
  //   borderColor: '#104e01',
  //   backgroundColor: '#fff59b',
  //   width: '100%',
  //   marginLeft: '0%',
  //   marginRight: '0%',
  //   borderRadius: 5
  // },
    // picSourceChooserButton:{
    //   // marginLeft: '5%',
    //   // marginRight: '5%',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   width: '100%',
    //   height: 100,
    //   flexDirection:'row',
    //   borderRadius: 5,
    //   backgroundColor: '#fff59b',
    //   borderStyle: 'solid',
    //   borderWidth: 1,
    // },
    // picSourceChooserCancelButton:{
    //   // marginLeft: '5%',
    //   // marginRight: '5%',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   width: '100%',
    //   height: 50,
    //   flexDirection:'row',
    //   borderRadius: 5,
    //   backgroundColor: '#720000',
    //   borderStyle: 'solid',
    //   borderWidth: 1,
    // },
    // picSourceChooserButtonText: {
    //   marginLeft: '5%',
    //   marginRight: '5%',
    //   textAlign: 'center',
    //   fontWeight: 'bold',
    //   fontSize: 20,
    //   color: '#104e01',
    // },
    // standardIcon: {
    //   color: '#104e01',
    // },
    // cancelIcon: {
    //   color: '#fff59b',
    // },
    // picSourceChooserCancelButtonText: {
    //   marginLeft: '5%',
    //   marginRight: '5%',
    //   textAlign: 'center',
    //   fontWeight: 'bold',
    //   fontSize: 14,
    //   color: '#fff59b',
    // },



    // filterButton: {
    //   position: 'absolute',
    //   backgroundColor: '#104e01',
    //   borderStyle: 'solid',
    //   borderWidth: 1,
    //   borderColor: '#fff59b',
    //   width: 50,
    //   height: 50,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   top: '85.3%',
    //   left: '80.2%',
    //   borderRadius: 100,
    //   zIndex: 1
    // },
    // filterIcon:{
    //   color: '#fff59b',
    //   // alignSelf: 'center',
    //   // marginLeft: '10%'
    // },
    // columnsContainer: {
    //   // flex: 9,
    //   // flexDirection: 'row',
    //   marginTop: '2%',
    //   // borderColor: '#720000',
    //   // borderStyle: 'solid',
    //   // borderWidth: 1,
    // },
    // column: {
    //   flex: 1,
    //   marginLeft: '2%'
    //   // borderColor: '#720000',
    //   // borderStyle: 'solid',
    //   // borderWidth: 1,
    // },
    // columnRow: {
    //   flexDirection: 'row',
    //   // borderColor: '#720000',
    //   // borderStyle: 'solid',
    //   // borderWidth: 1,
    // },
    // switchContainer: {
    //   // flex: 1,
    //   width: '20%',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   marginLeft: '7%',
    //   // marginRight: '5%',
    // },
    // categoryContainer: {
    //   // flex: 4,
    //   marginLeft: '7%',
    //   width: '80%',
    //   justifyContent: 'center',
    //   // alignItems: 'center'
    // },
    // categoryText:{
    //   color: '#104e01'
    // },
    // bottomContainer: {
    //   alignItems: 'center',
    // },
    // bottomTopContainer: {
    //   flexDirection: 'row',
    //   justifyContent: 'center',
    //   alignItems: 'center'
    // },
  
    


  });