import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native'
// import { WebBrowser } from 'expo'
// import { MonoText } from '../../components/StyledText'
import { Container, Header, Content, Form, Item, Input, Label, Button, Icon, Picker } from 'native-base';
import { countries } from '../dataComponents/countries'
import { ImagePicker } from 'expo'
import {Camera, Permissions, DangerZone } from 'expo'
import { connect } from 'react-redux'
import { databaseURL } from '../functionalComponents/databaseURL'



const mapStateToProps = (state) => ({
  first_name: state.newUserDetails.first_name,
  last_name: state.newUserDetails.last_name,
  username: state.newUserDetails.username,
  e_mail: state.newUserDetails.e_mail,
  password: state.newUserDetails.password,
  password_confirmation: state.newUserDetails.password_confirmation,
  country: state.newUserDetails.country,
  imageURL: state.newUserDetails.imageURL
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
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(
  class CreateChef extends React.Component {

    state = {
      hasPermission: false,
      frontFacing: false
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
        quality: 0.1,
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
        console.log(chef)
          AsyncStorage.setItem('chef', JSON.stringify(chef), () => {
            AsyncStorage.getItem('chef', (err, res) => {
              const chef = JSON.parse(res)
              console.log(err)
              console.log(chef)
            })
          })
      })
      .catch(error => {
        console.log(error)
      })
    }

    render() {
      return (
        <ScrollView>
        <Container>
          <Content>
            <Form>
            <Item rounded floatingLabel >
                <Label>First Name (optional)</Label>
                <Input onChange={(e) => this.handleTextInput(e, "first_name")}/>
              </Item>
                <Item rounded floatingLabel>
                <Label>Last Name (optional)</Label>
                <Input onChange={(e) => this.handleTextInput(e, "last_name")}/>
              </Item>
              <Item rounded picker>
              <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  onValueChange={e => this.onCountryChange(e, "country")}
                >
                  <Picker.Item key={this.props.country} label={this.props.country} value={this.props.country} />
                  {this.countriesPicker()}
                </Picker>
              </Item>
                  <Item rounded floatingLabel>
                <Label>e-mail</Label>
                <Input onChange={(e) => this.handleTextInput(e, "e_mail")}/>
              </Item>
              <Item rounded floatingLabel>
                <Label>Username</Label>
                <Input onChange={(e) => this.handleTextInput(e, "username")}/>
              </Item>
              <Item rounded floatingLabel >
                <Label>Password</Label>
                <Input onChange={(e) => this.handleTextInput(e, "password")}/>
              </Item>
              <Item rounded floatingLabel last>
                <Label>Password Confirmation</Label>
                <Input onChange={(e) => this.handleTextInput(e, "password_confirmation")}/>
              </Item>
              <Button large rounded error title="Choose Photo" onPress={this.pickImage}>
                <Icon name='camera' />
                <Text>Choose Photo</Text>
              </Button>
              <Button large rounded error title="Take Photo" onPress={this.openCamera}>
                <Icon name='camera' />
                <Text>Take Photo</Text>
              </Button>
              <Button large rounded success style={styles.submitButton} onPress={e => this.submitChef(e)}>
              <Icon name='person' />
              <Text>Submit</Text>
              </Button>
            </Form>
          </Content>
        </Container>
        </ScrollView>
      )
    }

  }
)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      paddingTop: 30,
    },
    getStartedText: {
      fontSize: 17,
      color: 'rgba(96,100,109, 1)',
      lineHeight: 24,
      textAlign: 'center',
    },
    submitButton: {
      fontSize: 10
    }
  });