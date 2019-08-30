import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalFullScreenContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picChooserModalContainer:{
    position: 'absolute',
    left: '25%',
    top: '25%',
    height: '50%',
    width: '50%',
  },
    picSourceChooserButton:{
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