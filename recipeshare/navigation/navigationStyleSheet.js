import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
  },
  headerEnd:{
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMiddle:{
    width: '70%',
    height: '100%',
    justifyContent: 'center'
  },
  headerDrawerButton: {
    marginLeft: 15,
    marginRight: 8,
  },
  headerNewButton: {

  },
  headerIcon:{
    color: '#fff59b'
  },
  headerText:{
    fontSize: 24,
    color: '#fff59b',
    marginLeft: 10
  },
  background: {
    width: '100%',
    height: '100%',
  },
});