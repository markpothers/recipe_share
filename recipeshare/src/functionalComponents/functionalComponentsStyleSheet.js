import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalFullScreenContainer:{
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // height: '100%',
    // width: '100%'
    //     borderStyle: 'solid',
    // borderWidth: 1,
  },
  picChooserModalContainer:{
    // position: 'absolute',
    right: '12.5%',
    top: '25%',
    // borderStyle: 'solid',
    // borderWidth: 1,
    // alignSelf: 'center',
    height: 250,
    width: '50%',
    marginLeft: '25%',
    marginRight: '25%',
    // borderRadius: 5
  },
    picSourceChooserButton:{
      // marginLeft: '5%',
      // marginRight: '5%',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 100,
      flexDirection:'row',
      borderRadius: 5,
      backgroundColor: '#fff59b',
      borderStyle: 'solid',
      borderWidth: 1,
    },
    picSourceChooserCancelButton:{
      // marginLeft: '5%',
      // marginRight: '5%',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 50,
      flexDirection:'row',
      borderRadius: 5,
      backgroundColor: '#720000',
      borderStyle: 'solid',
      borderWidth: 1,
    },
    picSourceChooserButtonText: {
      marginLeft: '5%',
      marginRight: '5%',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: '#104e01',
    },
    standardIcon: {
      color: '#104e01',
    },
    cancelIcon: {
      color: '#fff59b',
    },
    picSourceChooserCancelButtonText: {
      marginLeft: '5%',
      marginRight: '5%',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      color: '#fff59b',
    },
  });