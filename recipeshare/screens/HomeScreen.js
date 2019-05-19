import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Header, Content, Button, Icon } from 'native-base';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
// import ReduxRecipeShareTabs from './RecipeShareTabs'
import RecipeShareTabs from './RecipeShareTabs'


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
          <RecipeShareTabs/>
      </View>
    );
  }

}

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
