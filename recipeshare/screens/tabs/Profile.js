import React from 'react';
import { Container, Header, Text, Button, Icon  } from 'native-base';
import {Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux'
import { styles } from '../functionalComponents/RSStyleSheet'

const mapStateToProps = (state) => ({
    loggedInChef: state.loggedInChef
})

const mapDispatchToProps = {

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
