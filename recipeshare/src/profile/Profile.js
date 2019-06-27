import React from 'react';
import ChefDetails from './chefDetails';
import { styles } from './profileStyleSheet'
import { Container, Header, Text, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsyncStorage } from 'react-native'
import AppHeader from '../../navigation/appHeader'

export default class Profile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <AppHeader text={"Profile"}/>,
    }
  };

  logout = () => {
    AsyncStorage.removeItem('chef', () => {})
    this.props.navigation.navigate('Login')
  }

  render() {

    return (
      <React.Fragment>
        <ChefDetails/>
          <Button rounded danger style={styles.logoutButton} onPress={this.logout}>
            <Icon name='logout' size={25} />
          </Button>
      </React.Fragment>
    )
  }
}
