import React from 'react'
import {Text, AsyncStorage, ImageBackground, KeyboardAvoidingView, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, Button, View } from 'native-base';
import { connect } from 'react-redux'
import { databaseURL } from '../dataComponents/databaseURL'
import { styles } from './usersStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const mapStateToProps = (state) => ({
  e_mail: state.loginUserDetails.e_mail,
  password: state.loginUserDetails.password,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  saveLoginChefDetails: (parameter, content) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_LOGIN_USER_DETAILS', parameter: parameter, content: content})
    }
  },
  clearLoginUserDetails: () => {
    return dispatch => {
      dispatch({ type: 'CLEAR_LOGIN_USER_DETAILS'})
    }
  },
  loginChefToState: (id, username) => {
    return dispatch => {
      dispatch({type: 'LOG_IN_CHEF', id: id, username: username})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class LoginScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };

    state = {
      loginError: ""
    }

    handleTextInput = (e, parameter) => {
      this.props.saveLoginChefDetails(parameter, e.nativeEvent.text)
    }

    loginChef = () => {
      // console.log("sending login")
      fetch(`${databaseURL}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chef: this.props
        })
      })
      .then(res => res.json())
      .then(chef => {
        if (!chef.error){
          // this.setState({error: ""})
          AsyncStorage.setItem('chef', JSON.stringify(chef), () => {
            AsyncStorage.getItem('chef', (err, res) => {
              console.log(err)
              this.props.clearLoginUserDetails()
              this.props.navigation.navigate('AppLoading')
            })
          })
        } else {
          // console.log(chef.message)
          this.setState({error: chef.message})
        }
      })
      .catch(error => {
        console.log(error)
      })
    }

    renderEmailError = () => {
      if (this.state.error === "email"){
        return (
          <View style={styles.formRow}>
            <Item rounded style={styles.formError}>
              <Text style={styles.formErrorText}>E-mail address not found.  Please register.</Text>
            </Item>
          </View>
        )
      }
    }

    renderPasswordError = () => {
      if (this.state.error === "password"){
        return (
          <View style={styles.formRow}>
            <Item rounded style={styles.formError}>
              <Text style={styles.formErrorText}>Password not recognized</Text>
            </Item>
          </View>
        )
      }
    }

    render() {
      // console.log(databaseURL)
      return (
        <KeyboardAvoidingView  style={styles.mainPageContainer} behavior="padding">
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={require('./logo.png')}/>
            </View>
            <View style={styles.loginForm} >
              <View style={styles.formRow}>
                <Item rounded style={styles.loginHeader}>
                  <Text style={styles.loginTitle}>Welcome, chef!{"\n"} Please log in or register</Text>
                </Item>
              </View>
              <View style={styles.formRow}>
                <Item rounded style={styles.loginInputBox}>
                  <Input placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
                </Item>
              </View>
              {this.renderEmailError()}
              <View style={styles.formRow}>
                <Item rounded style={styles.loginInputBox}>
                  <Input placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
                </Item>
              </View>
              {this.renderPasswordError()}
              <View style={styles.formRow}>
                <Button rounded warning style={styles.loginFormButton} onPress={() => this.props.navigation.navigate('CreateChef')}>
                  <Icon style={styles.standardIcon} size={25} name='account-plus'></Icon>
                    <Text style={styles.createChefFormButtonText}>Register</Text>
                </Button>
                <Button rounded success style={styles.loginFormButton} onPress={e => this.loginChef(e)}>
                  <Icon style={styles.standardIcon} size={25} name='login'></Icon>
                    <Text style={styles.createChefFormButtonText}>Login</Text>
                  </Button>
              </View>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView >
      )
    }

  }
)
