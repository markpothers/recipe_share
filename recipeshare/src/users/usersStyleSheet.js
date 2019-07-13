import React from 'react'
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainPageContainer:{
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    flex: 1
  },
  backgroundImageStyle: {
    // opacity: 0.8
  },
  loginForm: {
    position: 'absolute',
    bottom: '20%',
    width: '100%',
  },
  loginInputBox: {
    marginTop: '0%',
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    height: 44,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5
  },
  loginInputAreaBox: {
    marginTop: '0%',
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    height: 88,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5
  },
  loginHeader: {
    marginTop: '0%',
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: '80%',
    borderRadius: 5
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
    flex: 1,
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
    top: '15%',
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
    height: 28,
    width: '80%'
  },
  formErrorText:{
    color: "#9e0000f8",
  },
  logoContainer: {
    width: '100%',
    height: '30%',
  },
  logo: {
    top: '40%',
    width: '100%',
    flex: 1
  },
  profileTextAreaInput: {
    height: 130,
    marginTop: 4,
  },
  });