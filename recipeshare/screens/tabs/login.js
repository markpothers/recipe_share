import React from 'react'
import {Text, AsyncStorage, ImageBackground } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, Button, View } from 'native-base';
import { connect } from 'react-redux'
import { databaseURL } from '../functionalComponents/databaseURL'
import { styles } from '../functionalComponents/RSStyleSheet'
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
        if (!chef.error){
          AsyncStorage.setItem('chef', JSON.stringify(chef), () => {
            AsyncStorage.getItem('chef', (err, res) => {
              console.log(err)
              this.props.navigation.navigate('Home')
            })
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
    }

    render() {
      // console.log(this.props)
      return (
        <Container>
          {/* <ImageBackground source={require("../components/peas.jpg")} style={styles.background} imageStyle={styles.backgroundImageStyle}> */}
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <Content style={styles.loginForm}>
              <Form >
                <Item rounded style={styles.loginHeader}>
                <Text style={styles.loginTitle}>Welcome, chef!{"\n"} Please log in or register</Text>
                </Item>
                <Item rounded style={styles.loginInputBox}>
                  {/* <Label>e-mail</Label> */}
                  <Input placeholder="e-mail" keyboardType="email-address" onChange={(e) => this.handleTextInput(e, "e_mail")}/>
                </Item>
                <Item rounded style={styles.loginInputBox}>
                  {/* <Label>Password</Label> */}
                  <Input placeholder="password" secureTextEntry={true} onChange={(e) => this.handleTextInput(e, "password")}/>
                </Item>
                <View style={styles.loginFormButtonWrapper}>
                  <Button rounded warning style={styles.loginFormButton} onPress={() => this.props.navigation.navigate('CreateChef')}>
                    <Icon style={styles.standardIcon} size={25} name='account-plus'></Icon>
                    <Text style={styles.createChefFormButtonText}>Register</Text>
                  </Button>
                  <Button rounded success style={styles.loginFormButton} onPress={e => this.loginChef(e)}>
                    <Icon style={styles.standardIcon} size={25} name='login'></Icon>
                    <Text style={styles.createChefFormButtonText}>Login</Text>
                  </Button>
                </View>
              </Form>
            </Content>
          </ImageBackground>
        </Container>
      )
    }

  }
)
