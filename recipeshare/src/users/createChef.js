import React from 'react'
import {ScrollView, Text, ImageBackground, KeyboardAvoidingView, TouchableOpacity, TextInput, View, Switch, ActivityIndicator } from 'react-native'
import { countries } from '../dataComponents/countries'
import * as Permissions from 'expo-permissions'
import { connect } from 'react-redux'
import { postChef } from '../fetches/postChef'
import { styles } from './usersStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PicSourceChooser from '../functionalComponents/picSourceChooser'
import { TAndC } from './tAndC'
import DualOSPicker from '../functionalComponents/DualOSPicker'

const mapStateToProps = (state) => ({
  first_name: state.newUserDetails.first_name,
  last_name: state.newUserDetails.last_name,
  username: state.newUserDetails.username,
  e_mail: state.newUserDetails.e_mail,
  password: state.newUserDetails.password,
  password_confirmation: state.newUserDetails.password_confirmation,
  country: state.newUserDetails.country,
  imageURL: state.newUserDetails.imageURL,
  profile_text: state.newUserDetails.profile_text,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  saveChefDetails: (parameter, content) => {
    console.log("saving chef")
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
      viewingTandC: false,
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
        this.props.saveChefDetails("imageURL", image.base64)
        this.setState({choosingPicture: false})
      }
    }

    submitChef = async() => {
      await this.setState({awaitingServer: true})
      console.log("sending new user details")
      const chef = await postChef(this.props.username, this.props.e_mail, this.props.password, this.props.password_confirmation, this.props.country, this.props.imageURL, this.props.profile_text)
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
        <View style={styles.formRow} key={error}>
          <View style={styles.formError}>
            <Text style={styles.formErrorText}>{error}</Text>
          </View>
        </View>
      ))
    }

    renderUsernameError = () => {
      const usernameErrors = this.state.errors.filter(message => message.startsWith("Username"))
      return usernameErrors.map(error => (
        <View style={styles.formRow} key={error}>
          <View style={styles.formError}>
            <Text style={styles.formErrorText}>{error}</Text>
          </View>
        </View>
      ))
    }

    renderPasswordError = () => {
      const passwordErrors = this.state.errors.filter(message => message.startsWith("Password"))
      return passwordErrors.map(error => (
        <View style={styles.formRow} key={error}>
          <View style={styles.formError}>
            <Text style={styles.formErrorText}>{error}</Text>
          </View>
        </View>
      ))
    }

    onCountryChange = (choice) => {
      this.props.saveChefDetails("country", choice)
    }

    handleTandCSwitch = () => {
      this.setState({tAndCAgreed: !this.state.tAndCAgreed})
    }

    handleViewTandC = () => {
      this.setState({viewingTandC: !this.state.viewingTandC})
    }

    render() {
      // console.log(this.props.saveChefDetails)
      return (
        <KeyboardAvoidingView  style={styles.mainPageContainer} behavior="padding">
          <ImageBackground source={require('../dataComponents/spinach.jpg')} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          {this.state.choosingPicture ? this.renderPictureChooser() : null}
          {this.state.awaitingServer ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#104e01" /> : null }
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
                  <TouchableOpacity style={styles.loginInputBox} activeOpacity={0.7} onPress={this.handleViewTandC}>
                    <Text style={styles.loginTextBox}>View Terms & Conditions</Text>
                  </TouchableOpacity>
                {this.state.viewingTandC ? <TAndC handleViewTandC={this.handleViewTandC}/> : null}
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
        </KeyboardAvoidingView>
      )
    }
  }
)