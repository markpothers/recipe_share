import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
  headerContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderColor: '#fff59b',
  },
  headerDrawerButton: {
    marginLeft: 15,
    marginRight: 8,
  },
  headerNewButton: {
    position: 'absolute',
    left: '85%',
    marginLeft: 10,
    marginRight: 10,
  },
  headerIcon:{
    color: '#fff59b'
  },
  headerText:{
    fontSize: 24,
    color: '#fff59b'
  },
  background: {
    width: '100%',
    height: '100%',
    // flex: 1
  },
});