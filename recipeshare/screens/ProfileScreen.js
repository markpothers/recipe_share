import React from 'react';
import ChefDetails from './tabs/Profile';
import { styles } from './functionalComponents/RSStyleSheet'
import { Container, Header, Text, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsyncStorage } from 'react-native'


export default class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'My profile',
      headerStyle: {
        backgroundColor: '#104e01',
        opacity: 0.8
      },
      headerTintColor: '#fff59b',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
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
