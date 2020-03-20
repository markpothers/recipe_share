import React from 'react'
import { Platform, SafeAreaView, ScrollView, Text, ImageBackground, KeyboardAvoidingView, TouchableOpacity, TextInput, View, Switch, ActivityIndicator } from 'react-native'
import { countries } from '../dataComponents/countries'
import * as Permissions from 'expo-permissions'
import { connect } from 'react-redux'
import { postChef } from '../fetches/postChef'
import { styles } from './usersStyleSheet'
import { centralStyles } from '../centralStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import { TextPopUp } from '../textPopUp/textPopUp'
import DualOSPicker from '../functionalComponents/DualOSPicker'
import { termsAndConditions } from '../dataComponents/termsAndConditions'
import { privacyPolicy } from '../dataComponents/privacyPolicy'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions'

const mapStateToProps = (state) => ({
  first_name: state.newUserDetails.first_name,
  last_name: state.newUserDetails.last_name,
  username: state.newUserDetails.username,
  e_mail: state.newUserDetails.e_mail,
  password: state.newUserDetails.password,
  password_confirmation: state.newUserDetails.password_confirmation,
  country: state.newUserDetails.country,
  image_url: state.newUserDetails.image_url,
  profile_text: state.newUserDetails.profile_text,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  saveChefDetails: (parameter, content) => {
    // console.log("saving chef")
    return dispatch => {
      dispatch({ type: 'UPDATE_NEW_USER_DETAILS', parameter: parameter, content: content})
    }
  },
  clearNewUserDetails: () => {
    return dispatch => {
      dispatch({ type: 'CLEAR_NEW_USER_DETAILS'})
    }
  },
  loginChefToSTate: (id, username) => {
    return dispatch => {
      dispatch({type: 'LOG_IN_CHEF', id: id, username: username})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class CreateChef extends React.Component {
    static navigationOptions = {
      header: null,
    };

    state = {
      hasPermission: false,
      errors: [],
      choosingPicture: false,
      tAndCAgreed: false,
      privacyPolicyAgreed: false,
      viewingTermsAndConditions: false,
      viewingPrivacyPolicy: false,
      awaitingServer: false,
    }

    componentDidMount(){
      Permissions.askAsync(Permissions.CAMERA_ROLL)
          .then(permission => {
              this.setState({hasPermission: permission.status == 'granted'})
          })
          Permissions.askAsync(Permissions.CAMERA)
          .then(permission => {
              this.setState({hasPermission: permission.status == 'granted'})
          })
    }

    handleTextInput = (e, parameter) => {
      this.props.saveChefDetails(parameter, e.nativeEvent.text)
    }

    choosePicture = () =>{
      this.setState({choosingPicture: true})
    }

    sourceChosen = () =>{
      this.setState({choosingPicture: false})
    }

    renderPictureChooser = () => {
      return <PicSourceChooser saveImage={this.saveImage} sourceChosen={this.sourceChosen} key={"pic-chooser"}/>
    }

    saveImage = async(image) => {
      if (image.cancelled === false){
        this.props.saveChefDetails("image_url", image.base64)
        this.setState({choosingPicture: false})
      }
    }

    submitChef = async() => {
      await this.setState({awaitingServer: true})
      console.log("sending new user details")
      const chef = await postChef(this.props.username, this.props.e_mail, this.props.password, this.props.password_confirmation, this.props.country, this.props.image_url, this.props.profile_text)
        if (!chef.error){
              this.props.clearNewUserDetails()
              this.props.navigation.navigate('Login')
        } else {
          this.setState({errors: chef.message})
          await this.setState({awaitingServer: false})
        }
    }

    renderEmailError = () => {
      const emailErrors = this.state.errors.filter(message => message.startsWith("E mail"))
      return emailErrors.map(error => (
        <View style={centralStyles.formErrorView} key={error}>
            <Text style={centralStyles.formErrorText}>{error}</Text>
        </View>
      ))
    }

    renderUsernameError = () => {
      const usernameErrors = this.state.errors.filter(message => message.startsWith("Username"))
      return usernameErrors.map(error => (
        <View style={centralStyles.formErrorView} key={error}>
            <Text style={centralStyles.formErrorText}>{error}</Text>
        </View>
      ))
    }

    renderPasswordError = () => {
      const passwordErrors = this.state.errors.filter(message => message.startsWith("Password"))
      return passwordErrors.map(error => (
        <View style={centralStyles.formErrorView} key={error}>
            <Text style={centralStyles.formErrorText}>{error}</Text>
        </View>
      ))
    }

    onCountryChange = (choice) => {
      this.props.saveChefDetails("country", choice)
    }

    handleTandCSwitch = () => {
      this.setState({tAndCAgreed: !this.state.tAndCAgreed})
    }

    handlePrivacyPolicySwitch = () => {
      this.setState({privacyPolicyAgreed: !this.state.privacyPolicyAgreed})
    }

    render() {
      // console.log(this.props.saveChefDetails)
      return (
        <ImageBackground source={require('../dataComponents/spinach.jpg')} style={centralStyles.spinachFullBackground}>
        <SafeAreaView style={centralStyles.fullPageSafeAreaView}>
        <KeyboardAvoidingView style={centralStyles.fullPageKeyboardAvoidingView} behavior="padding">
        {this.state.awaitingServer && <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={centralStyles.activityIndicator } size="large" color="#104e01" /></View>}
        {this.state.choosingPicture ? this.renderPictureChooser() : null}
        <ScrollView style={centralStyles.fullPageScrollView}>
          <View style={[centralStyles.formContainer, {marginTop: responsiveHeight(10)}]}>
            {/* title */}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <Text style={centralStyles.formTitle}>Please register and click the link in your confirmation e-mail!</Text>
              </View>
            </View>
            {/* e-mail*/}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput style={centralStyles.formInput} value={this.props.e_mail} placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
              </View>
              {this.renderEmailError()}
            </View>
            {/* username*/}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput style={centralStyles.formInput} value={this.props.username} placeholder="username" autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "username")}/>
              </View>
              {this.renderUsernameError()}
            </View>
            {/* country */}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <View picker style={[centralStyles.pickerContainer, (this.state.pickerFocused ? {height: 170} : {height: 44})]}>
                  <DualOSPicker
                    onChoiceChange={this.onCountryChange}
                    options={countries}
                    selectedChoice={this.props.country}/>
                </View>
              </View>
            </View>
            {/* profile*/}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput style={[centralStyles.formInput, {height: responsiveHeight(12)}]} value={this.props.profile_text} placeholder="about me" multiline={true} numberOfLines={3} onChange={(e) => this.handleTextInput(e, "profile_text")}/>
              </View>
            </View>
            {/* password*/}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput style={centralStyles.formInput} value={this.props.password} placeholder="password" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
              </View>
            </View>
            {/* password confirmation*/}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TextInput style={centralStyles.formInput} value={this.props.password_confirmation} placeholder="password confirmation" autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password_confirmation")}/>
              </View>
              {this.renderPasswordError()}
            </View>
            {/* view terms and conditions*/}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={{width: responsiveWidth(50)}} activeOpacity={0.7} onPress={() => this.setState({viewingTermsAndConditions: true})}>
                  <View style={centralStyles.formTextBoxContainer}>
                    <Text style={centralStyles.formTextBox}>{`View Terms & Conditions`}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[centralStyles.yellowRectangleButton, {width: responsiveWidth(29)}]}>
                  <Text style={centralStyles.greenButtonText}>I accept</Text>
                  <Switch style={[(Platform.OS === 'ios' ? {transform:[{scaleX:.7},{scaleY:.7}]}:null),{marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1)}]} value={this.state.tAndCAgreed} onChange={this.handleTandCSwitch}/>
                </View>
                {this.state.viewingTermsAndConditions && (
                  <TextPopUp
                    close={() => this.setState({viewingTermsAndConditions: false})}
                    title={`Terms and Conditions`}
                    text={termsAndConditions}
                  />
                )}
              </View>
            </View>
              {/* view privacy policy*/}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={{width: responsiveWidth(50)}} activeOpacity={0.7} onPress={() => this.setState({viewingPrivacyPolicy: true})}>
                  <View style={centralStyles.formTextBoxContainer}>
                    <Text style={centralStyles.formTextBox}>{`View Privacy Policy`}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[centralStyles.yellowRectangleButton, {width: responsiveWidth(29)}]}>
                  <Text style={centralStyles.greenButtonText}>I accept</Text>
                  <Switch style={[(Platform.OS === 'ios' ? {transform:[{scaleX:.7},{scaleY:.7}]}:null),{marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1)}]} value={this.state.privacyPolicyAgreed} onChange={this.handlePrivacyPolicySwitch}/>
                </View>
                {this.state.viewingPrivacyPolicy && (
                  <TextPopUp
                    close={() => this.setState({viewingPrivacyPolicy: false})}
                    title={`Privacy Policy`}
                    text={privacyPolicy}
                  />
                )}
              </View>
            </View>
            {/* choose picture */}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={[centralStyles.yellowRectangleButton, {width: '100%'}]} activeOpacity={0.7} onPress={this.choosePicture}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='camera'></Icon>
                    <Text style={centralStyles.greenButtonText}>Add profile picture</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* return / log in */}
            <View style={centralStyles.formSection}>
              <View style={centralStyles.formInputContainer}>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Login')}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
                  <Text style={centralStyles.greenButtonText}>Return to{"\n"} login screen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={centralStyles.yellowRectangleButton} activeOpacity={0.7} onPress={(this.state.tAndCAgreed && this.state.privacyPolicyAgreed ? (e) => this.submitChef(e) : null )}>
                  <Icon style={centralStyles.greenButtonIcon} size={25} name='login'></Icon>
                    <Text style={centralStyles.greenButtonText}>{(this.state.tAndCAgreed ? (this.state.privacyPolicyAgreed ? "Submit &\n go to log in" : "Please accept\nprivacy policy" ) : "Please\naccept T&C")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>








{/* 
        <KeyboardAvoidingView  style={styles.mainPageContainer} behavior="padding">
          <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          {this.state.choosingPicture ? this.renderPictureChooser() : null}
          {this.state.awaitingServer ? <View style={centralStyles.activityIndicatorContainer}><ActivityIndicator style={Platform.OS === 'ios' ? centralStyles.activityIndicator : null} size="large" color="#104e01" /></View> : null }
            <View style={styles.createChefForm}>
              <ScrollView>
                <View style={styles.formRow}>
                  <View style={styles.loginHeader}>
                    <Text style={styles.createChefTitle}>Please register and click the link in your confirmation e-mail!</Text>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.loginInputBox}>
                    <TextInput style={styles.loginTextBox} placeholder="e-mail" keyboardType="email-address"  autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
                  </View>
                </View>
                  {this.renderEmailError()}
                <View style={styles.formRow}>
                  <View style={styles.loginInputBox}>
                    <TextInput style={styles.loginTextBox} placeholder="username"  autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "username")}/>
                  </View>
                </View>
                {this.renderUsernameError()}
                <View style={[styles.formRow, {zIndex: 1}]}>
                  <View picker style={[styles.pickerInputBox, (this.state.pickerFocused ? {height: 170} : {height: 44})]}>
                    <DualOSPicker
                      onChoiceChange={this.onCountryChange}
                      options={countries}
                      selectedChoice={this.props.country}/>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.loginInputAreaBox} >
                    <TextInput style={styles.loginTextBox} value={this.props.profile_text} placeholder="about me" multiline={true} numberOfLines={3} onChange={(e) => this.handleTextInput(e, "profile_text")}/>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.loginInputBox} >
                    <TextInput style={styles.loginTextBox} placeholder="password"  autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.loginInputBox} >
                    <TextInput style={styles.loginTextBox} placeholder="confirm password"  autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password_confirmation")}/>
                  </View>
                </View>
                {this.renderPasswordError()}
                <View style={styles.formRow}>
                  <TouchableOpacity style={styles.loginInputBox} activeOpacity={0.7} onPress={() => this.setState({viewingTermsAndConditions: true})}>
                    <Text style={styles.loginTextBox}>{`View Terms & Conditions`}</Text>
                  </TouchableOpacity>
                  {this.state.viewingTermsAndConditions && (
                    <TextPopUp
                      close={() => this.setState({viewingTermsAndConditions: false})}
                      title={`Terms and Conditions`}
                      text={termsAndConditions}
                    />
                  )}
                </View>
                <View style={styles.formRow}>
                  <TouchableOpacity style={[styles.loginInputBox, {marginRight: 0, width: '40%'}]} activeOpacity={0.7} onPress={() => this.setState({viewingPrivacyPolicy: true})}>
                    <Text style={styles.loginTextBox}>View Privacy Policy</Text>
                  </TouchableOpacity>
                  {this.state.viewingPrivacyPolicy && (
                    <TextPopUp
                      close={() => this.setState({viewingPrivacyPolicy: false})}
                      title={`Privacy Policy`}
                      text={privacyPolicy}
                    />
                  )}
                  <View style={[styles.loginFormButton, {width:'30%', marginRight: 0}]}>
                    <Text style={styles.loginFormButtonText}>Agree Privacy{"\n"}Policy</Text>
                    <Switch style={(Platform.OS === 'ios' ? {transform:[{scaleX:.8},{scaleY:.8}]}:null)} value={this.state.tAndCAgreed} onChange={this.handleTandCSwitch}/>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.loginFormButton}>
                    <Text style={styles.loginFormButtonText}>Agree{"\n"}T&C</Text>
                    <Switch style={(Platform.OS === 'ios' ? {transform:[{scaleX:.8},{scaleY:.8}]}:null)} value={this.state.tAndCAgreed} onChange={this.handleTandCSwitch}/>
                  </View>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} title="Take Photo" onPress={this.choosePicture}>
                    <Icon style={styles.standardIcon} size={25} name='camera' />
                    <Text style={styles.loginFormButtonText}>Add{"\n"}picture</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.formRow}>
                <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Login')}>
                    <Icon style={styles.standardIcon} size={25} name='login' />
                    <Text style={styles.loginFormButtonText}>Return to{"\n"} login screen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={(this.state.tAndCAgreed ? e => this.submitChef(e) : null )}>
                    <Icon style={styles.standardIcon} size={25} name='login-variant' />
                    <Text style={styles.loginFormButtonText}>{(this.state.tAndCAgreed ? "Submit &\n go to log in" : "Please\naccept T&C")}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView> */}
        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
        </ImageBackground>
      )
    }
  }
)