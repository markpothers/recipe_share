import React from 'react';
import { Container, Header, Tab, Tabs, ScrollableTab, Text, Button, Icon  } from 'native-base';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
    loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {
//   fetchAllRecipes: () => {
//       return dispatch => {
//           fetch('http://10.185.4.207:3000')
//           .then(res => res.json())
//           .then(recipes => {
//               dispatch({ type: 'STORE_ALL_RECIPES', recipes: recipes})
//           })
//       }
//   }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  class ChefDetails extends React.Component {

    componentDidMount = () => {
      // this.props.fetchAllRecipes()
    }

    render() {
      return (
        <Container>
          <Header>
              <Text>Chef Details</Text>
          </Header>
            <Text>Chef ID: {this.props.loggedInChef.id}</Text>
            <Text>Chef username: {this.props.loggedInChef.username}</Text>
        </Container>
      );
    }
  }
)
