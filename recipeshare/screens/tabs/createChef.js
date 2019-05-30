import React from 'react'
import {ScrollView, StyleSheet, Text, AsyncStorage, ImageBackground, KeyboardAvoidingView} from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, Button, Picker, View } from 'native-base';
import { countries } from '../dataComponents/countries'
import { ImagePicker } from 'expo'
import {Camera, Permissions, DangerZone } from 'expo'
import { connect } from 'react-redux'
import { databaseURL } from '../functionalComponents/databaseURL'
import { styles } from '../functionalComponents/RSStyleSheet'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const mapStateToProps = (state) => ({
  first_name: state.newUserDetails.first_name,
  last_name: state.newUserDetails.last_name,
  username: state.newUserDetails.username,
  e_mail: state.newUserDetails.e_mail,
  password: state.newUserDetails.password,
  password_confirmation: state.newUserDetails.password_confirmation,
  country: state.newUserDetails.country,
  imageURL: state.newUserDetails.imageURL,
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
      errors: []
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

    pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true
      })
      // console.log(result)
      this.props.saveChefDetails("imageURL", result.base64)
    }

    openCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
        base64: true
      })
      // console.log(result)
      this.props.saveChefDetails("imageURL", result.base64)
    }

    submitChef = () => {
      console.log("sending new user details")
      fetch(`${databaseURL}/chefs`, {
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
          <Item rounded style={styles.formError}>
            <Text style={styles.formErrorText}>{error}</Text>
          </Item>
        </View>
      ))
    }

    renderUsernameError = () => {
      const usernameErrors = this.state.errors.filter(message => message.startsWith("Username")) 
      return usernameErrors.map(error => (
        <View style={styles.formRow} key={error}>
          <Item rounded style={styles.formError}>
            <Text style={styles.formErrorText}>{error}</Text>
          </Item>
        </View>
      ))
    }

    renderPasswordError = () => {
      const passwordErrors = this.state.errors.filter(message => message.startsWith("Password")) 
      return passwordErrors.map(error => (
        <View style={styles.formRow} key={error}>
          <Item rounded style={styles.formError}>
            <Text style={styles.formErrorText}>{error}</Text>
          </Item>
        </View>
      ))
    }

    render() {
      // console.log(this.state.errors)
      return (
        <KeyboardAvoidingView  style={styles.mainPageContainer} behavior="padding">
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <View style={styles.createChefForm}>
              <ScrollView>
                <View style={styles.formRow}>
                  <Item rounded style={styles.loginHeader}>
                    <Text style={styles.createChefTitle}>Please register as our newest chef!</Text>
                  </Item>
                </View>
                <View style={styles.formRow}>
                  <Item rounded style={styles.createChefInputBox}>
                    <Input placeholder="e-mail" keyboardType="email-address"  autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
                  </Item>
                </View>
                  {this.renderEmailError()}
                <View style={styles.formRow}>
                  <Item rounded style={styles.createChefInputBox}>
                    <Input placeholder="username"  autoCapitalize="none" onChange={(e) => this.handleTextInput(e, "username")}/>
                  </Item>
                </View>
                {this.renderUsernameError()}
                <View style={styles.formRow}>
                  <Item rounded picker style={styles.createChefInputBox}>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      onValueChange={e => this.onCountryChange(e, "country")}
                    >
                      <Picker.Item key={this.props.country} label={this.props.country} value={this.props.country} />
                      {this.countriesPicker()}
                    </Picker>
                  </Item>
                </View>
                <View style={styles.formRow}>
                  <Item rounded style={styles.createChefInputBox} >
                    <Input placeholder="password"  autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
                  </Item>
                </View>
                <View style={styles.formRow}>
                  <Item rounded style={styles.createChefInputBox} >
                    <Input placeholder="confirm password"  autoCapitalize="none" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password_confirmation")}/>
                  </Item>
                </View>
                {this.renderPasswordError()}
                  <View style={styles.formRow}>
                  <Button rounded info style={styles.createChefFormButton} title="Choose Photo" onPress={this.pickImage}>
                    <Icon style={styles.standardIcon} size={25} name='camera-burst' />
                    <Text style={styles.createChefFormButtonText}>Choose{"\n"}photo</Text>
                  </Button>
                  <Button rounded info style={styles.createChefFormButton} title="Take Photo" onPress={this.openCamera}>
                    <Icon style={styles.standardIcon} size={25} name='camera' />
                    <Text style={styles.createChefFormButtonText}>Take{"\n"}photo</Text>
                  </Button>
                </View>
                <View style={styles.formRow}>
                  <Button rounded warning style={styles.createChefFormButton} onPress={() => this.props.navigation.navigate('Login')}>
                    <Icon style={styles.standardIcon} size={25} name='login' />
                    <Text style={styles.createChefFormButtonText}>Return to{"\n"} login screen</Text>
                  </Button>
                  <Button rounded success style={styles.createChefFormButton} onPress={e => this.submitChef(e)}>
                    <Icon style={styles.standardIcon} size={25} name='login-variant' />
                    <Text style={styles.createChefFormButtonText}>Submit &{"\n"}log in</Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      )
    }

  }
)

