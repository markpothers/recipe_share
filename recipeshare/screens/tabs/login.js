import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
// import { WebBrowser } from 'expo'
// import { MonoText } from '../../components/StyledText'
import { Container, Header, Content, Form, Item, Input, Label, Button, Icon } from 'native-base';
import { connect } from 'react-redux'
import { databaseURL } from '../functionalComponents/databaseURL'


const mapStateToProps = (state) => ({
  e_mail: state.loginUserDetails.e_mail,
  password: state.loginUserDetails.password,
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class Login extends React.Component {

    handleTextInput = (e, parameter) => {
      this.props.saveLoginChefDetails(parameter, e.nativeEvent.text)
    }

    loginChef = () => {
      console.log("sending login")
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
      // console.log(this.props)
      return (
        <Container>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>e-mail</Label>
                <Input onChange={(e) => this.handleTextInput(e, "e_mail")}/>
              </Item>
              <Item floatingLabel last>
                <Label>Password</Label>
                <Input onChange={(e) => this.handleTextInput(e, "password")}/>
              </Item>
              <Button large rounded success style={styles.submitButton} onPress={e => this.loginChef(e)}>
              <Icon name='person' />
              <Text>Submit</Text>
              </Button>
            </Form>
          </Content>
        </Container>
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
    }
  });