import React from 'react'
import {ScrollView, Text, AsyncStorage, ImageBackground, KeyboardAvoidingView, TouchableOpacity, TextInput, View} from 'react-native'
import { Picker } from 'native-base';
import { countries } from '../dataComponents/countries'
import * as Permissions from 'expo-permissions'
import { connect } from 'react-redux'
import { databaseURL } from '../dataComponents/databaseURL'
import { styles } from './usersStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PicSourceChooser from '../functionalComponents/picSourceChooser'

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
      choosingPicture: false
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

    countriesPicker = () => {
      return countries.map( country => {
        return <Picker.Item key={country} label={country} value={country} />
      })
    }

    handleTextInput = (e, parameter) => {
      this.props.saveChefDetails(parameter, e.nativeEvent.text)
    }

    onCountryChange(value, parameter) {
      this.props.saveChefDetails(parameter, value)
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

    submitChef = () => {
      console.log("sending new user details")
      fetch(`${databaseURL}/chefs`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chef: {
            username: this.props.username,
            e_mail: this.props.e_mail,
            password: this.props.password,
            password_confirmation: this.props.password_confirmation,
            country: this.props.country,
            imageURL: this.props.imageURL,
            profile_text: this.props.profile_text
          }
        })
      })
      .then(res => res.json())
      .then(chef => {
        if (!chef.error){
          // console.log(chef)
          // this.setState({errors: []})
          AsyncStorage.setItem('chef', JSON.stringify(chef), () => {
            AsyncStorage.getItem('chef', (err, res) => {
              console.log(err)
              this.props.clearNewUserDetails()
              this.props.navigation.navigate('AppLoading')
            })
          })

        } else {
          // console.log(chef.message)
          this.setState({errors: chef.message})
        }
      })
      .catch(error => {
        console.log(error)
      })
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

    render() {
      // console.log(this.props)
      return (
        <KeyboardAvoidingView  style={styles.mainPageContainer} behavior="padding">
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
          {this.state.choosingPicture ? this.renderPictureChooser() : null}
            <View style={styles.createChefForm}>
              <ScrollView>
                <View style={styles.formRow}>
                  <View style={styles.loginHeader}>
                    <Text style={styles.createChefTitle}>Please register as our newest chef!</Text>
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
                <View style={styles.formRow}>
                  <View picker style={styles.loginInputBox}>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={e => this.onCountryChange(e, "country")}
                    >
                      <Picker.Item key={this.props.country} label={this.props.country} value={this.props.country} />
                      {this.countriesPicker()}
                    </Picker>
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
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Login')}>
                    <Icon style={styles.standardIcon} size={25} name='login' />
                    <Text style={styles.loginFormButtonText}>Return to{"\n"} login screen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} title="Take Photo" onPress={this.choosePicture}>
                    <Icon style={styles.standardIcon} size={25} name='camera' />
                    <Text style={styles.loginFormButtonText}>Add{"\n"}picture</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.formRow}>
                  <TouchableOpacity style={styles.loginFormButton} activeOpacity={0.7} onPress={e => this.submitChef(e)}>
                    <Icon style={styles.standardIcon} size={25} name='login-variant' />
                    <Text style={styles.loginFormButtonText}>Submit &{"\n"}log in</Text>
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

