import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
  scrollContainer:{
    flexGrow: 1,
  },
  background: {
    flex: 1,
  },
  backgroundImageStyle: {
    // opacity: 0.8
  },
  loginForm: {
    width: '100%',
    marginTop: '5%',
    height: 280,
  },
  loginInputBox: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    height: 44,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    // overflow: 'hidden',
  },
  pickerInputBox: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    // height: 170,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01',
    overflow: 'hidden',
  },
  loginInputAreaBox: {
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
  loginHeader: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: '80%',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  loginTitle: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: "#505050",
  },
  loginTextBox: {
    marginLeft: '3%',
    marginRight: '3%',
  },
  createChefTitle: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: "#505050",
  },
  formRow: {
    marginTop: '1%',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  loginFormButton:{
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
    height: 44,
    flexDirection:'row',
    borderRadius: 5,
    backgroundColor: '#fff59b',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#104e01'
  },
  loginFormButtonText: {
    marginLeft: '5%',
    marginRight: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#104e01',
  },
  standardIcon: {
    color: '#104e01',
  },
  createChefForm: {
    top: '8%',
    width: '100%',
    height: '85%',
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
    borderWidth: 1,
    borderColor: '#104e01'
  },
  formErrorText:{
    color: "#9e0000f8",
    marginLeft: '2%',
    marginRight: '2%'
  },
  logoContainer: {
    height: 275,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '75%',
    height: '100%',
  },
  profileTextAreaInput: {
    height: 130,
    marginTop: 4,
  },
  buttonPlaceholder:{
    marginLeft: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
    height: 44,
    flexDirection:'row',
    borderRadius: 5,
  },
  iOSdropDownIcon: {
    position: 'absolute',
    // height: 25,
    // width: 25,
    left: '89%',
    // top: '1.5%',
    zIndex: 2,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#104e01',
    color: '#104e01',
  },
  });