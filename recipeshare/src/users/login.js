import React from 'react'
import {Text, AsyncStorage, ImageBackground, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Switch, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './usersStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNewPassword } from '../fetches/getNewPassword'
import { loginChef } from '../fetches/loginChef'

const mapStateToProps = (state) => ({
  e_mail: state.loginUserDetails.e_mail,
  password: state.loginUserDetails.password,
  loggedInChef: state.loggedInChef,
  stayingLoggedIn: state.stayLoggedIn,
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
  },
  stayLoggedIn: (value) => {
    return dispatch => {
      dispatch({type: 'STAY_LOGGED_IN', value: value})
    }
  },
  updateLoggedInChefInState: (id, username, auth_token, imageURL, is_admin) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username, auth_token: auth_token, imageURL: imageURL, is_admin: is_admin})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class LoginScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };

    state = {
      loginError: "",
      awaitingServer: false,
    }

    handleTextInput = (e, parameter) => {
      this.props.saveLoginChefDetails(parameter, e.nativeEvent.text)
    }

    loginChef = async() => {
      await this.setState({awaitingServer: true})
      console.log("sending login")
      const chef = await loginChef(this.props)
      if (!chef.error){
        if(this.props.stayingLoggedIn){
          AsyncStorage.setItem('chef', JSON.stringify(chef), () => {
            AsyncStorage.getItem('chef', (err, res) => {
              console.log(err)
              this.props.clearLoginUserDetails()
              this.props.navigation.navigate('AppLoading')
            })
          })
        }else{
          this.props.updateLoggedInChefInState(chef.id, chef.username, chef.auth_token, chef.imageURL, chef.is_admin, chef.is_member)
          this.props.clearLoginUserDetails()
          await this.setState({awaitingServer: false})
          this.props.navigation.navigate('Home')
        }
      } else {
        console.log(chef.message)
        this.setState({error: chef.message})
        await this.setState({awaitingServer: false})
      }
    }

    renderEmailError = () => {
      if (this.state.error === "email"){
        return (
          <View style={styles.formRow}>
            <View style={styles.formError}>
              <Text style={styles.formErrorText}>E-mail address not found.  Please register.</Text>
            </View>
          </View>
        )
      }
    }

    renderPasswordError = () => {
      if (this.state.error === "password"){
        return (
          <View style={styles.formRow}>
            <View style={styles.formError}>
              <Text style={styles.formErrorText}>Password not recognized</Text>
            </View>
          </View>
        )
      }
    }

    renderPasswordExpiredError = () => {
      if (this.state.error === "password_expired"){
        return (
          <View style={styles.formRow}>
            <View style={styles.formError}>
              <Text style={styles.formErrorText}>Automatically generated password has expired.  Please reset your password.</Text>
            </View>
          </View>
        )
      }
    }

    renderAccountActivationError = () => {
      if (this.state.error === "activation"){
        return (
          <View style={styles.formRow}>
            <View style={styles.formError}>
              <Text style={styles.formErrorText}>Account not yet activated.  Please click the link in your confirmation e-mail. (Don't forget to check spam!)</Text>
            </View>
          </View>
        )
      }
    }

    renderAccountDeactivatedError = () => {
      if (this.state.error === "deactivated"){
        return (
          <View style={styles.formRow}>
            <View style={styles.formError}>
              <Text style={styles.formErrorText}>This account was deactivated.  Reset your password to reactivate your account.</Text>
            </View>
          </View>
        )
      }
    }

    forgotPassword = async() => {
      const response = await getNewPassword(this.props.e_mail)
      if (response){
        // console.log(response)
        this.setState({error: "forgotPassword", forgottenPasswordMessage: response.message})
      }
    }

    renderForgotPasswordError = () => {
      if (this.state.error === "forgotPassword"){
        return (
          <View style={styles.formRow}>
            <View style={styles.formError}>
              <Text style={styles.formErrorText}>{this.state.forgottenPasswordMessage}</Text>
            </View>
          </View>
        )
      }
    }

    render() {
      // console.log(this.props.e_mail)
      return (
        <ImageBackground source={require('../dataComponents/spinach.jpg')} style={[styles.background,{height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        }]} imageStyle={styles.backgroundImageStyle}>
          <KeyboardAvoidingView style={styles.mainPageContainer} behavior="padding">
          {this.state.awaitingServer ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#104e01" /> : null }
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} resizeMode={"contain"} source={require('../dataComponents/yellowLogo.png')}/>
              </View>
              <View style={styles.loginForm} >
                <View style={styles.formRow}>
                  <View style={styles.loginHeader}>
                    <Text style={styles.loginTitle}>Welcome, chef!{"\n"} Please log in or register</Text>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.loginInputBox}>
                    <TextInput style={styles.loginTextBox} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
                  </View>
                </View>
                {this.renderEmailError()}
                {this.renderForgotPasswordError()}
                {this.renderAccountActivationError()}
                {this.renderAccountDeactivatedError()}
                <View style={styles.formRow}>
                  <View style={styles.loginInputBox}>
                    <TextInput style={styles.loginTextBox} placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
                  </View>
                </View>
                {this.renderPasswordError()}
                {this.renderPasswordExpiredError()}
                <View style={styles.formRow}>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('CreateChef')}>
                    <Icon style={styles.standardIcon} size={25} name='account-plus'></Icon>
                      <Text style={styles.loginFormButtonText}>Register</Text>
                  </TouchableOpacity>
                  <View style={styles.loginFormButton}>
                    <Text style={styles.loginFormButtonText}>Stay{"\n"}logged in</Text>
                    <Switch value={this.props.stayingLoggedIn} onChange={(e) => this.props.stayLoggedIn(e.nativeEvent.value)}/>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={this.forgotPassword}>
                    <Icon style={styles.standardIcon} size={25} name='lock-open'></Icon>
                    <Text style={styles.loginFormButtonText}>Reset{"\n"}password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={e => this.loginChef(e)}>
                    <Icon style={styles.standardIcon} size={25} name='login'></Icon>
                      <Text style={styles.loginFormButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
              </ScrollView>
          </KeyboardAvoidingView >
        </ImageBackground>

      )
    }

  }
)
