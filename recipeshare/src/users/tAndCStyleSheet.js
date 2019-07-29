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
    height: '85%',
    marginTop: '8%',
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
  formRow: {
    marginTop: '3%',
    flexDirection:'row',
    // justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
    // borderWidth: 1
  },
  editChefInputAreaBox: {
    // marginTop: '0%',
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: 'white',
    // height: '86%',
    width: '90%',
    // justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    overflow: 'hidden'
  },
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