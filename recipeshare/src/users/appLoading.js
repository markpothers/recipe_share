import React from 'react'
import { StyleSheet, Text, AsyncStorage, View, ImageBackground, Image} from 'react-native'
import { Container, Content } from 'native-base';
import { connect } from 'react-redux'
import { styles } from './usersStyleSheet'

const mapStateToProps = (state) => ({
  e_mail: state.loginUserDetails.e_mail,
  password: state.loginUserDetails.password,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  updateLoggedInChefInState: (id, username, auth_token, imageURL, is_admin) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username, auth_token: auth_token, imageURL: imageURL, is_admin: is_admin})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class AppLoading extends React.Component {
    static navigationOptions = {
      header: null,
    };

    componentDidMount = () => {
      // AsyncStorage.removeItem('chef', () => {})
      AsyncStorage.getItem('chef', (err, res) => {
        if (res != null) {
          const loggedInChef = JSON.parse(res)
          // console.log(loggedInChef)
          this.props.updateLoggedInChefInState(loggedInChef.id, loggedInChef.username, loggedInChef.auth_token, loggedInChef.imageURL, loggedInChef.is_admin)
          this.props.navigation.navigate('Home')
        } else {
          this.props.navigation.navigate('Login')
        }
      })
    }

    render() {
      // console.log(this.props)
      return (
        <View style={styles.mainPageContainer}>
          <ImageBackground source={{uri: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/4007181/910/607/m2/fpnw/wm1/laura_kei-spinach-leaves-cover-.jpg?1518635518&s=dfeb27bc4b219f4a965c61d725e58413'}} style={styles.background} imageStyle={styles.backgroundImageStyle}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={require('./logo.png')}/>
            </View>
          </ImageBackground>
        </View>
      )
    }

  }
)
