import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import { Container, Header, Content, Button, Icon } from 'native-base';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
// import ReduxRecipeShareTabs from './RecipeShareTabs'
import RecipeShareTabs from './RecipeShareTabs'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
      loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
  updateLoggedInChef: (id, username) => {
    return dispatch => {
      dispatch({ type: 'UPDATE_LOGGED_IN_CHEF', id: id, username: username})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class HomeScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };

    componentDidMount = () => {

      //delete the next constant and chef when tieing in loggedInChef and routes
      const chef = {
        "auth_token": "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MjA4fQ.hud1TwDA_jhhQFMYsozkw0w7g6mTjtKN-PJ62ceBQvA",
        "first_name": "",
        "id": 98,
        "imageURL": null,
        "last_name": "",
        "username": "Dgf"
      }
      AsyncStorage.setItem('chef', JSON.stringify(chef), () => {
        })
      
        AsyncStorage.getItem('chef', (err, res) => {
          const loggedInChef = JSON.parse(res)
          this.props.updateLoggedInChef(loggedInChef.id, loggedInChef.username)
        })
    }


    render() {
      return (
        <View style={styles.container}>
            <RecipeShareTabs/>
        </View>
      );
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
  floatingButton: {
    position: 'relative',
    left: '0%',
    bottom: '0%'
  }
});
