import React from 'react'
import { StyleSheet, Text, AsyncStorage} from 'react-native'
import { Container, Content } from 'native-base';
import { connect } from 'react-redux'
import { styles } from '../functionalComponents/RSStyleSheet'

const mapStateToProps = (state) => ({
  e_mail: state.loginUserDetails.e_mail,
  password: state.loginUserDetails.password,
  loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  updateLoggedInChefInState: (id, username) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class AppLoading extends React.Component {
    static navigationOptions = {
      title: 'App Loading!',
    };

    componentDidMount = () => {
      // AsyncStorage.removeItem('chef', () => {})
      AsyncStorage.getItem('chef', (err, res) => {
        if (res != null) {
          const loggedInChef = JSON.parse(res)
          console.log(loggedInChef)
          this.props.updateLoggedInChefInState(loggedInChef.id, loggedInChef.username)
          this.props.navigation.navigate('Home')
        } else {
          this.props.navigation.navigate('Login')
          // this.props.navigation.navigate('CreateChef')
        }
      })
    }

    render() {
      // console.log(this.props)
      return (
        <Container>
          <Content>
            <Text>App Loading...</Text>
          </Content>
        </Container>
      )
    }

  }
)
