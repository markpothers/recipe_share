import React from 'react'
import { Platform, SafeAreaView, Text, AsyncStorage, ImageBackground, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Switch, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { styles } from './usersStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNewPassword } from '../fetches/getNewPassword'
import { loginChef } from '../fetches/loginChef'
import { responsiveWidth } from 'react-native-responsive-dimensions'

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
      // forgottenPasswordMessage: ''
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
          this.props.updateLoggedInChefInState(chef.id, chef.username, chef.auth_token, chef.image_url, chef.is_admin, chef.is_member)
          this.props.clearLoginUserDetails()
          await this.setState({
            loginError: false,
            awaitingServer: false})
          this.props.navigation.navigate('Home')
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

    // renderCredentialsError = () => {
    //   if (this.state.error === "invalid"){
    //     return (
    //       <View style={styles.formRow}>
    //         <View style={styles.formError}>
    //           <Text style={styles.formErrorText}>Username and password combination not recognized.</Text>
    //         </View>
    //       </View>
    //     )
    //   }
    // }

    // renderPasswordExpiredError = () => {
    //   if (this.state.error === "password_expired"){
    //     return (
    //       <View style={styles.formRow}>
    //         <View style={styles.formError}>
    //           <Text style={styles.formErrorText}>Automatically generated password has expired.  Please reset your password.</Text>
    //         </View>
    //       </View>
    //     )
    //   }
    // }

    // renderAccountActivationError = () => {
    //   if (this.state.error === "activation"){
    //     return (
    //       <View style={styles.formRow}>
    //         <View style={styles.formError}>
    //           <Text style={styles.formErrorText}>Account not yet activated.  Please click the link in your confirmation e-mail. (Don't forget to check spam!)</Text>
    //         </View>
    //       </View>
    //     )
    //   }
    // }

    // renderAccountDeactivatedError = () => {
    //   if (this.state.error === "deactivated"){
    //     return (
    //       <View style={styles.formRow}>
    //         <View style={styles.formError}>
    //           <Text style={styles.formErrorText}>This account was deactivated.  Reset your password to reactivate your account.</Text>
    //         </View>
    //       </View>
    //     )
    //   }
    // }

    forgotPassword = async() => {
      const response = await getNewPassword(this.props.e_mail)
      if (response){
        // console.log(response)
        this.setState({error: "forgotPassword", error: response.message})
      }
    }

    // renderForgotPasswordError = () => {
    //   if (this.state.error === "forgotPassword"){
    //     return (
    //       <View style={styles.formRow}>
    //         <View style={styles.formError}>
    //           <Text style={styles.formErrorText}>{this.state.forgottenPasswordMessage}</Text>
    //         </View>
    //       </View>
    //     )
    //   }
    // }

    render() {
      // console.log(this.props.e_mail)
      return (
        <ImageBackground source={require('../dataComponents/spinach.jpg')} style={centralStyles.spinachFullBackground}>
        <SafeAreaView style={centralStyles.fullPageSafeAreaView}>
        <KeyboardAvoidingView style={centralStyles.fullPageKeyboardAvoidingView} >
        {this.state.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={centralStyles.activityIndicator } size="large" color="#104e01" /></View>}
        <ScrollView style={centralStyles.fullPageScrollView}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} resizeMode={"contain"} source={require('../dataComponents/yellowLogo.png')}/>
          </View>
          <View style={centralStyles.formContainer}>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <Text style={centralStyles.formTitle}>Welcome, chef!{"\n"} Please log in or register</Text>
              </View>
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput style={centralStyles.formInput} value={this.props.e_mail} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
              </View>
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
              <TextInput style={centralStyles.formInput} value={this.props.password} placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
              </View>
              {this.state.loginError &&(
                <View style={centralStyles.formErrorView}>
                  {this.state.error === 'invalid' && <Text style={centralStyles.formErrorText}>Username and password combination not recognized</Text>}
                  {this.state.error === 'password_expired' && <Text style={centralStyles.formErrorText}>Automatically generated password has expired.  Please reset your password.</Text>}
                  {this.state.error === 'activation' && <Text style={centralStyles.formErrorText}>Account not yet activated.  Please click the link in your confirmation e-mail. (Don't forget to check spam!)</Text>}
                  {this.state.error === 'deactivated' && <Text style={centralStyles.formErrorText}>This account was deactivated.  Reset your password to reactivate your account.</Text>}
                  {this.state.error === 'forgotPassword' && <Text style={centralStyles.formErrorText}>Thanks.  If this e-mail has an account we'll send you a new password.  Please check your e-mail</Text>}
                </View>
              )}
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('CreateChef')}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='account-plus'></Icon>
                    <Text style={centralStyles.greenButtonText}>Register</Text>
                </TouchableOpacity>
                <View style={centralStyles.yellowRectangleButton}>
                  <Text style={centralStyles.greenButtonText}>Stay{"\n"}logged in</Text>
                  <Switch style={[(Platform.OS === 'ios' ? {transform:[{scaleX:.7},{scaleY:.7}]}:null),{marginLeft: responsiveWidth(2)}]} value={this.props.stayingLoggedIn} onChange={(e) => this.props.stayLoggedIn(e.nativeEvent.value)}/>
                </View>
              </View>
            </View>
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={this.forgotPassword}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='lock-open'></Icon>
                  <Text style={centralStyles.greenButtonText}>Reset{"\n"}password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={e => this.loginChef(e)}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
                    <Text style={centralStyles.greenButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>








          </View>




              {/* <View style={styles.loginForm} >
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
                {this.renderForgotPasswordError()}
                {this.renderAccountActivationError()}
                {this.renderAccountDeactivatedError()}
                <View style={styles.formRow}>
                  <View style={styles.loginInputBox}>
                    <TextInput style={styles.loginTextBox} placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
                  </View>
                </View>
                {this.renderCredentialsError()}
                {this.renderPasswordExpiredError()}
                <View style={styles.formRow}>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('CreateChef')}>
                    <Icon style={styles.standardIcon} size={25} name='account-plus'></Icon>
                      <Text style={styles.loginFormButtonText}>Register</Text>
                  </TouchableOpacity>
                  <View style={styles.loginFormButton}>
                    <Text style={styles.loginFormButtonText}>Stay{"\n"}logged in</Text>
                    <Switch style={(Platform.OS === 'ios' ? {transform:[{scaleX:.8},{scaleY:.8}]}:null)} value={this.props.stayingLoggedIn} onChange={(e) => this.props.stayLoggedIn(e.nativeEvent.value)}/>
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
              </View> */}
        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
        </ImageBackground>

      )
    }

  }
)
