import React from 'react'
import { StyleSheet } from 'react-native';

export const centralStyles = StyleSheet.create({
  activityIndicator:{
    left: 1.25,
    top: 1.32
  },
  activityIndicatorContainer:{
    position: 'absolute',
    top: '10%',
    left: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#fff59b',
    borderColor: '#104e01',
    borderWidth: 1,
    width: 47,
    height: 47,
    zIndex: 1
  }
  });