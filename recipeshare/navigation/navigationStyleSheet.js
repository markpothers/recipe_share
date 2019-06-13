import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderColor: '#9e0000f8',
    // overflow: 'scroll'
    flex: 1,
    // flexDirection: 'column'
  },
  headerContainer: {
    // flex: 1,
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: '33%',
    width: '100%',
    height: 60,
    // overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: 2,
    // marginTop: -24,
  },
  headerDrawerButton: {
    marginLeft: 10,
    marginRight: 10,
    // color: '#f700ffef'
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
    flex: 1
    // opacity: '20%'
  },
  backgroundImageStyle: {
    opacity: 0.8
  },
});