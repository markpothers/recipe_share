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
import { WebBrowser } from 'expo'
import { MonoText } from '../../components/StyledText'

export default class MyLikedRecipes extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.getStartedText}>Mark is trying to work with tabs 3</Text>
      </View>
    )
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
    }
  });