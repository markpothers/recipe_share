import React from 'react'
import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

export const styles = StyleSheet.create({
  mainPageContainer:{
    width: '100%',
  },
  headerContainer:{
    height: '12%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  headerTopContainer:{
    marginTop: '2%',
    marginBottom: '3%',
    height: '100%',
    width: '90%',
  },
  logo: {
    width: undefined,
    height: undefined,
    flex: 1
  },
  userNameHeader:{
    fontSize: responsiveFontSize(2.5),
    color: "#505050",
  },
  userName:{
    fontSize: responsiveFontSize(2.9),
    marginLeft: '10%',
    color: "#505050",
    fontWeight: 'bold'
  },
  bottomContainer:{
    flexDirection: 'row',
    height: 75,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    alignItems: 'center'
  },
  bottomRightContainer:{
    height: '100%',
    width: '25%',
    overflow: 'hidden',
    borderRadius: 5,
    aspectRatio: 1
  },
  bottomLeftContainer:{
    height: '100%',
    width: '75%',
    justifyContent: 'center',
  },
  avatarThumbnail: {
    height: '100%',
    width: '100%',
  },
  horizontalRule:{
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    borderBottomColor: '#104e01',
    borderBottomWidth: 1,
  },
  routesContainer: {
    height: '55%',
    width: '90%',
    marginTop: '3%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  routeLink: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: responsiveHeight(1.5),
    alignItems: 'center',
  },
  routeNameContainer: {
    width: '80%',
    marginLeft: '5%'
  },
  routeName: {
    fontSize: responsiveFontSize(2.7),
    width: '100%',
    color: "#505050",
  },
  icon: {
    color: "#505050",
    marginLeft: '5%',
  },
  logoutContainer: {
    width: '90%',
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%'
  },
});