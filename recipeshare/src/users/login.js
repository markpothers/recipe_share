import React from 'react'
import { Platform, SafeAreaView, Text, AsyncStorage, ImageBackground, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Switch, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './usersStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNewPassword } from '../fetches/getNewPassword'
import { loginChef } from '../fetches/loginChef'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'
import SpinachAppContainer from '../spinachAppContainer/SpinachAppContainer'

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
  updateLoggedInChefInState: (id, username, auth_token, image_url, is_admin) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username, auth_token: auth_token, image_url: image_url, is_admin: is_admin})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class LoginScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };

    state = {
      loginError: false,
      error: 'invalid ',
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
              this.props.updateLoggedInChefInState(chef.id, chef.username, chef.auth_token, chef.image_url, chef.is_admin, chef.is_member)
              this.props.setLoadedAndLoggedIn({loaded: true, loggedIn: true})
            })
          })
        }else{
          this.props.updateLoggedInChefInState(chef.id, chef.username, chef.auth_token, chef.image_url, chef.is_admin, chef.is_member)
          this.props.clearLoginUserDetails()
          await this.setState({
            loginError: false,
            awaitingServer: false})
            this.props.setLoadedAndLoggedIn({loaded: true, loggedIn: true})
        }
      } else {
        console.log(chef.message)
        await this.setState({
          awaitingServer: false,
          loginError: true,
          error: chef.message
        })
      }
    }

    forgotPassword = async() => {
      const response = await getNewPassword(this.props.e_mail)
      if (response){
        // console.log(response)
        this.setState({error: "forgotPassword", error: response.message})
      }
    }

    render() {
      // console.log(this.props)
      return (
        <SpinachAppContainer scrollingEnabled={true} awaitingServer={this.state.awaitingServer}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} resizeMode={"contain"} source={require('../dataComponents/yellowLogo.png')}/>
          </View>
          <View style={centralStyles.formContainer}>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <Text style={centralStyles.formTitle} maxFontSizeMultiplier={1.5}>Welcome, chef!{"\n"} Please log in or register</Text>
              </View>
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput maxFontSizeMultiplier={3} style={centralStyles.formInput} value={this.props.e_mail} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
              </View>
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput maxFontSizeMultiplier={3} style={centralStyles.formInput} value={this.props.password} placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
              </View>
              {this.state.loginError &&(
                <View style={centralStyles.formErrorView}>
                  {this.state.error === 'invalid' && <Text maxFontSizeMultiplier={3} style={centralStyles.formErrorText}>Username and password combination not recognized</Text>}
                  {this.state.error === 'password_expired' && <Text maxFontSizeMultiplier={3} style={centralStyles.formErrorText}>Automatically generated password has expired.  Please reset your password.</Text>}
                  {this.state.error === 'activation' && <Text maxFontSizeMultiplier={3} style={centralStyles.formErrorText}>Account not yet activated.  Please click the link in your confirmation e-mail. (Don't forget to check spam!)</Text>}
                  {this.state.error === 'deactivated' && <Text maxFontSizeMultiplier={3} style={centralStyles.formErrorText}>This account was deactivated.  Reset your password to reactivate your account.</Text>}
                  {this.state.error === 'forgotPassword' && <Text maxFontSizeMultiplier={3} style={centralStyles.formErrorText}>Thanks.  If this e-mail has an account we'll send you a new password.  Please check your e-mail</Text>}
                </View>
              )}
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('CreateChef')}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='account-plus'></Icon>
                  <Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={2}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={centralStyles.yellowRectangleButton} onPress={() => this.props.stayLoggedIn(!this.props.stayingLoggedIn)}>
                  <Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={2}>Stay{"\n"}logged in</Text>
                  <Switch style={[(Platform.OS === 'ios' ? {transform:[{scaleX:.7},{scaleY:.7}]}:null)]} value={this.props.stayingLoggedIn} onChange={(e) => this.props.stayLoggedIn(e.nativeEvent.value)}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.forgotPassword}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='lock-open'></Icon>
                  <Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={2}>Reset{"\n"}password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={e => this.loginChef(e)}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
                  <Text style={centralStyles.greenButtonText} maxFontSizeMultiplier={2}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SpinachAppContainer>
      )
    }
  }
)
